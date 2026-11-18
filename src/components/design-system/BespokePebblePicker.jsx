import React from 'react';
import { sounds } from '../../services/soundEffects';

/**
 * BespokePebblePicker: 100% Custom Non-Rectangular Option Chips & Toggles
 * Paradigms:
 * 1. Solarpunk: Floating bio-capsule with kinetic neon light aura
 * 2. Clay Pebble: 3D sculpted river stone with moss cushion indentation
 * 3. Herbarium: Botanical specimen label with wax seal stamp indicator
 * 4. Hydro-Droplet: Dew meniscus droplet that swells with fluid reflection
 */
export default function BespokePebblePicker({
  options = [],
  value,
  onChange,
  theme = 'solarpunk',
  className = '',
  'aria-label': groupAriaLabel = 'Select option'
}) {
  const normalized = (theme || 'solarpunk').replace(/^theme-/, '');
  const activeTheme = 
    normalized === 'biomorphic' ? 'solarpunk' :
    normalized === 'stone' ? 'clay-pebble' :
    normalized === 'papercraft' ? 'herbarium' :
    normalized;

  const handleSelect = (val) => {
    if (sounds?.playSpotSuccess) {
      sounds.playSpotSuccess();
    }
    onChange(val);
  };

  return (
    <div 
      role="group" 
      aria-label={groupAriaLabel} 
      className={`flex flex-wrap gap-2 ${className}`}
    >
      {options.map((opt, optIndex) => {
        const optVal = typeof opt === 'string' ? opt : (opt.value !== undefined ? opt.value : (opt.id !== undefined ? opt.id : opt.label));
        const optLabel = typeof opt === 'string' ? opt : opt.label;
        const isSelected = value === optVal;

        // 1. SOLARPUNK BIO-GLASS CAPSULE
        if (activeTheme === 'solarpunk') {
          return (
            <button
              key={optVal}
              type="button"
              aria-pressed={isSelected}
              onClick={() => handleSelect(optVal)}
              className={`relative inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer select-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${
                isSelected
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black shadow-[0_0_16px_rgba(16,185,129,0.5)] scale-105 border border-emerald-300'
                  : 'bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-200 border border-emerald-700/40 hover:scale-102'
              }`}
            >
              {isSelected ? (
                <span className="w-2 h-2 rounded-full bg-slate-950 shadow-[0_0_6px_#ffffff]" />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
              )}
              <span>{optLabel}</span>
            </button>
          );
        }

        // 2. NEO-TACTILE CLAY PEBBLE
        if (activeTheme === 'clay-pebble') {
          return (
            <button
              key={optVal}
              type="button"
              aria-pressed={isSelected}
              onClick={() => handleSelect(optVal)}
              className={`relative inline-flex items-center gap-2 px-4 py-2 text-xs font-bold transition-all duration-200 cursor-pointer select-none focus-visible:ring-2 focus-visible:ring-lime-400 focus-visible:outline-none ${
                isSelected
                  ? 'bg-gradient-to-br from-lime-600 to-emerald-700 text-white font-black shadow-[0_4px_0_#064e3b] translate-y-1'
                  : 'bg-gradient-to-br from-[#1d3629] to-[#122219] hover:from-[#264535] hover:to-[#172b20] text-slate-200 shadow-[0_5px_0_#07100b] border border-emerald-900/40'
              }`}
              style={{
                borderRadius: '32px 50px 36px 48px / 46px 34px 50px 38px'
              }}
            >
              <div className={`w-2.5 h-2.5 rounded-full border border-emerald-900/60 ${
                isSelected ? 'bg-lime-300 shadow-inner' : 'bg-slate-900'
              }`} />
              <span>{optLabel}</span>
            </button>
          );
        }

        // 3. EDITORIAL HERBARIUM (Botanical Specimen Label)
        if (activeTheme === 'herbarium') {
          return (
            <button
              key={optVal}
              type="button"
              aria-pressed={isSelected}
              onClick={() => handleSelect(optVal)}
              className={`relative inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-serif transition-all duration-200 cursor-pointer select-none focus-visible:ring-2 focus-visible:ring-emerald-800 focus-visible:outline-none ${
                isSelected
                  ? 'bg-emerald-800 text-amber-50 font-bold shadow-md scale-105'
                  : 'bg-[#fffdf5] hover:bg-[#f5f1e1] text-stone-800 border border-stone-300 shadow-sm'
              }`}
              style={{
                clipPath: 'polygon(2% 0%, 98% 2%, 100% 98%, 0% 96%)'
              }}
            >
              <span className="text-[11px] select-none">{isSelected ? '✓' : '•'}</span>
              <span>{optLabel}</span>
            </button>
          );
        }

        // 4. LIQUID HYDRO-DROPLET
        return (
          <button
            key={optVal}
            type="button"
            aria-pressed={isSelected}
            onClick={() => handleSelect(optVal)}
            className={`relative inline-flex items-center gap-2 px-4 py-2 text-xs font-bold transition-all duration-300 cursor-pointer select-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:outline-none ${
              isSelected
                ? 'bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-black shadow-[0_0_18px_rgba(6,182,212,0.55)] scale-105 border border-cyan-200'
                : 'bg-cyan-950/70 hover:bg-cyan-900/80 text-cyan-200 border border-cyan-700/40'
            }`}
            style={{
              borderRadius: '40% 60% 55% 45% / 50% 45% 55% 50%'
            }}
          >
            <span className={`w-2 h-2 rounded-full ${
              isSelected ? 'bg-slate-950 shadow-[0_0_6px_#fff]' : 'bg-cyan-500/60'
            }`} />
            <span>{optLabel}</span>
          </button>
        );
      })}
    </div>
  );
}
