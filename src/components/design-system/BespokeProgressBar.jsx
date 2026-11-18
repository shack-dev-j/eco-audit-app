import React from 'react';

/**
 * BespokeProgressBar: 100% Custom Organic Progress Indicator
 * Paradigms:
 * 1. Solarpunk: Luminescent chlorophyll fluid tube with kinetic photon flow
 * 2. Clay Pebble: Sunken clay channel filling with physical moss cushion
 * 3. Herbarium: Creeping botanical vine ruler unfurling green buds
 * 4. Hydro-Droplet: Fluid water vial with glistening dew meniscus
 */
export default function BespokeProgressBar({
  progressPct = 0,
  progress,
  theme = 'solarpunk',
  className = '',
  'aria-label': ariaLabel = 'Eco-survey completion progress'
}) {
  const normalized = (theme || 'solarpunk').replace(/^theme-/, '');
  const activeTheme = 
    normalized === 'biomorphic' ? 'solarpunk' :
    normalized === 'stone' ? 'clay-pebble' :
    normalized === 'papercraft' ? 'herbarium' :
    normalized;

  const rawVal = progress !== undefined ? progress : progressPct;
  const clamped = Math.min(100, Math.max(0, rawVal));

  const progressBarProps = {
    role: 'progressbar',
    'aria-valuenow': clamped,
    'aria-valuemin': 0,
    'aria-valuemax': 100,
    'aria-label': ariaLabel
  };

  // 1. SOLARPUNK
  if (activeTheme === 'solarpunk') {
    return (
      <div {...progressBarProps} className={`flex items-center gap-3 ${className}`}>
        <div className="flex-1 h-3 rounded-full bg-slate-950/80 border border-emerald-500/40 p-0.5 relative overflow-hidden shadow-inner">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-500 relative"
            style={{ width: `${clamped}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
          </div>
        </div>
        <span className="text-xs font-black text-cyan-300 font-mono min-w-[55px]">
          {clamped}%
        </span>
      </div>
    );
  }

  // 2. CLAY PEBBLE
  if (activeTheme === 'clay-pebble') {
    return (
      <div {...progressBarProps} className={`flex items-center gap-3 ${className}`}>
        <div className="flex-1 h-3.5 rounded-full bg-[#0a150f] border border-emerald-900/60 p-0.5 relative overflow-hidden shadow-[inset_2px_3px_6px_rgba(0,0,0,0.8)]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-lime-600 to-emerald-600 transition-all duration-400 shadow-inner"
            style={{ width: `${clamped}%` }}
          />
        </div>
        <span className="text-xs font-bold text-lime-400 font-mono min-w-[55px]">
          {clamped}%
        </span>
      </div>
    );
  }

  // 3. EDITORIAL HERBARIUM
  if (activeTheme === 'herbarium') {
    return (
      <div {...progressBarProps} className={`flex items-center gap-3 ${className}`}>
        <div className="flex-1 h-3 bg-[#f5f1e1] border-b-2 border-dashed border-stone-400 relative overflow-hidden">
          <div
            className="h-full bg-emerald-800 transition-all duration-500 flex items-center justify-end pr-1"
            style={{ width: `${clamped}%` }}
          >
            <span className="text-[9px] text-amber-200 select-none">🍃</span>
          </div>
        </div>
        <span className="text-xs font-serif font-bold text-stone-800 min-w-[55px]">
          {clamped}%
        </span>
      </div>
    );
  }

  // 4. LIQUID HYDRO-DROPLET
  return (
    <div {...progressBarProps} className={`flex items-center gap-3 ${className}`}>
      <div className="flex-1 h-3 rounded-full bg-cyan-950/80 border border-cyan-500/40 p-0.5 relative overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-teal-400 via-cyan-400 to-sky-400 transition-all duration-500 relative"
          style={{ width: `${clamped}%` }}
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-white/40 rounded-full" />
        </div>
      </div>
      <span className="text-xs font-black text-cyan-300 font-mono min-w-[55px]">
        {clamped}%
      </span>
    </div>
  );
}
