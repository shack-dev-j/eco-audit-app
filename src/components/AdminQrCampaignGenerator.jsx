import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { 
  QrCode, Download, Copy, Printer, Check, ExternalLink, 
  MapPin, Layers, Sparkles, Plus, Trash2, Globe, Laptop
} from 'lucide-react';
import { SCENARIOS } from '../data/scenarios';
import BespokeButton from './design-system/BespokeButton';
import BespokeInput from './design-system/BespokeInput';

const CATEGORY_PRESETS = [
  { id: 'classroom', nameEn: 'Classroom & Hallway', nameUz: 'Maktab Sinfxonasi va Yo‘lak', defaultScenario: 'school' },
  { id: 'office', nameEn: 'Workplace & Staff Office', nameUz: 'Xodimlar va Ma’muriy Xona', defaultScenario: 'office' },
  { id: 'cafeteria', nameEn: 'Cafeteria & Canteen', nameUz: 'Maktab Oshxonasi va Bufet', defaultScenario: 'cafeteria' },
  { id: 'science-lab', nameEn: 'Science Laboratory', nameUz: 'Kimyo va Biologiya Laboratoriyasi', defaultScenario: 'science-lab' },
  { id: 'library', nameEn: 'Library & Study Hall', nameUz: 'Kutubxona va O‘quv Zali', defaultScenario: 'library' },
  { id: 'restrooms', nameEn: 'Restrooms & Washrooms', nameUz: 'Hojatxona va Yuvinish Xonasi', defaultScenario: 'restroom' },
  { id: 'gym', nameEn: 'Gymnasium & Sports Arena', nameUz: 'Sport Zali va Kiyinish Xonasi', defaultScenario: 'gym' },
  { id: 'computer-lab', nameEn: 'Computer & IT Suite', nameUz: 'Informatika Xonasi va Server', defaultScenario: 'computer-lab' },
  { id: 'garden', nameEn: 'Campus Garden & Greenhouse', nameUz: 'Maktab Bog‘i va Issiqxona', defaultScenario: 'garden' },
  { id: 'grounds', nameEn: 'School Entrance & Grounds', nameUz: 'Maktab Kirish Qismi va Hovli', defaultScenario: 'grounds' },
  { id: 'art-studio', nameEn: 'Art & Design Creative Studio', nameUz: 'Tasviriy San’at va Dizayn Studiyasi', defaultScenario: 'art-studio' },
  { id: 'staff-lounge', nameEn: 'Teachers’ Lounge & Breakroom', nameUz: 'O‘qituvchilar va Xodimlar Dam Olish Xonasi', defaultScenario: 'staff-lounge' },
  { id: 'greenhouse', nameEn: 'Eco-Center & Botanical Greenhouse', nameUz: 'Eko-Markaz va Botanika Issiqxonasi', defaultScenario: 'greenhouse' },
  { id: 'dynamic-shuffle', nameEn: '🎲 Dynamic Shuffle (Unique Picture for Everyone)', nameUz: '🎲 Dinamik Tasodifiy (Har kimga har xil rasm)', defaultScenario: 'dynamic' }
];

const PART_PRESETS = {
  classroom: ['Radiator & Window Zone', 'Teacher Desk & Charging Strips', 'Lighting & Door Drafts', 'Waste Bin & Paper Station'],
  office: ['Computer Workstations', 'Coffee Station & Mugs', 'Air Conditioning & Desk Heater', 'General Trash Sorting'],
  cafeteria: ['Tray Return & Food Waste', 'Cutlery & Napkin Dispenser', 'Dishwashing Spray Sink', 'Dining Hall High Lights'],
  'science-lab': ['Chemical Fume Hood Sash', 'Prep Room Sink Faucet', 'Apparatus Power Strips', 'Specimen Cabinets'],
  library: ['Window Study Carrels', 'Reading Desk Lamps', 'Archival Paper Recycling', 'Book Stacks Lighting'],
  restrooms: ['Flushing Cistern Cubicles', 'Handwash Faucet Basins', 'Paper Towel Dispensers', 'Ceiling Ventilation & Lighting'],
  gym: ['High-Bay Arena Floodlights', 'Locker Room Showers', 'Bleachers & Water Bottles', 'Equipment Storage Room'],
  'computer-lab': ['30 Desktop Terminals', 'Split Air Conditioner & Door', 'Central Copier/Printer', 'Network Server Rack'],
  garden: ['Irrigation Hose & Tap', 'Raised Vegetable Planter Beds', 'Compost & Organic Pile', 'Greenhouse Ventilation'],
  grounds: ['Drop-off Vehicle Idling Zone', 'Midday Security Spotlights', 'Perimeter Trash Cans', 'Main Arrival Gate'],
  'art-studio': ['Paint Wash Sink & Faucet', 'Skylight Track Lights', 'Drawing Paper Cutters', 'Recycling & Food Bins', 'Tool Power Strips'],
  'staff-lounge': ['Coffee Machine & Mugs Counter', 'Phone & Laptop Charging Strip', 'General Trash & Food Scraps', 'Window & Radiator Heater'],
  greenhouse: ['Garden Hose Nozzle & Pathway', 'Parched Planter Beds', 'Greenhouse Door & Heaters', 'Outdoor Benches & Litter'],
  'dynamic-shuffle': ['Every Respondent Gets a Different Picture 🎲', 'Multi-Zone Mixed Contexts', 'Automatic Pool Rotation']
};

export default function AdminQrCampaignGenerator() {
  // Host resolution: detect network IP, current window origin, or default
  const defaultHost = typeof window !== 'undefined' 
    ? (window.location.hostname === 'localhost' ? 'http://10.252.149.101:5173' : window.location.origin)
    : 'http://10.252.149.101:5173';

  const [hostUrl, setHostUrl] = useState(defaultHost);
  const [selectedCategory, setSelectedCategory] = useState('classroom');
  const [customCategory, setCustomCategory] = useState('');
  const [selectedPart, setSelectedPart] = useState('Radiators & Windows Zone');
  const [customPart, setCustomPart] = useState('');
  const [selectedScenarioId, setSelectedScenarioId] = useState('school');
  const [selectedLanguage, setSelectedLanguage] = useState('uz');
  const [preselectedRole, setPreselectedRole] = useState('');

  // Generated QR data
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [savedCampaigns, setSavedCampaigns] = useState(() => {
    try {
      const stored = localStorage.getItem('eco_audit_saved_qr_campaigns');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const categoryName = selectedCategory === 'custom' 
    ? (customCategory || 'Custom Zone')
    : (CATEGORY_PRESETS.find(c => c.id === selectedCategory)?.[selectedLanguage === 'uz' ? 'nameUz' : 'nameEn'] || selectedCategory);

  const partName = customPart.trim() || selectedPart;

  // Build the complete QR target URL
  const targetUrl = (() => {
    const base = hostUrl.replace(/\/+$/, '');
    const params = new URLSearchParams();
    if (selectedCategory === 'dynamic-shuffle') {
      params.set('shuffle', '1');
    } else {
      params.set('scenario', selectedScenarioId);
    }
    if (categoryName && selectedCategory !== 'dynamic-shuffle') params.set('category', categoryName);
    if (partName && selectedCategory !== 'dynamic-shuffle') params.set('part', partName);
    if (selectedLanguage) params.set('lang', selectedLanguage);
    if (preselectedRole) params.set('role', preselectedRole);
    return `${base}/?${params.toString()}`;
  })();

  // Regenerate QR code whenever target URL changes
  useEffect(() => {
    QRCode.toDataURL(targetUrl, {
      width: 480,
      margin: 2,
      color: {
        dark: '#1e2920', // Herbarium deep botanical ink
        light: '#ffffff'
      },
      errorCorrectionLevel: 'H'
    })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error('QR Generation failed:', err));
  }, [targetUrl]);

  // Copy mobile link to clipboard
  const handleCopyLink = () => {
    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download high-res PNG image
  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `eco_audit_qr_${selectedCategory}_${partName.toLowerCase().replace(/[^a-z0-9]/g, '_')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print Stand Poster
  const handlePrintStandPoster = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>60-Second Eco-Audit Stand Poster - ${partName}</title>
          <style>
            @page { size: A4 portrait; margin: 15mm; }
            body {
              font-family: 'Georgia', serif;
              background-color: #f7f1e1;
              color: #1c1917;
              padding: 20px;
              text-align: center;
              margin: 0;
            }
            .poster-card {
              border: 3px solid #2d4534;
              border-radius: 12px;
              padding: 30px;
              background: #fffdf5;
              box-shadow: 0 4px 15px rgba(0,0,0,0.1);
              max-width: 650px;
              margin: 0 auto;
            }
            .badge {
              display: inline-block;
              padding: 4px 14px;
              background: #2d4534;
              color: #fff;
              font-size: 13px;
              font-weight: bold;
              text-transform: uppercase;
              letter-spacing: 2px;
              border-radius: 20px;
              margin-bottom: 12px;
            }
            h1 {
              font-size: 28px;
              margin: 8px 0;
              color: #1c1917;
              letter-spacing: -0.5px;
            }
            .subtitle {
              font-size: 15px;
              color: #57534e;
              font-style: italic;
              margin-bottom: 20px;
            }
            .zone-banner {
              background: #ebe4d5;
              border: 1px dashed #78350f;
              padding: 12px;
              border-radius: 8px;
              margin: 15px 0 25px;
            }
            .zone-title {
              font-size: 18px;
              font-weight: bold;
              color: #2d4534;
            }
            .part-title {
              font-size: 22px;
              font-weight: 900;
              color: #8b4a32;
              margin-top: 4px;
            }
            .qr-image {
              width: 260px;
              height: 260px;
              margin: 10px auto;
              border: 4px solid #2d4534;
              border-radius: 12px;
              padding: 8px;
              background: #fff;
            }
            .scan-instructions {
              font-size: 16px;
              font-weight: bold;
              color: #2d4534;
              margin-top: 15px;
            }
            .sub-instructions {
              font-size: 12px;
              color: #78716c;
              margin-top: 6px;
            }
            .footer-url {
              font-family: monospace;
              font-size: 11px;
              color: #44403c;
              margin-top: 15px;
              word-break: break-all;
            }
          </style>
        </head>
        <body>
          <div class="poster-card">
            <div class="badge">Ecology Committee • Eco-Audit Station</div>
            <h1>THE 60-SECOND ECO-AUDIT</h1>
            <div class="subtitle">Spot it. Prioritise it. Solve it.</div>

            <div class="zone-banner">
              <div class="zone-title">📍 ZONE: ${categoryName}</div>
              <div class="part-title">${partName}</div>
            </div>

            <img src="${qrDataUrl}" class="qr-image" alt="QR Code" />

            <div class="scan-instructions">
              📷 Point your smartphone camera to audit this exact spot!
            </div>
            <div class="sub-instructions">
              No manual typing required — venue zone and spot are pre-loaded into your survey.
            </div>

            <div class="footer-url">${targetUrl}</div>
          </div>
          <script>
            window.onload = function() { window.print(); };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Save campaign
  const handleSaveCampaign = () => {
    const item = {
      id: `camp-${Date.now()}`,
      category: categoryName,
      part: partName,
      scenarioId: selectedScenarioId,
      url: targetUrl,
      createdAt: new Date().toLocaleDateString()
    };
    const updated = [item, ...savedCampaigns];
    setSavedCampaigns(updated);
    try {
      localStorage.setItem('eco_audit_saved_qr_campaigns', JSON.stringify(updated));
    } catch (_) {}
  };

  const handleDeleteCampaign = (id) => {
    const updated = savedCampaigns.filter(c => c.id !== id);
    setSavedCampaigns(updated);
    try {
      localStorage.setItem('eco_audit_saved_qr_campaigns', JSON.stringify(updated));
    } catch (_) {}
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="eco-container p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              <QrCode className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-400">
                Venue Part & QR Automation
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white font-serif">
                Specific Venue & Spot QR Code Generator
              </h2>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mt-2">
            Generate QR codes for specific zones and parts of your school (e.g., Cafeteria Tray Station, Science Lab Hoods). When students scan the code, their location is <strong>automatically pre-loaded</strong> with zero manual typing!
          </p>
        </div>

        {/* Live Network Notice */}
        <div className="p-3 rounded-2xl bg-slate-900/90 border border-emerald-600/40 text-xs space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Tester Network Access Active</span>
          </div>
          <div className="text-[11px] text-slate-300 font-mono">
            {hostUrl}
          </div>
        </div>
      </div>

      {/* Main Generator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Form: Configuration Controls (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* 1. Host URL Setting (Essential for Mobile Testers & Vercel) */}
          <div className="eco-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Laptop className="w-4 h-4 text-emerald-400" />
                <span>Base Host URL (Network / Domain for Testers)</span>
              </label>
              <button
                type="button"
                onClick={() => setHostUrl(typeof window !== 'undefined' ? window.location.origin : defaultHost)}
                className="text-[10px] text-cyan-300 hover:underline cursor-pointer"
              >
                Auto-detect current
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
              <button
                type="button"
                onClick={() => setHostUrl('http://10.252.149.101:5173')}
                className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 border border-emerald-600/50 text-emerald-300 hover:bg-emerald-900 cursor-pointer"
              >
                📡 Wi-Fi IP (10.252.149.101:5173)
              </button>
              <button
                type="button"
                onClick={() => setHostUrl('https://eco-audit-app.vercel.app')}
                className="px-2 py-0.5 rounded text-[10px] bg-cyan-950 border border-cyan-600/50 text-cyan-300 hover:bg-cyan-900 cursor-pointer"
              >
                ☁️ Vercel (eco-audit-app.vercel.app)
              </button>
              <button
                type="button"
                onClick={() => setHostUrl(typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173')}
                className="px-2 py-0.5 rounded text-[10px] bg-slate-800 border border-slate-600 text-slate-300 hover:bg-slate-700 cursor-pointer"
              >
                🌐 Brauzer manzili ({typeof window !== 'undefined' ? window.location.origin : 'Current'})
              </button>
            </div>

            <input
              type="text"
              value={hostUrl}
              onChange={(e) => setHostUrl(e.target.value)}
              placeholder="e.g., http://10.252.149.101:5173 or https://eco-audit-app.vercel.app"
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-emerald-700/40 text-xs font-mono text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
            <p className="text-[11px] text-slate-400">
              Telefon va planshetlar ulangan Wi-Fi IP (masalan <code>http://10.252.149.101:5173</code>) yoki rasmiy Vercel bulut manzili orqali skanerlaydi.
            </p>
          </div>

          {/* 2. Category & Specific Part Picker */}
          <div className="eco-card p-5 space-y-4">
            <span className="text-xs font-black uppercase tracking-wider text-cyan-400 block border-b border-emerald-800/40 pb-2">
              Step 1: Specify Venue Category & Specific Spot
            </span>

            {/* Category Dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                1. Venue Zone / Category:
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  const preset = CATEGORY_PRESETS.find(c => c.id === e.target.value);
                  if (preset) {
                    setSelectedScenarioId(preset.defaultScenario);
                    const parts = PART_PRESETS[preset.id] || [];
                    if (parts.length > 0) setSelectedPart(parts[0]);
                  }
                }}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-emerald-700/40 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                {CATEGORY_PRESETS.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nameUz} ({cat.nameEn})
                  </option>
                ))}
                <option value="custom">✍️ Custom Zone (Enter own name)...</option>
              </select>
            </div>

            {/* Custom Category Input if selected */}
            {selectedCategory === 'custom' && (
              <BespokeInput
                label="Custom Category Name"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="e.g., Gymnasium / Sports Hall, Greenhouse..."
                theme="theme-solarpunk"
              />
            )}

            {/* Specific Part / Spot */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-bold text-slate-300">
                2. Which exact part or spot is this?
              </label>
              
              {/* Preset Quick Chips */}
              {PART_PRESETS[selectedCategory] && (
                <div className="flex flex-wrap gap-1.5 pb-2">
                  {PART_PRESETS[selectedCategory].map((part) => (
                    <button
                      key={part}
                      type="button"
                      onClick={() => {
                        setSelectedPart(part);
                        setCustomPart('');
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        selectedPart === part && !customPart
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {part}
                    </button>
                  ))}
                </div>
              )}

              <input
                type="text"
                value={customPart}
                onChange={(e) => setCustomPart(e.target.value)}
                placeholder="Or enter custom spot (e.g. West Wing Water Fountain, Chemistry Table 4)..."
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-emerald-700/40 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            {/* Linked Scenario Presets */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-bold text-slate-300">
                3. Associated Eco-Audit Scenario:
              </label>
              <select
                value={selectedScenarioId}
                onChange={(e) => setSelectedScenarioId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-emerald-700/40 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                {SCENARIOS.map((scen) => (
                  <option key={scen.id} value={scen.id}>
                    {scen.title} ({scen.issues.length} eco-hazards)
                  </option>
                ))}
              </select>
            </div>

            {/* Language & Role Pre-Lock */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400">
                  Pre-set Language:
                </label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-slate-900 border border-emerald-700/40 text-xs text-white"
                >
                  <option value="uz">🇺🇿 O'zbekcha (Uzbek)</option>
                  <option value="en">🇬🇧 English</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400">
                  Participant Role Lock (Optional):
                </label>
                <select
                  value={preselectedRole}
                  onChange={(e) => setPreselectedRole(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-slate-900 border border-emerald-700/40 text-xs text-white"
                >
                  <option value="">Any (User chooses on gate)</option>
                  <option value="Student">Pupil / Student</option>
                  <option value="EcoRep">Eco-Representative</option>
                  <option value="Teacher">Teacher / Staff</option>
                  <option value="Visitor">Visitor</option>
                </select>
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: Live QR Stand Card Preview & Actions (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          <div className="eco-card p-6 text-center space-y-4 border-2 border-emerald-400/40 shadow-2xl relative overflow-hidden bg-slate-900/90">
            
            <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 inline-block">
              Live Scannable QR Stand Badge
            </span>

            {/* Target Spot Banner */}
            <div className="p-3 rounded-xl bg-slate-950 border border-emerald-800/40 text-left space-y-0.5">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
                📍 {categoryName}
              </div>
              <div className="text-sm font-black text-white truncate">
                {partName}
              </div>
              <div className="text-[10px] text-cyan-300">
                Auto-fills venue on scan • Language: {selectedLanguage === 'uz' ? "O'zbekcha" : 'English'}
              </div>
            </div>

            {/* The QR Image */}
            <div className="relative inline-block p-3 rounded-2xl bg-white shadow-xl mx-auto">
              {qrDataUrl ? (
                <img 
                  src={qrDataUrl} 
                  alt="QR Code" 
                  className="w-48 h-48 sm:w-56 sm:h-56 object-contain"
                />
              ) : (
                <div className="w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center text-slate-400">
                  Generating QR...
                </div>
              )}
            </div>

            {/* Encoded URL box */}
            <div className="text-left bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[10px] font-mono text-slate-400 break-all select-all">
              {targetUrl}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Mobile Link'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadQr}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-xs font-bold text-white transition-colors cursor-pointer shadow-md"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PNG</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handlePrintStandPoster}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-amber-800 hover:bg-amber-700 text-xs font-black text-amber-100 transition-colors cursor-pointer shadow-md"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Stand Poster</span>
              </button>

              <a
                href={targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-cyan-300 transition-colors cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Test Live Link ↗</span>
              </a>
            </div>

            <button
              type="button"
              onClick={handleSaveCampaign}
              className="w-full py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-[11px] font-bold text-slate-300 border border-slate-700 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-400" />
              <span>Save to Station Campaign Badges List</span>
            </button>

          </div>

          {/* Saved Campaigns List */}
          {savedCampaigns.length > 0 && (
            <div className="eco-card p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-emerald-800/40 pb-2">
                <span className="text-xs font-black uppercase tracking-wider text-slate-300">
                  Saved Venue QR Badges ({savedCampaigns.length})
                </span>
                <span className="text-[10px] text-slate-400">Quick Access</span>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {savedCampaigns.map((camp) => (
                  <div 
                    key={camp.id}
                    className="p-2.5 rounded-xl bg-slate-950/70 border border-emerald-900/40 flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-white truncate">
                        {camp.part}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {camp.category} • {camp.createdAt}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <a
                        href={camp.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300"
                        title="Open in new tab"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        type="button"
                        onClick={() => handleDeleteCampaign(camp.id)}
                        className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900 text-red-300"
                        title="Delete badge"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
