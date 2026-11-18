import React, { useState } from 'react';
import { 
  CheckCircle2, Target, Lightbulb, User, Calendar, Sparkles, 
  Plus, X, ArrowRight, HelpCircle, Droplets, SunMedium, Zap, 
  FileText, Trash2, Flame, Sprout, AlertCircle, BookmarkCheck
} from 'lucide-react';
import BespokeInput from './design-system/BespokeInput';
import BespokeTextArea from './design-system/BespokeTextArea';
import BespokeButton from './design-system/BespokeButton';

export function IssueIcon({ name, className = "w-5 h-5" }) {
  const map = {
    Droplets, SunMedium, Zap, FileText, Trash2, Flame, Sprout,
    AlertCircle
  };
  const IconComp = map[name] || AlertCircle;
  return <IconComp className={className} />;
}

export default function AuditCardForm({
  scenario,
  formData,
  setFormData,
  currentPhase, // 'spot' | 'prioritise' | 'action'
  theme = 'biomorphic',
  onSubmit
}) {
  const [issue1, setIssue1] = useState(formData.selectedIssues[0]?.title || '');
  const [issue2, setIssue2] = useState(formData.selectedIssues[1]?.title || '');
  const [issue3, setIssue3] = useState(formData.selectedIssues[2]?.title || '');

  const updateIssuesList = (i1, i2, i3) => {
    const list = [];
    if (i1.trim()) list.push({ id: 'issue-1', title: i1.trim() });
    if (i2.trim()) list.push({ id: 'issue-2', title: i2.trim() });
    if (i3.trim()) list.push({ id: 'issue-3', title: i3.trim() });

    setFormData(prev => ({
      ...prev,
      selectedIssues: list,
      topPriority: prev.topPriority || (list[0]?.id || '')
    }));
  };

  const handleIssue1Change = (val) => {
    setIssue1(val);
    updateIssuesList(val, issue2, issue3);
  };

  const handleIssue2Change = (val) => {
    setIssue2(val);
    updateIssuesList(issue1, val, issue3);
  };

  const handleIssue3Change = (val) => {
    setIssue3(val);
    updateIssuesList(issue1, issue2, val);
  };

  // Quick preset helper
  const handleApplyPreset = (title) => {
    if (!issue1.trim()) {
      handleIssue1Change(title);
    } else if (!issue2.trim()) {
      handleIssue2Change(title);
    } else if (!issue3.trim()) {
      handleIssue3Change(title);
    }
  };

  const validIssues = formData.selectedIssues || [];

  return (
    <div className="eco-container w-full p-5 sm:p-9 space-y-7 text-slate-100 transition-all duration-300">
      
      {/* Header Info Banner matching Page 2 of Guide */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-emerald-500/30">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Official Audit Survey
            </span>
            <span className="text-xs text-slate-400">Page 2 Participant Record</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white mt-1.5 font-serif">
            THE 60-SECOND ECO-AUDIT
          </h3>
          <p className="text-xs sm:text-sm text-emerald-300 font-medium">
            Active Scenario: <strong className="text-white">{scenario.title}</strong>
          </p>
        </div>

        {/* Name and Date Inputs */}
        <div className="flex flex-wrap items-center gap-3">
          <BespokeInput
            placeholder="Participant Name (optional)"
            value={formData.participantName}
            onChange={(e) => setFormData({ ...formData, participantName: e.target.value })}
            onClear={() => setFormData({ ...formData, participantName: '' })}
            icon={User}
            theme={theme}
          />
        </div>
      </div>

      {/* SECTION A: List up to three issues you noticed */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-sm sm:text-base font-bold text-emerald-300 flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-xs font-black border border-emerald-400/40">
              A
            </span>
            <span>List up to three issues you noticed:</span>
          </label>
          <span className="text-xs text-slate-400 italic">
            Look closely at the scene or room • 60 seconds
          </span>
        </div>

        {/* 3 Dedicated Bespoke Inputs matching the printable card */}
        <div className="space-y-3">
          <BespokeInput
            label="1. First Issue"
            placeholder="First issue noticed (e.g. A tap is dripping or left running)..."
            value={issue1}
            onChange={(e) => handleIssue1Change(e.target.value)}
            onClear={() => handleIssue1Change('')}
            theme={theme}
          />
          <BespokeInput
            label="2. Second Issue"
            placeholder="Second issue noticed (e.g. Lights on in empty room / bright daylight)..."
            value={issue2}
            onChange={(e) => handleIssue2Change(e.target.value)}
            onClear={() => handleIssue2Change('')}
            theme={theme}
          />
          <BespokeInput
            label="3. Third Issue"
            placeholder="Third issue noticed (e.g. Recycling contaminated by incorrect waste)..."
            value={issue3}
            onChange={(e) => handleIssue3Change(e.target.value)}
            onClear={() => handleIssue3Change('')}
            theme={theme}
          />
        </div>

        {/* Quick Suggestion Chips from the Facilitator Answer Key */}
        <div className="pt-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Common Observations (Click to auto-fill slot):
          </span>
          <div className="flex flex-wrap gap-2">
            {scenario.issues.map((scenIssue) => {
              const isUsed = [issue1, issue2, issue3].includes(scenIssue.title);
              return (
                <button
                  key={scenIssue.id}
                  disabled={isUsed || (!!issue1 && !!issue2 && !!issue3)}
                  onClick={() => handleApplyPreset(scenIssue.title)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                    isUsed 
                      ? 'opacity-40 bg-slate-900 border-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-emerald-950/60 hover:bg-emerald-800/80 text-emerald-200 border-emerald-600/40 hover:scale-105'
                  }`}
                >
                  + {scenIssue.title}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECTION B: My top priority is */}
      <div className="space-y-4 pt-4 border-t border-emerald-800/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-sm sm:text-base font-bold text-emerald-300 flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-xs font-black border border-emerald-400/40">
              B
            </span>
            <span>My top priority is:</span>
          </label>
          <span className="text-xs text-slate-400 italic">
            Select the #1 issue you would tackle first • 30 seconds
          </span>
        </div>

        {validIssues.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {validIssues.map((issue) => {
              const isSelected = formData.topPriority === issue.id;
              return (
                <button
                  key={issue.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, topPriority: issue.id })}
                  className={`eco-card p-4 text-left flex items-start gap-3 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-amber-400 bg-amber-950/50 ring-2 ring-amber-400/60 shadow-lg'
                      : 'hover:border-slate-500 bg-slate-900/50'
                  }`}
                >
                  <div className={`p-2 rounded-xl shrink-0 ${isSelected ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'}`}>
                    <Target className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300">
                      {isSelected ? '★ Chosen Priority' : 'Tap to Prioritize'}
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-white mt-0.5 truncate">
                      {issue.title}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-slate-900/50 text-xs text-slate-400 border border-slate-800 italic">
            Type at least one issue in Section A above to select your priority.
          </div>
        )}
      </div>

      {/* SECTION C: Why should it be tackled first? */}
      <div className="space-y-3 pt-4 border-t border-emerald-800/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-sm sm:text-base font-bold text-emerald-300 flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-xs font-black border border-emerald-400/40">
              C
            </span>
            <span>Why should it be tackled first?</span>
          </label>
        </div>

        {/* Quick rationale helper pills */}
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
              onClick={() => setFormData({ ...formData, priorityReason: rat })}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                formData.priorityReason === rat
                  ? 'bg-amber-500 text-slate-950 border-amber-300 font-bold shadow-md'
                  : 'bg-slate-900/60 hover:bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              + {rat}
            </button>
          ))}
        </div>

        <textarea
          rows={2}
          placeholder="Explain your reasoning (e.g. this costs nothing to fix right now, or this causes the greatest ongoing environmental harm)..."
          value={formData.priorityReason}
          onChange={(e) => setFormData({ ...formData, priorityReason: e.target.value })}
          className="w-full px-4 py-2.5 rounded-2xl bg-slate-900/70 border border-emerald-600/40 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
      </div>

      {/* SECTION D: One practical first action */}
      <div className="space-y-3 pt-4 border-t border-emerald-800/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-sm sm:text-base font-bold text-emerald-300 flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-xs font-black border border-emerald-400/40">
              D
            </span>
            <span>One practical first action:</span>
          </label>
          <span className="text-xs text-slate-400 italic">
            What is one realistic first step? • 30 seconds
          </span>
        </div>

        {/* Helpful prompt suggestions */}
        <div className="flex flex-wrap gap-2">
          {[
            'Turn off fully / switch off when room is empty',
            'Report the leak or maintenance issue for repair',
            'Label sorting bins clearly with pictures',
            'Set printer default to double-sided duplex',
            'Bring reusable bottle or cup'
          ].map((actionSug, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setFormData({ ...formData, practicalAction: actionSug })}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                formData.practicalAction === actionSug
                  ? 'bg-emerald-500 text-slate-950 border-emerald-300 font-bold shadow-md'
                  : 'bg-slate-900/60 hover:bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              + {actionSug}
            </button>
          ))}
        </div>

        <textarea
          rows={2}
          placeholder="Suggest one practical, realistic action step to improve the situation..."
          value={formData.practicalAction}
          onChange={(e) => setFormData({ ...formData, practicalAction: e.target.value })}
          className="w-full px-4 py-2.5 rounded-2xl bg-slate-900/70 border border-emerald-600/40 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
      </div>

      {/* Complete Audit Submit Button */}
      <div className="pt-4 flex items-center justify-between border-t border-emerald-800/30">
        <span className="text-xs text-slate-400">
          Be ready to explain your choice during facilitator debrief.
        </span>

        <button
          onClick={onSubmit}
          disabled={validIssues.length === 0}
          className="eco-btn flex items-center gap-2 px-6 py-3 text-sm sm:text-base font-extrabold text-white shadow-xl cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 transition-transform"
        >
          <BookmarkCheck className="w-5 h-5" />
          <span>Submit Audit Card & Finish</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

    </div>
  );
}
