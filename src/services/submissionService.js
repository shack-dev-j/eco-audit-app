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

export const fetchRemoteSubmissions = async () => {
  const response = await fetchWithTimeout('/api/submissions', {
    method: 'GET',
    cache: 'no-store',
    headers: { Accept: 'application/json' }
  }, 7000);
  const data = response?.ok ? await response.json() : null;
  if (!data?.success || !Array.isArray(data.submissions)) {
    throw new Error('Shared submissions are unavailable.');
  }

  return data.submissions.filter(item => item && typeof item === 'object')
    .sort((a, b) => new Date(b.submittedAt || b.date || 0) - new Date(a.submittedAt || a.date || 0));
};

export const clearSubmissions = async (adminKey = '') => {
  const headers = { Accept: 'application/json' };
  if (adminKey) headers.Authorization = `Bearer ${adminKey}`;
  const response = await fetchWithTimeout('/api/submissions', { method: 'DELETE', headers }, 8000);
  const data = await response?.json().catch(() => null);
  if (!response?.ok || !data?.success) {
    throw new Error(data?.error || 'Could not clear shared submissions.');
  }
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('LocalStorage clear failed:', error);
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
    }, 12000);

    const result = apiRes?.ok ? await apiRes.json() : null;
    if (result?.success && result.submission?.id === enriched.id) {
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
