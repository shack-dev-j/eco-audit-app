import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';
import UserSurveyPage from '../pages/UserSurveyPage';
import AdminPage from '../pages/AdminPage';
import { SCENARIOS } from '../data/scenarios';

describe('7. User Survey Page & Admin Control Isolation Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.innerWidth = 1024;
    window.innerHeight = 768;
    window.history.pushState({}, '', '/');
    localStorage.clear();
  });

  describe('User Side Isolation (Strictly Form Only)', () => {
    it('renders ONLY the user survey form on root path / with no admin controls', () => {
      render(<App />);

      // Must display the Eco-Audit title and subtitle
      expect(screen.getByText(/60.*EKO-AUDIT|60-SECOND ECO-AUDIT/i)).toBeInTheDocument();

      // Must NOT render facilitator tabs or admin tools
      expect(screen.queryByText(/Facilitator Station/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Connect DB/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Stand Signs & QR Posters/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Design Paradigms/i)).not.toBeInTheDocument();
    });

    it('displays the serene approval gate screen initially before survey messages', () => {
      render(<UserSurveyPage />);

      // Verification of the initial "blank/serene" gate
      expect(screen.getByText(/I agree to participate|Men ushbu e'tiborli eko-auditda/i)).toBeInTheDocument();
      const agreeBtn = screen.getByRole('button', { name: /I Agree & Begin Audit|Roziman va Auditni Boshlash/i });
      expect(agreeBtn).toBeInTheDocument();

      // Observations inputs should not yet be displayed before agreement
      expect(screen.queryByText(/Observation #1|1-Kuzatuv/i)).not.toBeInTheDocument();
    });

    it('requires agreement before proceeding and shows validation message if unchecked', () => {
      render(<UserSurveyPage />);

      const agreeBtn = screen.getByRole('button', { name: /I Agree & Begin Audit|Roziman va Auditni Boshlash/i });
      fireEvent.click(agreeBtn);

      // Expect validation error
      expect(screen.getByText(/Please indicate your agreement|Davom etish uchun rozilik/i)).toBeInTheDocument();
    });
  });

  describe('Sequential Message Progression Flow', () => {
    it('progresses smoothly through all 4 official PDF stages upon agreement', async () => {
      render(<UserSurveyPage />);

      // Step 0: Fill participant name, agree, and begin
      const nameInput = screen.getByRole('textbox', { name: /Your Name|Ismingiz/i });
      fireEvent.change(nameInput, { target: { value: 'Greta Thunberg' } });

      const checkbox = screen.getByLabelText(/I agree to participate|Men ushbu e'tiborli/i);
      fireEvent.click(checkbox);

      const beginBtn = screen.getByRole('button', { name: /I Agree & Begin Audit|Roziman va Auditni Boshlash/i });
      fireEvent.click(beginBtn);

      // Step 1: 15s Intro Message
      await waitFor(() => {
        expect(screen.getByText(/Look closely|Diqqat bilan qarang/i)).toBeInTheDocument();
      });

      // Advance to 60s observation
      const startObsBtn = screen.getByRole('button', { name: /I'm Ready to Record|Yozishga tayyorman/i });
      fireEvent.click(startObsBtn);

      // Step 2: 60s Observation Message
      await waitFor(() => {
        expect(screen.getAllByText(/Find as many as you can|Imkon qadar ko'proq toping/i).length).toBeGreaterThan(0);
      });

      const issue1Input = screen.getByRole('textbox', { name: /Observation #1|1-Kuzatuv/i });
      fireEvent.change(issue1Input, { target: { value: 'Computers running in empty room' } });

      const proceedToPrioritizeBtn = screen.getByRole('button', { name: /Proceed to Prioritise|Saralashga O'tish/i });
      fireEvent.click(proceedToPrioritizeBtn);

      // Step 3: Prioritisation Question
      await waitFor(() => {
        expect(screen.getByText(/Which issue would you tackle first|Qaysi muammoni birinchi/i)).toBeInTheDocument();
      });

      const whyTextArea = screen.getByRole('textbox', { name: /Why is this your #1 priority|Nima uchun aynan/i });
      fireEvent.change(whyTextArea, { target: { value: 'Zero cost and cuts nighttime energy draw immediately.' } });

      const proceedToActionBtn = screen.getByRole('button', { name: /Proceed to Action Pledge|Amaliy Va'daga/i });
      fireEvent.click(proceedToActionBtn);

      // Step 4: Action Pledge
      await waitFor(() => {
        expect(screen.getByText(/What is one realistic first step|Bugun qila oladigan bitta/i)).toBeInTheDocument();
      });

      const actionInput = screen.getByRole('textbox', { name: /One Realistic First Step|Bitta Real Birinchi Qadam/i });
      fireEvent.change(actionInput, { target: { value: 'Put stickers on monitors reminding class to turn off power.' } });

      const submitBtn = screen.getByRole('button', { name: /Submit My Eco-Audit|Eko-Auditni Yuborish/i });
      fireEvent.click(submitBtn);

      // Step 5: Completed Eco-Pledge Certificate
      await waitFor(() => {
        expect(screen.getByText(/60-Second Eco-Audit Action Pledge|60-Soniyali Eko-Audit Harakat Va'dasi/i)).toBeInTheDocument();
        expect(screen.getByText(/Greta Thunberg/i)).toBeInTheDocument();
      });
    });
  });

  describe('Locked Warm Linen Herbarium Design & Bilingual Support', () => {
    it('locks in Option 1 Warm Linen Herbarium aesthetic permanently', () => {
      const { container } = render(<UserSurveyPage />);
      expect(container.querySelector('.theme-herbarium')).toBeInTheDocument();
      expect(container.querySelector('.palette-linen')).toBeInTheDocument();
      // Ensure palette judge dock is removed from user side
      expect(screen.queryByLabelText(/Herbarium Palette Judge Dock/i)).not.toBeInTheDocument();
    });

    it('toggles seamlessly between Uzbek and English languages', () => {
      render(<UserSurveyPage />);

      // Switch to English
      const enBtn = screen.getByRole('button', { name: /English/i });
      fireEvent.click(enBtn);

      expect(screen.getByText(/THE 60-SECOND ECO-AUDIT/i)).toBeInTheDocument();
      expect(screen.getByText(/Spot it\. Prioritise it\. Solve it\./i)).toBeInTheDocument();

      // Switch to Uzbek
      const uzBtn = screen.getByRole('button', { name: /O'zbekcha/i });
      fireEvent.click(uzBtn);

      expect(screen.getByText(/60 SONIYALI EKO-AUDIT/i)).toBeInTheDocument();
      expect(screen.getByText(/Aniqlang\. Saralang\. Hal qiling\./i)).toBeInTheDocument();
    });

    it('automatically pre-populates venue zone and spot from QR parameters without typing', () => {
      window.history.pushState({}, '', '/?category=Science+Laboratory&part=Fume+Hoods+Station');
      render(<UserSurveyPage />);

      expect(screen.getByText(/Fume Hoods Station/i)).toBeInTheDocument();
      expect(screen.getByText(/Pre-configured|Oldindan Belgilangan/i)).toBeInTheDocument();
    });
  });

  describe('Admin Station Route Separation', () => {
    it('shows complete answers and keeps the log empty after a confirmed clear', async () => {
      let submissions = [{
        id: 'sample',
        participantName: 'Test Auditor',
        selectedIssues: ['Water leak', { title: 'Lights left on' }],
        topPriorityTitle: 'Water leak',
        priorityReason: 'It wastes water every day.',
        practicalAction: 'Replace the seal.'
      }];
      vi.stubGlobal('fetch', vi.fn(async (_url, options) => {
        if (options.method === 'DELETE') submissions = [];
        return { ok: true, json: async () => ({ success: true, submissions }) };
      }));
      const confirm = vi.spyOn(window, 'confirm').mockReturnValue(true);

      try {
        const view = render(<AdminPage />);
        const expand = await screen.findByRole('button', { name: 'View answers for Test Auditor' });
        fireEvent.click(expand);
        expect(screen.getByText('Lights left on')).toBeVisible();
        expect(screen.getByText('It wastes water every day.')).toBeVisible();
        fireEvent.click(screen.getByRole('button', { name: 'Hide answers for Test Auditor' }));
        expect(screen.getByText('It wastes water every day.')).not.toBeVisible();
        fireEvent.click(screen.getByRole('button', { name: 'Clear' }));
        await screen.findByText('No submissions recorded yet');

        view.unmount();
        render(<AdminPage />);
        await screen.findByText('No submissions recorded yet');
      } finally {
        confirm.mockRestore();
        vi.unstubAllGlobals();
      }
    });

    it('renders the complete Admin Control Center with QR Spot Generator & Question Editor when path is /admin', () => {
      window.history.pushState({}, '', '/admin');
      render(<App />);

      expect(screen.getByText(/Facilitator Station/i)).toBeInTheDocument();
      expect(screen.getAllByText(/QR Spot Generator/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/Edit Questions/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Facilitator Answer Key/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/Stand Signs & QR Posters/i)).toBeInTheDocument();
      expect(screen.getByText(/Connect DB/i)).toBeInTheDocument();
    });
  });
});
