import React, { useState } from 'react';
import { 
  Droplets, SunMedium, Zap, FileText, Trash2, Flame, Sprout, 
  Monitor, Coffee, Apple, Refrigerator, Printer, UtensilsCrossed, 
  Boxes, Droplet, Package, Lightbulb, CheckCircle2, AlertCircle, Eye, EyeOff
} from 'lucide-react';
import { sounds } from '../services/soundEffects';

// Icon resolver for issues
export function IssueIcon({ name, className = "w-5 h-5" }) {
  const map = {
    Droplets, SunMedium, Zap, FileText, Trash2, Flame, Sprout,
    Monitor, Coffee, Apple, Refrigerator, Printer, UtensilsCrossed,
    Boxes, Droplet, Package, Lightbulb
  };
  const IconComp = map[name] || AlertCircle;
  return <IconComp className={className} />;
}

export default function InteractiveScene({ 
  scenario = { id: 'school', issues: [] }, 
  hotspots,
  discoveredIds = [], 
  onSpotIssue, 
  onSelectHotspot,
  theme = 'biomorphic',
  showHints = true,
  customImageUrl = null
}) {
  const [activeIssue, setActiveIssue] = useState(null);
  const [showHelperMarkers, setShowHelperMarkers] = useState(showHints);

  const issuesList = hotspots || scenario?.issues || [];

  const handleHotspotClick = (issue) => {
    sounds.playSpotSuccess();
    setActiveIssue(issue);
    if (!discoveredIds.includes(issue.id)) {
      if (onSpotIssue) onSpotIssue(issue);
      if (onSelectHotspot) onSelectHotspot(issue);
    }
  };

  return (
    <div className="relative w-full rounded-[2.5rem] overflow-hidden select-none shadow-2xl border-4 border-emerald-800/30 bg-slate-950/80 backdrop-blur-md group">
      {/* Top Scene Controls Overlay */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-2 bg-emerald-950/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-emerald-600/40 text-xs font-semibold text-emerald-200">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span>Interactive Scene: Click or tap any eco-issue</span>
        </div>

        <button
          onClick={() => setShowHelperMarkers(!showHelperMarkers)}
          className="flex items-center gap-1.5 bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700/60 text-xs font-medium text-slate-300 transition-all cursor-pointer"
          title={showHelperMarkers ? "Hide glowing rings for harder challenge" : "Show glowing hint rings"}
        >
          {showHelperMarkers ? <EyeOff className="w-3.5 h-3.5 text-amber-300" /> : <Eye className="w-3.5 h-3.5 text-emerald-400" />}
          <span>{showHelperMarkers ? 'Expert Mode (Hide Rings)' : 'Show Rings'}</span>
        </button>
      </div>

      {/* Main Visual Scene Area */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] min-h-[380px] sm:min-h-[460px] max-h-[580px] overflow-hidden">
        {customImageUrl ? (
          // Custom uploaded scenario photo
          <img 
            src={customImageUrl} 
            alt="Custom Eco-Audit Scenario" 
            className="w-full h-full object-cover"
          />
        ) : (scenario?.id || 'school') === 'school' ? (
          // Detailed SVG Scene: School Classroom & Hallway
          <svg viewBox="0 0 1000 600" className="w-full h-full object-cover">
            <defs>
              <linearGradient id="wallGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1e3a2f" />
                <stop offset="65%" stopColor="#132a21" />
                <stop offset="100%" stopColor="#0d1e17" />
              </linearGradient>
              <linearGradient id="floorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#292524" />
                <stop offset="100%" stopColor="#1c1917" />
              </linearGradient>
              <linearGradient id="windowDaylight" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
                <stop offset="60%" stopColor="#bae6fd" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.2" />
              </linearGradient>
              <filter id="glowLight">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Back Wall */}
            <rect x="0" y="0" width="1000" height="420" fill="url(#wallGrad)" />

            {/* Ceiling fluorescent light fixtures (Lights On Issue) */}
            <g className="cursor-pointer">
              <rect x="340" y="20" width="320" height="30" rx="6" fill="#f8fafc" opacity="0.9" filter="url(#glowLight)" />
              {/* Beaming light cone despite sunny day */}
              <polygon points="320,50 680,50 820,380 180,380" fill="rgba(254, 240, 138, 0.12)" />
              <line x1="360" y1="35" x2="640" y2="35" stroke="#fef08a" strokeWidth="4" />
            </g>

            {/* Floor */}
            <polygon points="0,420 1000,420 1000,600 0,600" fill="url(#floorGrad)" />
            {/* Floor perspective lines */}
            <line x1="200" y1="420" x2="80" y2="600" stroke="#44403c" strokeWidth="1.5" strokeOpacity="0.4" />
            <line x1="450" y1="420" x2="380" y2="600" stroke="#44403c" strokeWidth="1.5" strokeOpacity="0.4" />
            <line x1="700" y1="420" x2="690" y2="600" stroke="#44403c" strokeWidth="1.5" strokeOpacity="0.4" />
            <line x1="880" y1="420" x2="940" y2="600" stroke="#44403c" strokeWidth="1.5" strokeOpacity="0.4" />

            {/* Whiteboard on classroom wall */}
            <rect x="320" y="90" width="360" height="180" rx="8" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="6" />
            <text x="350" y="130" fill="#0f172a" fontSize="18" fontWeight="bold" fontFamily="sans-serif">
              Today's Science Topic: ECOSYSTEMS
            </text>
            <text x="350" y="160" fill="#475569" fontSize="13" fontFamily="sans-serif">
              * Remember to save energy & recycle properly!
            </text>
            <path d="M 350 200 Q 420 180 500 210 T 640 190" stroke="#10b981" strokeWidth="3" fill="none" />

            {/* Sunny Big Window on Right (Daylight & Open Window with Radiator) */}
            <g>
              <rect x="780" y="80" width="180" height="240" rx="4" fill="url(#windowDaylight)" stroke="#cbd5e1" strokeWidth="8" />
              {/* Window grid */}
              <line x1="870" y1="80" x2="870" y2="320" stroke="#cbd5e1" strokeWidth="4" />
              <line x1="780" y1="200" x2="960" y2="200" stroke="#cbd5e1" strokeWidth="4" />
              {/* Outside green tree visible */}
              <circle cx="840" cy="170" r="45" fill="#22c55e" opacity="0.7" />
              <circle cx="910" cy="140" r="50" fill="#16a34a" opacity="0.6" />
              {/* Window cracked open pane with breeze wave */}
              <polygon points="870,80 940,90 940,310 870,320" fill="rgba(255,255,255,0.25)" />
              <path d="M 910 120 Q 890 140 920 170 T 895 210" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="4 4" fill="none" />
              {/* Radiator directly beneath open window blasting heat */}
              <rect x="790" y="340" width="160" height="70" rx="4" fill="#64748b" stroke="#334155" strokeWidth="3" />
              <line x1="810" y1="345" x2="810" y2="405" stroke="#94a3b8" strokeWidth="3" />
              <line x1="830" y1="345" x2="830" y2="405" stroke="#94a3b8" strokeWidth="3" />
              <line x1="850" y1="345" x2="850" y2="405" stroke="#94a3b8" strokeWidth="3" />
              <line x1="870" y1="345" x2="870" y2="405" stroke="#94a3b8" strokeWidth="3" />
              <line x1="890" y1="345" x2="890" y2="405" stroke="#94a3b8" strokeWidth="3" />
              <line x1="910" y1="345" x2="910" y2="405" stroke="#94a3b8" strokeWidth="3" />
              <line x1="930" y1="345" x2="930" y2="405" stroke="#94a3b8" strokeWidth="3" />
              {/* Heat waves rising */}
              <path d="M 830 330 Q 825 315 835 300" stroke="#f97316" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.8" />
              <path d="M 870 330 Q 865 315 875 300" stroke="#f97316" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.8" />
              <path d="M 910 330 Q 905 315 915 300" stroke="#f97316" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.8" />
            </g>

            {/* Left Science Prep Sink with Dripping Tap */}
            <g>
              {/* Sink Counter Base */}
              <rect x="100" y="350" width="160" height="130" fill="#334155" stroke="#1e293b" strokeWidth="3" />
              <rect x="90" y="340" width="180" height="20" rx="3" fill="#94a3b8" />
              {/* Basin */}
              <ellipse cx="180" cy="365" rx="50" ry="16" fill="#475569" stroke="#64748b" strokeWidth="2" />
              {/* Goose-neck faucet */}
              <path d="M 180 340 L 180 290 Q 180 270 195 270 Q 210 270 210 290 L 210 310" stroke="#cbd5e1" strokeWidth="8" strokeLinecap="round" fill="none" />
              {/* Dripping Water droplets */}
              <circle cx="210" cy="330" r="3.5" fill="#38bdf8" />
              <circle cx="210" cy="350" r="4.5" fill="#38bdf8" />
              {/* Ripple in basin */}
              <ellipse cx="210" cy="368" rx="14" ry="4" stroke="#38bdf8" strokeWidth="1.5" fill="none" opacity="0.8" />
              <ellipse cx="210" cy="368" rx="26" ry="7" stroke="#38bdf8" strokeWidth="1" fill="none" opacity="0.4" />
            </g>

            {/* Wilted Plant in Corner Shelf */}
            <g>
              <rect x="60" y="240" width="60" height="12" fill="#78350f" />
              <polygon points="75,240 105,240 100,210 80,210" fill="#b45309" />
              {/* Drooping brown/yellow leaves */}
              <path d="M 85 210 Q 70 195 65 215" stroke="#a16207" strokeWidth="4" strokeLinecap="round" fill="none" />
              <path d="M 95 210 Q 110 195 115 220" stroke="#ca8a04" strokeWidth="4" strokeLinecap="round" fill="none" />
              <circle cx="90" cy="215" r="2" fill="#78350f" />
            </g>

            {/* Student Desks in Foreground */}
            <g>
              {/* Front Center Desk */}
              <polygon points="380,430 640,430 680,490 340,490" fill="#a16207" stroke="#78350f" strokeWidth="3" />
              {/* Desk Legs */}
              <line x1="360" y1="490" x2="350" y2="570" stroke="#475569" strokeWidth="6" strokeLinecap="round" />
              <line x1="660" y1="490" x2="670" y2="570" stroke="#475569" strokeWidth="6" strokeLinecap="round" />

              {/* Single use plastic water bottles on desk */}
              <rect x="420" y="410" width="14" height="35" rx="3" fill="#67e8f9" opacity="0.75" stroke="#0891b2" strokeWidth="1" />
              <rect x="450" y="420" width="14" height="30" rx="3" fill="#67e8f9" opacity="0.65" stroke="#0891b2" strokeWidth="1" transform="rotate(25, 450, 420)" />

              {/* Stack of single-sided discarded paper on right side of desk */}
              <polygon points="560,440 630,435 635,465 565,470" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
              <polygon points="563,442 633,437 638,467 568,472" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.5" />
              <text x="575" y="458" fill="#64748b" fontSize="8" fontFamily="monospace">SINGLE-SIDED</text>
            </g>

            {/* Wall Sockets & Phantom Charger on Lower Right Wall */}
            <g>
              <rect x="800" y="450" width="40" height="40" rx="4" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
              <circle cx="813" cy="465" r="3" fill="#1e293b" />
              <circle cx="827" cy="465" r="3" fill="#1e293b" />
              {/* Charger plugged in with hanging wire but NO phone/laptop */}
              <rect x="812" y="456" width="16" height="24" rx="2" fill="#0f172a" />
              {/* Dangling black cord */}
              <path d="M 820 480 Q 830 520 810 540 T 835 565" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" fill="none" />
              {/* Idle transformer glow */}
              <circle cx="826" cy="462" r="1.5" fill="#ef4444" />
            </g>

            {/* Contaminated Recycling Bins in Lower Left Floor */}
            <g>
              {/* Blue Paper Bin */}
              <polygon points="270,470 330,470 325,540 275,540" fill="#2563eb" stroke="#1d4ed8" strokeWidth="2" />
              <text x="282" y="515" fill="#ffffff" fontSize="12" fontWeight="bold">PAPER</text>
              {/* Trash sticking out: greasy drink cup with straw & plastic wrapper */}
              <rect x="290" y="450" width="22" height="25" rx="3" fill="#ef4444" />
              <line x1="305" y1="440" x2="300" y2="455" stroke="#fef08a" strokeWidth="3" strokeLinecap="round" />
              <polygon points="275,455 295,465 285,475" fill="#f59e0b" />
            </g>
          </svg>
        ) : scenario.id === 'office' ? (
          // Detailed SVG Scene: Modern Tech Office
          <svg viewBox="0 0 1000 600" className="w-full h-full object-cover">
            <rect x="0" y="0" width="1000" height="420" fill="#0f172a" />
            <rect x="0" y="420" width="1000" height="180" fill="#1e293b" />
            {/* Office Large Glass Partition */}
            <line x1="500" y1="0" x2="500" y2="420" stroke="#334155" strokeWidth="4" />
            {/* Left Desk with Dual Glowing Monitors */}
            <polygon points="250,390 520,390 560,470 210,470" fill="#334155" stroke="#475569" strokeWidth="2" />
            {/* Monitors left ON */}
            <rect x="280" y="270" width="90" height="60" rx="3" fill="#38bdf8" opacity="0.9" filter="url(#glowLight)" />
            <rect x="385" y="270" width="90" height="60" rx="3" fill="#38bdf8" opacity="0.9" filter="url(#glowLight)" />
            <line x1="325" y1="330" x2="325" y2="360" stroke="#94a3b8" strokeWidth="4" />
            <line x1="430" y1="330" x2="430" y2="360" stroke="#94a3b8" strokeWidth="4" />

            {/* Space heater blazing under desk */}
            <rect x="230" y="490" width="55" height="60" rx="4" fill="#ea580c" />
            <line x1="240" y1="510" x2="275" y2="510" stroke="#fef08a" strokeWidth="4" />
            <line x1="240" y1="530" x2="275" y2="530" stroke="#fef08a" strokeWidth="4" />

            {/* Coffee Station on Right with Single-Use Paper Cups Mountain */}
            <rect x="620" y="320" width="220" height="130" fill="#475569" />
            <rect x="650" y="250" width="60" height="70" rx="4" fill="#0284c7" />
            {/* Pyramid of disposable coffee cups */}
            <polygon points="730,300 745,300 742,320 733,320" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />
            <polygon points="750,300 765,300 762,320 753,320" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />
            <polygon points="770,300 785,300 782,320 773,320" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />
            <polygon points="740,280 755,280 752,300 743,300" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />
            <polygon points="760,280 775,280 772,300 763,300" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />

            {/* Breakroom Fridge door ajar */}
            <rect x="860" y="220" width="100" height="210" rx="6" fill="#94a3b8" />
            <line x1="910" y1="220" x2="910" y2="430" stroke="#64748b" strokeWidth="2" />
            <polygon points="910,240 940,245 940,360 910,350" fill="#e2e8f0" opacity="0.8" />
            {/* Cold air escaping */}
            <path d="M 925 280 Q 940 300 920 320" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" fill="none" />

            {/* Left Multifunction Printer with Abandoned Print Pile */}
            <rect x="100" y="330" width="90" height="100" rx="4" fill="#64748b" />
            <rect x="120" y="310" width="50" height="30" fill="#ffffff" stroke="#94a3b8" strokeWidth="2" />
            <rect x="123" y="305" width="44" height="6" fill="#f8fafc" />
            <rect x="123" y="299" width="44" height="6" fill="#f1f5f9" />
            <rect x="123" y="293" width="44" height="6" fill="#e2e8f0" />

            {/* Trash bin with apple core / food waste */}
            <polygon points="760,490 810,490 805,550 765,550" fill="#334155" stroke="#64748b" strokeWidth="2" />
            <circle cx="785" cy="485" r="10" fill="#ef4444" />
            <line x1="785" y1="475" x2="790" y2="470" stroke="#78350f" strokeWidth="2" />
          </svg>
        ) : (
          // Detailed SVG Scene: School Cafeteria & Dining Hall
          <svg viewBox="0 0 1000 600" className="w-full h-full object-cover">
            <rect x="0" y="0" width="1000" height="380" fill="#1e293b" />
            <rect x="0" y="380" width="1000" height="220" fill="#334155" />
            {/* Skylight Atrium Glass */}
            <polygon points="300,0 700,0 650,140 350,140" fill="#bae6fd" opacity="0.6" stroke="#94a3b8" strokeWidth="3" />
            {/* Bright lamps burning under skylight */}
            <circle cx="420" cy="120" r="14" fill="#fef08a" filter="url(#glowLight)" />
            <circle cx="580" cy="120" r="14" fill="#fef08a" filter="url(#glowLight)" />

            {/* Cafeteria Dining Bench in Center */}
            <polygon points="250,420 750,420 800,480 200,480" fill="#f59e0b" stroke="#d97706" strokeWidth="3" />
            {/* Single use plastic cutlery piles & condiment packets */}
            <rect x="260" y="435" width="40" height="15" rx="3" fill="#ffffff" opacity="0.8" />
            <rect x="310" y="435" width="20" height="12" rx="2" fill="#ef4444" />
            <rect x="335" y="435" width="20" height="12" rx="2" fill="#eab308" />

            {/* Dishwash Station on Right with Running Spray Wand */}
            <rect x="720" y="270" width="220" height="150" fill="#64748b" />
            <rect x="740" y="300" width="120" height="40" rx="4" fill="#475569" />
            {/* Industrial coil spring spray wand */}
            <path d="M 760 210 Q 760 250 780 270 L 780 295" stroke="#cbd5e1" strokeWidth="6" fill="none" />
            {/* Spray gushing into sink */}
            <polygon points="775,295 785,295 805,335 755,335" fill="rgba(56, 189, 248, 0.6)" />

            {/* Center Waste Station with Untouched Food Tray Dump */}
            <rect x="490" y="460" width="100" height="110" rx="4" fill="#1e293b" stroke="#0f172a" strokeWidth="3" />
            {/* Tray balanced on garbage with whole apple and milk */}
            <polygon points="500,445 580,445 575,460 505,460" fill="#ef4444" />
            <circle cx="525" cy="440" r="8" fill="#22c55e" />
            <rect x="545" y="432" width="14" height="20" rx="2" fill="#ffffff" stroke="#94a3b8" />
          </svg>
        )}

        {/* Clickable Hotspots overlay */}
        {issuesList.map((issue) => {
          const isDiscovered = discoveredIds.includes(issue.id);
          const isSelected = activeIssue?.id === issue.id;

          return (
            <div
              key={issue.id}
              role="button"
              tabIndex={0}
              aria-label={`Eco hazard: ${issue.title} in ${issue.category}`}
              onClick={() => handleHotspotClick(issue)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleHotspotClick(issue);
                }
              }}
              style={{ left: `${issue.x}%`, top: `${issue.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-30 cursor-pointer group/hotspot transition-transform hover:scale-125 focus-visible:ring-4 focus-visible:ring-emerald-400 focus-visible:outline-none rounded-full"
            >
              {/* Outer Pulsing Rings (if hints enabled and not discovered) */}
              {showHelperMarkers && !isDiscovered && (
                <>
                  <span className="absolute -inset-3 rounded-full bg-emerald-400/40 animate-ping pointer-events-none" />
                  <span className="absolute -inset-2 rounded-full border-2 border-emerald-300/80 animate-pulse pointer-events-none" />
                </>
              )}

              {/* Marker Button */}
              <div 
                className={`relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full shadow-xl transition-all duration-300 ${
                  isDiscovered 
                    ? 'bg-emerald-600 text-white ring-4 ring-emerald-300/60 scale-105' 
                    : isSelected
                      ? 'bg-amber-500 text-white ring-4 ring-amber-300'
                      : 'bg-slate-900/90 text-emerald-300 border-2 border-emerald-400/90 hover:bg-emerald-500 hover:text-slate-950 hover:border-white'
                }`}
              >
                {isDiscovered ? (
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
                ) : (
                  <IssueIcon name={issue.icon} className="w-5 h-5" />
                )}
              </div>

              {/* Mini Label Badge */}
              <div className={`absolute top-full mt-1 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded-md text-[10px] font-bold pointer-events-none transition-all duration-200 ${
                isDiscovered
                  ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-700/60 opacity-90'
                  : 'bg-slate-900/90 text-slate-200 border border-slate-700 opacity-0 group-hover/hotspot:opacity-100'
              }`}>
                {issue.title}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Issue Detail Popover / Feedback Card */}
      {activeIssue && (
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-950/95 via-slate-900/95 to-teal-950/95 border-t border-emerald-600/40 backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 shrink-0">
                <IssueIcon name={activeIssue.icon} className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {activeIssue.category}
                  </span>
                  <span className="text-xs font-semibold text-emerald-400">
                    Spotted #{discoveredIds.indexOf(activeIssue.id) + 1 || 1}
                  </span>
                </div>
                <h4 className="text-base sm:text-lg font-bold text-white mt-1">
                  {activeIssue.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 mt-0.5 max-w-2xl leading-relaxed">
                  {activeIssue.description}
                </p>
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-emerald-800/40">
              <div className="text-left sm:text-right">
                <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Recommended Action</div>
                <div className="text-xs text-slate-200 max-w-xs sm:text-right font-medium">
                  {activeIssue.practicalAction}
                </div>
              </div>
              <button
                onClick={() => setActiveIssue(null)}
                className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-600 transition-colors"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
