import React, { useState, useEffect } from 'react';
import { 
  Clock, CheckCircle2, ShieldCheck, Sparkles, ArrowRight, ArrowLeft, 
  Volume2, VolumeX, Eye, RotateCcw, AlertTriangle, Check, 
  Leaf, Feather, Send, HelpCircle, Layers, Globe, MapPin, QrCode, Users
} from 'lucide-react';
import BiosphereTimerBackground from '../components/BiosphereTimerBackground';
import BespokeInput from '../components/design-system/BespokeInput';
import BespokeTextArea from '../components/design-system/BespokeTextArea';
import BespokeButton from '../components/design-system/BespokeButton';
import BespokePebblePicker from '../components/design-system/BespokePebblePicker';
import BespokeActionCard from '../components/design-system/BespokeActionCard';
import PledgeCertificate from '../components/PledgeCertificate';
import CommunityResponsesView from '../components/CommunityResponsesView';
import { SCENARIOS, getLocalizedScenario } from '../data/scenarios';
import { sounds } from '../services/soundEffects';
import { saveSubmission } from '../services/submissionService';
import { getStoredLanguage, setStoredLanguage, DICTIONARY, getTranslation } from '../services/localization';
import { getQuestionSettings } from '../services/questionSettingsService';
import confetti from 'canvas-confetti';

/**
 * UserSurveyPage: The distraction-free, participant-only 60-Second Eco-Audit.
 * Strictly presents the form experience with:
 * 1. Locked Option 1: Warm Linen & Dried Sage Herbarium aesthetic (zero visual distraction).
 * 2. Full Uzbek ('uz') & English ('en') Bilingual Support.
 * 3. Dynamic custom questions from Admin Question Editor.
 * 4. Automatic pre-population of Venue Category & Specific Spot from scanned QR codes.
 * 5. Sequential Message Progression upon agreement:
 *    - 60s (1 min) Spatial Observation & Contemplation ("Look closely...")
 *    - 240s (4 min) Observation & Writing Challenge (Spot up to 3 issues)
 *    - 30s Prioritisation Question ("Which issue would you tackle first, and why?")
 *    - 30s Practical Action Pledge ("What is one realistic first step today?")
 *    - Completion Ceremony & Personalized Eco-Pledge Certificate
 *    - Community Responses Wall ("See Others' Responses")
 */
export default function UserSurveyPage({ defaultScenarioId = 'school' }) {
  // 1. Language Toggle: 'uz' (O'zbekcha) | 'en' (English)
  const [lang, setLang] = useState(() => getStoredLanguage());
  const dict = DICTIONARY[lang] || DICTIONARY.uz || DICTIONARY.en;

  // 2. Custom Questions from Admin
  const [customQuestions, setCustomQuestions] = useState(() => getQuestionSettings());

  // 3. Scenario & Pre-configured Venue Spot from URL (?scenario=...&category=...&part=...)
  const [scenarioId, setScenarioId] = useState(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search).get('scenario');
      const found = SCENARIOS.find(s => s.id === p);
      if (found) return found.id;
    }
    return defaultScenarioId;
  });

  const [qrZoneCategory, setQrZoneCategory] = useState('');
  const [qrSpecificPart, setQrSpecificPart] = useState('');

  const rawScenario = SCENARIOS.find(s => s.id === scenarioId) || SCENARIOS[0];
  const scenario = getLocalizedScenario(rawScenario, lang);

  // 4. Audio Mute
  const [isMuted, setIsMuted] = useState(false);

  // 5. State Machine Progression:
  // 'gate' -> 'intro-15s' (now 60s) -> 'spot-60s' (now 240s/4min) -> 'prioritize-30s' -> 'action-30s' -> 'certificate' -> 'community-responses'
  const [currentStep, setCurrentStep] = useState('gate');
  const [hasAgreed, setHasAgreed] = useState(false);

  // 6. Participant Profile
  const [participantName, setParticipantName] = useState('');
  const [participantRole, setParticipantRole] = useState('Student');

  // 7. Timers (1 minute staring/observation contemplation, 4 minutes writing & spotting)
  const [observationTimeLeft, setObservationTimeLeft] = useState(240);
  const [isObservationTimerRunning, setIsObservationTimerRunning] = useState(false);
  const [introTimeLeft, setIntroTimeLeft] = useState(60);
  const [isIntroTimerRunning, setIsIntroTimerRunning] = useState(false);

  // Timer helper: format seconds into MM:SS
  const formatTimer = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 8. Form Observations & Action Pledge
  const [issue1, setIssue1] = useState('');
  const [issue2, setIssue2] = useState('');
  const [issue3, setIssue3] = useState('');
  const [topPriorityId, setTopPriorityId] = useState('issue-1');
  const [priorityReason, setPriorityReason] = useState('');
  const [practicalAction, setPracticalAction] = useState('');
  const [timeToFix, setTimeToFix] = useState('Immediate Quick Win (< 24 hrs)');
  const [validationError, setValidationError] = useState('');
  const [lastSubmission, setLastSubmission] = useState(null);
  const [showSceneModal, setShowSceneModal] = useState(false);

  // Read URL query parameters on initial mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const p = new URLSearchParams(window.location.search);
    
    // Check scenario
    const scen = p.get('scenario');
    if (scen) {
      const match = SCENARIOS.find(s => s.id === scen);
      if (match) setScenarioId(match.id);
    }

    // Check QR Pre-configured zone & part
    const cat = p.get('category');
    if (cat) setQrZoneCategory(cat);

    const prt = p.get('part');
    if (prt) setQrSpecificPart(prt);

    // Check view param (?view=responses)
    const view = p.get('view');
    if (view === 'responses' || view === 'community') {
      setCurrentStep('community-responses');
    }

    // Check URL language override (?lang=uz or ?lang=en)
    const urlLang = p.get('lang');
    if (urlLang === 'uz' || urlLang === 'en') {
      setLang(urlLang);
      setStoredLanguage(urlLang);
    }

    // Check pre-selected role (?role=Student or ?role=Teacher)
    const urlRole = p.get('role');
    if (urlRole && ['Student', 'Teacher', 'EcoRep', 'Visitor'].includes(urlRole)) {
      setParticipantRole(urlRole);
    }

    // Load fresh question settings from storage
    setCustomQuestions(getQuestionSettings());
  }, []);

  // Language switch handler
  const handleToggleLang = (newLang) => {
    setLang(newLang);
    setStoredLanguage(newLang);
    sounds.playSpotSuccess();
  };

  // Audio Toggle
  const handleToggleMute = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      sounds.startAmbientNature();
    } else {
      sounds.stopAmbientNature();
    }
  };

  // 15-second Intro timer countdown
  useEffect(() => {
    let interval = null;
    if (isIntroTimerRunning && introTimeLeft > 0) {
      interval = setInterval(() => {
        setIntroTimeLeft(prev => {
          if (prev <= 1) {
            setIsIntroTimerRunning(false);
            sounds.playStageChime();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isIntroTimerRunning, introTimeLeft]);

  // 60-second Observation timer countdown
  useEffect(() => {
    let interval = null;
    if (isObservationTimerRunning && observationTimeLeft > 0) {
      interval = setInterval(() => {
        setObservationTimeLeft(prev => {
          if (prev <= 1) {
            setIsObservationTimerRunning(false);
            sounds.playStageChime();
            return 0;
          }
          if (prev <= 10 && prev > 1) {
            sounds.playClockTick();
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isObservationTimerRunning, observationTimeLeft]);

  // Derive active issues list
  const activeIssues = [
    issue1.trim() && { id: 'issue-1', title: issue1.trim(), number: 1 },
    issue2.trim() && { id: 'issue-2', title: issue2.trim(), number: 2 },
    issue3.trim() && { id: 'issue-3', title: issue3.trim(), number: 3 },
  ].filter(Boolean);

  // Auto-align top priority if current selection is invalid
  useEffect(() => {
    if (activeIssues.length > 0) {
      const exists = activeIssues.find(i => i.id === topPriorityId);
      if (!exists) {
        setTopPriorityId(activeIssues[0].id);
      }
    }
  }, [issue1, issue2, issue3, topPriorityId]);

  // Quick suggestion tag click
  const handleApplyPreset = (title) => {
    sounds.playSpotSuccess();
    if (!issue1.trim()) {
      setIssue1(title);
    } else if (!issue2.trim()) {
      setIssue2(title);
    } else if (!issue3.trim()) {
      setIssue3(title);
    }
  };

  // Step 0 -> Step 1 Approval Handler
  const handleApproveAndBegin = () => {
    if (!hasAgreed) {
      setValidationError(dict.agreeValidation);
      return;
    }
    setValidationError('');
    sounds.init();
    sounds.playSpotSuccess();
    setCurrentStep('intro-15s');
    setIntroTimeLeft(15);
    setIsIntroTimerRunning(true);
  };

  // Step 1 -> Step 2
  const handleProceedToObservation = () => {
    sounds.playStageChime();
    setIsIntroTimerRunning(false);
    setCurrentStep('spot-60s');
    setObservationTimeLeft(60);
    setIsObservationTimerRunning(true);
  };

  // Step 2 -> Step 3
  const handleProceedToPrioritize = () => {
    if (activeIssues.length === 0) {
      setValidationError(dict.validationNeedOneIssue);
      return;
    }
    setValidationError('');
    sounds.playStageChime();
    setIsObservationTimerRunning(false);
    setCurrentStep('prioritize-30s');
  };

  // Step 3 -> Step 4
  const handleProceedToAction = () => {
    sounds.playStageChime();
    setCurrentStep('action-30s');
  };

  // Step 4 -> Submit
  const handleFinalSubmit = (e) => {
    if (e) e.preventDefault();
    if (!practicalAction.trim()) {
      setValidationError(dict.validationNeedAction);
      return;
    }
    setValidationError('');
    sounds.playStageChime();

    const topItem = activeIssues.find(i => i.id === topPriorityId) || activeIssues[0];
    const payload = {
      scenarioId: scenario.id,
      scenarioTitle: scenario.title,
      venueCategory: qrZoneCategory || scenario.badge,
      venueSpecificSpot: qrSpecificPart || 'General Area',
      participantName: participantName.trim() || (lang === 'uz' ? "E'tiborli Auditor" : 'Mindful Auditor'),
      participantRole,
      language: lang,
      date: new Date().toISOString().split('T')[0],
      selectedIssues: activeIssues.map(i => i.title),
      topPriorityId,
      topPriorityTitle: topItem?.title || (lang === 'uz' ? 'Asosiy Eko-Maqsad' : 'Primary Eco Target'),
      priorityReason: priorityReason.trim() || (lang === 'uz' ? 'Katta samara beruvchi asosiy tejamkorlik imkoniyati.' : 'Highest leverage opportunity for tangible impact.'),
      practicalAction: practicalAction.trim(),
      timeToFix,
      auditTimestamp: new Date().toISOString()
    };

    saveSubmission(payload);
    setLastSubmission(payload);
    setCurrentStep('certificate');

    try {
      confetti({
        particleCount: 85,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#2d4534', '#8b4a32', '#d4af37', '#7a9980', '#e4dcd0']
      });
    } catch (_) {}
  };

  // Reset / Start Over
  const handleStartOver = () => {
    setCurrentStep('gate');
    setHasAgreed(false);
    setIssue1('');
    setIssue2('');
    setIssue3('');
    setPriorityReason('');
    setPracticalAction('');
    setObservationTimeLeft(240);
    setIsObservationTimerRunning(false);
    setIntroTimeLeft(60);
    setIsIntroTimerRunning(false);
    setLastSubmission(null);
  };

  // Background timer progress
  const timerProgress = 
    currentStep === 'certificate' ? 1 :
    currentStep === 'community-responses' ? 1 :
    currentStep === 'spot-60s' ? (240 - observationTimeLeft) / 240 :
    currentStep === 'intro-15s' ? (60 - introTimeLeft) / 60 :
    currentStep === 'prioritize-30s' ? 0.75 :
    currentStep === 'action-30s' ? 0.9 : 0;

  const isUrgent = currentStep === 'spot-60s' && observationTimeLeft <= 15 && observationTimeLeft > 0;

  // Active question overrides from Admin
  const activeQuestions = customQuestions[lang] || customQuestions.en;

  return (
    <div className="theme-herbarium palette-linen min-h-screen text-slate-900 relative selection:bg-amber-900/20 selection:text-amber-950 font-serif">
      
      {/* 1. Procedural Growing Biosphere Filling Background */}
      <BiosphereTimerBackground
        progress={timerProgress}
        isUrgent={isUrgent}
        stage={currentStep === 'certificate' || currentStep === 'community-responses' ? 'completed' : 'spot'}
        theme="herbarium"
      />

      {/* Main Container */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
        
        {/* Subtle Language Switcher, Community Link & Audio Bar */}
        <div className="flex items-center justify-between pb-1 flex-wrap gap-2">
          {/* Language Switcher Pill */}
          <div className="inline-flex items-center p-1 rounded-full bg-stone-900/80 backdrop-blur-md border border-stone-700/60 shadow-md">
            <button
              type="button"
              onClick={() => handleToggleLang('uz')}
              className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                lang === 'uz' ? 'bg-emerald-800 text-white shadow-sm font-extrabold' : 'text-stone-300 hover:text-white'
              }`}
            >
              <span>🇺🇿</span>
              <span>O'zbekcha</span>
            </button>

            <button
              type="button"
              onClick={() => handleToggleLang('en')}
              className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                lang === 'en' ? 'bg-emerald-800 text-white shadow-sm font-extrabold' : 'text-stone-300 hover:text-white'
              }`}
            >
              <span>🇬🇧</span>
              <span>English</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Community Responses Wall Button */}
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep === 'community-responses' ? (lastSubmission ? 'certificate' : 'gate') : 'community-responses')}
              className="px-3 py-1.5 rounded-full bg-stone-900/80 text-stone-200 hover:text-white border border-stone-700/60 shadow-md cursor-pointer transition-all flex items-center gap-1.5 text-[11px] font-bold"
              title={lang === 'uz' ? "Boshqalarning javoblarini ko'rish" : "See others' responses"}
            >
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span>{currentStep === 'community-responses' ? (lang === 'uz' ? 'Orqaga' : 'Back') : (lang === 'uz' ? "Javoblar" : "Responses")}</span>
            </button>

            {/* Sound Mute Toggle */}
            <button
              type="button"
              onClick={handleToggleMute}
              className="p-2 rounded-full bg-stone-900/80 text-stone-300 hover:text-white border border-stone-700/60 shadow-md cursor-pointer transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* =========================================================================
            PHASE 0: THE ATMOSPHERIC APPROVAL GATE ("the blank/minimal screen at first")
            ========================================================================= */}
        {currentStep === 'gate' && (
          <div className="eco-container p-6 sm:p-10 space-y-8 animate-in fade-in duration-500">
            
            {/* Serene Botanical Header */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-900/10 border-2 border-emerald-800/30 text-emerald-800 shadow-inner mx-auto">
                <Leaf className="w-8 h-8 text-emerald-800 animate-pulse" />
              </div>

              <div className="space-y-1">
                <div className="inline-block px-3 py-0.5 rounded-full text-[11px] font-black tracking-widest uppercase bg-emerald-800/10 text-emerald-900 border border-emerald-800/20">
                  {dict.mindfulAuditBadge}
                </div>
                <h1 className="text-2xl sm:text-4xl font-black text-stone-900 tracking-tight">
                  {dict.title}
                </h1>
                <p className="text-sm sm:text-base text-stone-700 italic font-medium">
                  {dict.subtitle}
                </p>
              </div>
            </div>

            {/* Target Venue & Pre-Configured QR Spot Card */}
            <div className="eco-card p-5 space-y-3 border-l-4 border-emerald-800">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800">
                  {dict.targetVenueLabel}
                </span>
                
                {qrSpecificPart ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-emerald-800 text-white shadow-sm flex items-center gap-1">
                    <QrCode className="w-3 h-3" />
                    <span>{dict.preConfiguredZoneBadge}</span>
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-900/10 text-amber-900">
                    {scenario.badge || dict.fieldLocationBadge}
                  </span>
                )}
              </div>

              {/* If scanned via specific spot QR code, display it prominently so they don't have to type! */}
              {qrSpecificPart ? (
                <div className="space-y-1 bg-amber-900/5 p-3 rounded-xl border border-stone-400/40">
                  <div className="text-xs text-stone-600 font-bold">
                    📍 {qrZoneCategory || scenario.title}
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-amber-950">
                    {qrSpecificPart}
                  </h2>
                  <div className="text-[11px] text-emerald-900 font-semibold flex items-center gap-1 pt-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800" />
                    <span>{dict.autoPrePopulatedHint}</span>
                  </div>
                </div>
              ) : (
                <h2 className="text-lg sm:text-xl font-bold text-stone-900">
                  {scenario.title}
                </h2>
              )}

              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                {scenario.description}
              </p>

              <div className="pt-1 flex items-center justify-between text-xs text-stone-600">
                <span>{dict.observationalCount.replace('{count}', scenario.issues?.length || 5)}</span>
                <button
                  type="button"
                  onClick={() => setShowSceneModal(true)}
                  className="inline-flex items-center gap-1 text-emerald-800 hover:text-emerald-950 font-bold underline cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{dict.previewSceneBtn}</span>
                </button>
              </div>
            </div>

            {/* Participant Credentials */}
            <div className="space-y-4 pt-2">
              <BespokeInput
                label={dict.nameLabel}
                value={participantName}
                onChange={(e) => setParticipantName(e.target.value)}
                onClear={() => setParticipantName('')}
                placeholder={dict.namePlaceholder}
                helper={dict.nameHelper}
                theme="theme-herbarium"
              />

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider">
                  {dict.roleLabel}
                </label>
                <BespokePebblePicker
                  options={[
                    { value: 'Student', label: dict.roles.Student, icon: '🎒' },
                    { value: 'Teacher', label: dict.roles.Teacher, icon: '📚' },
                    { value: 'EcoRep', label: dict.roles.EcoRep, icon: '🌱' },
                    { value: 'Visitor', label: dict.roles.Visitor, icon: '🔍' }
                  ]}
                  value={participantRole}
                  onChange={setParticipantRole}
                  theme="theme-herbarium"
                />
              </div>
            </div>

            {/* The Solemn Agreement Box (reads from Admin customizations if edited) */}
            <div className="p-4 sm:p-5 rounded-lg bg-amber-900/5 border border-amber-900/20 space-y-3">
              <div className="flex items-start gap-3">
                <input
                  id="agree-checkbox"
                  type="checkbox"
                  checked={hasAgreed}
                  onChange={(e) => {
                    setHasAgreed(e.target.checked);
                    if (e.target.checked) setValidationError('');
                  }}
                  className="mt-1 w-5 h-5 rounded border-stone-400 text-emerald-800 focus:ring-emerald-700 cursor-pointer"
                />
                <label htmlFor="agree-checkbox" className="text-xs sm:text-sm text-stone-800 leading-snug cursor-pointer select-none">
                  {activeQuestions.agreementStatement || dict.agreementText}
                </label>
              </div>
            </div>

            {/* Validation Message */}
            {validationError && (
              <div className="p-3 rounded-lg bg-red-950/10 border border-red-800/30 text-xs font-bold text-red-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-800 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Observation Timer Readiness Hook for Accessibility & Screen Readers */}
            <div 
              role="timer"
              aria-live="polite"
              aria-atomic="true"
              aria-label={`Observation timer: 60 seconds remaining in observation window (activates upon audit approval)`}
              className="text-center text-xs text-stone-500 italic"
            >
              {dict.timerReadyLabel}
            </div>

            {/* The Begin Action CTA */}
            <div className="pt-2 text-center">
              <BespokeButton
                size="lg"
                onClick={handleApproveAndBegin}
                icon={ArrowRight}
                theme="theme-herbarium"
                className="w-full sm:w-auto px-10 py-4 text-base font-black shadow-xl"
              >
                {dict.beginAuditBtn}
              </BespokeButton>
            </div>

          </div>
        )}

        {/* =========================================================================
            PHASE 1: 15-SECOND OBSERVATION PREPARATION ("Look closely. What could be more sustainable here?")
            ========================================================================= */}
        {currentStep === 'intro-15s' && (
          <div className="eco-container p-6 sm:p-8 space-y-6 animate-in fade-in duration-300">
            
            {/* Prompt Banner */}
            <div className="text-center space-y-2 border-b border-stone-400/30 pb-4">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-800/10 text-emerald-900">
                {dict.phase1Badge}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-stone-900">
                "{activeQuestions.introPrompt || dict.phase1DefaultPrompt}"
              </h2>
              <p className="text-xs sm:text-sm text-stone-700 italic">
                {activeQuestions.introHelper || dict.phase1Helper}
              </p>
            </div>

            {/* Scene Drawing Card */}
            <div className="eco-card p-4 space-y-3">
              <div className="relative aspect-[16/10] bg-stone-900 rounded-lg overflow-hidden border border-stone-400/40 shadow-inner">
                {scenario.customImageUrl || scenario.coverImage ? (
                  <img 
                    src={scenario.customImageUrl || scenario.coverImage} 
                    alt={scenario.title} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-emerald-950 to-stone-900 p-6 text-center text-stone-200">
                    <span className="text-5xl">🏛️</span>
                    <h3 className="text-lg font-bold mt-2 text-stone-100">{scenario.title}</h3>
                    <p className="text-xs text-stone-400 mt-1 max-w-md">{scenario.description}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Countdown & Immediate Skip Option */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-2 text-stone-700 text-xs font-bold">
                <Clock className="w-4 h-4 text-emerald-800" />
                <span>{dict.introTimerRemaining.replace('{seconds}', formatTimer(introTimeLeft))}</span>
              </div>

              <BespokeButton
                size="md"
                onClick={handleProceedToObservation}
                icon={ArrowRight}
                theme="theme-herbarium"
              >
                {dict.readyToRecordBtn}
              </BespokeButton>
            </div>

          </div>
        )}

        {/* =========================================================================
            PHASE 2: 4-MINUTE OBSERVATION CHALLENGE ("Find as many as you can — spot up to 3 eco-issues.")
            ========================================================================= */}
        {currentStep === 'spot-60s' && (
          <div className="eco-container p-6 sm:p-8 space-y-6 animate-in fade-in duration-300">
            
            {/* Top Timer Bar */}
            <div className="flex items-center justify-between border-b border-stone-400/30 pb-4 gap-3">
              <div className="flex items-center gap-3">
                <div 
                  role="timer"
                  aria-live="polite"
                  aria-atomic="true"
                  aria-label={`Observation timer: ${observationTimeLeft} seconds remaining in observation window`}
                  className={`flex items-baseline gap-1 px-3 py-1.5 rounded-xl border-2 transition-all ${
                    isUrgent 
                      ? 'bg-amber-900/20 border-amber-800 text-amber-900 animate-pulse' 
                      : 'bg-emerald-900/10 border-emerald-800/40 text-emerald-900'
                  }`}
                >
                  <Clock className="w-4 h-4 text-emerald-800 self-center" />
                  <span className="text-xl sm:text-2xl font-black font-mono">
                    {formatTimer(observationTimeLeft)}
                  </span>
                  <span className="text-[10px] font-bold text-stone-600">
                    {observationTimeLeft >= 60 ? (lang === 'uz' ? 'daq' : 'min') : (lang === 'uz' ? 'son' : 'sec')}
                  </span>
                </div>

                <div>
                  <div className="text-xs font-bold text-emerald-950">
                    {dict.phase2Badge}
                  </div>
                  <div className="text-[11px] text-stone-600 truncate max-w-xs sm:max-w-md">
                    {activeQuestions.spotPrompt || dict.phase2DefaultPrompt}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowSceneModal(true)}
                className="px-2.5 py-1.5 rounded-xl bg-stone-300/40 hover:bg-stone-300/80 text-stone-800 text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{dict.previewSceneBtn}</span>
              </button>
            </div>

            {/* Prompt Header */}
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-stone-900">
                "{activeQuestions.spotPrompt || dict.phase2DefaultPrompt}"
              </h2>
              <p className="text-xs text-stone-700 mt-1">
                {activeQuestions.spotHelper || dict.phase2Helper}
              </p>
            </div>

            {/* 3 Bespoke Input Slots with vine underlines */}
            <div className="space-y-4 pt-1">
              <BespokeInput
                label={dict.obs1Label}
                value={issue1}
                onChange={(e) => setIssue1(e.target.value)}
                onClear={() => setIssue1('')}
                placeholder={dict.obs1Placeholder}
                theme="theme-herbarium"
              />

              <BespokeInput
                label={dict.obs2Label}
                value={issue2}
                onChange={(e) => setIssue2(e.target.value)}
                onClear={() => setIssue2('')}
                placeholder={dict.obs2Placeholder}
                theme="theme-herbarium"
              />

              <BespokeInput
                label={dict.obs3Label}
                value={issue3}
                onChange={(e) => setIssue3(e.target.value)}
                onClear={() => setIssue3('')}
                placeholder={dict.obs3Placeholder}
                theme="theme-herbarium"
              />
            </div>

            {/* Quick Suggestion Tags from Scenario */}
            {scenario.issues && scenario.issues.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-stone-400/20">
                <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block">
                  {dict.quickSpotTitle}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {scenario.issues.slice(0, 5).map((iss) => (
                    <button
                      key={iss.id}
                      type="button"
                      onClick={() => handleApplyPreset(iss.title)}
                      className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-900/10 hover:bg-amber-900/20 text-stone-800 border border-stone-400/30 transition-all cursor-pointer"
                    >
                      + {iss.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {validationError && (
              <div className="p-3 rounded-lg bg-red-950/10 border border-red-800/30 text-xs font-bold text-red-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-800 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Next CTA */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-stone-600">
                {dict.loggedCountText.replace('{count}', activeIssues.length)}
              </span>

              <BespokeButton
                size="md"
                onClick={handleProceedToPrioritize}
                icon={ArrowRight}
                theme="theme-herbarium"
              >
                {dict.proceedToPrioritizeBtn}
              </BespokeButton>
            </div>

          </div>
        )}

        {/* =========================================================================
            PHASE 3: PRIORITISATION QUESTION ("Which issue would you tackle first, and why?")
            ========================================================================= */}
        {currentStep === 'prioritize-30s' && (
          <div className="eco-container p-6 sm:p-8 space-y-6 animate-in fade-in duration-300">
            
            {/* Header */}
            <div className="space-y-1 border-b border-stone-400/30 pb-4">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-800/10 text-emerald-900">
                {dict.phase3Badge}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-stone-900">
                "{activeQuestions.prioritizePrompt || dict.phase3DefaultPrompt}"
              </h2>
              <p className="text-xs text-stone-700">
                {activeQuestions.prioritizeHelper || dict.phase3Helper}
              </p>
            </div>

            {/* Interactive Issue Selectors */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider">
                {dict.selectPriorityLabel}
              </label>
              
              <div className="grid grid-cols-1 gap-3">
                {activeIssues.map((iss) => (
                  <BespokeActionCard
                    key={iss.id}
                    title={iss.title}
                    subtitle={dict.observedItemSubtitle.replace('{number}', iss.number)}
                    badge={topPriorityId === iss.id ? dict.activePriorityBadge : (dict.optionBadge || 'Option')}
                    isSelected={topPriorityId === iss.id}
                    onSelect={() => setTopPriorityId(iss.id)}
                    onClick={() => setTopPriorityId(iss.id)}
                    theme="theme-herbarium"
                    icon="🌱"
                  />
                ))}
              </div>
            </div>

            {/* Rationale Input */}
            <div className="pt-2">
              <BespokeTextArea
                label={dict.whyPriorityLabel}
                value={priorityReason}
                onChange={(e) => setPriorityReason(e.target.value)}
                placeholder={dict.whyPriorityPlaceholder}
                helper={dict.whyPriorityHelper}
                theme="theme-herbarium"
              />
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep('spot-60s')}
                className="inline-flex items-center gap-1 text-xs font-bold text-stone-700 hover:text-stone-950 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{dict.backToObservationsBtn}</span>
              </button>

              <BespokeButton
                size="md"
                onClick={handleProceedToAction}
                icon={ArrowRight}
                theme="theme-herbarium"
              >
                {dict.proceedToActionBtn}
              </BespokeButton>
            </div>

          </div>
        )}

        {/* =========================================================================
            PHASE 4: PRACTICAL ACTION PLEDGE ("What is one realistic first step you could take today?")
            ========================================================================= */}
        {currentStep === 'action-30s' && (
          <div className="eco-container p-6 sm:p-8 space-y-6 animate-in fade-in duration-300">
            
            {/* Header */}
            <div className="space-y-1 border-b border-stone-400/30 pb-4">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-800/10 text-emerald-900">
                {dict.phase4Badge}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-stone-900">
                "{activeQuestions.actionPrompt || dict.phase4DefaultPrompt}"
              </h2>
              <p className="text-xs text-stone-700">
                {activeQuestions.actionHelper || dict.phase4Helper}
              </p>
            </div>

            {/* Selected Priority Recap */}
            <div className="p-3.5 rounded-lg bg-emerald-900/10 border border-emerald-800/20 text-xs space-y-1">
              <span className="font-extrabold uppercase tracking-wider text-emerald-900">
                {dict.targetedIssueLabel}
              </span>
              <p className="text-stone-900 font-bold">
                {activeIssues.find(i => i.id === topPriorityId)?.title || issue1 || 'Observed Eco-Issue'}
              </p>
            </div>

            {/* Action Pledge Field */}
            <BespokeTextArea
              label={dict.actionStepLabel}
              value={practicalAction}
              onChange={(e) => {
                setPracticalAction(e.target.value);
                if (e.target.value.trim()) setValidationError('');
              }}
              placeholder={dict.actionStepPlaceholder}
              helper={dict.actionStepHelper}
              theme="theme-herbarium"
            />

            {/* Expected Turnaround */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider">
                {dict.timeframeLabel}
              </label>
              <BespokePebblePicker
                options={[
                  { value: 'Immediate Quick Win (< 24 hrs)', label: dict.timeframeOptions.quick },
                  { value: '1-Week Team Action', label: dict.timeframeOptions.week },
                  { value: 'Long-term Systemic Change', label: dict.timeframeOptions.policy }
                ]}
                value={timeToFix}
                onChange={setTimeToFix}
                theme="theme-herbarium"
              />
            </div>

            {validationError && (
              <div className="p-3 rounded-lg bg-red-950/10 border border-red-800/30 text-xs font-bold text-red-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-800 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Submit Action */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep('prioritize-30s')}
                className="inline-flex items-center gap-1 text-xs font-bold text-stone-700 hover:text-stone-950 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{dict.backToPrioritiseBtn}</span>
              </button>

              <BespokeButton
                size="lg"
                onClick={handleFinalSubmit}
                icon={Send}
                theme="theme-herbarium"
                className="px-8 py-3.5 shadow-xl"
              >
                {dict.submitAuditBtn}
              </BespokeButton>
            </div>

          </div>
        )}

        {/* =========================================================================
            PHASE 5: COMPLETION CEREMONY & PERSONALIZED ECO-PLEDGE CERTIFICATE
            ========================================================================= */}
        {currentStep === 'certificate' && lastSubmission && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <PledgeCertificate
              formData={{
                participantName: lastSubmission.participantName,
                date: lastSubmission.date,
                selectedIssues: lastSubmission.selectedIssues,
                topPriority: lastSubmission.topPriorityTitle,
                priorityReason: lastSubmission.priorityReason,
                practicalAction: lastSubmission.practicalAction
              }}
              scenario={scenario}
              onRestart={handleStartOver}
              onViewCommunityResponses={() => setCurrentStep('community-responses')}
              theme="herbarium"
              lang={lang}
            />
          </div>
        )}

        {/* =========================================================================
            PHASE 6: COMMUNITY ECO-AUDIT RESPONSES WALL ("See Others' Answers")
            ========================================================================= */}
        {currentStep === 'community-responses' && (
          <CommunityResponsesView
            onBackToCertificate={lastSubmission ? () => setCurrentStep('certificate') : () => setCurrentStep('gate')}
            onStartNewAudit={handleStartOver}
            lang={lang}
          />
        )}

      </main>

      {/* Collapsible Scene Modal (when clicking "View Scene" or "Preview venue drawing") */}
      {showSceneModal && (
        <div 
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in"
        >
          <div className="eco-container max-w-2xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-400/30 pb-2">
              <h3 className="text-base font-bold text-stone-900">
                {dict.targetVenueLabel}: {qrSpecificPart ? `${qrZoneCategory} — ${qrSpecificPart}` : scenario.title}
              </h3>
              <button
                type="button"
                onClick={() => setShowSceneModal(false)}
                className="p-1 rounded-full bg-stone-300/50 hover:bg-stone-300 text-stone-800 cursor-pointer"
              >
                ✕
              </button>
            </div>
            
            <div className="aspect-[16/10] bg-stone-950 rounded-lg overflow-hidden flex items-center justify-center">
              {scenario.customImageUrl || scenario.coverImage ? (
                <img src={scenario.customImageUrl || scenario.coverImage} alt={scenario.title} className="w-full h-full object-cover" />
              ) : (
                <div className="p-6 text-center text-stone-200">
                  <span className="text-5xl">🏛️</span>
                  <div className="text-sm font-bold text-stone-100 mt-2">{scenario.title}</div>
                  <div className="text-xs text-stone-400 max-w-md mt-1">{scenario.description}</div>
                </div>
              )}
            </div>

            <div className="text-right pt-2">
              <button
                type="button"
                onClick={() => setShowSceneModal(false)}
                className="px-4 py-2 rounded-xl bg-stone-800 text-white text-xs font-bold hover:bg-stone-700 cursor-pointer"
              >
                {dict.closeBtn || (lang === 'uz' ? 'Yopish' : 'Close')}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
