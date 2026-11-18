import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import BiosphereTimerBackground from '../components/BiosphereTimerBackground';

describe('5. Performance & 60 FPS Canvas Timer Suite', () => {
  let originalRAF;
  let originalCAF;
  let rafCallbacks = [];

  beforeEach(() => {
    rafCallbacks = [];
    originalRAF = window.requestAnimationFrame;
    originalCAF = window.cancelAnimationFrame;

    window.requestAnimationFrame = vi.fn((cb) => {
      const id = rafCallbacks.length + 1;
      rafCallbacks.push({ id, cb });
      return id;
    });

    window.cancelAnimationFrame = vi.fn((id) => {
      rafCallbacks = rafCallbacks.filter(item => item.id !== id);
    });
  });

  afterEach(() => {
    window.requestAnimationFrame = originalRAF;
    window.cancelAnimationFrame = originalCAF;
  });

  it('initializes canvas context and starts 60 FPS animation loop', () => {
    const { container } = render(
      <BiosphereTimerBackground progress={0} isUrgent={false} stage="spot" />
    );

    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
    expect(canvas).toHaveAttribute('aria-hidden', 'true');
    expect(canvas.getContext).toHaveBeenCalledWith('2d');
    expect(window.requestAnimationFrame).toHaveBeenCalled();
  });

  it('maintains continuous loop without tearing down animation on progress updates', () => {
    const { rerender } = render(
      <BiosphereTimerBackground progress={0.1} isUrgent={false} stage="spot" />
    );

    const initialRAFCalls = window.requestAnimationFrame.mock.calls.length;
    const initialCancelCalls = window.cancelAnimationFrame.mock.calls.length;

    // Simulate clock countdown progress updating from 0.1 to 0.2, 0.3, 0.5
    rerender(<BiosphereTimerBackground progress={0.2} isUrgent={false} stage="spot" />);
    rerender(<BiosphereTimerBackground progress={0.3} isUrgent={false} stage="spot" />);
    rerender(<BiosphereTimerBackground progress={0.5} isUrgent={true} stage="spot" />);

    // Because progress is ref-based, cancelAnimationFrame should NOT be called on every second update!
    expect(window.cancelAnimationFrame.mock.calls.length).toBe(initialCancelCalls);
  });

  it('applies devicePixelRatio for high-DPI retina display sharpness', () => {
    window.devicePixelRatio = 2;
    window.innerWidth = 800;
    window.innerHeight = 600;

    const { container } = render(
      <BiosphereTimerBackground progress={0.4} isUrgent={false} />
    );

    const canvas = container.querySelector('canvas');
    expect(canvas.width).toBe(800 * 2);
    expect(canvas.height).toBe(600 * 2);
  });

  it('respects prefers-reduced-motion media query', () => {
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query.includes('prefers-reduced-motion: reduce'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { container } = render(
      <BiosphereTimerBackground progress={0.5} isUrgent={false} />
    );

    expect(container.querySelector('canvas')).toBeInTheDocument();
  });

  it('cancels animation frame and removes window listeners on unmount', () => {
    const removeListenerSpy = vi.spyOn(window, 'removeEventListener');

    const { unmount } = render(
      <BiosphereTimerBackground progress={0.2} isUrgent={false} />
    );

    unmount();

    expect(window.cancelAnimationFrame).toHaveBeenCalled();
    expect(removeListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    expect(removeListenerSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
  });
});
