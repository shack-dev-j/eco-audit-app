// Submission & Database Service for The 60-Second Eco-Audit
// Supports Local Database, Email dispatch (Web3Forms/Formspree), and Google Sheets Webhooks

const STORAGE_KEY = 'eco_audit_submissions';
const SETTINGS_KEY = 'eco_audit_backend_settings';

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
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

export const getLocalSubmissions = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const clearSubmissions = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn('LocalStorage clear failed:', err);
  }
};

export const saveSubmission = async (submission) => {
  // 1. Always persist to Local Database first
  const existing = getLocalSubmissions();
  const enriched = {
    ...submission,
    id: submission.id || `audit-${Date.now()}`,
    submittedAt: new Date().toISOString(),
    status: 'saved_locally'
  };
  const updated = [enriched, ...existing];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (storageErr) {
    console.warn('LocalStorage persistence failed (storage quota or disabled):', storageErr);
  }

  const settings = getBackendSettings();
  const dispatchResults = { local: true, email: false, sheet: false, error: null };

  // 2. Dispatch to Google Sheets Webhook if configured
  if (settings.googleSheetWebhookUrl) {
    try {
      await fetch(settings.googleSheetWebhookUrl, {
        method: 'POST',
        mode: 'no-cors', // standard for Google Apps Script Web Apps
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enriched)
      });
      dispatchResults.sheet = true;
    } catch (err) {
      console.warn('Google Sheets Webhook dispatch failed:', err);
    }
  }

  // 3. Dispatch to Formspree or Web3Forms free email service if configured
  if (settings.formspreeEndpoint) {
    try {
      await fetch(settings.formspreeEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          subject: `🌱 New 60-Second Eco-Audit: ${enriched.scenarioTitle}`,
          participant: enriched.participantName || 'Anonymous',
          email: enriched.participantEmail || 'Not provided',
          role: enriched.participantRole || 'Student',
          scenario: enriched.scenarioTitle,
          issues_noticed: enriched.selectedIssues?.map(i => i.title).join('; ') || '',
          top_priority: enriched.topPriorityTitle,
          reason_for_priority: enriched.priorityReason,
          practical_action: enriched.practicalAction,
          feasibility: enriched.timeToFix
        })
      });
      dispatchResults.email = true;
    } catch (err) {
      console.warn('Formspree dispatch failed:', err);
    }
  } else if (settings.web3FormsKey) {
    try {
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
          issues_noticed: enriched.selectedIssues?.map(i => i.title).join('; ') || '',
          top_priority: enriched.topPriorityTitle,
          reason_for_priority: enriched.priorityReason,
          practical_action: enriched.practicalAction,
          feasibility: enriched.timeToFix
        })
      });
      dispatchResults.email = true;
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
${submission.selectedIssues?.map((iss, i) => `${i + 1}. ${iss.title}`).join('\n') || 'None listed'}

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
