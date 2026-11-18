import React, { useState } from 'react';
import { 
  FileEdit, Save, RotateCcw, Check, Sparkles, 
  HelpCircle, Globe, BookOpen, AlertCircle
} from 'lucide-react';
import { getQuestionSettings, saveQuestionSettings, resetQuestionSettings } from '../services/questionSettingsService';
import BespokeInput from './design-system/BespokeInput';
import BespokeTextArea from './design-system/BespokeTextArea';
import BespokeButton from './design-system/BespokeButton';

/**
 * AdminQuestionEditor: Facilitator Question & Prompt Customizer.
 * Edit survey wording for all 4 phases in English and Uzbek.
 */
export default function AdminQuestionEditor() {
  const [questions, setQuestions] = useState(getQuestionSettings());
  const [activeLang, setActiveLang] = useState('uz'); // default to Uzbek as requested
  const [saved, setSaved] = useState(false);

  const currentQuestions = questions[activeLang] || questions.en;

  const handleChange = (field, value) => {
    setQuestions(prev => ({
      ...prev,
      [activeLang]: {
        ...prev[activeLang],
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    saveQuestionSettings(questions);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    if (window.confirm('Reset all questions and prompts to official PDF guide defaults?')) {
      const defaults = resetQuestionSettings();
      setQuestions(defaults);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="eco-container p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <FileEdit className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400">
                Live Survey Customization
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white font-serif">
                Survey Question & Prompt Editor
              </h2>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mt-2">
            Modify the prompts, observation challenges, and reflection instructions presented to participants. Changes take effect on the participant survey immediately.
          </p>
        </div>

        {/* Language Tabs & Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-emerald-700/50">
            <button
              type="button"
              onClick={() => setActiveLang('uz')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeLang === 'uz' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🇺🇿</span>
              <span>O'zbekcha</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveLang('en')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeLang === 'en' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🇬🇧</span>
              <span>English</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
            title="Reset to default questions"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-extrabold text-xs text-white shadow-lg transition-all cursor-pointer"
          >
            {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{saved ? 'Saved!' : 'Save Questions'}</span>
          </button>
        </div>
      </div>

      {/* Editor Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Phase 0: Gate Agreement */}
        <div className="eco-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-800/40 pb-2">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
              Approval Gate • Agreement Statement
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Stage 0</span>
          </div>

          <BespokeTextArea
            label="Participant Agreement Declaration"
            value={currentQuestions.agreementStatement || ''}
            onChange={(e) => handleChange('agreementStatement', e.target.value)}
            placeholder="Statement participant must agree to before starting..."
            theme="theme-solarpunk"
          />
        </div>

        {/* Phase 1: 15s Intro */}
        <div className="eco-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-800/40 pb-2">
            <span className="text-xs font-black uppercase tracking-wider text-cyan-400">
              Phase 1 • 15s Spatial Observation
            </span>
            <span className="text-[10px] text-slate-400 font-mono">15 Seconds</span>
          </div>

          <BespokeInput
            label="Phase 1 Challenge Prompt"
            value={currentQuestions.introPrompt || ''}
            onChange={(e) => handleChange('introPrompt', e.target.value)}
            placeholder="e.g., Look closely. What could be more sustainable here?"
            theme="theme-solarpunk"
          />

          <BespokeInput
            label="Phase 1 Guidance / Helper Text"
            value={currentQuestions.introHelper || ''}
            onChange={(e) => handleChange('introHelper', e.target.value)}
            placeholder="e.g., Take a quiet moment to scan the environment..."
            theme="theme-solarpunk"
          />
        </div>

        {/* Phase 2: 60s Spot */}
        <div className="eco-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-800/40 pb-2">
            <span className="text-xs font-black uppercase tracking-wider text-amber-400">
              Phase 2 • 60s Observation Challenge
            </span>
            <span className="text-[10px] text-slate-400 font-mono">60 Seconds</span>
          </div>

          <BespokeInput
            label="Phase 2 Observation Prompt"
            value={currentQuestions.spotPrompt || ''}
            onChange={(e) => handleChange('spotPrompt', e.target.value)}
            placeholder="e.g., Find as many as you can — spot up to 3 eco-issues."
            theme="theme-solarpunk"
          />

          <BespokeInput
            label="Phase 2 Guidance / Category Hints"
            value={currentQuestions.spotHelper || ''}
            onChange={(e) => handleChange('spotHelper', e.target.value)}
            placeholder="e.g., Record energy leaks, single-use waste, dripping taps..."
            theme="theme-solarpunk"
          />
        </div>

        {/* Phase 3: Prioritise */}
        <div className="eco-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-800/40 pb-2">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
              Phase 3 • Prioritisation & Rationale
            </span>
            <span className="text-[10px] text-slate-400 font-mono">30 Seconds</span>
          </div>

          <BespokeInput
            label="Phase 3 Prioritisation Question"
            value={currentQuestions.prioritizePrompt || ''}
            onChange={(e) => handleChange('prioritizePrompt', e.target.value)}
            placeholder="e.g., Which issue would you tackle first, and why?"
            theme="theme-solarpunk"
          />

          <BespokeInput
            label="Phase 3 Rationale Guidance Helper"
            value={currentQuestions.prioritizeHelper || ''}
            onChange={(e) => handleChange('prioritizeHelper', e.target.value)}
            placeholder="e.g., Select your #1 target among your observations..."
            theme="theme-solarpunk"
          />
        </div>

        {/* Phase 4: Action Pledge */}
        <div className="eco-card p-5 space-y-4 md:col-span-2">
          <div className="flex items-center justify-between border-b border-emerald-800/40 pb-2">
            <span className="text-xs font-black uppercase tracking-wider text-teal-400">
              Phase 4 • Practical Action Pledge
            </span>
            <span className="text-[10px] text-slate-400 font-mono">30 Seconds</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <BespokeInput
              label="Phase 4 Action Question"
              value={currentQuestions.actionPrompt || ''}
              onChange={(e) => handleChange('actionPrompt', e.target.value)}
              placeholder="e.g., What is one realistic first step you could take today?"
              theme="theme-solarpunk"
            />

            <BespokeInput
              label="Phase 4 Action Guidance Helper"
              value={currentQuestions.actionHelper || ''}
              onChange={(e) => handleChange('actionHelper', e.target.value)}
              placeholder="e.g., Make it concrete and achievable..."
              theme="theme-solarpunk"
            />
          </div>
        </div>

      </div>

      {/* Bottom Save Bar */}
      <div className="eco-container p-4 flex items-center justify-between">
        <span className="text-xs text-slate-400">
          Editing language: <strong className="text-emerald-300 uppercase">{activeLang === 'uz' ? "O'zbekcha" : 'English'}</strong>
        </span>

        <button
          type="button"
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-extrabold text-xs text-white shadow-xl transition-all cursor-pointer"
        >
          {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          <span>{saved ? 'Successfully Saved to Survey!' : 'Apply & Save Questions'}</span>
        </button>
      </div>

    </div>
  );
}
