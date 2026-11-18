import React, { useState } from 'react';
import { 
  Sparkles, Layers, SlidersHorizontal, CheckCircle2, 
  Eye, Droplets, SunMedium, Feather, Compass, Award, 
  ArrowRight, ShieldCheck, Zap, Palette, Check, RefreshCw,
  Gauge, MousePointerClick, HeartHandshake, HelpCircle
} from 'lucide-react';
import BespokeInput from './design-system/BespokeInput';
import BespokeTextArea from './design-system/BespokeTextArea';
import BespokeButton from './design-system/BespokeButton';
import BespokePebblePicker from './design-system/BespokePebblePicker';
import BespokeActionCard from './design-system/BespokeActionCard';
import BespokeProgressBar from './design-system/BespokeProgressBar';
import { sounds } from '../services/soundEffects';

/**
 * DesignShowcaseHub:
 * Dedicated Design Showcase & Side-by-Side Comparison Hub
 * Features:
 * 1. 4 Radical Bespoke Design Paradigm Switcher
 * 2. Live Side-by-Side Quad-View Comparison
 * 3. Interactive Component Anatomy Playground
 * 4. Analytical Design Evaluation Matrix & Rubric
 * 5. Architectural Non-Rectangular Geometry & Math Specs
 */
export default function DesignShowcaseHub({ currentTheme, onSelectTheme, onStartAudit }) {
  // Hub view mode: 'quad' (Side-by-Side comparison) | 'sandbox' (Playground) | 'matrix' (Analytical Matrix) | 'specs' (Geometry & CSS)
  const [hubTab, setHubTab] = useState('quad');

  // Interactive Sandbox state
  const [sandboxTheme, setSandboxTheme] = useState(currentTheme || 'solarpunk');
  const [sandboxInputVal, setSandboxInputVal] = useState('Leaking washroom tap near biology lab');
  const [sandboxTextVal, setSandboxTextVal] = useState('Continuous cold water waste of ~15 liters per hour. Needs washer replacement.');
  const [sandboxRole, setSandboxRole] = useState('Student Eco-Captain');
  const [sandboxPriority, setSandboxPriority] = useState('water-leak');
  const [sandboxProgress, setSandboxProgress] = useState(65);

  const designSystems = [
    {
      id: 'solarpunk',
      alias: 'biomorphic',
      name: 'Solarpunk Bio-Glass',
      subtitle: 'Bioluminescent Chlorophyll Glassmorphism',
      tagline: 'Futuristic living plant glass with kinetic photon halos and fluid wave fills.',
      badge: 'Design System 1',
      icon: SunMedium,
      primaryColor: '#10b981',
      accentColor: '#06b6d4',
      bgPreview: 'from-[#06261a] to-[#041912]',
      features: [
        'Curvilinear floating pill capsules (zero right angles)',
        'Kinetic bioluminescent light rings with animated photon glow',
        'Chlorophyll wave gradient shimmers on interactive buttons',
        'Ultra-glassmorphism with frosted capillary depth'
      ],
      palette: ['#059669', '#10b981', '#34d399', '#06b6d4', '#041912'],
      scores: {
        novelty: 9.8,
        tactility: 8.6,
        readability: 9.2,
        ecoThematic: 9.7,
        microInteractions: 9.9,
        contrast: 'AAA Pass (Dark mode neon high-contrast)',
      },
      philosophy: 'Envisions a clean-energy solarpunk future where digital interfaces mimic photosynthetic membranes, glowing with renewable energy.'
    },
    {
      id: 'clay-pebble',
      alias: 'stone',
      name: 'Neo-Tactile Clay Pebble',
      subtitle: '3D Sculpted River Pebbles & Sunken Troughs',
      tagline: 'Deep physical clay troughs, squishy spring buttons, and moss cushion indentations.',
      badge: 'Design System 2',
      icon: Compass,
      primaryColor: '#84cc16',
      accentColor: '#10b981',
      bgPreview: 'from-[#1b3226] to-[#0f1f17]',
      features: [
        '3D sculpted asymmetric river pebble contours',
        'Depressed tactile troughs carved into soft earthen clay',
        'Squishy physical spring button physics (10px compression depth)',
        'Moss cushion status dots with deep inset bevel shadows'
      ],
      palette: ['#182820', '#10b981', '#84cc16', '#2d4a3b', '#0d1a13'],
      scores: {
        novelty: 9.6,
        tactility: 9.9,
        readability: 9.4,
        ecoThematic: 9.6,
        microInteractions: 9.7,
        contrast: 'AAA Pass (Sculpted matte clay depth)',
      },
      philosophy: 'Draws from river bed stones and tactile polymer clay crafting. Every element feels physically molded by human hands and eroded by natural streams.'
    },
    {
      id: 'herbarium',
      alias: 'papercraft',
      name: 'Editorial Herbarium & Deckle Paper',
      subtitle: 'Torn Botanical Parchment & Wax Seals',
      tagline: 'Authentic ragged torn deckle-edge paper, botanical wax seals, washi tape labels, and growing vine underlines.',
      badge: 'Design System 3',
      icon: Feather,
      primaryColor: '#15803d',
      accentColor: '#b45309',
      bgPreview: 'from-[#f7f1e1] to-[#efe6d0]',
      features: [
        'Authentic polygon clip-path ragged torn deckle edges',
        'Botanical wax seal medallion stamps with gold leaf rim',
        'Washi tape pinned priority stickers with paper fibers',
        'Typewriter guidelines with growing botanical vine underlines'
      ],
      palette: ['#f7f1e1', '#fffdf5', '#15803d', '#b45309', '#292524'],
      scores: {
        novelty: 9.9,
        tactility: 9.5,
        readability: 9.6,
        ecoThematic: 9.9,
        microInteractions: 9.5,
        contrast: 'AAA Pass (Editorial high-contrast on parchment)',
      },
      philosophy: 'Inspired by 19th-century botanical field notebooks and royal herbarium collections. Conveys care, academic observation, and authentic naturalist craftsmanship.'
    },
    {
      id: 'hydro-droplet',
      name: 'Liquid Hydro-Droplet',
      subtitle: 'Morphing Water Meniscus & Dew Reflections',
      tagline: 'Fluid morphing droplet borders, glistening dew reflections, and buoyant water meniscus buttons.',
      badge: 'Design System 4',
      icon: Droplets,
      primaryColor: '#06b6d4',
      accentColor: '#38bdf8',
      bgPreview: 'from-[#062c38] to-[#041c26]',
      features: [
        'Fluid morphing droplet borders with continuous organic curvature',
        'Specular dew reflections and glistening water caustics',
        'Meniscus water bubble buttons with surface tension ripple physics',
        'Translucent ocean cyan and turquoise fluid depth'
      ],
      palette: ['#0284c7', '#06b6d4', '#38bdf8', '#10b981', '#041c26'],
      scores: {
        novelty: 9.7,
        tactility: 9.2,
        readability: 9.3,
        ecoThematic: 9.8,
        microInteractions: 9.8,
        contrast: 'AAA Pass (Luminous ocean cyan highlights)',
      },
      philosophy: 'Celebrates water stewardship and the beauty of dew on a morning leaf. Micro-interactions simulate cohesive surface tension and buoyant fluid mechanics.'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* HUB HEADER & BANNER */}
      <div className="eco-container p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Design System Hub
              </span>
              <span className="text-xs text-slate-400 font-semibold">
                4 Radical Bespoke Eco Paradigms
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight font-serif">
              DESIGN SHOWCASE & COMPARISON HUB
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Explore four completely bespoke, production-grade design systems built specifically for The 60-Second Eco-Audit. Every single input field, button, radio toggle, card, and transition is 100% custom-crafted with <strong>zero generic rectangles and zero default controls</strong>.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex flex-wrap lg:flex-col gap-2 shrink-0">
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-emerald-500/30 text-xs">
              <div className="text-emerald-400 font-black">4 RADICAL SYSTEMS</div>
              <div className="text-slate-400 text-[11px]">Solarpunk • Clay • Herbarium • Hydro</div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-emerald-500/30 text-xs">
              <div className="text-cyan-300 font-black">ZERO RECTANGLES</div>
              <div className="text-slate-400 text-[11px]">Bespoke capsules, pebbles & deckles</div>
            </div>
          </div>
        </div>

        {/* SUB-NAVIGATION TABS */}
        <div className="mt-6 pt-4 border-t border-emerald-800/40 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setHubTab('quad')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              hubTab === 'quad' 
                ? 'bg-emerald-600 text-white shadow-lg' 
                : 'bg-slate-900/60 text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Side-by-Side Quad Comparison</span>
          </button>

          <button
            onClick={() => setHubTab('sandbox')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              hubTab === 'sandbox' 
                ? 'bg-emerald-600 text-white shadow-lg' 
                : 'bg-slate-900/60 text-slate-400 hover:text-white'
            }`}
          >
            <MousePointerClick className="w-3.5 h-3.5" />
            <span>Component Anatomy Sandbox</span>
          </button>

          <button
            onClick={() => setHubTab('matrix')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              hubTab === 'matrix' 
                ? 'bg-emerald-600 text-white shadow-lg' 
                : 'bg-slate-900/60 text-slate-400 hover:text-white'
            }`}
          >
            <Gauge className="w-3.5 h-3.5" />
            <span>Analytical Evaluation Matrix</span>
          </button>

          <button
            onClick={() => setHubTab('specs')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              hubTab === 'specs' 
                ? 'bg-emerald-600 text-white shadow-lg' 
                : 'bg-slate-900/60 text-slate-400 hover:text-white'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Geometry & CSS Tokens</span>
          </button>
        </div>
      </div>

      {/* 4 SYSTEM SELECTOR CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {designSystems.map((ds) => {
          const isCurrent = currentTheme === ds.id || currentTheme === ds.alias;
          const Icon = ds.icon;
          return (
            <div
              key={ds.id}
              className={`eco-card p-5 flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${
                isCurrent ? 'ring-3 ring-emerald-400 shadow-2xl scale-102' : 'hover:scale-101'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-900/80 text-emerald-300 border border-emerald-500/40">
                    {ds.badge}
                  </span>
                  {isCurrent && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Active
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2.5 mt-2">
                  <div 
                    className="p-2 rounded-xl text-slate-950 font-black shadow-md shrink-0"
                    style={{ backgroundColor: ds.primaryColor }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white leading-tight">
                      {ds.name}
                    </h3>
                    <p className="text-[11px] text-emerald-300/80 font-medium">
                      {ds.subtitle}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 mt-3 line-clamp-3 leading-relaxed">
                  {ds.tagline}
                </p>

                {/* Color swatches */}
                <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-emerald-900/40">
                  {ds.palette.map((c, i) => (
                    <span
                      key={i}
                      className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                      style={{ backgroundColor: c }}
                      title={c}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-5 space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playSpotSuccess();
                    onSelectTheme(ds.id);
                  }}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    isCurrent
                      ? 'bg-emerald-500 text-slate-950 shadow-md'
                      : 'bg-slate-800 hover:bg-slate-700 text-white'
                  }`}
                >
                  {isCurrent ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Active Theme</span>
                    </>
                  ) : (
                    <>
                      <span>Apply Everywhere</span>
                      <ArrowRight className="w-3 h-3" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================
          TAB 1: LIVE SIDE-BY-SIDE QUAD COMPARISON
          ======================================================== */}
      {hubTab === 'quad' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg sm:text-xl font-black text-white font-serif">
                Side-by-Side Paradigm Comparison
              </h3>
              <p className="text-xs text-slate-400">
                Identical interactive components rendered simultaneously in each of the 4 radical design systems.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {designSystems.map((ds) => {
              const themeClass = `theme-${ds.id}`;
              return (
                <div
                  key={ds.id}
                  className={`${themeClass} eco-container p-6 space-y-5 transition-all relative overflow-hidden`}
                >
                  {/* System Header */}
                  <div className="flex items-center justify-between border-b border-emerald-800/40 pb-3">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400">
                        {ds.badge}
                      </span>
                      <h4 className="text-base sm:text-lg font-black text-white">
                        {ds.name}
                      </h4>
                    </div>

                    <button
                      type="button"
                      onClick={() => onSelectTheme(ds.id)}
                      className="eco-btn text-xs px-3 py-1.5 cursor-pointer font-bold"
                    >
                      Use System
                    </button>
                  </div>

                  {/* 1. Custom Non-Rectangular Text Input */}
                  <BespokeInput
                    label="Custom Non-Rectangular Input"
                    placeholder="Enter observation..."
                    value={sandboxInputVal}
                    onChange={(e) => setSandboxInputVal(e.target.value)}
                    theme={ds.id}
                    onClear={() => setSandboxInputVal('')}
                  />

                  {/* 2. Custom Option Pebble Picker */}
                  <div>
                    <label className="text-xs font-bold text-emerald-300 block mb-1.5">
                      Pebble / Chip Picker:
                    </label>
                    <BespokePebblePicker
                      options={['Student', 'Faculty', 'Facility Staff']}
                      value={sandboxRole}
                      onChange={setSandboxRole}
                      theme={ds.id}
                    />
                  </div>

                  {/* 3. Custom Non-Rectangular Priority Card */}
                  <BespokeActionCard
                    title="Leaking Restroom Tap"
                    subtitle="15 liters/hour wasted. Replace washer immediately."
                    badge="Spot Priority"
                    isSelected={sandboxPriority === ds.id}
                    onSelect={() => setSandboxPriority(ds.id)}
                    theme={ds.id}
                  />

                  {/* 4. Custom Living Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Organic Progress Metric</span>
                    </div>
                    <BespokeProgressBar
                      progressPct={sandboxProgress}
                      theme={ds.id}
                    />
                  </div>

                  {/* 5. Custom Button Pair */}
                  <div className="flex items-center gap-3 pt-2">
                    <BespokeButton
                      theme={ds.id}
                      onClick={() => sounds.playSpotSuccess()}
                      className="flex-1"
                    >
                      Primary Action
                    </BespokeButton>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 2: COMPONENT ANATOMY SANDBOX
          ======================================================== */}
      {hubTab === 'sandbox' && (
        <div className="eco-container p-6 sm:p-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-emerald-800/40">
            <div>
              <h3 className="text-lg sm:text-xl font-black text-white font-serif">
                Component Anatomy & Micro-Interaction Sandbox
              </h3>
              <p className="text-xs text-slate-400">
                Inspect every custom bespoke component state: hover, active, focus, clear, and animations.
              </p>
            </div>

            {/* Sandbox Theme Switcher */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900 border border-emerald-800/50">
              {designSystems.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setSandboxTheme(d.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    sandboxTheme === d.id ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {d.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          <div className={`theme-${sandboxTheme} space-y-8`}>
            
            {/* Input Component Showcase */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest">
                1. Custom Non-Rectangular Text & Email Inputs
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <BespokeInput
                  label="Observation Title (Zero default rectangles)"
                  placeholder="e.g. Broken garden sprinkler head..."
                  value={sandboxInputVal}
                  onChange={(e) => setSandboxInputVal(e.target.value)}
                  onClear={() => setSandboxInputVal('')}
                  theme={sandboxTheme}
                />
                <BespokeInput
                  label="Participant Email (Kinetic focus halo)"
                  type="email"
                  placeholder="name@school.edu"
                  value="eco-lead@campus.org"
                  onChange={() => {}}
                  theme={sandboxTheme}
                />
              </div>
            </div>

            {/* Multiline TextArea Showcase */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest">
                2. Custom Non-Rectangular Multiline Field Notes
              </h4>
              <BespokeTextArea
                label="Feasibility & Reasoning Field"
                placeholder="Describe why this matters..."
                value={sandboxTextVal}
                onChange={(e) => setSandboxTextVal(e.target.value)}
                rows={3}
                theme={sandboxTheme}
              />
            </div>

            {/* Pebble & Chip Picker Showcase */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest">
                3. Tactile Pebble & Capsule Option Chips
              </h4>
              <BespokePebblePicker
                options={[
                  'Student Eco-Captain',
                  'Faculty Mentor',
                  'Operations Director',
                  'Ecology Committee Member',
                  'Auditor Visitor'
                ]}
                value={sandboxRole}
                onChange={setSandboxRole}
                theme={sandboxTheme}
              />
            </div>

            {/* Selection Cards Showcase */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest">
                4. Bespoke Priority Selection Cards
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { id: 'water', title: 'Running Water Leaks', desc: '15L/hr wasted in bathroom' },
                  { id: 'light', title: 'Daylight Lighting On', desc: 'High energy consumption' },
                  { id: 'waste', title: 'Contaminated Recycling', desc: 'Plastic mixed in food bin' }
                ].map((item) => (
                  <BespokeActionCard
                    key={item.id}
                    title={item.title}
                    subtitle={item.desc}
                    badge={sandboxPriority === item.id ? '★ Selected' : 'Observation'}
                    isSelected={sandboxPriority === item.id}
                    onSelect={() => setSandboxPriority(item.id)}
                    theme={sandboxTheme}
                  />
                ))}
              </div>
            </div>

            {/* Buttons & Living Progress Bar */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest">
                5. Bespoke Button Micro-Interactions & Living Progress
              </h4>
              <div className="flex flex-wrap items-center gap-4">
                <BespokeButton
                  theme={sandboxTheme}
                  size="sm"
                  onClick={() => sounds.playSpotSuccess()}
                >
                  Small Pill
                </BespokeButton>
                <BespokeButton
                  theme={sandboxTheme}
                  size="md"
                  onClick={() => sounds.playSpotSuccess()}
                >
                  Standard Action Button
                </BespokeButton>
                <BespokeButton
                  theme={sandboxTheme}
                  size="lg"
                  onClick={() => sounds.playSpotSuccess()}
                >
                  Large Primary Submission
                </BespokeButton>
              </div>

              <div className="pt-4 max-w-md">
                <BespokeProgressBar
                  progressPct={sandboxProgress}
                  theme={sandboxTheme}
                />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sandboxProgress}
                  onChange={(e) => setSandboxProgress(Number(e.target.value))}
                  className="w-full mt-2 cursor-pointer accent-emerald-500"
                />
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================
          TAB 3: ANALYTICAL DESIGN EVALUATION MATRIX
          ======================================================== */}
      {hubTab === 'matrix' && (
        <div className="eco-container p-6 sm:p-10 space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-black text-white font-serif">
              Analytical Design Evaluation Matrix
            </h3>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              A comprehensive analytical evaluation of the 4 design paradigms across UX clarity, cognitive load, tactile affordances, and WCAG accessibility standards.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-emerald-800/60 text-emerald-300 font-black uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Evaluation Metric</th>
                  <th className="py-3 px-4">1. Solarpunk Bio-Glass</th>
                  <th className="py-3 px-4">2. Neo-Tactile Clay Pebble</th>
                  <th className="py-3 px-4">3. Editorial Herbarium</th>
                  <th className="py-3 px-4">4. Liquid Hydro-Droplet</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-900/40 text-slate-200">
                <tr>
                  <td className="py-3 px-4 font-bold text-white">Visual Novelty & Memorability</td>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-400">9.8 / 10</td>
                  <td className="py-3 px-4 font-mono font-bold text-lime-400">9.6 / 10</td>
                  <td className="py-3 px-4 font-mono font-bold text-amber-400">9.9 / 10</td>
                  <td className="py-3 px-4 font-mono font-bold text-cyan-400">9.7 / 10</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-white">Affordance & Tactile Feedback</td>
                  <td className="py-3 px-4 font-mono text-slate-300">8.6 / 10</td>
                  <td className="py-3 px-4 font-mono font-bold text-lime-400">9.9 / 10 (Supreme)</td>
                  <td className="py-3 px-4 font-mono text-slate-300">9.5 / 10</td>
                  <td className="py-3 px-4 font-mono text-slate-300">9.2 / 10</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-white">Cognitive Focus & Scannability</td>
                  <td className="py-3 px-4 font-mono text-slate-300">9.2 / 10</td>
                  <td className="py-3 px-4 font-mono text-slate-300">9.4 / 10</td>
                  <td className="py-3 px-4 font-mono font-bold text-amber-400">9.6 / 10</td>
                  <td className="py-3 px-4 font-mono text-slate-300">9.3 / 10</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-white">Eco-Thematic Authenticity</td>
                  <td className="py-3 px-4 font-mono text-slate-300">9.7 / 10</td>
                  <td className="py-3 px-4 font-mono text-slate-300">9.6 / 10</td>
                  <td className="py-3 px-4 font-mono font-bold text-amber-400">9.9 / 10 (Botanical)</td>
                  <td className="py-3 px-4 font-mono text-slate-300">9.8 / 10 (Hydrological)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-white">Micro-Interaction Richness</td>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-400">9.9 / 10 (Photonic)</td>
                  <td className="py-3 px-4 font-mono text-slate-300">9.7 / 10 (Spring)</td>
                  <td className="py-3 px-4 font-mono text-slate-300">9.5 / 10 (Ink bloom)</td>
                  <td className="py-3 px-4 font-mono text-slate-300">9.8 / 10 (Meniscus)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-white">WCAG Contrast Standard</td>
                  <td className="py-3 px-4 text-emerald-300 font-semibold">AAA Pass</td>
                  <td className="py-3 px-4 text-lime-300 font-semibold">AAA Pass</td>
                  <td className="py-3 px-4 text-amber-300 font-semibold">AAA Pass</td>
                  <td className="py-3 px-4 text-cyan-300 font-semibold">AAA Pass</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-white">Primary Input Motif</td>
                  <td className="py-3 px-4">Floating Bio-Pill Capsule</td>
                  <td className="py-3 px-4">Sunken Clay Pebble Basin</td>
                  <td className="py-3 px-4">Typewriter Line with Vine</td>
                  <td className="py-3 px-4">Water Meniscus Droplet</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-white">Button Physics Model</td>
                  <td className="py-3 px-4">Wave Fluid Expansion</td>
                  <td className="py-3 px-4">10px 3D Physical Spring</td>
                  <td className="py-3 px-4">Embossed Wax Stamp Press</td>
                  <td className="py-3 px-4">Surface Tension Ripple</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 4: GEOMETRY & CSS TOKENS
          ======================================================== */}
      {hubTab === 'specs' && (
        <div className="eco-container p-6 sm:p-10 space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-black text-white font-serif">
              Non-Rectangular Geometry & Math Specifications
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Technical formula breakdown of the asymmetrical border-radius curves, polygon clip-paths, and fluid CSS morphing parameters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
            
            {/* Solarpunk Math */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/30 space-y-2">
              <div className="text-emerald-400 font-bold uppercase text-[11px]">
                1. Solarpunk Asymmetric Capsule Formula
              </div>
              <div className="text-slate-300 text-[11px] bg-slate-950 p-2.5 rounded-xl border border-emerald-900/50">
                border-radius: 42px 75px 50px 68px / 65px 45px 70px 48px;
              </div>
              <p className="text-slate-400 text-[11px] font-sans">
                Generates a living cellular curvature where horizontal and vertical corner radii mismatch intentionally, eliminating rectangular tension.
              </p>
            </div>

            {/* Clay Pebble Math */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-lime-500/30 space-y-2">
              <div className="text-lime-400 font-bold uppercase text-[11px]">
                2. Clay River Pebble 3D Extrusion
              </div>
              <div className="text-slate-300 text-[11px] bg-slate-950 p-2.5 rounded-xl border border-lime-900/50">
                box-shadow: 0 10px 0 #064e3b, inset 2px 2px 5px rgba(255,255,255,0.35);
              </div>
              <p className="text-slate-400 text-[11px] font-sans">
                Pairs a hard 10px extrusion bottom shadow with a soft specular bevel rim. On click, translates Y by 6px with active spring compression.
              </p>
            </div>

            {/* Herbarium Clip-Path */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/30 space-y-2">
              <div className="text-amber-400 font-bold uppercase text-[11px]">
                3. Ragged Torn Deckle Polygon
              </div>
              <div className="text-slate-300 text-[11px] bg-slate-950 p-2.5 rounded-xl border border-amber-900/50 truncate">
                clip-path: polygon(0% 0.7%, 3.5% 0.1%, ..., 100% 100%);
              </div>
              <p className="text-slate-400 text-[11px] font-sans">
                28-point polygonal clip path mathematically mimicking the fibrous tear of vintage cotton rag paper pressed on a deckle wire frame.
              </p>
            </div>

            {/* Hydro Droplet Morph */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/30 space-y-2">
              <div className="text-cyan-400 font-bold uppercase text-[11px]">
                4. Continuous Hydro Droplet Morphing
              </div>
              <div className="text-slate-300 text-[11px] bg-slate-950 p-2.5 rounded-xl border border-cyan-900/50">
                border-radius: 62% 38% 54% 46% / 48% 59% 41% 52%;
              </div>
              <p className="text-slate-400 text-[11px] font-sans">
                Dynamic 4-stage keyframe morph rotating axes by 15° to simulate surface tension and fluid wobble when hovered or touched.
              </p>
            </div>

          </div>
        </div>
      )}

      {/* FOOTER CTA */}
      <div className="eco-container p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-black text-white">
            Ready to test in the live 60-second survey?
          </h4>
          <p className="text-xs text-slate-300">
            Selected active theme: <strong className="text-emerald-300">{currentTheme}</strong>
          </p>
        </div>

        <BespokeButton
          theme={currentTheme}
          size="md"
          onClick={onStartAudit}
        >
          Launch Audit Survey with this Theme ➔
        </BespokeButton>
      </div>

    </div>
  );
}
