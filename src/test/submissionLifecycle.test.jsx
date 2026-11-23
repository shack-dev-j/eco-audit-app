import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  saveSubmission, 
  getLocalSubmissions, 
  fetchRemoteSubmissions,
  clearSubmissions,
  generateMailtoUrl, 
  saveBackendSettings, 
  getBackendSettings 
} from '../services/submissionService';

describe('4. Form Submission Lifecycle & Data Integrity Suite', () => {
  const dummyPayload = {
    scenarioId: 'school',
    scenarioTitle: 'School Classroom & Hallway',
    participantName: 'Morgan Rivera',
    participantEmail: 'morgan@school.edu',
    participantRole: 'Student',
    date: '2026-11-18',
    selectedIssues: [
      { id: 'tap-dripping', title: 'Dripping Sink Tap' },
      { id: 'paper-waste', title: 'Single-Sided Paper Discard' }
    ],
    topPriorityId: 'tap-dripping',
    topPriorityTitle: 'Dripping Sink Tap',
    priorityReason: 'Wastes 15L of clean drinking water every day with zero cost to fix',
    practicalAction: 'Turn off fully and alert building maintenance for a new washer',
    timeToFix: 'Immediate Quick Win (< 24 hrs)'
  };

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('Local Database Persistence', () => {
    it('persists submission with generated ID and timestamp', async () => {
      const { enriched, dispatchResults } = await saveSubmission(dummyPayload);

      expect(enriched.id).toMatch(/^audit-\d+/);
      expect(enriched.submittedAt).toBeDefined();
      expect(enriched.status).toBe('saved_locally');
      expect(dispatchResults.local).toBe(true);

      const saved = getLocalSubmissions();
      expect(saved).toHaveLength(1);
      expect(saved[0].participantName).toBe('Morgan Rivera');
      expect(saved[0].selectedIssues).toHaveLength(2);
    });

    it('gracefully handles LocalStorage QuotaExceededError without crashing', async () => {
      vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
        const error = new Error('QuotaExceededError');
        error.name = 'QuotaExceededError';
        throw error;
      });

      const { enriched, dispatchResults } = await saveSubmission(dummyPayload);

      // Must succeed and return enriched object even when storage throws
      expect(enriched.participantName).toBe('Morgan Rivera');
      expect(dispatchResults.local).toBe(true);
    });
  });

  describe('Google Sheets Webhook Dispatch', () => {
    it('dispatches JSON payload to configured Google Apps Script Web App', async () => {
      const mockFetch = vi.fn().mockResolvedValue({ ok: true });
      global.fetch = mockFetch;

      saveBackendSettings({
        method: 'google_sheets',
        recipientEmail: 'committee@school.edu',
        googleSheetWebhookUrl: 'https://script.google.com/macros/s/AKfycbx_test/exec',
        formspreeEndpoint: '',
        web3FormsKey: ''
      });

      const { dispatchResults } = await saveSubmission(dummyPayload);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://script.google.com/macros/s/AKfycbx_test/exec',
        expect.objectContaining({
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining('"participantName":"Morgan Rivera"')
        })
      );
      expect(dispatchResults.sheet).toBe(true);
    });
  });

  describe('Email Webhook Payloads (Formspree & Web3Forms)', () => {
    it('dispatches complete payload to Formspree endpoint', async () => {
      const mockFetch = vi.fn().mockResolvedValue({ ok: true });
      global.fetch = mockFetch;

      saveBackendSettings({
        method: 'local_plus_email',
        formspreeEndpoint: 'https://formspree.io/f/test_form_id',
        web3FormsKey: '',
        googleSheetWebhookUrl: ''
      });

      const { dispatchResults } = await saveSubmission(dummyPayload);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://formspree.io/f/test_form_id',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('"feasibility":"Immediate Quick Win (< 24 hrs)"')
        })
      );
      expect(dispatchResults.email).toBe(true);
    });

    it('dispatches complete payload to Web3Forms including feasibility horizon', async () => {
      const mockFetch = vi.fn().mockResolvedValue({ ok: true });
      global.fetch = mockFetch;

      saveBackendSettings({
        method: 'local_plus_email',
        formspreeEndpoint: '',
        web3FormsKey: 'test-web3-api-key',
        googleSheetWebhookUrl: ''
      });

      const { dispatchResults } = await saveSubmission(dummyPayload);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.web3forms.com/submit',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('"access_key":"test-web3-api-key"')
        })
      );
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.web3forms.com/submit',
        expect.objectContaining({
          body: expect.stringContaining('"feasibility":"Immediate Quick Win (< 24 hrs)"')
        })
      );
      expect(dispatchResults.email).toBe(true);
    });
  });

  describe('Mailto Link Generation & Encoding', () => {
    it('encodes submission report with special characters and linebreaks', () => {
      const mailto = generateMailtoUrl(dummyPayload, 'eco@test.org');

      expect(mailto).toMatch(/^mailto:eco@test\.org\?subject=/);
      expect(mailto).toContain('School%20Classroom%20%26%20Hallway');
      expect(mailto).toContain('Morgan%20Rivera');
      expect(mailto).toContain('Dripping%20Sink%20Tap');
      expect(mailto).toContain('Immediate%20Quick%20Win');
    });
  });

  describe('Remote Network Synchronization (/api/submissions)', () => {
    it('dispatches submission to /api/submissions and tags status as synced_remote when API responds', async () => {
      const mockFetch = vi.fn().mockImplementation((url, opts) => {
        if (url === '/api/submissions' && opts?.method === 'POST') {
          return Promise.resolve({
            ok: true,
            status: 201,
            json: async () => ({ success: true, submission: JSON.parse(opts.body) })
          });
        }
        return Promise.resolve({ ok: true });
      });
      global.fetch = mockFetch;

      const { enriched, dispatchResults } = await saveSubmission(dummyPayload);

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/submissions',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
          body: expect.stringContaining('"participantName":"Morgan Rivera"')
        })
      );
      expect(dispatchResults.remoteApi).toBe(true);
      expect(enriched.status).toBe('synced_remote');
    });

    it('loads shared submissions without mixing in stale browser entries', async () => {
      const remoteMockData = [
        {
          id: 'audit-remote-101',
          participantName: 'Alisher Navoiy',
          scenarioTitle: 'Kutubxona & O‘quv zali',
          submittedAt: '2026-11-18T10:00:00.000Z'
        }
      ];

      const mockFetch = vi.fn().mockImplementation((url) => {
        if (url === '/api/submissions') {
          return Promise.resolve({
            ok: true,
            json: async () => ({ success: true, count: 1, submissions: remoteMockData })
          });
        }
        return Promise.resolve({ ok: true });
      });
      global.fetch = mockFetch;

      // Seed local storage with a different submission
      localStorage.setItem('eco_audit_submissions', JSON.stringify([
        {
          id: 'audit-local-202',
          participantName: 'Local Student',
          submittedAt: '2026-11-18T09:00:00.000Z'
        }
      ]));

      const merged = await fetchRemoteSubmissions();

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/submissions',
        expect.objectContaining({ method: 'GET' })
      );
      expect(merged).toHaveLength(1);
      expect(merged.some(s => s.id === 'audit-remote-101')).toBe(true);
      expect(merged.some(s => s.id === 'audit-local-202')).toBe(false);
    });

    it('keeps a cleared shared list empty even with stale browser data', async () => {
      localStorage.setItem('eco_audit_submissions', JSON.stringify([{ id: 'old-sample' }]));
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, submissions: [] })
      });
      global.fetch = mockFetch;

      await expect(fetchRemoteSubmissions()).resolves.toEqual([]);
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('reports a failed clear and preserves browser data', async () => {
      const cached = JSON.stringify([{ id: 'old-sample' }]);
      localStorage.setItem('eco_audit_submissions', cached);
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ success: false, error: 'Shared storage is unavailable.' })
      });

      await expect(clearSubmissions()).rejects.toThrow('Shared storage is unavailable.');
      expect(localStorage.getItem('eco_audit_submissions')).toBe(cached);
    });

    it('clears remote server storage on clearSubmissions', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, count: 0, submissions: [] })
      });
      global.fetch = mockFetch;

      await clearSubmissions();

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/submissions',
        expect.objectContaining({ method: 'DELETE' })
      );
    });
  });
});
