import React, { useState } from 'react';
import { X } from 'lucide-react';
import { sounds } from '../../services/soundEffects';

/**
 * BespokeInput: 100% Custom Non-Rectangular Text & Email Input
 * Paradigms:
 * 1. Solarpunk: Floating bio-capsule with kinetic bioluminescent light ring & chlorophyll pulse
 * 2. Clay Pebble: Sunken 3D river pebble trough with deep carved inset shadows
 * 3. Herbarium: Editorial typewriter notebook rule with growing botanical vine underline
 * 4. Hydro-Droplet: Fluid morphing water droplet with glistening meniscus reflection & ripple
 */
export default function BespokeInput({
  id,
  label,
  value,
  onChange,
  placeholder = '',
  type = 'text',
  icon: Icon,
  required = false,
  onClear,
  helperText,
  theme = 'solarpunk',
  className = '',
  autoFocus = false,
  'aria-label': ariaLabel
}) {
  const [isFocused, setIsFocused] = useState(false);

  // Normalize theme aliases (handles 'theme-solarpunk', 'solarpunk', 'theme-biomorphic', etc.)
  const normalized = (theme || 'solarpunk').replace(/^theme-/, '');
  const activeTheme = 
    normalized === 'biomorphic' ? 'solarpunk' :
    normalized === 'stone' ? 'clay-pebble' :
    normalized === 'papercraft' ? 'herbarium' :
    normalized;

  const inputId = id || (label ? `input-${label.toLowerCase().replace(/[^a-z0-9]/g, '-')}` : undefined);
  const effectiveAriaLabel = ariaLabel || label || placeholder;

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label 
          htmlFor={inputId}
          className="flex items-center justify-between text-xs font-bold tracking-wide"
        >
          <span className={activeTheme === 'herbarium' ? 'text-stone-800 font-serif italic' : 'text-emerald-300'}>
            {label} {required && <span className="text-red-400">*</span>}
          </span>
          {helperText && (
            <span className="text-[11px] text-slate-400 font-normal">
              {helperText}
            </span>
          )}
        </label>
      )}

      {/* 1. SOLARPUNK BIO-GLASS: Floating Capsule with Kinetic Light Ring */}
      {activeTheme === 'solarpunk' && (
        <div className="relative group">
          {/* Kinetic Ambient Light Aura */}
          {isFocused && (
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 opacity-75 blur-sm animate-pulse pointer-events-none transition-all duration-300" />
          )}

          <div
            className={`eco-input-wrapper relative flex items-center px-4 py-2.5 transition-all duration-300 ${
              isFocused ? 'ring-2 ring-emerald-400/80 shadow-lg shadow-emerald-500/20' : ''
            }`}
          >
            {Icon && (
              <div className="mr-3 text-emerald-400 shrink-0">
                <Icon className={`w-4 h-4 transition-transform duration-300 ${isFocused ? 'scale-110 text-cyan-300' : ''}`} />
              </div>
            )}

            <input
              id={inputId}
              type={type}
              value={value}
              onChange={onChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder={placeholder}
              autoFocus={autoFocus}
              aria-label={effectiveAriaLabel}
              required={required}
              className="bespoke-raw-input flex-1 eco-input-field text-xs sm:text-sm font-medium text-white placeholder-emerald-200/40 focus:outline-none"
            />

            {value && onClear && (
              <button
                type="button"
                onClick={onClear}
                aria-label={`Clear ${label || placeholder || 'input'}`}
                className="ml-2 p-1 rounded-full bg-emerald-950/70 hover:bg-emerald-800 text-emerald-300 hover:text-white transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
                title="Clear input"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Kinetic Bioluminescent Indicator Pill */}
            <div className="ml-2 shrink-0">
              <span className={`w-2 h-2 rounded-full block transition-all duration-300 ${
                isFocused 
                  ? 'bg-cyan-300 shadow-[0_0_8px_#67e8f9] animate-ping' 
                  : value 
                    ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]' 
                    : 'bg-emerald-900/60'
              }`} />
            </div>
          </div>
        </div>
      )}

      {/* 2. NEO-TACTILE CLAY PEBBLE: 3D Sunken River Pebble Trough */}
      {activeTheme === 'clay-pebble' && (
        <div className="relative group">
          <div
            className={`eco-input-wrapper relative flex items-center px-4 py-2.5 transition-all duration-200 ${
              isFocused ? 'ring-2 ring-emerald-500/70' : ''
            }`}
          >
            {Icon && (
              <div className="mr-3 text-emerald-500 shrink-0">
                <Icon className={`w-4 h-4 transition-transform duration-200 ${isFocused ? 'scale-110 text-lime-400' : ''}`} />
              </div>
            )}

            <input
              id={inputId}
              type={type}
              value={value}
              onChange={onChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder={placeholder}
              autoFocus={autoFocus}
              aria-label={effectiveAriaLabel}
              required={required}
              className="bespoke-raw-input flex-1 eco-input-field text-xs sm:text-sm font-bold text-slate-100 placeholder-slate-500 focus:outline-none"
            />

            {value && onClear && (
              <button
                type="button"
                onClick={onClear}
                aria-label={`Clear ${label || placeholder || 'input'}`}
                className="ml-2 p-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-red-400 transition-all cursor-pointer shadow-inner focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
                title="Clear input"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Tactile Pebble Indentation Dot */}
            <div className="ml-2 shrink-0">
              <div className={`w-3 h-3 rounded-full border border-emerald-900/80 transition-all ${
                value ? 'bg-lime-500 shadow-inner' : 'bg-slate-950 shadow-inner'
              }`} />
            </div>
          </div>
        </div>
      )}

      {/* 3. EDITORIAL HERBARIUM: Typewriter Guideline with Growing Vine Underline */}
      {activeTheme === 'herbarium' && (
        <div className="relative group">
          <div
            className={`eco-input-wrapper relative flex items-center px-4 py-2.5 transition-all duration-200 ${
              isFocused ? 'shadow-md ring-1 ring-emerald-800' : ''
            }`}
          >
            {Icon && (
              <div className="mr-3 text-stone-600 shrink-0">
                <Icon className={`w-4 h-4 ${isFocused ? 'text-emerald-700' : ''}`} />
              </div>
            )}

            <input
              id={inputId}
              type={type}
              value={value}
              onChange={onChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder={placeholder}
              autoFocus={autoFocus}
              aria-label={effectiveAriaLabel}
              required={required}
              className="bespoke-raw-input flex-1 eco-input-field text-xs sm:text-sm text-stone-900 font-serif placeholder-stone-500 font-normal focus:outline-none"
            />

            {value && onClear && (
              <button
                type="button"
                onClick={onClear}
                aria-label={`Clear ${label || placeholder || 'input'}`}
                className="ml-2 p-1 rounded bg-stone-200 hover:bg-stone-300 text-stone-600 hover:text-stone-900 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:outline-none"
                title="Clear field"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Vintage Botanical Specimen Stamp */}
            <div className="ml-2 shrink-0">
              <span className="text-xs text-emerald-800 select-none">
                {value ? '🌿' : '✎'}
              </span>
            </div>
          </div>

          {/* Animated Botanical Vine Underline that blooms on focus */}
          <div className="relative h-1 overflow-hidden mt-0.5 rounded-full">
            <div
              className={`h-full bg-gradient-to-r from-emerald-700 via-amber-600 to-green-600 transition-all duration-500 ${
                isFocused ? 'w-full opacity-100' : value ? 'w-full opacity-40' : 'w-0 opacity-0'
              }`}
            />
          </div>
        </div>
      )}

      {/* 4. LIQUID HYDRO-DROPLET: Fluid Morphing Droplet with Meniscus Highlight */}
      {activeTheme === 'hydro-droplet' && (
        <div className="relative group">
          {/* Subtle Water Caustic Glow */}
          {isFocused && (
            <div className="absolute -inset-1 rounded-full bg-cyan-400/25 blur-md animate-pulse pointer-events-none" />
          )}

          <div
            className={`eco-input-wrapper relative flex items-center px-4 py-2.5 transition-all duration-300 ${
              isFocused ? 'ring-2 ring-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)]' : ''
            }`}
          >
            {Icon && (
              <div className="mr-3 text-cyan-400 shrink-0">
                <Icon className={`w-4 h-4 transition-transform duration-300 ${isFocused ? 'scale-110 text-cyan-200' : ''}`} />
              </div>
            )}

            <input
              id={inputId}
              type={type}
              value={value}
              onChange={onChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder={placeholder}
              autoFocus={autoFocus}
              aria-label={effectiveAriaLabel}
              required={required}
              className="bespoke-raw-input flex-1 eco-input-field text-xs sm:text-sm font-medium text-cyan-50 placeholder-cyan-200/40 focus:outline-none"
            />

            {value && onClear && (
              <button
                type="button"
                onClick={onClear}
                aria-label={`Clear ${label || placeholder || 'input'}`}
                className="ml-2 p-1 rounded-full bg-cyan-950/80 hover:bg-cyan-800 text-cyan-300 hover:text-white transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
                title="Clear input"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Liquid Dew Drop Meniscus Indicator */}
            <div className="ml-2 shrink-0">
              <span className={`w-2.5 h-2.5 rounded-full block transition-all duration-300 ${
                isFocused 
                  ? 'bg-cyan-300 shadow-[0_0_10px_#22d3ee] scale-125' 
                  : value 
                    ? 'bg-teal-400 shadow-[0_0_6px_#2dd4bf]' 
                    : 'bg-cyan-900/70'
              }`} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
