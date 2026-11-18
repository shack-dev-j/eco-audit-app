import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import BespokeInput from '../components/design-system/BespokeInput';
import GoogleFormsEcoSurvey from '../components/GoogleFormsEcoSurvey';
import { SCENARIOS } from '../data/scenarios';

describe('1. Input Component Testing Suite', () => {
  const dummyScenario = SCENARIOS[0];

  describe('Focus Ring Visibility & Theme Paradigms', () => {
    const themes = ['solarpunk', 'clay-pebble', 'herbarium', 'hydro-droplet'];

    themes.forEach((theme) => {
      it(`renders input with visible focus ring in ${theme} theme`, () => {
        const handleChange = vi.fn();
        const { container } = render(
          <BespokeInput
            label="Classroom Observation"
            value="Leaking tap in room 204"
            onChange={handleChange}
            theme={theme}
          />
        );

        const input = screen.getByRole('textbox', { name: /classroom observation/i });
        expect(input).toBeInTheDocument();
        expect(input).toHaveValue('Leaking tap in room 204');

        // Focus the input
        fireEvent.focus(input);
        const wrapper = container.querySelector('.eco-input-wrapper');
        expect(wrapper).toBeInTheDocument();
        expect(wrapper.className).toContain('isFocused' ? 'ring' : '');
      });
    });
  });

  describe('Placeholder Contrast & Accessible Labeling', () => {
    it('provides accessible label linked to input via htmlFor and id', () => {
      render(
        <BespokeInput
          id="custom-test-id"
          label="Your Full Name"
          placeholder="e.g. Alex Morgan"
          value=""
          onChange={vi.fn()}
        />
      );

      const labelText = screen.getByText(/your full name/i);
      const label = labelText.closest('label');
      const input = screen.getByPlaceholderText('e.g. Alex Morgan');
      
      expect(label).toHaveAttribute('for', 'custom-test-id');
      expect(input).toHaveAttribute('id', 'custom-test-id');
    });

    it('displays placeholder text without replacing visual label', () => {
      render(
        <BespokeInput
          label="Email Address"
          placeholder="name@school.edu"
          value=""
          onChange={vi.fn()}
        />
      );

      expect(screen.getByText(/email address/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText('name@school.edu')).toBeInTheDocument();
    });
  });

  describe('Character Typing & Controlled Value Binding', () => {
    it('captures character typing smoothly', () => {
      let currentValue = '';
      const { rerender } = render(
        <BespokeInput
          label="Eco Issue"
          value={currentValue}
          onChange={(e) => {
            currentValue = e.target.value;
          }}
        />
      );

      const input = screen.getByRole('textbox', { name: /eco issue/i });
      fireEvent.change(input, { target: { value: 'Lights left blazing' } });
      expect(currentValue).toBe('Lights left blazing');

      rerender(
        <BespokeInput
          label="Eco Issue"
          value={currentValue}
          onChange={vi.fn()}
        />
      );
      expect(input).toHaveValue('Lights left blazing');
    });
  });

  describe('Clear Buttons & State Reset', () => {
    it('displays clear button only when input has value and onClear is provided', () => {
      const handleClear = vi.fn();
      const { rerender } = render(
        <BespokeInput
          label="Observed Issue"
          value=""
          onChange={vi.fn()}
          onClear={handleClear}
        />
      );

      expect(screen.queryByRole('button', { name: /clear observed issue/i })).not.toBeInTheDocument();

      rerender(
        <BespokeInput
          label="Observed Issue"
          value="Food waste contamination"
          onChange={vi.fn()}
          onClear={handleClear}
        />
      );

      const clearBtn = screen.getByRole('button', { name: /clear observed issue/i });
      expect(clearBtn).toBeInTheDocument();
      expect(clearBtn).toHaveAttribute('aria-label', 'Clear Observed Issue');

      fireEvent.click(clearBtn);
      expect(handleClear).toHaveBeenCalledTimes(1);
    });

    it('clears issues and cleans up top priority synchronization in GoogleFormsEcoSurvey', () => {
      render(
        <GoogleFormsEcoSurvey
          scenario={dummyScenario}
          onComplete={vi.fn()}
          theme="solarpunk"
        />
      );

      // Initially enter an issue via preset
      const presetBtn = screen.getByText(`+ ${dummyScenario.issues[0].title}`);
      fireEvent.click(presetBtn);

      // Verify issue is filled
      const issueInput1 = screen.getByDisplayValue(dummyScenario.issues[0].title);
      expect(issueInput1).toBeInTheDocument();

      // Top priority card should exist
      expect(screen.getByText(dummyScenario.issues[0].title, { selector: 'h4' })).toBeInTheDocument();

      // Clear the first issue using its accessible clear button
      const clearBtn = screen.getByRole('button', { name: /clear issue 1/i });
      fireEvent.click(clearBtn);

      // After clearing, top priority placeholder message should appear
      expect(screen.getByText(/please enter at least one issue in section 2/i)).toBeInTheDocument();
    });
  });
});
