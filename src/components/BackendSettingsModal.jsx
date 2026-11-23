import React, { useState } from 'react';
import { 
  X, Database, Mail, FileSpreadsheet, Check, 
  ExternalLink, Sparkles, Copy, Send, HelpCircle
} from 'lucide-react';
import { getBackendSettings, saveBackendSettings } from '../services/submissionService';
import BespokeInput from './design-system/BespokeInput';
import BespokeButton from './design-system/BespokeButton';

export default function BackendSettingsModal({ isOpen, onClose }) {
  const [settings, setSettings] = useState(getBackendSettings());
  const [saved, setSaved] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    saveBackendSettings(settings);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  const googleAppsScriptCode = `// 1. In your Google Sheet: click Extensions > Apps Script
// 2. Delete any existing code, paste this script, and click "Save"
// 3. Click "Deploy" > "New deployment" > Select type: "Web app"
// 4. Set "Execute as": "Me" & "Who has access": "Anyone"
// 5. Click "Deploy", copy the Web App URL, and paste it into the Admin Panel!

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Auto-create header row if sheet is brand new
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

  const copyScript = () => {
    navigator.clipboard.writeText(googleAppsScriptCode);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="eco-container w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 relative border-2 border-emerald-500/40 bg-slate-900 text-white shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-emerald-800/40 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-400/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white font-serif">
                Free Database & Email Forwarding
              </h3>
              <p className="text-xs text-slate-400">
                Configure where survey audit responses are automatically logged
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content & Methods */}
        <div className="space-y-4">
          
          {/* Method 1: Email Collection (Web3Forms / Formspree) */}
          <div className="p-4 rounded-3xl bg-slate-950/70 border border-emerald-800/40 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <Mail className="w-4 h-4" />
              <span>Free Email Forwarding</span>
            </div>
            <p className="text-xs text-slate-300">
              Every participant submission will be sent directly to your committee's email address.
            </p>

            <BespokeInput
              label="Committee Recipient Email Address"
              type="email"
              placeholder="e.g. eco-committee@myschool.org"
              value={settings.recipientEmail}
              onChange={(e) => setSettings({ ...settings, recipientEmail: e.target.value })}
              icon={Mail}
              theme="solarpunk"
            />

            <BespokeInput
              label="Web3Forms Access Key (Optional — Free from web3forms.com)"
              placeholder="e.g. 1a2b3c4d-5e6f-..."
              value={settings.web3FormsKey}
              onChange={(e) => setSettings({ ...settings, web3FormsKey: e.target.value })}
              theme="solarpunk"
            />
          </div>

          {/* Method 2: Free Google Sheets Webhook */}
          <div className="p-4 rounded-3xl bg-slate-950/70 border border-emerald-800/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>Free Google Sheets Webhook (Direct Live Sync)</span>
              </div>
              <button
                onClick={copyScript}
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-emerald-300 transition-colors cursor-pointer"
              >
                {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedScript ? 'Script Copied' : 'Copy Apps Script'}</span>
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Paste the Web App URL from your Google Sheet below to automatically log each audit response as a new row in your spreadsheet.
            </p>

            <BespokeInput
              label="Google Apps Script Web App URL"
              type="url"
              placeholder="https://script.google.com/macros/s/.../exec"
              value={settings.googleSheetWebhookUrl}
              onChange={(e) => setSettings({ ...settings, googleSheetWebhookUrl: e.target.value })}
              theme="solarpunk"
            />
          </div>

          {/* Method 3: Built-in Offline Local Database */}
          <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-700/30 flex items-start gap-2.5 text-xs text-slate-300">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-emerald-300">Automatic Local Database: </strong>
              Every submission is always saved locally on this device and can be exported as a <strong>.CSV</strong> or <strong>.JSON</strong> spreadsheet at any time from the Facilitator Hub.
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <BespokeButton
            onClick={handleSave}
            theme="solarpunk"
            size="sm"
            icon={saved ? Check : Sparkles}
          >
            {saved ? 'Settings Saved!' : 'Save Database Settings'}
          </BespokeButton>
        </div>

      </div>
    </div>
  );
}
