import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, Target, Lightbulb, User, Mail, Calendar, 
  Sparkles, Plus, X, ArrowRight, ArrowLeft, Send, Check, 
  HelpCircle, ShieldCheck, Flame, Droplets, SunMedium, Zap, 
  Trash2, FileText, Layers, Smartphone, LayoutList, SlidersHorizontal,
  Clock, AlertTriangle
} from 'lucide-react';
import { sounds } from '../services/soundEffects';
import { saveSubmission, generateMailtoUrl, getBackendSettings } from '../services/submissionService';
import BespokeInput from './design-system/BespokeInput';
import BespokeTextArea from './design-system/BespokeTextArea';
import BespokeButton from './design-system/BespokeButton';
import BespokePebblePicker from './design-system/BespokePebblePicker';
import BespokeActionCard from './design-system/BespokeActionCard';
import BespokeProgressBar from './design-system/BespokeProgressBar';

export default function GoogleFormsEcoSurvey({
  scenario,
  onComplete,
  theme = 'solarpunk',
  timerDuration = 60,
  timerTimeLeft = 60
}) {
  // View mode: 'scroll' (continuous Google Forms sheet) or 'step' (Typeform focus mode)
  const [formMode, setFormMode] = useState('scroll');
  const [stepIndex, setStepIndex] = useState(0);

  // Form State
  const [formData, setFormData] = useState({
    participantName: '',
    participantEmail: '',
    participantRole: 'Student',
    date: new Date().toISOString().split('T')[0],
    issue1: '',
    issue2: '',
    issue3: '',
    topPriorityId: 'issue-1',
    topPriorityTitle: '',
    priorityReason: '',
    practicalAction: '',
    timeToFix: 'Immediate Quick Win (< 24 hrs)'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);

  // Derive active issue list
  const activeIssues = [
    formData.issue1.trim() && { id: 'issue-1', title: formData.issue1.trim() },
    formData.issue2.trim() && { id: 'issue-2', title: formData.issue2.trim() },
    formData.issue3.trim() && { id: 'issue-3', title: formData.issue3.trim() }
  ].filter(Boolean);

  // Synchronize top priority title when issues change
  useEffect(() => {
    const matched = activeIssues.find(i => i.id === formData.topPriorityId);
    if (matched) {
      setFormData(prev => ({ ...prev, topPriorityTitle: matched.title }));
    } else if (activeIssues.length > 0) {
      setFormData(prev => ({ 
        ...prev, 
        topPriorityId: activeIssues[0].id, 
        topPriorityTitle: activeIssues[0].title 
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        topPriorityId: '',
        topPriorityTitle: ''
      }));
    }
  }, [formData.issue1, formData.issue2, formData.issue3, formData.topPriorityId]);

  // Handle Preset Suggestion Click
  const handleApplyPreset = (title) => {
    sounds.playSpotSuccess();
    if (!formData.issue1.trim()) {
      setFormData(prev => ({ ...prev, issue1: title }));
    } else if (!formData.issue2.trim()) {
      setFormData(prev => ({ ...prev, issue2: title }));
    } else if (!formData.issue3.trim()) {
      setFormData(prev => ({ ...prev, issue3: title }));
    }
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (activeIssues.length === 0) return;

    setIsSubmitting(true);
    sounds.playStageChime();

    const submissionPayload = {
      scenarioId: scenario.id,
      scenarioTitle: scenario.title,
      participantName: formData.participantName.trim() || 'Anonymous Participant',
      participantEmail: formData.participantEmail.trim(),
      participantRole: formData.participantRole,
      date: formData.date,
      selectedIssues: activeIssues,
      topPriorityId: formData.topPriorityId,
      topPriorityTitle: formData.topPriorityTitle || activeIssues[0]?.title,
      priorityReason: formData.priorityReason.trim(),
      practicalAction: formData.practicalAction.trim(),
      timeToFix: formData.timeToFix
    };

    const result = await saveSubmission(submissionPayload);
    setIsSubmitting(false);
    setSubmitResult(result);
    onComplete(submissionPayload);
  };

  // Calculate completion percentage
  const totalSteps = 5;
  const answeredCount = [
    formData.participantName || formData.participantRole,
    activeIssues.length > 0,
    formData.topPriorityTitle,
    formData.priorityReason,
    formData.practicalAction
  ].filter(Boolean).length;
  const progressPct = Math.round((answeredCount / totalSteps) * 100);

  const roles = ['Student', 'Faculty / Teacher', 'Facility Staff', 'Committee Leader', 'Visitor'];

  const horizonOptions = [
    'Immediate Quick Win (< 24 hrs)',
    'Within 1 Week',
    'Requires Committee / School Budget'
  ];

  return (
    <div className="w-full space-y-6">
      
      {/* GOOGLE FORMS / TYPEFORM CONTROL BAR */}
      <div className="eco-container p-4 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Form View Mode Toggle */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950/70 border border-emerald-900/60 text-xs">
          <button
            type="button"
            onClick={() => setFormMode('scroll')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              formMode === 'scroll' 
                ? 'bg-emerald-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutList className="w-3.5 h-3.5" />
            <span>Continuous Form</span>
          </button>

          <button
            type="button"
            onClick={() => setFormMode('step')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              formMode === 'step' 
                ? 'bg-emerald-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Step-by-Step Cards</span>
          </button>
        </div>

        {/* Custom Living Bespoke Progress Bar */}
        <div className="flex items-center gap-3 min-w-[200px]">
          <span className="text-xs text-slate-400 font-semibold hidden sm:inline">Progress:</span>
          <BespokeProgressBar
            progressPct={progressPct}
            theme={theme}
            className="flex-1"
          />
        </div>

      </div>

      {/* ========================================================
          CONTINUOUS FORM VIEW (Google Forms Inspired with Bespoke Themes)
          ======================================================== */}
      {formMode === 'scroll' && (
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Form Header Card */}
          <div className="eco-container p-6 sm:p-10 space-y-3 relative overflow-hidden">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Eco-Survey
              </span>
              <span className="text-xs text-slate-400 font-semibold">
                Official Ecology Committee Form
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight font-serif">
              THE 60-SECOND ECO-AUDIT
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Spot it. Prioritise it. Solve it. Help us observe everyday school and workplace sustainability issues, select one immediate priority, and suggest a practical action step.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-emerald-300 font-semibold border-t border-emerald-800/40">
              <span>Auditing: <strong className="text-white">{scenario.title}</strong></span>
              <span>•</span>
              <span>Takes: <strong>2–3 Minutes</strong></span>
              <span>•</span>
              <span>Theme: <strong className="text-cyan-300 uppercase">{theme}</strong></span>
            </div>
          </div>

          {/* Section 1: Participant Identity */}
          <div className="eco-container p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 font-black text-xs uppercase tracking-wider">
              <span>Section 1 of 5</span>
              <span>•</span>
              <span>Participant Details</span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-white">
              Who is conducting this eco-audit?
            </h3>

            {/* Bespoke Non-Rectangular Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <BespokeInput
                label="Your Name (Optional)"
                placeholder="e.g. Alex Morgan"
                value={formData.participantName}
                onChange={(e) => setFormData({ ...formData, participantName: e.target.value })}
                onClear={() => setFormData({ ...formData, participantName: '' })}
                icon={User}
                theme={theme}
              />

              <BespokeInput
                label="Your Email (Optional, to receive pledge certificate)"
                type="email"
                placeholder="e.g. alex@school.edu"
                value={formData.participantEmail}
                onChange={(e) => setFormData({ ...formData, participantEmail: e.target.value })}
                onClear={() => setFormData({ ...formData, participantEmail: '' })}
                icon={Mail}
                theme={theme}
              />
            </div>

            {/* Role Pebble Picker */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-emerald-300 block">
                Your Community Role:
              </label>
              <BespokePebblePicker
                options={roles}
                value={formData.participantRole}
                onChange={(role) => setFormData({ ...formData, participantRole: role })}
                theme={theme}
              />
            </div>
          </div>

          {/* Section 2: List up to 3 Issues Noticed (Spot Phase) */}
          <div className="eco-container p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-400 font-black text-xs uppercase tracking-wider">
                <span>Section 2 of 5</span>
                <span>•</span>
                <span>Observation (60s)</span>
              </div>
              <span className="text-xs font-bold text-red-400">* At least 1 Required</span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-white">
              A. List up to three environmental issues you noticed:
            </h3>

            <p className="text-xs text-slate-300">
              Look closely at the scene picture. Type what you observe or click the common observations below to autofill.
            </p>

            {/* 3 Dedicated Bespoke Form Rows */}
            <div className="space-y-3">
              {[
                { key: 'issue1', label: 'Issue 1', placeholder: 'First issue noticed (e.g. A tap is dripping or left running)' },
                { key: 'issue2', label: 'Issue 2 (Optional)', placeholder: 'Second issue noticed (e.g. Lights on in empty room / bright daylight)' },
                { key: 'issue3', label: 'Issue 3 (Optional)', placeholder: 'Third issue noticed (e.g. Paper recycling contaminated with food waste)' }
              ].map(({ key, label, placeholder }) => (
                <BespokeInput
                  key={key}
                  label={label}
                  placeholder={placeholder}
                  value={formData[key]}
                  onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                  onClear={() => setFormData({ ...formData, [key]: '' })}
                  theme={theme}
                />
              ))}
            </div>

            {/* Quick Suggestion Pills */}
            <div className="pt-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Common Scene Issues (Click to autofill):
              </span>
              <div className="flex flex-wrap gap-2">
                {scenario.issues.map((iss) => {
                  const isUsed = [formData.issue1, formData.issue2, formData.issue3].includes(iss.title);
                  return (
                    <button
                      key={iss.id}
                      type="button"
                      disabled={isUsed || (!!formData.issue1 && !!formData.issue2 && !!formData.issue3)}
                      onClick={() => handleApplyPreset(iss.title)}
                      className={`text-xs px-3.5 py-1.5 rounded-full border transition-all cursor-pointer ${
                        isUsed
                          ? 'opacity-40 bg-slate-900 border-slate-800 text-slate-500 cursor-not-allowed'
                          : 'bg-emerald-950/70 hover:bg-emerald-800 text-emerald-200 border-emerald-600/40 hover:scale-105 shadow-sm'
                      }`}
                    >
                      + {iss.title}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 3: Choose Top Priority (Prioritise Phase) */}
          <div className="eco-container p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-400 font-black text-xs uppercase tracking-wider">
                <span>Section 3 of 5</span>
                <span>•</span>
                <span>Prioritization (30s)</span>
              </div>
              <span className="text-xs font-bold text-red-400">* Required</span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-white">
              B. Which issue would you tackle first? (My Top Priority)
            </h3>

            {activeIssues.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {activeIssues.map((issue) => {
                  const isSelected = formData.topPriorityId === issue.id;
                  return (
                    <BespokeActionCard
                      key={issue.id}
                      title={issue.title}
                      badge={isSelected ? '★ Top Priority' : 'Tap to Prioritize'}
                      isSelected={isSelected}
                      onSelect={() => {
                        setFormData({ 
                          ...formData, 
                          topPriorityId: issue.id, 
                          topPriorityTitle: issue.title 
                        });
                      }}
                      icon={Target}
                      theme={theme}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-900/60 text-xs text-slate-400 border border-slate-800 italic flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Please enter at least one issue in Section 2 above to select your priority.</span>
              </div>
            )}
          </div>

          {/* Section 4: Why Tackle First? */}
          <div className="eco-container p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 font-black text-xs uppercase tracking-wider">
              <span>Section 4 of 5</span>
              <span>•</span>
              <span>Reasoning & Feasibility</span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-white">
              C. Why should it be tackled first?
            </h3>

            {/* Rationale Quick Pills */}
            <div className="flex flex-wrap gap-2">
              {[
                'Immediate resource loss / high waste',
                'Zero or low cost to fix',
                'Prevents safety or property hazard',
                'Builds visible sustainable habits'
              ].map((rat, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    sounds.playSpotSuccess();
                    setFormData({ ...formData, priorityReason: rat });
                  }}
                  className={`text-xs px-3.5 py-1.5 rounded-full border transition-all cursor-pointer ${
                    formData.priorityReason === rat
                      ? 'bg-amber-500 text-slate-950 border-amber-300 font-bold shadow-md'
                      : 'bg-slate-900/70 hover:bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  + {rat}
                </button>
              ))}
            </div>

            {/* Bespoke Non-Rectangular TextArea */}
            <BespokeTextArea
              rows={2}
              placeholder="Explain your reasoning (e.g. this costs nothing to fix right away, or causes massive ongoing resource loss)..."
              value={formData.priorityReason}
              onChange={(e) => setFormData({ ...formData, priorityReason: e.target.value })}
              theme={theme}
            />
          </div>

          {/* Section 5: Practical Action Step */}
          <div className="eco-container p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 font-black text-xs uppercase tracking-wider">
              <span>Section 5 of 5</span>
              <span>•</span>
              <span>Practical Action (30s)</span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-white">
              D. One practical first action:
            </h3>

            {/* Practical Action Suggestion Pills */}
            <div className="flex flex-wrap gap-2">
              {[
                'Turn off fully / switch off when room is empty',
                'Report the leak or maintenance issue for repair',
                'Label sorting bins clearly with pictorial signs',
                'Set printer default to double-sided duplex',
                'Bring reusable bottle or cup'
              ].map((sug, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    sounds.playSpotSuccess();
                    setFormData({ ...formData, practicalAction: sug });
                  }}
                  className={`text-xs px-3.5 py-1.5 rounded-full border transition-all cursor-pointer ${
                    formData.practicalAction === sug
                      ? 'bg-emerald-500 text-slate-950 border-emerald-300 font-bold shadow-md'
                      : 'bg-slate-900/70 hover:bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  + {sug}
                </button>
              ))}
            </div>

            {/* Bespoke Multiline Action Input */}
            <BespokeTextArea
              rows={2}
              placeholder="Suggest one realistic, practical first step that can be executed today..."
              value={formData.practicalAction}
              onChange={(e) => setFormData({ ...formData, practicalAction: e.target.value })}
              theme={theme}
            />

            {/* Estimated Resolution Horizon via Bespoke Pebble Picker */}
            <div className="pt-2 space-y-2">
              <label className="text-xs font-bold text-emerald-300 block">
                Estimated Resolution Horizon:
              </label>
              <BespokePebblePicker
                options={horizonOptions}
                value={formData.timeToFix}
                onChange={(horizon) => setFormData({ ...formData, timeToFix: horizon })}
                theme={theme}
              />
            </div>
          </div>

          {/* Form Submit Footer */}
          <div className="eco-container p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-300 text-center sm:text-left">
              Submissions are logged to the Ecology Committee database and dispatched to committee coordinators.
            </div>

            <BespokeButton
              type="submit"
              disabled={activeIssues.length === 0 || isSubmitting}
              size="lg"
              theme={theme}
              icon={Send}
            >
              {isSubmitting ? 'Submitting to Database...' : 'Submit Eco-Audit Form'}
            </BespokeButton>
          </div>

        </form>
      )}

      {/* ========================================================
          STEP-BY-STEP FOCUS MODE (Typeform Inspired with Bespoke Themes)
          ======================================================== */}
      {formMode === 'step' && (
        <div className="eco-container p-6 sm:p-10 space-y-6">
          
          <div className="flex items-center justify-between text-xs text-slate-400 pb-3 border-b border-emerald-800/40">
            <span className="font-bold text-emerald-400">
              Question {stepIndex + 1} of 5
            </span>
            <span>Typeform-style Focus Mode • Theme: {theme}</span>
          </div>

          {/* Step 0: Identity */}
          {stepIndex === 0 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <span className="text-emerald-400 font-mono text-sm font-bold">1 ➔</span>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Who is submitting this audit?
              </h3>
              <p className="text-xs text-slate-300">
                Enter your name and community role so the committee can credit your observation.
              </p>

              <div className="space-y-3 pt-2">
                <BespokeInput
                  label="Your Name (Optional)"
                  placeholder="Your Name (Optional)"
                  value={formData.participantName}
                  onChange={(e) => setFormData({ ...formData, participantName: e.target.value })}
                  onClear={() => setFormData({ ...formData, participantName: '' })}
                  theme={theme}
                  autoFocus
                />
                <BespokeInput
                  label="Your Email (Optional)"
                  type="email"
                  placeholder="Your Email (Optional, for certificate copy)"
                  value={formData.participantEmail}
                  onChange={(e) => setFormData({ ...formData, participantEmail: e.target.value })}
                  onClear={() => setFormData({ ...formData, participantEmail: '' })}
                  theme={theme}
                />

                <div className="pt-2">
                  <label className="text-xs font-bold text-emerald-300 block mb-2">
                    Select Your Role:
                  </label>
                  <BespokePebblePicker
                    options={roles}
                    value={formData.participantRole}
                    onChange={(r) => setFormData({ ...formData, participantRole: r })}
                    theme={theme}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Issues Noticed */}
          {stepIndex === 1 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <span className="text-emerald-400 font-mono text-sm font-bold">2 ➔</span>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                What environmental issues did you observe?
              </h3>
              <p className="text-xs text-slate-300">
                List up to 3 issues noticed during the 60-second observation window.
              </p>

              <div className="space-y-3 pt-2">
                <BespokeInput
                  label="1. Primary issue observed *"
                  placeholder="e.g. A tap is dripping or left running..."
                  value={formData.issue1}
                  onChange={(e) => setFormData({ ...formData, issue1: e.target.value })}
                  onClear={() => setFormData({ ...formData, issue1: '' })}
                  theme={theme}
                  autoFocus
                />
                <BespokeInput
                  label="2. Second issue (optional)"
                  placeholder="e.g. Lights on in empty room..."
                  value={formData.issue2}
                  onChange={(e) => setFormData({ ...formData, issue2: e.target.value })}
                  onClear={() => setFormData({ ...formData, issue2: '' })}
                  theme={theme}
                />
                <BespokeInput
                  label="3. Third issue (optional)"
                  placeholder="e.g. Recycling bin contaminated with food..."
                  value={formData.issue3}
                  onChange={(e) => setFormData({ ...formData, issue3: e.target.value })}
                  onClear={() => setFormData({ ...formData, issue3: '' })}
                  theme={theme}
                />
              </div>

              {/* Suggestions */}
              <div className="flex flex-wrap gap-2 pt-2">
                {scenario.issues.slice(0, 4).map((iss) => (
                  <button
                    key={iss.id}
                    type="button"
                    onClick={() => handleApplyPreset(iss.title)}
                    className="text-xs px-3.5 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-600/40 text-emerald-200 hover:bg-emerald-800"
                  >
                    + {iss.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Prioritize */}
          {stepIndex === 2 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <span className="text-emerald-400 font-mono text-sm font-bold">3 ➔</span>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Which issue would you tackle first?
              </h3>
              <p className="text-xs text-slate-300">
                Choose the #1 top priority issue among your observations.
              </p>

              {activeIssues.length > 0 ? (
                <div className="space-y-3 pt-2">
                  {activeIssues.map((iss) => (
                    <BespokeActionCard
                      key={iss.id}
                      title={iss.title}
                      badge={formData.topPriorityId === iss.id ? '★ Top Priority' : 'Tap to Prioritize'}
                      isSelected={formData.topPriorityId === iss.id}
                      onSelect={() => {
                        sounds.playSpotSuccess();
                        setFormData({ ...formData, topPriorityId: iss.id, topPriorityTitle: iss.title });
                      }}
                      icon={Target}
                      theme={theme}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-900 text-xs text-slate-400">
                  Please go back and enter at least one issue first.
                </div>
              )}
            </div>
          )}

          {/* Step 3: Why Tackle First */}
          {stepIndex === 3 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <span className="text-emerald-400 font-mono text-sm font-bold">4 ➔</span>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Why should it be tackled first?
              </h3>
              <p className="text-xs text-slate-300">
                Explain your reasoning (e.g. quick cost-free win, severe hazard, or high carbon impact).
              </p>

              <BespokeTextArea
                rows={3}
                placeholder="Type your explanation..."
                value={formData.priorityReason}
                onChange={(e) => setFormData({ ...formData, priorityReason: e.target.value })}
                theme={theme}
              />
            </div>
          )}

          {/* Step 4: Practical Action Step */}
          {stepIndex === 4 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <span className="text-emerald-400 font-mono text-sm font-bold">5 ➔</span>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                What is one practical first action?
              </h3>
              <p className="text-xs text-slate-300">
                What is a realistic step that can actually be started today?
              </p>

              <BespokeTextArea
                rows={3}
                placeholder="Type your suggested practical action..."
                value={formData.practicalAction}
                onChange={(e) => setFormData({ ...formData, practicalAction: e.target.value })}
                theme={theme}
              />

              <div className="pt-2">
                <label className="text-xs font-bold text-emerald-300 block mb-2">
                  Resolution Horizon:
                </label>
                <BespokePebblePicker
                  options={horizonOptions}
                  value={formData.timeToFix}
                  onChange={(h) => setFormData({ ...formData, timeToFix: h })}
                  theme={theme}
                />
              </div>
            </div>
          )}

          {/* Step Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-emerald-800/40">
            <BespokeButton
              type="button"
              disabled={stepIndex === 0}
              onClick={() => setStepIndex(stepIndex - 1)}
              theme={theme}
              size="sm"
              icon={ArrowLeft}
            >
              Back
            </BespokeButton>

            {stepIndex < 4 ? (
              <BespokeButton
                type="button"
                onClick={() => setStepIndex(stepIndex + 1)}
                theme={theme}
                size="md"
                icon={ArrowRight}
              >
                Continue
              </BespokeButton>
            ) : (
              <BespokeButton
                type="button"
                onClick={handleSubmit}
                disabled={activeIssues.length === 0 || isSubmitting}
                theme={theme}
                size="md"
                icon={Send}
              >
                Submit Audit Form
              </BespokeButton>
            )}
          </div>

        </div>
      )}

      {/* Post-Submit Email Forwarding helper dialog if needed */}
      {submitResult && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-emerald-200 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>
              <strong>Form submitted!</strong> Saved to local database.
              {submitResult.dispatchResults?.email && ' Forwarded to committee email.'}
              {submitResult.dispatchResults?.sheet && ' Logged to Google Sheet.'}
            </span>
          </div>

          <a
            href={generateMailtoUrl(submitResult.enriched, getBackendSettings().recipientEmail)}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-emerald-600/40 text-emerald-300 font-bold shrink-0 transition-colors"
          >
            Open in Email App
          </a>
        </div>
      )}

    </div>
  );
}
