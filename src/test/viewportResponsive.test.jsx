import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AttachedQrBadge from '../components/AttachedQrBadge';
import StandPosterModal from '../components/StandPosterModal';
import App from '../App';
import { SCENARIOS } from '../data/scenarios';

describe('3. Viewport Responsive & Mobile QR Scanning Suite', () => {
  const dummyScenario = SCENARIOS[0]; // School

  beforeEach(() => {
    vi.clearAllMocks();
    window.innerWidth = 1024;
    window.innerHeight = 768;
    window.history.pushState({}, '', '/');
  });

  describe('Attached QR Badge Variants', () => {
    it('renders compact QR badge with scan message and copy link', async () => {
      render(
        <AttachedQrBadge
          scenarioId={dummyScenario.id}
          scenarioTitle={dummyScenario.title}
          variant="compact"
        />
      );

      expect(screen.getByText(/scan with phone/i)).toBeInTheDocument();
      expect(screen.getByText(dummyScenario.title)).toBeInTheDocument();

      const copyBtn = screen.getByRole('button', { name: /copy link/i });
      fireEvent.click(copyBtn);

      await waitFor(() => {
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
          expect.stringContaining(`scenario=${dummyScenario.id}`)
        );
      });
      await waitFor(() => {
        expect(screen.getByText(/copied/i)).toBeInTheDocument();
      });
    });

    it('renders banner variant with mobile instructions and direct URL copy', async () => {
      const handleOpenPoster = vi.fn();
      render(
        <AttachedQrBadge
          scenarioId="office"
          scenarioTitle="Tech Office & Staff Room"
          variant="banner"
          onOpenPoster={handleOpenPoster}
        />
      );

      expect(screen.getByText(/mobile ready/i)).toBeInTheDocument();
      expect(screen.getByText(/scan to start/i)).toBeInTheDocument();

      const posterBtn = screen.getByRole('button', { name: /print stand sign/i });
      fireEvent.click(posterBtn);
      expect(handleOpenPoster).toHaveBeenCalledTimes(1);
    });
  });

  describe('Mobile Viewport & Stand Poster Modal (320px to 4K)', () => {
    it('renders stand poster modal and triggers window.print when requested', () => {
      // Simulate mobile viewport
      window.innerWidth = 360;
      window.innerHeight = 640;

      const handleClose = vi.fn();
      render(
        <StandPosterModal
          scenario={dummyScenario}
          isOpen={true}
          onClose={handleClose}
        />
      );

      expect(screen.getByText(/can you spot the problem\?/i)).toBeInTheDocument();
      expect(screen.getByText(/1 minute/i)).toBeInTheDocument();
      expect(screen.getAllByText(/30 seconds/i).length).toBe(2);

      const printBtn = screen.getByRole('button', { name: /print poster/i });
      fireEvent.click(printBtn);
      expect(window.print).toHaveBeenCalledTimes(1);

      const closeBtn = screen.getByLabelText(/close modal/i);
      fireEvent.click(closeBtn);
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('does not render stand poster modal when isOpen is false', () => {
      render(
        <StandPosterModal
          scenario={dummyScenario}
          isOpen={false}
          onClose={vi.fn()}
        />
      );

      expect(screen.queryByText(/can you spot the problem\?/i)).not.toBeInTheDocument();
    });
  });

  describe('URL Query Parameter Mobile Redirection (?scenario=...)', () => {
    it('automatically activates the scenario specified in the URL query string', async () => {
      // Point URL to cafeteria scenario
      window.history.pushState({}, '', '/?scenario=cafeteria');

      render(<App />);

      // The scenario dropdown or active title should match Cafeteria
      await waitFor(() => {
        expect(screen.getAllByText(/school cafeteria & canteen/i).length).toBeGreaterThan(0);
      });
    });

    it('falls back gracefully to default school scenario if parameter is unknown', async () => {
      window.history.pushState({}, '', '/?scenario=non_existent_404');

      render(<App />);

      await waitFor(() => {
        expect(screen.getAllByText(/school classroom & hallway/i).length).toBeGreaterThan(0);
      });
    });
  });
});
