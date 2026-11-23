// Submission & Database Service for The 60-Second Eco-Audit
// Supports Local Database, Remote Network API (/api/submissions), Email dispatch (Web3Forms/Formspree), and Google Sheets Webhooks

const STORAGE_KEY = 'eco_audit_submissions';
const SETTINGS_KEY = 'eco_audit_backend_settings';

const fetchWithTimeout = async (url, options = {}, timeoutMs = 4000) => {
  if (typeof fetch === 'undefined') return null;
  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller ? controller.signal : undefined
    });
    return response;
  } catch (err) {
    return null;
  } finally {
    if (timer) clearTimeout(timer);
  }
};

export const getBackendSettings = () => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? JSON.parse(raw) : {
      method: 'google_sheets', // 'local_only' | 'local_plus_email' | 'google_sheets' | 'custom_webhook'
      recipientEmail: 'ecology.committee@school.edu',
      formspreeEndpoint: '',
      web3FormsKey: '',
      googleSheetWebhookUrl: ''
    };
  } catch {
    return {
      method: 'google_sheets',
      recipientEmail: 'ecology.committee@school.edu',
      formspreeEndpoint: '',
      web3FormsKey: '',
      googleSheetWebhookUrl: ''
    };
  }
};

export const saveBackendSettings = (settings) => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.warn('Failed to save backend settings to localStorage:', err);
  }
};

export const getLocalSubmissions = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

/**
 * Fetch remote submissions from /api/submissions and merge with client-side localStorage.
 * Deduplicates by unique audit ID and sorts descending by timestamp.
 */
export const fetchRemoteSubmissions = async () => {
  let remoteSubmissions = null;
  try {
    const res = await fetchWithTimeout('/api/submissions', {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    }, 3500);

    if (res && res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.submissions)) {
        remoteSubmissions = data.submissions;
      }
    }
  } catch (err) {
    // Network offline or endpoint unreachable - fallback to local storage
  }

  const localItems = getLocalSubmissions();

  // If server responded successfully (even if 0 submissions []), server is source of truth
  if (remoteSubmissions !== null) {
    const mergedMap = new Map();
    remoteSubmissions.forEach(sub => {
      if (sub && sub.id) mergedMap.set(sub.id, sub);
    });
    // Preserve local items only if they are pending sync
    localItems.forEach(sub => {
      if (sub && sub.id && !mergedMap.has(sub.id) && sub.status !== 'synced_remote') {
        mergedMap.set(sub.id, sub);
      }
    });

    const merged = Array.from(mergedMap.values());
    merged.sort((a, b) => new Date(b.submittedAt || b.date || 0) - new Date(a.submittedAt || a.date || 0));

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    } catch (_) {}

    // Background sync for any pending local items
    const unsynced = localItems.filter(item => item && item.status !== 'synced_remote');
    if (unsynced.length > 0) {
      unsynced.forEach(item => {
        fetchWithTimeout('/api/submissions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(item)
        }, 3000).catch(() => {});
      });
    }

    return merged;
  }

  return localItems;
};

export const clearSubmissions = async () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn('LocalStorage clear failed:', err);
  }

  // Also clear remote server storage
  try {
    await fetchWithTimeout('/api/submissions', {
      method: 'DELETE',
      headers: { 'Accept': 'application/json' }
    }, 3000);
  } catch (err) {
    console.warn('Remote submissions clear failed:', err);
  }
};

export const saveSubmission = async (submission) => {
  const existing = getLocalSubmissions();
  const enriched = {
    ...submission,
    id: submission.id || `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    submittedAt: submission.submittedAt || new Date().toISOString(),
    status: 'saved_locally'
  };

  // 1. Immediately persist to Local Database first
  const updatedLocal = [enriched, ...existing.filter(item => item.id !== enriched.id)];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLocal));
  } catch (storageErr) {
    console.warn('LocalStorage persistence failed (storage quota or disabled):', storageErr);
  }

  const settings = getBackendSettings();
  const dispatchResults = { local: true, remoteApi: false, email: false, sheet: false, error: null };

  // 2. Dispatch to Central Network API (/api/submissions) so Facilitators on Admin station see it live
  try {
    const apiRes = await fetchWithTimeout('/api/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(enriched)
    }, 4000);

    if (apiRes && (apiRes.ok || apiRes.status === 201)) {
      dispatchResults.remoteApi = true;
      enriched.status = 'synced_remote';
      // update local status
      try {
        const recheck = getLocalSubmissions().map(item => item.id === enriched.id ? { ...item, status: 'synced_remote' } : item);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(recheck));
      } catch (_) {}
    }
  } catch (apiErr) {
    console.warn('Remote /api/submissions dispatch failed (offline or network error):', apiErr);
  }

  // 3. Dispatch to Google Sheets Webhook if configured
  if (settings.googleSheetWebhookUrl) {
    try {
      if (typeof fetch !== 'undefined') {
        await fetch(settings.googleSheetWebhookUrl, {
          method: 'POST',
          mode: 'no-cors', // standard for Google Apps Script Web Apps
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(enriched)
        });
        dispatchResults.sheet = true;
      }
    } catch (err) {
      console.warn('Google Sheets Webhook dispatch failed:', err);
    }
  }

  // 4. Dispatch to Formspree or Web3Forms free email service if configured
  if (settings.formspreeEndpoint) {
    try {
      if (typeof fetch !== 'undefined') {
        await fetch(settings.formspreeEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            subject: `🌱 New 60-Second Eco-Audit: ${enriched.scenarioTitle}`,
            participant: enriched.participantName || 'Anonymous',
            email: enriched.participantEmail || 'Not provided',
            role: enriched.participantRole || 'Student',
            scenario: enriched.scenarioTitle,
            issues_noticed: enriched.selectedIssues?.map(i => typeof i === 'string' ? i : i.title).join('; ') || '',
            top_priority: enriched.topPriorityTitle,
            reason_for_priority: enriched.priorityReason,
            practical_action: enriched.practicalAction,
            feasibility: enriched.timeToFix
          })
        });
        dispatchResults.email = true;
      }
    } catch (err) {
      console.warn('Formspree dispatch failed:', err);
    }
  } else if (settings.web3FormsKey) {
    try {
      if (typeof fetch !== 'undefined') {
        await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            access_key: settings.web3FormsKey,
            subject: `🌱 New 60-Second Eco-Audit: ${enriched.scenarioTitle}`,
            from_name: 'Eco-Audit Web App',
            participant: enriched.participantName || 'Anonymous',
            email: enriched.participantEmail || 'Not provided',
            role: enriched.participantRole || 'Student',
            scenario: enriched.scenarioTitle,
            issues_noticed: enriched.selectedIssues?.map(i => typeof i === 'string' ? i : i.title).join('; ') || '',
            top_priority: enriched.topPriorityTitle,
            reason_for_priority: enriched.priorityReason,
            practical_action: enriched.practicalAction,
            feasibility: enriched.timeToFix
          })
        });
        dispatchResults.email = true;
      }
    } catch (err) {
      console.warn('Web3Forms dispatch failed:', err);
    }
  }

  return { enriched, dispatchResults };
};

// Generate mailto link for zero-setup committee forwarding
export const generateMailtoUrl = (submission, recipientEmail = 'ecology.committee@school.edu') => {
  const subject = encodeURIComponent(`[Eco-Audit Report] ${submission.scenarioTitle} - ${submission.participantName || 'Anonymous'}`);
  const body = encodeURIComponent(
`THE 60-SECOND ECO-AUDIT REPORT
==================================
Date: ${submission.date || new Date().toLocaleDateString()}
Participant: ${submission.participantName || 'Anonymous'} (${submission.participantRole || 'Student'})
Participant Email: ${submission.participantEmail || 'N/A'}
Scenario Audited: ${submission.scenarioTitle}

A. ISSUES NOTICED:
${submission.selectedIssues?.map((iss, i) => `${i + 1}. ${typeof iss === 'string' ? iss : iss.title}`).join('\n') || 'None listed'}

B. TOP PRIORITY:
${submission.topPriorityTitle}

C. WHY TACKLE FIRST:
${submission.priorityReason || 'N/A'}

D. ONE PRACTICAL FIRST ACTION:
${submission.practicalAction || 'N/A'}

E. ESTIMATED RESOLUTION HORIZON:
${submission.timeToFix || 'Immediate'}
==================================
Sent from The 60-Second Eco-Audit Form`
  );

  return `mailto:${recipientEmail}?subject=${subject}&body=${body}`;
};
