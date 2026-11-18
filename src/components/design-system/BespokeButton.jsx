import React from 'react';
import { sounds } from '../../services/soundEffects';

/**
 * BespokeButton: 100% Custom Non-Rectangular Buttons
 * Paradigms:
 * 1. Solarpunk: Bioluminescent chlorophyll glass capsule with flowing gradient waves
 * 2. Clay Pebble: Squishy 3D physical spring pebble button with deep extruded bevels
 * 3. Herbarium: Deckle-torn kraft ribbon / botanical wax seal with ragged edges
 * 4. Hydro-Droplet: Water meniscus dew bubble button with glistening specular reflection
 */
export default function BespokeButton({
  children,
  onClick,
  type = 'button',
  disabled = false,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  className = '',
  theme = 'solarpunk',
  'aria-label': ariaLabel
}) {
  const activeTheme = 
    theme === 'biomorphic' ? 'solarpunk' :
    theme === 'stone' ? 'clay-pebble' :
    theme === 'papercraft' ? 'herbarium' :
    theme;

  const handleClick = (e) => {
    if (disabled) return;
    if (sounds?.playSpotSuccess) {
      sounds.playSpotSuccess();
    }
    if (onClick) onClick(e);
  };

  // Size padding
  const sizeClasses = {
    sm: 'px-3.5 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-xs sm:text-sm',
    lg: 'px-7 py-3.5 text-sm sm:text-base font-black'
  }[size] || 'px-5 py-2.5 text-xs sm:text-sm';

  const commonProps = {
    type,
    disabled,
    'aria-disabled': disabled,
    'aria-label': ariaLabel,
    onClick: handleClick
  };

  // 1. SOLARPUNK BIO-GLASS BUTTON
  if (activeTheme === 'solarpunk') {
    return (
      <button
        {...commonProps}
        className={`eco-btn relative inline-flex items-center justify-center gap-2 font-black tracking-wide cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed select-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${sizeClasses} ${className}`}
      >
        {Icon && <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:rotate-12" />}
        <span>{children}</span>
        {/* Kinetic Chlorophyll Micro-Halo */}
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_6px_#67e8f9] shrink-0" />
      </button>
    );
  }

  // 2. NEO-TACTILE CLAY PEBBLE BUTTON (Physical 3D Spring Press)
  if (activeTheme === 'clay-pebble') {
    return (
      <button
        {...commonProps}
        className={`eco-btn relative inline-flex items-center justify-center gap-2 font-black cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed select-none focus-visible:ring-2 focus-visible:ring-lime-400 focus-visible:outline-none ${sizeClasses} ${className}`}
      >
        {Icon && <Icon className="w-4 h-4 shrink-0" />}
        <span>{children}</span>
        {/* Tactile Moss Cushion Pebble Pin */}
        <span className="w-2 h-2 rounded-full bg-lime-300 shadow-inner shrink-0" />
      </button>
    );
  }

  // 3. EDITORIAL HERBARIUM (Deckle-Torn Ribbon & Wax Seal)
  if (activeTheme === 'herbarium') {
    return (
      <button
        {...commonProps}
        className={`eco-btn relative inline-flex items-center justify-center gap-2.5 font-bold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed select-none focus-visible:ring-2 focus-visible:ring-emerald-800 focus-visible:outline-none ${sizeClasses} ${className}`}
      >
        {/* Botanical Wax Seal Icon or Emoji */}
        <span className="text-sm select-none">🍃</span>
        {Icon && <Icon className="w-4 h-4 shrink-0" />}
        <span>{children}</span>
      </button>
    );
  }

  // 4. LIQUID HYDRO-DROPLET (Water Meniscus Bubble)
  return (
    <button
      {...commonProps}
      className={`eco-btn relative inline-flex items-center justify-center gap-2 font-extrabold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed select-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:outline-none ${sizeClasses} ${className}`}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0" />}
      <span>{children}</span>
      {/* Specular Dew Drop Glisten */}
      <span className="w-2 h-2 rounded-full bg-cyan-200 shadow-[0_0_8px_#a5f3fc] shrink-0" />
    </button>
  );
}
