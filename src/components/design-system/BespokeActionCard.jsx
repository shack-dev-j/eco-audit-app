import React from 'react';
import { Target } from 'lucide-react';
import { sounds } from '../../services/soundEffects';

/**
 * BespokeActionCard: 100% Custom Non-Rectangular Interactive Selection Card
 * Used for: Prioritization selection, Scenario showcases, Audit debriefs
 */
export default function BespokeActionCard({
  title,
  subtitle,
  badge,
  isSelected = false,
  onSelect,
  onClick,
  icon: Icon = Target,
  children,
  theme = 'solarpunk',
  className = '',
  role = 'button'
}) {
  const normalized = (theme || 'solarpunk').replace(/^theme-/, '');
  const activeTheme = 
    normalized === 'biomorphic' ? 'solarpunk' :
    normalized === 'stone' ? 'clay-pebble' :
    normalized === 'papercraft' ? 'herbarium' :
    normalized;

  const handleClick = (e) => {
    if (sounds?.playSpotSuccess) {
      sounds.playSpotSuccess();
    }
    if (onSelect) onSelect(e);
    if (onClick) onClick(e);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  const a11yProps = {
    role,
    tabIndex: 0,
    'aria-pressed': isSelected,
    'aria-label': `${title}${isSelected ? ' (Selected top priority)' : ''}`,
    onKeyDown: handleKeyDown
  };

  const renderIcon = () => {
    if (!Icon) return null;
    if (typeof Icon === 'string') {
      return <span className="text-xl select-none leading-none">{Icon}</span>;
    }
    const Comp = Icon;
    return <Comp className="w-5 h-5" />;
  };

  // 1. SOLARPUNK BIO-GLASS CARD
  if (activeTheme === 'solarpunk') {
    return (
      <div
        {...a11yProps}
        onClick={handleClick}
        className={`eco-card p-5 relative cursor-pointer select-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${
          isSelected
            ? 'ring-2 ring-cyan-400 bg-gradient-to-br from-emerald-950/90 to-cyan-950/80 shadow-[0_0_25px_rgba(6,182,212,0.4)] scale-102'
            : 'hover:scale-101'
        } ${className}`}
      >
        <div className="flex items-start gap-3.5">
          <div className={`p-2.5 rounded-full shrink-0 transition-all duration-300 ${
            isSelected 
              ? 'bg-gradient-to-tr from-cyan-400 to-emerald-400 text-slate-950 shadow-[0_0_12px_#22d3ee]' 
              : 'bg-emerald-900/50 text-emerald-300'
          }`}>
            {renderIcon()}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-300">
                {badge || (isSelected ? '★ Active Priority' : 'Selectable')}
              </span>
              {isSelected && (
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-300 shadow-[0_0_8px_#67e8f9] animate-ping" />
              )}
            </div>

            <h4 className="text-sm sm:text-base font-black text-white mt-1 leading-snug">
              {title}
            </h4>

            {subtitle && (
              <p className="text-xs text-emerald-200/80 mt-1 line-clamp-2">
                {subtitle}
              </p>
            )}

            {children && <div className="mt-3">{children}</div>}
          </div>
        </div>
      </div>
    );
  }

  // 2. NEO-TACTILE CLAY PEBBLE CARD
  if (activeTheme === 'clay-pebble') {
    return (
      <div
        {...a11yProps}
        onClick={handleClick}
        className={`eco-card p-5 relative cursor-pointer select-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-lime-400 focus-visible:outline-none ${
          isSelected
            ? 'translate-y-1 ring-2 ring-lime-400 shadow-[0_4px_0_#064e3b]'
            : 'shadow-[0_8px_0_#07120c] hover:-translate-y-0.5'
        } ${className}`}
      >
        <div className="flex items-start gap-3.5">
          <div className={`p-2.5 rounded-2xl shrink-0 transition-all ${
            isSelected 
              ? 'bg-gradient-to-br from-lime-500 to-emerald-600 text-white shadow-inner font-black' 
              : 'bg-slate-900 text-slate-400 shadow-inner'
          }`}>
            {renderIcon()}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-lime-400">
                {badge || (isSelected ? '★ Top Tactile Priority' : 'Pebble Option')}
              </span>
              <div className={`w-3 h-3 rounded-full border border-emerald-900 ${
                isSelected ? 'bg-lime-400 shadow-inner' : 'bg-slate-950'
              }`} />
            </div>

            <h4 className="text-sm sm:text-base font-extrabold text-slate-100 mt-1 leading-snug">
              {title}
            </h4>

            {subtitle && (
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                {subtitle}
              </p>
            )}

            {children && <div className="mt-3">{children}</div>}
          </div>
        </div>
      </div>
    );
  }

  // 3. EDITORIAL HERBARIUM CARD
  if (activeTheme === 'herbarium') {
    return (
      <div
        {...a11yProps}
        onClick={handleClick}
        className={`eco-card p-5 relative cursor-pointer select-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-emerald-800 focus-visible:outline-none ${
          isSelected
            ? 'border-l-8 border-l-emerald-800 bg-[#fffef9] shadow-lg scale-101 rotate-[-0.5deg]'
            : 'hover:rotate-[-0.3deg]'
        } ${className}`}
      >
        {/* Decorative Washi Tape Pin on Selected Card */}
        {isSelected && (
          <div className="absolute -top-3 left-6 px-3 py-0.5 washi-tape-strip text-[10px] font-bold text-amber-950 uppercase tracking-widest shadow-sm">
            ★ Prioritised
          </div>
        )}

        <div className="flex items-start gap-3.5 pt-1">
          <div className={`p-2 rounded-lg shrink-0 ${
            isSelected ? 'bg-emerald-800 text-amber-100' : 'bg-stone-200 text-stone-700'
          }`}>
            {renderIcon()}
          </div>

          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-serif font-bold text-emerald-800 uppercase tracking-widest">
              {badge || 'Herbarium Entry'}
            </div>

            <h4 className="text-sm sm:text-base font-serif font-bold text-stone-900 mt-1 leading-snug">
              {title}
            </h4>

            {subtitle && (
              <p className="text-xs text-stone-600 mt-1 font-serif line-clamp-2 italic">
                {subtitle}
              </p>
            )}

            {children && <div className="mt-3">{children}</div>}
          </div>
        </div>
      </div>
    );
  }

  // 4. LIQUID HYDRO-DROPLET CARD
  return (
    <div
      {...a11yProps}
      onClick={handleClick}
      className={`eco-card p-5 relative cursor-pointer select-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:outline-none ${
        isSelected
          ? 'ring-2 ring-cyan-300 bg-gradient-to-br from-cyan-950/90 to-teal-950/80 shadow-[0_0_28px_rgba(6,182,212,0.5)] scale-102'
          : 'hover:scale-101'
      } ${className}`}
    >
      <div className="flex items-start gap-3.5">
        <div className={`p-2.5 rounded-full shrink-0 transition-all duration-300 ${
          isSelected 
            ? 'bg-gradient-to-tr from-cyan-400 to-teal-300 text-slate-950 shadow-[0_0_15px_#22d3ee]' 
            : 'bg-cyan-950/80 text-cyan-300'
        }`}>
          {renderIcon()}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-300">
              {badge || (isSelected ? '★ Meniscus Priority' : 'Dewdrop Choice')}
            </span>
            {isSelected && (
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-300 shadow-[0_0_10px_#22d3ee]" />
            )}
          </div>

          <h4 className="text-sm sm:text-base font-black text-cyan-50 mt-1 leading-snug">
            {title}
          </h4>

          {subtitle && (
            <p className="text-xs text-cyan-200/80 mt-1 line-clamp-2">
              {subtitle}
            </p>
          )}

          {children && <div className="mt-3">{children}</div>}
        </div>
      </div>
    </div>
  );
}
