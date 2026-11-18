import React, { useState } from 'react';
import { Eye, QrCode, Maximize2, Minimize2, Printer, Compass } from 'lucide-react';
import AttachedQrBadge from './AttachedQrBadge';

export default function ScenarioPictureCard({ 
  scenario, 
  onOpenPoster = null 
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="eco-container overflow-hidden p-5 sm:p-7 space-y-4">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Audit Target Scene
            </span>
            <span className="text-xs text-slate-400 font-semibold">{scenario.badge}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
            {scenario.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            {scenario.description}
          </p>
        </div>

        {/* View Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-xs font-semibold text-slate-300 border border-slate-700 transition-colors cursor-pointer"
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span>{isExpanded ? 'Collapse Scene' : 'Expand Scene'}</span>
          </button>

          {onOpenPoster && (
            <button
              onClick={onOpenPoster}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-xs font-bold text-emerald-200 border border-emerald-600/40 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Stand Poster</span>
            </button>
          )}
        </div>
      </div>

      {/* Picture Frame (Clean Observation View, No Clickable Game Hotspots) */}
      <div className={`relative w-full rounded-2xl overflow-hidden border-2 border-emerald-700/40 bg-slate-950 transition-all duration-300 shadow-xl ${
        isExpanded ? 'aspect-[16/10] max-h-[640px]' : 'aspect-[16/9] max-h-[380px]'
      }`}>
        {scenario.customImageUrl ? (
          <img 
            src={scenario.customImageUrl} 
            alt={scenario.title} 
            className="w-full h-full object-cover" 
          />
        ) : scenario.id === 'school' ? (
          // School Classroom & Hallway Scene Vector Art
          <svg viewBox="0 0 1000 600" className="w-full h-full object-cover">
            <defs>
              <linearGradient id="scWall" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1e3a2f" />
                <stop offset="70%" stopColor="#132a21" />
                <stop offset="100%" stopColor="#0d1e17" />
              </linearGradient>
              <linearGradient id="scFloor" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#292524" />
                <stop offset="100%" stopColor="#1c1917" />
              </linearGradient>
              <linearGradient id="scSunWindow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" stopOpacity="0.85" />
                <stop offset="60%" stopColor="#bae6fd" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.3" />
              </linearGradient>
            </defs>

            {/* Back Wall */}
            <rect x="0" y="0" width="1000" height="420" fill="url(#scWall)" />

            {/* Fluorescent Light Banks Blazing */}
            <g>
              <rect x="340" y="20" width="320" height="30" rx="6" fill="#f8fafc" opacity="0.95" />
              <line x1="360" y1="35" x2="640" y2="35" stroke="#fef08a" strokeWidth="4" />
              <polygon points="320,50 680,50 820,380 180,380" fill="rgba(254, 240, 138, 0.12)" />
            </g>

            {/* Floor */}
            <polygon points="0,420 1000,420 1000,600 0,600" fill="url(#scFloor)" />
            <line x1="200" y1="420" x2="80" y2="600" stroke="#44403c" strokeWidth="1.5" strokeOpacity="0.4" />
            <line x1="500" y1="420" x2="480" y2="600" stroke="#44403c" strokeWidth="1.5" strokeOpacity="0.4" />
            <line x1="800" y1="420" x2="880" y2="600" stroke="#44403c" strokeWidth="1.5" strokeOpacity="0.4" />

            {/* Whiteboard */}
            <rect x="320" y="90" width="360" height="180" rx="8" fill="#f8fafc" stroke="#94a3b8" strokeWidth="6" />
            <text x="350" y="130" fill="#0f172a" fontSize="18" fontWeight="bold" fontFamily="sans-serif">
              Today's Science Topic: ECOSYSTEMS
            </text>
            <text x="350" y="160" fill="#475569" fontSize="13" fontFamily="sans-serif">
              * Remember to save energy & recycle properly!
            </text>
            <path d="M 350 200 Q 420 180 500 210 T 640 190" stroke="#10b981" strokeWidth="3" fill="none" />

            {/* Sunny Big Window & Radiator conflict */}
            <g>
              <rect x="780" y="80" width="180" height="240" rx="4" fill="url(#scSunWindow)" stroke="#cbd5e1" strokeWidth="8" />
              <line x1="870" y1="80" x2="870" y2="320" stroke="#cbd5e1" strokeWidth="4" />
              <line x1="780" y1="200" x2="960" y2="200" stroke="#cbd5e1" strokeWidth="4" />
              <circle cx="840" cy="170" r="45" fill="#22c55e" opacity="0.7" />
              <circle cx="910" cy="140" r="50" fill="#16a34a" opacity="0.6" />
              <polygon points="870,80 940,90 940,310 870,320" fill="rgba(255,255,255,0.3)" />
              <path d="M 910 120 Q 890 140 920 170 T 895 210" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="4 4" fill="none" />

              {/* Radiator */}
              <rect x="790" y="340" width="160" height="70" rx="4" fill="#64748b" stroke="#334155" strokeWidth="3" />
              <line x1="810" y1="345" x2="810" y2="405" stroke="#94a3b8" strokeWidth="3" />
              <line x1="840" y1="345" x2="840" y2="405" stroke="#94a3b8" strokeWidth="3" />
              <line x1="870" y1="345" x2="870" y2="405" stroke="#94a3b8" strokeWidth="3" />
              <line x1="900" y1="345" x2="900" y2="405" stroke="#94a3b8" strokeWidth="3" />
              <line x1="930" y1="345" x2="930" y2="405" stroke="#94a3b8" strokeWidth="3" />
              <path d="M 830 330 Q 825 315 835 300" stroke="#f97316" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.8" />
              <path d="M 870 330 Q 865 315 875 300" stroke="#f97316" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.8" />
            </g>

            {/* Science Prep Sink with Dripping Tap */}
            <g>
              <rect x="100" y="350" width="160" height="130" fill="#334155" stroke="#1e293b" strokeWidth="3" />
              <rect x="90" y="340" width="180" height="20" rx="3" fill="#94a3b8" />
              <ellipse cx="180" cy="365" rx="50" ry="16" fill="#475569" stroke="#64748b" strokeWidth="2" />
              <path d="M 180 340 L 180 290 Q 180 270 195 270 Q 210 270 210 290 L 210 310" stroke="#cbd5e1" strokeWidth="8" strokeLinecap="round" fill="none" />
              <circle cx="210" cy="330" r="3.5" fill="#38bdf8" />
              <circle cx="210" cy="350" r="4.5" fill="#38bdf8" />
              <ellipse cx="210" cy="368" rx="14" ry="4" stroke="#38bdf8" strokeWidth="1.5" fill="none" opacity="0.8" />
            </g>

            {/* Classroom desk with paper & bottles */}
            <g>
              <polygon points="380,430 640,430 680,490 340,490" fill="#a16207" stroke="#78350f" strokeWidth="3" />
              <rect x="420" y="410" width="14" height="35" rx="3" fill="#67e8f9" opacity="0.75" stroke="#0891b2" strokeWidth="1" />
              <polygon points="560,440 630,435 635,465 565,470" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
            </g>

            {/* Phantom Charger */}
            <g>
              <rect x="800" y="450" width="40" height="40" rx="4" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
              <rect x="812" y="456" width="16" height="24" rx="2" fill="#0f172a" />
              <path d="M 820 480 Q 830 520 810 540 T 835 565" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" fill="none" />
            </g>

            {/* Contaminated Recycling Bin */}
            <g>
              <polygon points="270,470 330,470 325,540 275,540" fill="#2563eb" stroke="#1d4ed8" strokeWidth="2" />
              <text x="282" y="515" fill="#ffffff" fontSize="12" fontWeight="bold">PAPER</text>
              <rect x="290" y="450" width="22" height="25" rx="3" fill="#ef4444" />
            </g>
          </svg>
        ) : scenario.id === 'office' ? (
          // Office Vector Art
          <svg viewBox="0 0 1000 600" className="w-full h-full object-cover">
            <rect x="0" y="0" width="1000" height="420" fill="#0f172a" />
            <rect x="0" y="420" width="1000" height="180" fill="#1e293b" />
            <line x1="500" y1="0" x2="500" y2="420" stroke="#334155" strokeWidth="4" />
            <polygon points="250,390 520,390 560,470 210,470" fill="#334155" stroke="#475569" strokeWidth="2" />
            <rect x="280" y="270" width="90" height="60" rx="3" fill="#38bdf8" opacity="0.9" />
            <rect x="385" y="270" width="90" height="60" rx="3" fill="#38bdf8" opacity="0.9" />
            <rect x="230" y="490" width="55" height="60" rx="4" fill="#ea580c" />
            <rect x="620" y="320" width="220" height="130" fill="#475569" />
            <rect x="650" y="250" width="60" height="70" rx="4" fill="#0284c7" />
            <rect x="860" y="220" width="100" height="210" rx="6" fill="#94a3b8" />
            <rect x="100" y="330" width="90" height="100" rx="4" fill="#64748b" />
            <polygon points="760,490 810,490 805,550 765,550" fill="#334155" stroke="#64748b" strokeWidth="2" />
          </svg>
        ) : (
          // Cafeteria Vector Art
          <svg viewBox="0 0 1000 600" className="w-full h-full object-cover">
            <rect x="0" y="0" width="1000" height="380" fill="#1e293b" />
            <rect x="0" y="380" width="1000" height="220" fill="#334155" />
            <polygon points="300,0 700,0 650,140 350,140" fill="#bae6fd" opacity="0.6" stroke="#94a3b8" strokeWidth="3" />
            <polygon points="250,420 750,420 800,480 200,480" fill="#f59e0b" stroke="#d97706" strokeWidth="3" />
            <rect x="720" y="270" width="220" height="150" fill="#64748b" />
            <rect x="490" y="460" width="100" height="110" rx="4" fill="#1e293b" stroke="#0f172a" strokeWidth="3" />
          </svg>
        )}

        {/* Observation Prompt Banner */}
        <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-emerald-500/40 text-[11px] font-semibold text-emerald-200">
          Observe this scene closely • Find up to 3 environmental issues
        </div>
      </div>

      {/* Attached QR Code Banner */}
      <AttachedQrBadge
        scenarioId={scenario.id}
        scenarioTitle={scenario.title}
        variant="banner"
        onOpenPoster={onOpenPoster}
      />
    </div>
  );
}
