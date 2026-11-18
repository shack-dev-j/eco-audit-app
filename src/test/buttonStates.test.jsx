import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import BespokeButton from '../components/design-system/BespokeButton';
import BespokePebblePicker from '../components/design-system/BespokePebblePicker';
import BespokeActionCard from '../components/design-system/BespokeActionCard';
import GoogleFormsEcoSurvey from '../components/GoogleFormsEcoSurvey';
import { SCENARIOS } from '../data/scenarios';
import { sounds } from '../services/soundEffects';

describe('2. Button States & Micro-Interactions Suite', () => {
  const dummyScenario = SCENARIOS[0];

  describe('BespokeButton States Across 4 Design Systems', () => {
    const themes = ['solarpunk', 'clay-pebble', 'herbarium', 'hydro-droplet'];

    themes.forEach((theme) => {
      it(`renders interactive button with active, hover, and spring bounce classes in ${theme}`, () => {
        const handleClick = vi.fn();
        render(
          <BespokeButton onClick={handleClick} theme={theme}>
            Execute Eco-Audit
          </BespokeButton>
        );

        const btn = screen.getByRole('button', { name: /execute eco-audit/i });
        expect(btn).toBeInTheDocument();
        expect(btn).not.toBeDisabled();
        expect(btn).toHaveAttribute('aria-disabled', 'false');

        // Verify class styling
        expect(btn.className).toContain('eco-btn');
        expect(btn.className).toContain('cursor-pointer');

        // Click activation
        fireEvent.click(btn);
        expect(handleClick).toHaveBeenCalledTimes(1);
      });

      it(`handles disabled state properly in ${theme}`, () => {
        const handleClick = vi.fn();
        render(
          <BespokeButton onClick={handleClick} disabled={true} theme={theme}>
            Disabled Action
          </BespokeButton>
        );

        const btn = screen.getByRole('button', { name: /disabled action/i });
        expect(btn).toBeDisabled();
        expect(btn).toHaveAttribute('aria-disabled', 'true');
        expect(btn.className).toContain('disabled:opacity-40');
        expect(btn.className).toContain('disabled:cursor-not-allowed');

        // Click when disabled must not fire
        fireEvent.click(btn);
        expect(handleClick).not.toHaveBeenCalled();
      });
    });
  });

  describe('PebblePicker Toggle Chips (Roles / Horizons)', () => {
    const roles = ['Student', 'Faculty / Teacher', 'Facility Staff', 'Committee Leader', 'Visitor'];

    it('manages active selection state with aria-pressed on pebble buttons', () => {
      let selectedRole = 'Student';
      const handleRoleChange = vi.fn((r) => {
        selectedRole = r;
      });

      const { rerender } = render(
        <BespokePebblePicker
          options={roles}
          value={selectedRole}
          onChange={handleRoleChange}
          theme="solarpunk"
        />
      );

      const studentBtn = screen.getByRole('button', { name: 'Student' });
      const facultyBtn = screen.getByRole('button', { name: 'Faculty / Teacher' });

      expect(studentBtn).toHaveAttribute('aria-pressed', 'true');
      expect(facultyBtn).toHaveAttribute('aria-pressed', 'false');

      // Click faculty
      fireEvent.click(facultyBtn);
      expect(handleRoleChange).toHaveBeenCalledWith('Faculty / Teacher');

      rerender(
        <BespokePebblePicker
          options={roles}
          value={selectedRole}
          onChange={handleRoleChange}
          theme="solarpunk"
        />
      );

      expect(facultyBtn).toHaveAttribute('aria-pressed', 'true');
    });
  });

  describe('ActionCard Tactile Selection & Keyboard Enter/Space', () => {
    it('activates selection on click', () => {
      const handleSelect = vi.fn();
      render(
        <BespokeActionCard
          title="Dripping Science Sink"
          subtitle="Continuous freshwater waste"
          isSelected={false}
          onSelect={handleSelect}
          theme="clay-pebble"
        />
      );

      const card = screen.getByRole('button', { name: /dripping science sink/i });
      expect(card).toHaveAttribute('aria-pressed', 'false');
      expect(card).toHaveAttribute('tabIndex', '0');

      fireEvent.click(card);
      expect(handleSelect).toHaveBeenCalledTimes(1);
    });

    it('supports keyboard activation via Enter and Space keys', () => {
      const handleSelect = vi.fn();
      render(
        <BespokeActionCard
          title="Lights Blazing in Empty Lab"
          isSelected={false}
          onSelect={handleSelect}
          theme="herbarium"
        />
      );

      const card = screen.getByRole('button', { name: /lights blazing in empty lab/i });

      // Enter key
      fireEvent.keyDown(card, { key: 'Enter', code: 'Enter' });
      expect(handleSelect).toHaveBeenCalledTimes(1);

      // Space key
      fireEvent.keyDown(card, { key: ' ', code: 'Space' });
      expect(handleSelect).toHaveBeenCalledTimes(2);
    });
  });

  describe('Form Submission Button Disabled Gate', () => {
    it('disables submit button when no issues are observed', () => {
      render(
        <GoogleFormsEcoSurvey
          scenario={dummyScenario}
          onComplete={vi.fn()}
          theme="solarpunk"
        />
      );

      const submitBtn = screen.getByRole('button', { name: /submit eco-audit form/i });
      expect(submitBtn).toBeDisabled();
      expect(submitBtn).toHaveAttribute('aria-disabled', 'true');
    });

    it('enables submit button as soon as at least one issue is provided', () => {
      render(
        <GoogleFormsEcoSurvey
          scenario={dummyScenario}
          onComplete={vi.fn()}
          theme="solarpunk"
        />
      );

      // Autofill via preset pill
      const presetBtn = screen.getByText(`+ ${dummyScenario.issues[0].title}`);
      fireEvent.click(presetBtn);

      const submitBtn = screen.getByRole('button', { name: /submit eco-audit form/i });
      expect(submitBtn).not.toBeDisabled();
      expect(submitBtn).toHaveAttribute('aria-disabled', 'false');
    });
  });
});
