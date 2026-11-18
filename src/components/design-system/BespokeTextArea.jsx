import React, { useState } from 'react';

/**
 * BespokeTextArea: 100% Custom Non-Rectangular Multiline Text Area
 * Paradigms:
 * 1. Solarpunk: Luminescent glass membrane capsule with kinetic border energy
 * 2. Clay Pebble: Carved 3D river basin trough with deep tactile inset shadow
 * 3. Herbarium: Deckle-edged botanical field notebook page with faint ink rules
 * 4. Hydro-Droplet: Fluid dewdrop pool with water meniscus highlights
 */
export default function BespokeTextArea({
  id,
  label,
  value,
  onChange,
  placeholder = '',
  rows = 3,
  required = false,
  helperText,
  theme = 'solarpunk',
  className = '',
  'aria-label': ariaLabel
}) {
  const [isFocused, setIsFocused] = useState(false);

  const normalized = (theme || 'solarpunk').replace(/^theme-/, '');
  const activeTheme = 
    normalized === 'biomorphic' ? 'solarpunk' :
    normalized === 'stone' ? 'clay-pebble' :
    normalized === 'papercraft' ? 'herbarium' :
    normalized;

  const textareaId = id || (label ? `textarea-${label.toLowerCase().replace(/[^a-z0-9]/g, '-')}` : undefined);
  const effectiveAriaLabel = ariaLabel || label || placeholder;

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label 
          htmlFor={textareaId}
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

      {/* 1. SOLARPUNK BIO-GLASS */}
      {activeTheme === 'solarpunk' && (
        <div className="relative group">
          {isFocused && (
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-500/30 to-cyan-500/30 blur-md animate-pulse pointer-events-none" />
          )}
          <div className={`eco-textarea-wrapper p-3.5 relative transition-all duration-300 ${
            isFocused ? 'ring-2 ring-emerald-400/80 shadow-lg shadow-emerald-500/20' : ''
          }`}>
            <textarea
              id={textareaId}
              rows={rows}
              value={value}
              onChange={onChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              aria-label={effectiveAriaLabel}
              required={required}
              className="bespoke-raw-textarea text-xs sm:text-sm font-medium text-emerald-100 placeholder-emerald-200/40 resize-none focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* 2. NEO-TACTILE CLAY PEBBLE */}
      {activeTheme === 'clay-pebble' && (
        <div className="relative group">
          <div className={`eco-textarea-wrapper p-3.5 relative transition-all duration-200 ${
            isFocused ? 'ring-2 ring-emerald-500/70' : ''
          }`}>
            <textarea
              id={textareaId}
              rows={rows}
              value={value}
              onChange={onChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              aria-label={effectiveAriaLabel}
              required={required}
              className="bespoke-raw-textarea text-xs sm:text-sm font-bold text-slate-100 placeholder-slate-500 resize-none focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* 3. EDITORIAL HERBARIUM */}
      {activeTheme === 'herbarium' && (
        <div className="relative group">
          <div className={`eco-textarea-wrapper p-3.5 relative transition-all duration-200 ${
            isFocused ? 'ring-1 ring-emerald-800 shadow-md' : ''
          }`}>
            <textarea
              id={textareaId}
              rows={rows}
              value={value}
              onChange={onChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              aria-label={effectiveAriaLabel}
              required={required}
              className="bespoke-raw-textarea text-xs sm:text-sm font-serif text-stone-900 placeholder-stone-500 resize-none leading-relaxed focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* 4. LIQUID HYDRO-DROPLET */}
      {activeTheme === 'hydro-droplet' && (
        <div className="relative group">
          {isFocused && (
            <div className="absolute -inset-1 rounded-3xl bg-cyan-400/20 blur-md pointer-events-none" />
          )}
          <div className={`eco-textarea-wrapper p-3.5 relative transition-all duration-300 ${
            isFocused ? 'ring-2 ring-cyan-400 shadow-[0_0_22px_rgba(6,182,212,0.4)]' : ''
          }`}>
            <textarea
              id={textareaId}
              rows={rows}
              value={value}
              onChange={onChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              aria-label={effectiveAriaLabel}
              required={required}
              className="bespoke-raw-textarea text-xs sm:text-sm font-medium text-cyan-50 placeholder-cyan-200/40 resize-none focus:outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}
