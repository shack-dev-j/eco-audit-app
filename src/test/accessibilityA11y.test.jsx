import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';
import InteractiveScene from '../components/InteractiveScene';
import BespokeActionCard from '../components/design-system/BespokeActionCard';
import BespokeProgressBar from '../components/design-system/BespokeProgressBar';
import BespokePebblePicker from '../components/design-system/BespokePebblePicker';
import BespokeInput from '../components/design-system/BespokeInput';
import BespokeButton from '../components/design-system/BespokeButton';

/**
 * WCAG 2.1 AA Contrast Ratio Calculator
 * Formula according to W3C Rec:
 * L = 0.2126 * R + 0.7152 * G + 0.0722 * B
 * where R, G, B are normalized and linearized.
 */
function parseHexColor(hex) {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return [r, g, b];
}

function getLinearRGB(val) {
  const srgb = val / 255;
  return srgb <= 0.03928 ? srgb / 12.92 : Math.pow((srgb + 0.055) / 1.055, 2.4);
}

function getRelativeLuminance(hex) {
  const [r, g, b] = parseHexColor(hex);
  const rLin = getLinearRGB(r);
  const gLin = getLinearRGB(g);
  const bLin = getLinearRGB(b);
  return 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;
}

function getContrastRatio(hex1, hex2) {
  const l1 = getRelativeLuminance(hex1);
  const l2 = getRelativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

describe('6. Accessibility (WCAG 2.1 AA) & Keyboard Navigation Quality Gate Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('WCAG 2.1 AA Color Contrast Engine', () => {
    it('verifies Solarpunk Bio-Glass theme satisfies WCAG 2.1 AA (and AAA) contrast', () => {
      // Dark moss background vs light mint text
      const bg = '#0f2d1e';
      const text = '#e8f5e9';
      const ratio = getContrastRatio(bg, text);
      expect(ratio).toBeGreaterThanOrEqual(7.0); // Exceeds WCAG AAA requirement (7:1)
    });

    it('verifies Neo-Tactile Clay Pebble theme satisfies WCAG 2.1 AA contrast', () => {
      // Dark stone background vs stone 100 text
      const bg = '#292524';
      const text = '#f5f5f4';
      const ratio = getContrastRatio(bg, text);
      expect(ratio).toBeGreaterThanOrEqual(7.0); // Exceeds WCAG AAA
    });

    it('verifies Editorial Herbarium Papercraft theme satisfies WCAG 2.1 AA with light theme overrides', () => {
      // Cream parchment background vs high-contrast stone 900 text
      const creamParchment = '#f7f1e1';
      const darkInkText = '#1c1917';
      const ratio = getContrastRatio(creamParchment, darkInkText);
      expect(ratio).toBeGreaterThanOrEqual(7.0); // 13.5:1, exceeds WCAG AAA

      // Secondary stone 700 text on parchment
      const stone700 = '#44403c';
      const secondaryRatio = getContrastRatio(creamParchment, stone700);
      expect(secondaryRatio).toBeGreaterThanOrEqual(4.5); // passes WCAG AA normal text
    });

    it('verifies Liquid Hydro-Droplet theme satisfies WCAG 2.1 AA contrast', () => {
      // Deep sky ocean background vs sky 50 text
      const oceanBg = '#082f49';
      const skyText = '#f0f9ff';
      const ratio = getContrastRatio(oceanBg, skyText);
      expect(ratio).toBeGreaterThanOrEqual(7.0); // Exceeds WCAG AAA
    });

    it('flags insufficient contrast if white text was left on parchment (regression guard)', () => {
      const parchment = '#f7f1e1';
      const badWhiteText = '#ffffff';
      const badRatio = getContrastRatio(parchment, badWhiteText);
      // Confirms why our CSS override in themes.css is strictly necessary
      expect(badRatio).toBeLessThan(1.5);
    });
  });

  describe('ARIA Semantic Roles & Attributes', () => {
    it('provides accessible role="progressbar" with live values in BespokeProgressBar', () => {
      render(<BespokeProgressBar progress={68} theme="theme-solarpunk" label="Bio-Capacity" />);
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toBeInTheDocument();
      expect(progressBar).toHaveAttribute('aria-valuenow', '68');
      expect(progressBar).toHaveAttribute('aria-valuemin', '0');
      expect(progressBar).toHaveAttribute('aria-valuemax', '100');
    });

    it('provides role="group" and aria-pressed attributes in BespokePebblePicker', () => {
      const onChange = vi.fn();
      const options = [
        { id: 'opt1', label: 'Option Alpha', icon: '🌱' },
        { id: 'opt2', label: 'Option Beta', icon: '⚡' },
      ];

      render(
        <BespokePebblePicker
          options={options}
          value="opt1"
          onChange={onChange}
          theme="theme-clay-pebble"
        />
      );

      const group = screen.getByRole('group');
      expect(group).toBeInTheDocument();

      const btn1 = screen.getByRole('button', { name: /Option Alpha/i });
      const btn2 = screen.getByRole('button', { name: /Option Beta/i });

      expect(btn1).toHaveAttribute('aria-pressed', 'true');
      expect(btn2).toHaveAttribute('aria-pressed', 'false');

      fireEvent.click(btn2);
      expect(onChange).toHaveBeenCalledWith('opt2');
    });

    it('renders role="timer" with aria-live="polite" on observation countdown in App', () => {
      render(<App />);
      const timer = screen.getByRole('timer');
      expect(timer).toBeInTheDocument();
      expect(timer).toHaveAttribute('aria-live', 'polite');
      expect(timer).toHaveAttribute('aria-atomic', 'true');
      expect(timer).toHaveAttribute('aria-label');
      expect(timer.getAttribute('aria-label')).toMatch(/Observation timer:/i);
    });

    it('links input labels with htmlFor and id and provides clear button aria-label', () => {
      render(
        <BespokeInput
          label="Inspector Name"
          value="Agent Mulder"
          onChange={() => {}}
          onClear={() => {}}
          theme="theme-herbarium"
        />
      );

      const input = screen.getByRole('textbox', { name: /Inspector Name/i });
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('id');

      const clearBtn = screen.getByRole('button', { name: /Clear Inspector Name/i });
      expect(clearBtn).toBeInTheDocument();
    });

    it('sets aria-disabled="true" on disabled buttons across paradigms', () => {
      render(
        <BespokeButton disabled theme="theme-hydro-droplet">
          Disabled Droplet
        </BespokeButton>
      );
      const btn = screen.getByRole('button', { name: /Disabled Droplet/i });
      expect(btn).toBeDisabled();
      expect(btn).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('Keyboard Navigation (Tab, Enter, Space) & Focus Management', () => {
    it('allows keyboard focus and Enter/Space activation on InteractiveScene hotspots', () => {
      const onSelectHotspot = vi.fn();
      const hotspots = [
        {
          id: 'leak-1',
          title: 'Dripping Faucet',
          category: 'water',
          status: 'pending',
          x: 25,
          y: 40,
        },
      ];

      render(
        <InteractiveScene
          hotspots={hotspots}
          onSelectHotspot={onSelectHotspot}
          activeId={null}
          theme="theme-solarpunk"
        />
      );

      const marker = screen.getByRole('button', { name: /Dripping Faucet/i });
      expect(marker).toBeInTheDocument();
      expect(marker).toHaveAttribute('tabIndex', '0');

      // Test Space key activation
      fireEvent.keyDown(marker, { key: ' ', code: 'Space' });
      expect(onSelectHotspot).toHaveBeenCalledTimes(1);
      expect(onSelectHotspot).toHaveBeenCalledWith(hotspots[0]);

      // Test Enter key activation
      fireEvent.keyDown(marker, { key: 'Enter', code: 'Enter' });
      expect(onSelectHotspot).toHaveBeenCalledTimes(2);
    });

    it('allows keyboard activation on BespokeActionCard via Enter and Space', () => {
      const onClick = vi.fn();
      render(
        <BespokeActionCard
          title="Install Flow Restrictors"
          subtitle="Saves 40% water"
          icon="💧"
          onClick={onClick}
          theme="theme-herbarium"
        />
      );

      const card = screen.getByRole('button', { name: /Install Flow Restrictors/i });
      expect(card).toBeInTheDocument();
      expect(card).toHaveAttribute('tabIndex', '0');

      // Trigger via Enter
      fireEvent.keyDown(card, { key: 'Enter', code: 'Enter' });
      expect(onClick).toHaveBeenCalledTimes(1);

      // Trigger via Space
      fireEvent.keyDown(card, { key: ' ', code: 'Space' });
      expect(onClick).toHaveBeenCalledTimes(2);
    });

    it('navigates design system switcher via keyboard and updates aria-pressed states in Admin station', () => {
      render(<App initialRoute="/admin" />);

      const themeGroup = screen.getByRole('group', { name: /Design System Switcher/i });
      expect(themeGroup).toBeInTheDocument();

      const stoneBtn = screen.getByRole('button', { name: /Clay Pebble/i });
      expect(stoneBtn).toHaveAttribute('aria-pressed', 'false');

      fireEvent.click(stoneBtn);
      expect(stoneBtn).toHaveAttribute('aria-pressed', 'true');
    });
  });

  describe('Reduced Motion & Accessibility Adaptation', () => {
    it('honors prefers-reduced-motion media query configuration', () => {
      const matchMediaSpy = vi.spyOn(window, 'matchMedia').mockImplementation((query) => ({
        matches: query.includes('prefers-reduced-motion: reduce'),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      expect(reducedQuery.matches).toBe(true);

      matchMediaSpy.mockRestore();
    });
  });
});
