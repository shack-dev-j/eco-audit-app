import React, { useState } from 'react';
import { 
  BookOpen, CheckSquare, MessageSquare, Download, Users, 
  HelpCircle, Sparkles, ChevronRight, CheckCircle2, ShieldAlert,
  Database, Mail, FileSpreadsheet, Copy, Check, Send
} from 'lucide-react';
import { SCENARIOS, DEBRIEF_QUESTIONS, FACILITATOR_CLOSING_LINE } from '../data/scenarios';
import { getBackendSettings, saveBackendSettings, generateMailtoUrl } from '../services/submissionService';
import BespokeInput from './design-system/BespokeInput';
import BespokeButton from './design-system/BespokeButton';

export default function FacilitatorHub({ 
  currentScenario, 
  submissions = [], 
  onClose = null 
}) {
  const [activeTab, setActiveTab] = useState('answerKey'); // 'answerKey' | 'quickGuide' | 'debrief' | 'submissions' | 'backend'
  const [backendConfig, setBackendConfig] = useState(getBackendSettings());
  const [savedConfig, setSavedConfig] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  const exportSubmissionsCSV = () => {
    if (!submissions.length) return;
    const headers = ['Date', 'Participant', 'Role', 'Email', 'Scenario', 'Top Priority', 'Reason', 'Practical Action', 'Horizon', 'Spotted Count'];
    const rows = submissions.map(s => [
      `"${s.date || ''}"`,
      `"${s.participantName || 'Anonymous'}"`,
      `"${s.participantRole || 'Student'}"`,
      `"${s.participantEmail || ''}"`,
      `"${s.scenarioTitle || ''}"`,
      `"${s.topPriorityTitle || ''}"`,
      `"${(s.priorityReason || '').replace(/"/g, '""')}"`,
      `"${(s.practicalAction || '').replace(/"/g, '""')}"`,
      `"${s.timeToFix || ''}"`,
      s.selectedIssues?.length || 0
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `eco_audit_submissions_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveBackend = (e) => {
    e.preventDefault();
    saveBackendSettings(backendConfig);
    setSavedConfig(true);
    setTimeout(() => setSavedConfig(false), 2000);
  };

  const googleAppsScriptCode = `// 1. In your Google Sheet: click Extensions > Apps Script
// 2. Delete any existing code, paste this script, and click "Save"
// 3. Click "Deploy" > "New deployment" > Select type: "Web app"
// 4. Set "Execute as": "Me" & "Who has access": "Anyone"
// 5. Click "Deploy", copy the Web App URL, and paste it below!

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Timestamp", "Participant Name", "Role", "Scenario", 
      "Venue Zone", "Specific Spot", "Spotted Issues", 
      "Top Priority Target", "Priority Rationale", 
      "Practical Action Pledge", "Resolution Horizon"
    ]);
    sheet.getRange(1, 1, 1, 11).setFontWeight("bold").setBackground("#d4edda");
  }

  var data = JSON.parse(e.postData.contents);
  var issues = data.selectedIssues ? data.selectedIssues.map(function(i){ 
    return typeof i === 'string' ? i : (i.title || ''); 
  }).join('; ') : '';

  sheet.appendRow([
    new Date(),
    data.participantName || 'Anonymous',
    data.participantRole || 'Student',
    data.scenarioTitle || '',
    data.venueCategory || '',
    data.venueSpecificSpot || '',
    issues,
    data.topPriorityTitle || '',
    data.priorityReason || '',
    data.practicalAction || '',
    data.timeToFix || ''
  ]);

  return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({ status: "Eco-Audit Webhook Active" }))
    .setMimeType(ContentService.MimeType.JSON);
}`;

  return (
    <div className="eco-container w-full p-6 sm:p-8 space-y-6 text-slate-100 bg-slate-950/90 border border-emerald-600/40 backdrop-blur-xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-emerald-500/30">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              Facilitator Toolkit & Knowledge Base
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            Official Facilitator Hub
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Guide, Answer Keys, Debriefs & Free Database / Email Integrations.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-slate-900/90 border border-emerald-800/40">
          <button
            onClick={() => setActiveTab('answerKey')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'answerKey' 
                ? 'bg-emerald-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Answer Key
          </button>
          <button
            onClick={() => setActiveTab('quickGuide')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'quickGuide' 
                ? 'bg-emerald-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Quick Guide
          </button>
          <button
            onClick={() => setActiveTab('debrief')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'debrief' 
                ? 'bg-emerald-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Debrief Script
          </button>
          <button
            onClick={() => setActiveTab('submissions')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'submissions' 
                ? 'bg-emerald-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Submissions</span>
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/30 text-[10px] text-emerald-200">
              {submissions.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('backend')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'backend' 
                ? 'bg-emerald-600 text-white shadow-md' 
                : 'text-amber-400 hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Connect DB / Email</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Answer Key (Page 3 of PDF) */}
      {activeTab === 'answerKey' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-600/30 text-xs text-slate-300">
            <strong className="text-emerald-300">Facilitator Note from Guide:</strong> Use this as a guide, not a rigid marking scheme. Praise participants for realistic observations and clear reasoning even if they propose alternative viable solutions.
          </div>

          <div className="overflow-x-auto rounded-2xl border border-emerald-800/40">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-emerald-950 text-emerald-300 uppercase font-bold text-[11px] tracking-wider border-b border-emerald-800/50">
                <tr>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Issue in Scene</th>
                  <th className="p-3.5">Possible Practical Action</th>
                  <th className="p-3.5">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-900/30 bg-slate-900/40">
                {currentScenario.issues.map((issue) => (
                  <tr key={issue.id} className="hover:bg-emerald-950/30 transition-colors">
                    <td className="p-3.5 font-bold text-emerald-400">
                      {issue.category}
                    </td>
                    <td className="p-3.5 font-semibold text-white">
                      {issue.title}
                      <p className="text-[11px] text-slate-400 font-normal mt-0.5">
                        {issue.description}
                      </p>
                    </td>
                    <td className="p-3.5 text-slate-200 font-medium">
                      {issue.practicalAction}
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        issue.severity === 'High' 
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
                          : issue.severity === 'Medium'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {issue.severity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Facilitator Quick Guide (Page 1 of PDF) */}
      {activeTab === 'quickGuide' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="eco-card p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-blue-400 uppercase tracking-wider">Step 1 • 15 Seconds</span>
                <span className="text-xs text-slate-400">Introduction</span>
              </div>
              <h4 className="text-sm font-bold text-white">Introduce the challenge</h4>
              <blockquote className="p-3 rounded-xl bg-blue-950/40 border-l-4 border-blue-400 text-xs sm:text-sm text-blue-200 italic font-serif">
                “Look closely. What could be more sustainable here?”
              </blockquote>
            </div>

            <div className="eco-card p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">Step 2 • 60 Seconds</span>
                <span className="text-xs text-slate-400">Observation</span>
              </div>
              <h4 className="text-sm font-bold text-white">Participants identify issues in the scene</h4>
              <blockquote className="p-3 rounded-xl bg-emerald-950/40 border-l-4 border-emerald-400 text-xs sm:text-sm text-emerald-200 italic font-serif">
                “Find as many as you can.”
              </blockquote>
            </div>

            <div className="eco-card p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-400 uppercase tracking-wider">Step 3 • 30 Seconds</span>
                <span className="text-xs text-slate-400">Prioritization</span>
              </div>
              <h4 className="text-sm font-bold text-white">Participants choose one priority issue</h4>
              <blockquote className="p-3 rounded-xl bg-amber-950/40 border-l-4 border-amber-400 text-xs sm:text-sm text-amber-200 italic font-serif">
                “Which issue would you tackle first, and why?”
              </blockquote>
            </div>

            <div className="eco-card p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-purple-400 uppercase tracking-wider">Step 4 • 30 Seconds</span>
                <span className="text-xs text-slate-400">Action Step</span>
              </div>
              <h4 className="text-sm font-bold text-white">Participants suggest a practical action</h4>
              <blockquote className="p-3 rounded-xl bg-purple-950/40 border-l-4 border-purple-400 text-xs sm:text-sm text-purple-200 italic font-serif">
                “What is one realistic first step?”
              </blockquote>
            </div>

          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-700 text-xs text-slate-300">
            <strong className="text-white">Accessibility & Delivery:</strong> Participants may work individually or in pairs. No running, specialist knowledge or previous preparation is required. Accept different solutions when participants can explain their reasoning.
          </div>
        </div>
      )}

      {/* Tab 3: Debrief Script (Page 3 of PDF) */}
      {activeTab === 'debrief' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {DEBRIEF_QUESTIONS.map((q, idx) => (
              <div key={idx} className="eco-card p-4 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xs uppercase">
                  <HelpCircle className="w-4 h-4" />
                  <span>Debrief Question #{idx + 1}</span>
                </div>
                <h4 className="text-sm sm:text-base font-bold text-white">
                  {q.question}
                </h4>
                <p className="text-xs text-slate-300 bg-slate-950/50 p-2.5 rounded-xl border border-emerald-900/40">
                  <span className="text-emerald-400 font-semibold">Facilitator tip: </span>
                  {q.guidance}
                </p>
              </div>
            ))}
          </div>

          {/* Official Facilitator Closing Line */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 border-2 border-emerald-500/50 shadow-xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-emerald-400">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Official Facilitator Closing Line</span>
            </div>
            <p className="text-base sm:text-lg font-serif italic text-emerald-100 leading-relaxed">
              “{FACILITATOR_CLOSING_LINE}”
            </p>
          </div>
        </div>
      )}

      {/* Tab 4: Submissions Log */}
      {activeTab === 'submissions' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">
              {submissions.length} completed audit cards recorded.
            </span>
            {submissions.length > 0 && (
              <button
                onClick={exportSubmissionsCSV}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-xs font-bold text-white shadow-md transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Export to Excel / CSV</span>
              </button>
            )}
          </div>

          {submissions.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400 text-sm">
              No participant audits submitted yet in this session. Fill in the audit form to see live entries here!
            </div>
          ) : (
            <div className="space-y-3">
              {submissions.map((sub, i) => (
                <div key={i} className="eco-card p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-white text-sm">
                        {sub.participantName || 'Anonymous Participant'}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300">
                        {sub.participantRole || 'Student'}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {sub.date}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                        {sub.scenarioTitle}
                      </span>
                    </div>
                    <div className="text-xs text-slate-300">
                      <strong className="text-amber-400">Top Priority: </strong>
                      <span>{sub.topPriorityTitle}</span>
                    </div>
                    <div className="text-xs text-slate-400 italic">
                      “{sub.practicalAction}”
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <a
                      href={generateMailtoUrl(sub, backendConfig.recipientEmail)}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-emerald-300 border border-emerald-700/40"
                    >
                      Email Report
                    </a>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-800 text-emerald-400 border border-emerald-700/40">
                      {sub.selectedIssues?.length || 0} issues
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Connect Free DB / Google Sheets / Email */}
      {activeTab === 'backend' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <form onSubmit={handleSaveBackend} className="space-y-5">
            
            {/* Email Forwarding Config */}
            <div className="eco-card p-5 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <Mail className="w-4 h-4" />
                <span>1. Free Committee Email Receiving</span>
              </div>
              <p className="text-xs text-slate-300">
                Submissions will be emailed directly to this address.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <BespokeInput
                  label="Committee Email Address"
                  type="email"
                  value={backendConfig.recipientEmail}
                  onChange={(e) => setBackendConfig({ ...backendConfig, recipientEmail: e.target.value })}
                  placeholder="eco-committee@school.org"
                  icon={Mail}
                  theme="solarpunk"
                />

                <BespokeInput
                  label="Web3Forms Access Key (Free instant email gateway)"
                  type="text"
                  value={backendConfig.web3FormsKey}
                  onChange={(e) => setBackendConfig({ ...backendConfig, web3FormsKey: e.target.value })}
                  placeholder="Free key from web3forms.com"
                  theme="solarpunk"
                />
              </div>
            </div>

            {/* Google Sheets Sync Config */}
            <div className="eco-card p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>2. Free Google Sheets Live Sync</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(googleAppsScriptCode);
                    setCopiedScript(true);
                    setTimeout(() => setCopiedScript(false), 2000);
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-emerald-300 cursor-pointer"
                >
                  {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedScript ? 'Script Copied' : 'Copy Apps Script'}</span>
                </button>
              </div>

              <p className="text-xs text-slate-300">
                To log submissions into a Google Sheet in real-time for free: In Google Sheets, click <em>Extensions &gt; Apps Script</em>, paste the copied script, and deploy as a Web App. Paste the resulting URL below:
              </p>

              <div>
                <BespokeInput
                  label="Google Sheets Web App Executable URL"
                  type="url"
                  value={backendConfig.googleSheetWebhookUrl}
                  onChange={(e) => setBackendConfig({ ...backendConfig, googleSheetWebhookUrl: e.target.value })}
                  placeholder="https://script.google.com/macros/s/.../exec"
                  theme="solarpunk"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <BespokeButton
                type="submit"
                theme="solarpunk"
                icon={savedConfig ? Check : Send}
              >
                {savedConfig ? 'Settings Saved!' : 'Save Integration Settings'}
              </BespokeButton>
            </div>

          </form>
        </div>
      )}

    </div>
  );
}
