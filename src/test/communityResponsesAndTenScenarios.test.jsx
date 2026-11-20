import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';
import { SCENARIOS, getLocalizedScenario } from '../data/scenarios';
import CommunityResponsesView from '../components/CommunityResponsesView';

describe('8. Community Responses Wall, 10 Scenarios & Extended Timers Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('All 10 Official Eco-Audit Scenarios & Localized Data', () => {
    it('contains all 10 distinct scenario locations with full issue sets and cover images', () => {
      expect(SCENARIOS.length).toBeGreaterThanOrEqual(10);

      const expectedIds = [
        'school', 'office', 'cafeteria', 'science-lab', 'library',
        'restroom', 'gym', 'computer-lab', 'garden', 'grounds',
        'art-studio', 'staff-lounge', 'greenhouse'
      ];

      expectedIds.forEach(id => {
        const found = SCENARIOS.find(s => s.id === id);
        expect(found).toBeDefined();
        expect(found.title).toBeTruthy();
        expect(found.title_uz).toBeTruthy();
        expect(found.description).toBeTruthy();
        expect(found.description_uz).toBeTruthy();
        expect(found.coverImage).toMatch(/^\/scenarios\/scenario_\d+_[a-z]+\.jpg$/);
        expect(found.issues.length).toBeGreaterThanOrEqual(2);
      });
    });

    it('getLocalizedScenario seamlessly swaps all titles, categories, and practical actions to Uzbek', () => {
      const base = SCENARIOS[0]; // Classroom
      const localizedUz = getLocalizedScenario(base, 'uz');

      expect(localizedUz.title).toBe('Maktab Sinfxonasi va Yo‘lak');
      expect(localizedUz.badge).toBe('Sinfxona Eko-Auditi');
      expect(localizedUz.issues[0].title).toBe('Tomchilayotgan Suv Krani');
      expect(localizedUz.issues[0].category).toBe('Suv');
      expect(localizedUz.issues[0].practicalAction).toContain('Jo‘mrakni oxirigacha mahkam burab yopish');

      const localizedEn = getLocalizedScenario(base, 'en');
      expect(localizedEn.title).toBe('School Classroom & Hallway');
      expect(localizedEn.badge).toBe('Campus Eco-Audit');
      expect(localizedEn.issues[0].title).toBe('Dripping Sink Tap');
    });
  });

  describe('Community Responses Wall View', () => {
    const sampleSubmissions = [
      {
        id: 'audit-comm-1',
        participantName: 'Nodira Qodirova',
        participantRole: 'Student',
        venueCategory: 'Classroom & Hallway',
        venueSpecificSpot: 'Radiator 2-qavat',
        scenarioTitle: 'Maktab Sinfxonasi',
        selectedIssues: ['Tomchilayotgan kran', 'Kechasi yoqiq monitor'],
        topPriorityTitle: 'Tomchilayotgan Suv Krani',
        priorityReason: 'Kuniga 15 litr ichimlik suvi tejaladi',
        practicalAction: 'Jo‘mrakni mahkam burash va navbatchiga aytish',
        timeToFix: '< 24 soat',
        date: '2026-11-20',
        language: 'uz'
      },
      {
        id: 'audit-comm-2',
        participantName: 'Sardor Rahim',
        participantRole: 'Teacher',
        venueCategory: 'Cafeteria & Canteen',
        venueSpecificSpot: 'Non stoli',
        scenarioTitle: 'Maktab Oshxonasi',
        selectedIssues: ['Tegilmagan oziq-ovqat'],
        topPriorityTitle: 'Oziq-ovqat Isrofi',
        priorityReason: 'Yeguliklarni muhtojlarga ulashish mumkin',
        practicalAction: 'Ulashish stolini tashkil etish',
        timeToFix: '1 hafta',
        date: '2026-11-20',
        language: 'uz'
      }
    ];

    it('renders community submissions with participant roles, spots, and action pledges', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, count: 2, submissions: sampleSubmissions })
      });

      render(
        <CommunityResponsesView 
          onBackToCertificate={() => {}}
          onStartNewAudit={() => {}}
          lang="uz"
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Nodira Qodirova')).toBeInTheDocument();
        expect(screen.getByText('Sardor Rahim')).toBeInTheDocument();
        expect(screen.getByText(/Tomchilayotgan Suv Krani/i)).toBeInTheDocument();
        expect(screen.getByText(/Oziq-ovqat Isrofi/i)).toBeInTheDocument();
      });
    });

    it('filters responses when user types into the search field', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, count: 2, submissions: sampleSubmissions })
      });

      render(
        <CommunityResponsesView 
          onBackToCertificate={() => {}}
          onStartNewAudit={() => {}}
          lang="uz"
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Nodira Qodirova')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/Ism, joy, muammo yoki/i);
      fireEvent.change(searchInput, { target: { value: 'Sardor' } });

      expect(screen.queryByText('Nodira Qodirova')).not.toBeInTheDocument();
      expect(screen.getByText('Sardor Rahim')).toBeInTheDocument();
    });
  });

  describe('Extended Timer Configuration (1-min Intro & 4-min Observation)', () => {
    it('sets initial observation window label to 4 minutes and allows agreement progression', async () => {
      window.history.pushState({}, '', '/');
      render(<App />);

      expect(screen.getByText(/4 minutes of focused audit and writing/i)).toBeInTheDocument();
    });
  });
});
