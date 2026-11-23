import React, { useState, useEffect, useCallback, useRef, Fragment } from 'react';
import { 
  Database, QrCode, BookOpen, Camera, CheckCircle2, 
  Palette, Download, Trash2, ArrowUpRight, Search, 
  SlidersHorizontal, Layers, ShieldCheck, RefreshCw, 
  Volume2, VolumeX, Eye, Sparkles, AlertCircle, FileEdit,
  MapPin, Globe, Laptop
} from 'lucide-react';
import StandPosterModal from '../components/StandPosterModal';
import BackendSettingsModal from '../components/BackendSettingsModal';
import CustomPhotoUploader from '../components/CustomPhotoUploader';
import DesignShowcaseHub from '../components/DesignShowcaseHub';
import FacilitatorHub from '../components/FacilitatorHub';
import ScenarioPictureCard from '../components/ScenarioPictureCard';
import AdminQrCampaignGenerator from '../components/AdminQrCampaignGenerator';
import AdminQuestionEditor from '../components/AdminQuestionEditor';
import { SCENARIOS } from '../data/scenarios';
import { fetchRemoteSubmissions, clearSubmissions } from '../services/submissionService';
import { sounds } from '../services/soundEffects';

/**
 * AdminPage: Complete Facilitator & Ecology Committee Control Center.
 * Strictly accessible at /admin or ?admin.
 * Separated completely from the participant view so respondents only ever see the form.
 */
export default function AdminPage({
  initialTheme = 'solarpunk',
  onPreviewUserForm = () => { window.location.href = '/'; }
}) {
  const [theme, setTheme] = useState(initialTheme);
  const [activeAdminTab, setActiveAdminTab] = useState('submissions');
  const [isMuted, setIsMuted] = useState(false);

  // Scenarios
  const [scenariosList, setScenariosList] = useState(SCENARIOS);
  const [selectedScenarioId, setSelectedScenarioId] = useState('school');
  const [customPhotoModalOpen, setCustomPhotoModalOpen] = useState(false);

  // Submissions Log & Live Remote Synchronization
  const [submissions, setSubmissions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [syncStatus, setSyncStatus] = useState('loading');
  const [clearError, setClearError] = useState('');
  const [isClearing, setIsClearing] = useState(false);
  const [expandedIds, setExpandedIds] = useState(() => new Set());
  const requestVersion = useRef(0);
  const clearing = useRef(false);
  const loading = useRef(false);

  // Modals
  const [posterScenario, setPosterScenario] = useState(null);
  const [backendModalOpen, setBackendModalOpen] = useState(false);

  const currentScenario = scenariosList.find(s => s.id === selectedScenarioId) || scenariosList[0];

  const loadSubmissions = useCallback(async () => {
    if (clearing.current || loading.current) return;
    loading.current = true;
    const version = ++requestVersion.current;
    setIsSyncing(true);
    try {
      const latest = await fetchRemoteSubmissions();
      if (version !== requestVersion.current) return;
      setSubmissions(latest);
      setSyncStatus('active');
      setLastSyncTime(new Date());
    } catch {
      if (version === requestVersion.current) setSyncStatus('offline');
    } finally {
      if (version === requestVersion.current) {
        loading.current = false;
        setIsSyncing(false);
      }
    }
  }, []);

  useEffect(() => {
    loadSubmissions();
    const interval = setInterval(() => {
      loadSubmissions();
    }, 4000);

    return () => {
      requestVersion.current++;
      loading.current = false;
      clearInterval(interval);
    };
  }, [loadSubmissions]);

  const handleToggleMute = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      sounds.startAmbientNature();
    } else {
      sounds.stopAmbientNature();
    }
  };

  const handleExportCSV = () => {
    if (!submissions || submissions.length === 0) {
      alert('No audit submissions recorded yet.');
      return;
    }

    const headers = [
      'Submission ID',
      'Origin',
      'Date',
      'Timestamp',
      'Participant Name',
      'Participant Role',
      'Language',
      'Venue Zone',
      'Specific Spot',
      'Scenario Title',
      'Spotted Issues Count',
      'Top Priority Target',
      'Priority Rationale',
      'Practical Action Pledge',
      'Time to Fix'
    ];

    const rows = submissions.map(sub => [
      `"${sub.id || ''}"`,
      `"${sub.origin || (sub.status === 'synced_remote' ? 'remote_mobile' : 'local')}"`,
      `"${sub.date || ''}"`,
      `"${sub.auditTimestamp || ''}"`,
      `"${(sub.participantName || '').replace(/"/g, '""')}"`,
      `"${sub.participantRole || ''}"`,
      `"${sub.language || 'uz'}"`,
      `"${(sub.venueCategory || '').replace(/"/g, '""')}"`,
      `"${(sub.venueSpecificSpot || '').replace(/"/g, '""')}"`,
      `"${(sub.scenarioTitle || '').replace(/"/g, '""')}"`,
      `"${(sub.selectedIssues || []).length}"`,
      `"${(sub.topPriorityTitle || '').replace(/"/g, '""')}"`,
      `"${(sub.priorityReason || '').replace(/"/g, '""')}"`,
      `"${(sub.practicalAction || '').replace(/"/g, '""')}"`,
      `"${sub.timeToFix || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `eco_audit_submissions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClearAll = async () => {
    if (clearing.current || !window.confirm('Permanently clear all shared audit submissions?')) return;
    const key = import.meta.env.PROD ? window.prompt('Enter the admin clear key. Leave blank for a local LAN server.') : '';
    if (key === null) return;
    clearing.current = true;
    requestVersion.current++;
    loading.current = false;
    setIsSyncing(false);
    setIsClearing(true);
    setClearError('');
    try {
      await clearSubmissions(key);
      setSubmissions([]);
      setExpandedIds(new Set());
      setSyncStatus('active');
      setLastSyncTime(new Date());
    } catch (error) {
      setClearError(error.message);
    } finally {
      clearing.current = false;
      setIsClearing(false);
    }
  };

  const toggleAnswers = (id) => {
    setExpandedIds(previous => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredSubmissions = submissions.filter(s => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (s.participantName && s.participantName.toLowerCase().includes(q)) ||
      (s.topPriorityTitle && s.topPriorityTitle.toLowerCase().includes(q)) ||
      (s.scenarioTitle && s.scenarioTitle.toLowerCase().includes(q)) ||
      (s.venueSpecificSpot && s.venueSpecificSpot.toLowerCase().includes(q)) ||
      (s.practicalAction && s.practicalAction.toLowerCase().includes(q))
    );
  });

  return (
    <div className={`theme-${theme} min-h-screen text-slate-100 relative selection:bg-emerald-400 selection:text-emerald-950 font-sans`}>
      
      {/* Container */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        
        {/* =======================================================
            ADMIN TOP BAR: Identity, Paradigms & Live Controls
            ======================================================= */}
        <header className="eco-container p-4 sm:p-6 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/20 border-2 border-amber-400/40 text-amber-300 shadow-md">
              <ShieldCheck className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Facilitator Station
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline">
                  Admin Control & Submissions Hub
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2 mt-0.5 font-serif">
                <span>THE 60-SECOND ECO-AUDIT</span>
                <span className="text-xs font-sans px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-bold">
                  /admin
                </span>
              </h1>
              <p className="text-xs text-emerald-300 font-medium">
                QR spot generator, question editor, Google Sheets collection & facilitator keys.
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Design System Switcher */}
            <div role="group" aria-label="Design System Switcher" className="flex items-center gap-1 p-1 rounded-2xl bg-slate-900/80 border border-emerald-800/40">
              <button
                type="button"
                aria-pressed={theme === 'solarpunk' || theme === 'biomorphic'}
                onClick={() => setTheme('solarpunk')}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  theme === 'solarpunk' || theme === 'biomorphic' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Solarpunk
              </button>
              <button
                type="button"
                aria-pressed={theme === 'clay-pebble' || theme === 'stone'}
                onClick={() => setTheme('clay-pebble')}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  theme === 'clay-pebble' || theme === 'stone' ? 'bg-lime-700 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Clay Pebble
              </button>
              <button
                type="button"
                aria-pressed={theme === 'herbarium' || theme === 'papercraft'}
                onClick={() => setTheme('herbarium')}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  theme === 'herbarium' || theme === 'papercraft' ? 'bg-amber-800 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Herbarium
              </button>
              <button
                type="button"
                aria-pressed={theme === 'hydro-droplet'}
                onClick={() => setTheme('hydro-droplet')}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  theme === 'hydro-droplet' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Hydro Droplet
              </button>
            </div>

            {/* Database / Email Config */}
            <button
              onClick={() => setBackendModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-emerald-600/40 text-xs font-bold text-amber-300 transition-all cursor-pointer"
            >
              <Database className="w-4 h-4 text-amber-400" />
              <span>Connect DB</span>
            </button>

            {/* View Participant Survey Button */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-xs font-extrabold text-white transition-all shadow-md hover:scale-105"
            >
              <span>Preview User Form</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            {/* Audio Toggle */}
            <button
              onClick={handleToggleMute}
              className="p-2 rounded-2xl border border-slate-700 bg-slate-800/80 text-slate-300 hover:text-white transition-all cursor-pointer"
              title={isMuted ? 'Unmute sounds' : 'Mute sounds'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

        </header>

        {/* =======================================================
            ADMIN NAVIGATION TABS
            ======================================================= */}
        <div className="flex flex-wrap items-center justify-between border-b border-emerald-800/40 pb-2 gap-2">
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Tab 1: Live Submissions Log */}
            <button
              onClick={() => setActiveAdminTab('submissions')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                activeAdminTab === 'submissions'
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Submissions Log ({submissions.length})</span>
            </button>

            {/* Tab 2: Specific Venue & Spot QR Code Generator */}
            <button
              onClick={() => setActiveAdminTab('qr-generator')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                activeAdminTab === 'qr-generator'
                  ? 'bg-cyan-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <QrCode className="w-4 h-4 text-cyan-300" />
              <span>QR Spot Generator</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-cyan-400/20 text-cyan-200 border border-cyan-400/30">
                Auto-Fill
              </span>
            </button>

            {/* Tab 3: Survey Question & Prompt Editor */}
            <button
              onClick={() => setActiveAdminTab('question-editor')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                activeAdminTab === 'question-editor'
                  ? 'bg-amber-700 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <FileEdit className="w-4 h-4 text-amber-300" />
              <span>Edit Questions (UZ / EN)</span>
            </button>

            {/* Tab 4: Facilitator Answer Key & Debrief Prompts (Page 3 of PDF) */}
            <button
              onClick={() => setActiveAdminTab('answer-key')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                activeAdminTab === 'answer-key'
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Facilitator Answer Key (PDF Pg 3)</span>
            </button>

            {/* Tab 5: Stand Display Posters & QR Badges (Page 4 of PDF) */}
            <button
              onClick={() => setActiveAdminTab('stand-signs')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                activeAdminTab === 'stand-signs'
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Stand Signs & QR Posters (PDF Pg 4)</span>
            </button>

            {/* Tab 6: Design Systems Showcase */}
            <button
              onClick={() => setActiveAdminTab('design-hub')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                activeAdminTab === 'design-hub'
                  ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Palette className="w-4 h-4 text-cyan-300" />
              <span>Design Paradigms</span>
            </button>
          </div>

          {/* Quick Scenario Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">Active Scene:</span>
            <select
              value={selectedScenarioId}
              onChange={(e) => setSelectedScenarioId(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-emerald-700/40 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              {scenariosList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* =======================================================
            TAB 1: LIVE SUBMISSIONS & DATABASE TELEMETRY
            ======================================================= */}
        {activeAdminTab === 'submissions' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="eco-card p-5 space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400">
                  Total Completed Audits
                </span>
                <div className="text-3xl font-black text-white font-mono">
                  {submissions.length}
                </div>
                <p className="text-xs text-slate-400">
                  Recorded across all venue scenarios
                </p>
              </div>

              <div className="eco-card p-5 space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-400">
                  Target Venue
                </span>
                <div className="text-lg font-bold text-white truncate">
                  {currentScenario.title}
                </div>
                <p className="text-xs text-slate-400">
                  {currentScenario.issues.length} eco-hazards logged in key
                </p>
              </div>

              <div className="eco-card p-5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400">
                    Jonli Tarmoq Sinxronizatsiyasi
                  </span>
                  <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${syncStatus === 'active' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'}`}>
                    <span className={`w-2 h-2 rounded-full ${syncStatus === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
                    {({ active: 'Faol / Live', loading: 'Connecting…', offline: 'Shared storage unavailable' })[syncStatus]}
                  </span>
                </div>
                <div className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <span>/api/submissions</span>
                  {lastSyncTime && (
                    <span className="text-xs text-slate-400 font-normal">
                      ({lastSyncTime.toLocaleTimeString()})
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400">
                  Mobil telefonlardan kelgan auditlar avtomatik yangilanib turadi
                </p>
              </div>
            </div>

            {/* Actions & Search */}
            <div className="eco-container p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter by name, issue, spot or action..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-emerald-800/40 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={loadSubmissions}
                  disabled={isSyncing || isClearing}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors cursor-pointer"
                  title="Reload submissions from storage and server"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-emerald-400' : ''}`} />
                  <span>{isSyncing ? 'Yangilanmoqda...' : 'Refresh'}</span>
                </button>

                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-xs font-bold text-white transition-colors cursor-pointer"
                  title="Download all submissions as CSV spreadsheet"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>

                {submissions.length > 0 && (
                  <button
                    onClick={handleClearAll}
                    disabled={isClearing}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/60 hover:bg-red-900 text-xs font-bold text-red-300 border border-red-800/40 transition-colors cursor-pointer"
                    title="Clear submissions"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{isClearing ? 'Clearing…' : 'Clear'}</span>
                  </button>
                )}
              </div>
            </div>

            {clearError && <p role="alert" className="text-sm text-red-300">{clearError}</p>}

            {/* Submissions Table */}
            <div className="eco-card overflow-hidden">
              {filteredSubmissions.length === 0 ? (
                <div className="p-8 text-center text-slate-400 space-y-2">
                  <span className="text-3xl block">📋</span>
                  <div className="text-sm font-bold text-slate-300">
                    {syncStatus === 'offline' ? 'Unable to load submissions' : syncStatus === 'loading' ? 'Loading submissions…' : searchQuery ? 'No matching submissions' : 'No submissions recorded yet'}
                  </div>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    When respondents scan the stand QR code or complete the survey form at <code>/</code>, their audited findings, priorities, and action pledges will appear here live.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-200">
                    <thead className="bg-slate-900/90 text-emerald-400 uppercase tracking-wider text-[10px] font-extrabold border-b border-emerald-800/40">
                      <tr>
                        <th className="p-3">Answers</th>
                        <th className="p-3">Source</th>
                        <th className="p-3">Participant</th>
                        <th className="p-3">Role</th>
                        <th className="p-3">Lang</th>
                        <th className="p-3">Venue / Zone</th>
                        <th className="p-3">Specific Spot</th>
                        <th className="p-3">Top Priority Target</th>
                        <th className="p-3">Practical Action Pledge</th>
                        <th className="p-3">Turnaround</th>
                        <th className="p-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-emerald-900/30">
                      {filteredSubmissions.map((sub, idx) => {
                        const key = sub.id || idx;
                        const expanded = expandedIds.has(key);
                        const detailsId = `submission-answers-${idx}`;
                        const issues = Array.isArray(sub.selectedIssues)
                          ? sub.selectedIssues.map(issue => typeof issue === 'string' ? issue : issue?.title).filter(Boolean)
                          : [];
                        return (
                          <Fragment key={key}>
                          <tr className="hover:bg-slate-800/40 transition-colors">
                            <td className="p-3">
                              <button
                                type="button"
                                aria-expanded={expanded}
                                aria-controls={detailsId}
                                aria-label={`${expanded ? 'Hide' : 'View'} answers for ${sub.participantName || 'Anonymous'}`}
                                onClick={() => toggleAnswers(key)}
                                className="whitespace-nowrap rounded-lg bg-emerald-900 px-3 py-2 font-bold text-emerald-100 hover:bg-emerald-800"
                              >
                                {expanded ? 'Hide answers' : 'View answers'}
                              </button>
                            </td>
                            <td className="p-3 whitespace-nowrap">
                              {sub.origin === 'remote_mobile' || sub.status === 'synced_remote' ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-700/50" title="Submitted over WiFi/Network">
                                  <span>📱</span>
                                  <span>Masofaviy</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700" title="Local browser entry">
                                  <span>💻</span>
                                  <span>Lokal</span>
                                </span>
                              )}
                            </td>
                            <td className="p-3 font-bold text-white whitespace-nowrap">
                              {sub.participantName || 'Anonymous'}
                            </td>
                            <td className="p-3 whitespace-nowrap">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/50">
                                {sub.participantRole || 'Student'}
                              </span>
                            </td>
                            <td className="p-3 whitespace-nowrap">
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                                {sub.language === 'uz' ? '🇺🇿 UZ' : '🇬🇧 EN'}
                              </span>
                            </td>
                            <td className="p-3 text-slate-300 whitespace-nowrap">
                              {sub.venueCategory || sub.scenarioTitle}
                            </td>
                            <td className="p-3 text-cyan-300 font-bold whitespace-nowrap">
                              {sub.venueSpecificSpot || 'General Area'}
                            </td>
                            <td className="p-3 font-bold text-amber-300 max-w-xs truncate">
                              {sub.topPriorityTitle}
                            </td>
                            <td className="p-3 text-slate-300 max-w-xs truncate">
                              {sub.practicalAction}
                            </td>
                            <td className="p-3 text-[11px] text-cyan-300 whitespace-nowrap">
                              {sub.timeToFix || '< 24 hrs'}
                            </td>
                            <td className="p-3 text-slate-400 whitespace-nowrap">
                              {sub.date || sub.submittedAt?.slice(0, 10)}
                            </td>
                          </tr>
                          <tr id={detailsId} hidden={!expanded}>
                            <td colSpan={11} className="bg-slate-900/70 p-4">
                              <dl className="grid gap-4 whitespace-pre-wrap break-words sm:grid-cols-2">
                                <div>
                                  <dt className="font-bold text-emerald-300">Issues noticed</dt>
                                  <dd>{issues.length ? (
                                    <ul className="list-disc pl-5">
                                      {issues.map((issue, index) => <li key={index}>{issue}</li>)}
                                    </ul>
                                  ) : 'No issues recorded'}</dd>
                                </div>
                                {[
                                  ['Top priority', sub.topPriorityTitle],
                                  ['Reason for priority', sub.priorityReason],
                                  ['Practical action pledge', sub.practicalAction],
                                  ['Time to fix', sub.timeToFix]
                                ].map(([label, answer]) => (
                                  <div key={label}>
                                    <dt className="font-bold text-emerald-300">{label}</dt>
                                    <dd>{answer || 'No answer recorded'}</dd>
                                  </div>
                                ))}
                              </dl>
                            </td>
                          </tr>
                          </Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* =======================================================
            TAB 2: SPECIFIC VENUE & SPOT QR CODE GENERATOR
            ======================================================= */}
        {activeAdminTab === 'qr-generator' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <AdminQrCampaignGenerator />
          </div>
        )}

        {/* =======================================================
            TAB 3: SURVEY QUESTION & PROMPT EDITOR (UZ & EN)
            ======================================================= */}
        {activeAdminTab === 'question-editor' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <AdminQuestionEditor />
          </div>
        )}

        {/* =======================================================
            TAB 4: FACILITATOR ANSWER KEY & DEBRIEF (PDF PG 3)
            ======================================================= */}
        {activeAdminTab === 'answer-key' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <FacilitatorHub
              currentScenario={currentScenario}
              submissions={submissions}
            />
          </div>
        )}

        {/* =======================================================
            TAB 5: STAND SIGNS & PRINTABLE POSTERS (PDF PG 4)
            ======================================================= */}
        {activeAdminTab === 'stand-signs' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            <div className="eco-container p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Printable Stand Posters (Page 4 of Pack)
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-1 font-serif">
                  Venue Posters with Scannable QR Codes
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
                  Place or project these posters at your audit station. Participants point their smartphone camera at the QR code, opening their user-only audit form instantly with zero facilitation friction.
                </p>
              </div>

              <button
                onClick={() => setCustomPhotoModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-xl transition-all cursor-pointer shrink-0"
              >
                <Camera className="w-4 h-4" />
                <span>Upload Venue Photo</span>
              </button>
            </div>

            {/* Scenarios Poster Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {scenariosList.map((scen) => (
                <div
                  key={scen.id}
                  className={`eco-card overflow-hidden flex flex-col justify-between transition-all duration-300 ${
                    selectedScenarioId === scen.id 
                      ? 'ring-4 ring-emerald-400 shadow-2xl' 
                      : 'hover:scale-[1.02]'
                  }`}
                >
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                        {scen.badge}
                      </span>
                      <span className="text-[11px] text-slate-400 font-bold">
                        {scen.issues.length} Issues Keyed
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white">
                      {scen.title}
                    </h3>
                    <p className="text-xs text-slate-300 line-clamp-2">
                      {scen.description}
                    </p>
                  </div>

                  <div className="p-4 pt-0">
                    <ScenarioPictureCard
                      scenario={scen}
                      onOpenPoster={() => setPosterScenario(scen)}
                    />
                  </div>

                  <div className="p-4 pt-2 border-t border-emerald-800/30 flex items-center gap-2">
                    <button
                      onClick={() => setPosterScenario(scen)}
                      className="flex-1 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 font-bold text-xs text-white transition-colors cursor-pointer text-center"
                    >
                      Print / Project Stand Poster
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* =======================================================
            TAB 6: DESIGN SYSTEM SHOWCASE MATRIX
            ======================================================= */}
        {activeAdminTab === 'design-hub' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <DesignShowcaseHub
              currentTheme={theme}
              onSelectTheme={(t) => setTheme(t)}
              onStartAudit={() => { window.location.href = '/'; }}
            />
          </div>
        )}

      </div>

      {/* Stand Sign & QR Poster Modal */}
      <StandPosterModal
        scenario={posterScenario}
        isOpen={!!posterScenario}
        onClose={() => setPosterScenario(null)}
      />

      {/* Free DB / Webhook / Email Modal */}
      <BackendSettingsModal
        isOpen={backendModalOpen}
        onClose={() => setBackendModalOpen(false)}
      />

      {/* Custom Venue Photo Uploader */}
      {customPhotoModalOpen && (
        <CustomPhotoUploader
          onCustomScenarioCreated={(newScen) => {
            setScenariosList(prev => [newScen, ...prev]);
            setSelectedScenarioId(newScen.id);
            setCustomPhotoModalOpen(false);
          }}
          onClose={() => setCustomPhotoModalOpen(false)}
        />
      )}

    </div>
  );
}
