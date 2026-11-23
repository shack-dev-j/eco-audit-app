import React, { useState, useEffect } from 'react';
import { 
  X, Database, Mail, FileSpreadsheet, Check, 
  ExternalLink, Sparkles, Copy, Send, AlertTriangle, 
  ChevronDown, ChevronUp, Loader2, CheckCircle2
} from 'lucide-react';
import { 
  getBackendSettings, 
  saveBackendSettings, 
  fetchBackendSettings,
  testGoogleSheetWebhook 
} from '../services/submissionService';
import BespokeInput from './design-system/BespokeInput';
import BespokeButton from './design-system/BespokeButton';

export default function BackendSettingsModal({ isOpen, onClose }) {
  const [settings, setSettings] = useState(getBackendSettings());
  const [saved, setSaved] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const [showGoogleGuide, setShowGoogleGuide] = useState(false);
  const [testState, setTestState] = useState({ loading: false, result: null, message: '' });

  // Always refresh settings from server and local storage when modal opens
  useEffect(() => {
    if (isOpen) {
      setSettings(getBackendSettings());
      fetchBackendSettings().then((remote) => {
        if (remote) setSettings(remote);
      });
      setTestState({ loading: false, result: null, message: '' });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    saveBackendSettings(settings);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  const handleTestConnection = async () => {
    if (!settings.googleSheetWebhookUrl || !settings.googleSheetWebhookUrl.trim()) {
      setTestState({
        loading: false,
        result: 'error',
        message: 'Iltimos, avval Google Apps Script Web App havolasini kiriting.'
      });
      return;
    }

    if (settings.googleSheetWebhookUrl.includes('/projects/')) {
      setTestState({
        loading: false,
        result: 'error',
        message: 'Bu Apps Script tahrirlash havolasi (/projects/...). Sizga /exec bilan tugovchi Web App havolasi kerak!'
      });
      return;
    }

    setTestState({ loading: true, result: null, message: 'Google Sheet bilan bog‘lanilmoqda va test qator yuborilmoqda...' });

    // Also auto-save settings so server has it
    saveBackendSettings(settings);

    try {
      const outcome = await testGoogleSheetWebhook(settings.googleSheetWebhookUrl);
      if (outcome && outcome.success) {
        setTestState({
          loading: false,
          result: 'success',
          message: outcome.message || 'Muvaffaqiyatli! Test qator Google Jadvalingizga yozildi. Jadvalingizni tekshiring!'
        });
      } else {
        setTestState({
          loading: false,
          result: 'error',
          message: outcome?.error || 'Ulanishda xatolik yuz berdi. Apps Script deploymentida "Who has access" = "Anyone" qilinganini tekshiring.'
        });
      }
    } catch (err) {
      setTestState({
        loading: false,
        result: 'error',
        message: `Xatolik: ${err.message}`
      });
    }
  };

  const googleAppsScriptCode = `// ==============================================================
// The 60-Second Eco-Audit: Google Apps Script Webhook
// Paste this entire code into Extensions > Apps Script in your Google Sheet!
// ==============================================================

function doPost(e) {
  try {
    // 1. Guard against direct runs or missing body
    if (!e || !e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "error",
        message: "Missing request body (postData)."
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // 2. Auto-create styled header row if sheet is brand new
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp", "Participant Name", "Role", "Scenario", 
        "Venue Zone", "Specific Spot", "Spotted Issues", 
        "Top Priority Target", "Priority Rationale", 
        "Practical Action Pledge", "Resolution Horizon"
      ]);
      sheet.getRange(1, 1, 1, 11).setFontWeight("bold").setBackground("#d4edda");
    }

    // 3. Safe JSON parsing with fallback
    var data = {};
    try {
      data = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "error",
        message: "Invalid JSON payload: " + parseErr.message
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 4. Clean formatting for selected issues
    var issues = "";
    if (data.selectedIssues && Array.isArray(data.selectedIssues)) {
      issues = data.selectedIssues.map(function(item) {
        return typeof item === 'string' ? item : (item.title || item.title_uz || '');
      }).filter(Boolean).join('; ');
    }

    // 5. Append participant audit row
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

    return ContentService.createTextOutput(JSON.stringify({ 
      status: "success", 
      message: "Row successfully appended to Google Sheet" 
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (globalErr) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: globalErr.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({ 
    status: "Eco-Audit Webhook Active",
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

// Built-in test function to test directly inside the Apps Script editor
function testDoPost() {
  var mockEvent = {
    postData: {
      contents: JSON.stringify({
        participantName: "Test Participant",
        participantRole: "Auditor",
        scenarioTitle: "Test Scenario",
        venueCategory: "Classroom",
        venueSpecificSpot: "Sink Area",
        selectedIssues: ["Dripping Faucet"],
        topPriorityTitle: "Fix Faucet Washer",
        priorityReason: "Stops 15L daily water loss",
        practicalAction: "Reported to building supervisor",
        timeToFix: "Immediate"
      })
    }
  };
  var result = doPost(mockEvent);
  Logger.log("doPost response: " + result.getContent());
}`;

  const copyScript = () => {
    navigator.clipboard.writeText(googleAppsScriptCode);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const isEditorUrl = settings.googleSheetWebhookUrl && settings.googleSheetWebhookUrl.includes('/projects/');
  const isValidExecUrl = settings.googleSheetWebhookUrl && settings.googleSheetWebhookUrl.includes('/exec');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="eco-container w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 relative border-2 border-emerald-500/40 bg-slate-900 text-white shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-emerald-800/40 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-400/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white font-serif">
                Database & Google Sheets Webhook
              </h3>
              <p className="text-xs text-slate-400">
                Barcha qurilmalardan javoblarni Google Sheet jadvaliga jonli yozib borish
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content & Methods */}
        <div className="space-y-4">
          
          {/* Method 1: Free Google Sheets Webhook (Primary & Direct) */}
          <div className="p-5 rounded-3xl bg-slate-950/80 border-2 border-emerald-500/50 space-y-4 shadow-lg">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>Google Sheets Jonli Sinxronizatsiya (Web App)</span>
              </div>
              <button
                onClick={copyScript}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 hover:bg-emerald-900/60 text-xs font-semibold text-emerald-300 transition-colors cursor-pointer"
              >
                {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedScript ? 'Nusxalandi!' : 'Kodni Nusxalash'}</span>
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Google Sheet jadvalingizdagi <strong>Extensions &gt; Apps Script</strong> oynasiga ushbu kodni joylashtiring. So‘ng <strong>Deploy &gt; New deployment &gt; Web app</strong> qilib, hosil bo‘lgan <code>/exec</code> havolasini quyidagi maydonga kiriting.
            </p>

            <BespokeInput
              label="Google Apps Script Web App URL (/exec)"
              type="url"
              placeholder="https://script.google.com/macros/s/AKfycb.../exec"
              value={settings.googleSheetWebhookUrl}
              onChange={(e) => {
                setSettings({ ...settings, googleSheetWebhookUrl: e.target.value });
                setTestState({ loading: false, result: null, message: '' });
              }}
              theme="solarpunk"
            />

            {/* URL Validation Warnings */}
            {isEditorUrl && (
              <div className="p-3 rounded-2xl bg-amber-950/60 border border-amber-500/50 flex items-start gap-2.5 text-xs text-amber-200">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong>Diqqat:</strong> Siz Apps Script tahrirlash oynasi havolasini kiritgansiz (<code>/projects/...</code>). 
                  Bu havola ma'lumotlarni qabul qilmaydi. Web App havolasi <strong>/exec</strong> bilan tugashi shart!
                </div>
              </div>
            )}

            {isValidExecUrl && (
              <div className="flex items-center gap-2 text-xs text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Havola formati to‘g‘ri (Web App /exec)</span>
              </div>
            )}

            {/* Test Connection Button & Result */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={handleTestConnection}
                disabled={testState.loading || !settings.googleSheetWebhookUrl}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 text-xs font-bold text-white transition-all shadow-md cursor-pointer disabled:cursor-not-allowed"
              >
                {testState.loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Yuborilmoqda...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Test Qator Yuborish (Test Connection)</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowGoogleGuide(!showGoogleGuide)}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 text-xs font-medium text-slate-300 transition-colors cursor-pointer"
              >
                <span>Google ogohlantirish berdimi?</span>
                {showGoogleGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Test Connection Status Banner */}
            {testState.result === 'success' && (
              <div className="p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-500/50 flex items-start gap-2.5 text-xs text-emerald-200 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong>Muvaffaqiyatli!</strong> {testState.message}
                </div>
              </div>
            )}

            {testState.result === 'error' && (
              <div className="p-3.5 rounded-2xl bg-rose-950/70 border border-rose-500/50 flex items-start gap-2.5 text-xs text-rose-200 animate-in fade-in">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <strong>Xatolik:</strong> {testState.message}
                </div>
              </div>
            )}

            {/* Collapsible Google "Haven't verified this app" Guide */}
            {showGoogleGuide && (
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700/80 space-y-2.5 text-xs text-slate-300 animate-in slide-in-from-top-2">
                <div className="font-bold text-amber-300 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>"Google hasn't verified this app" oynasida nima qilish kerak?</span>
                </div>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-300 pl-1">
                  <li>
                    Oynadagi <strong>"Advanced"</strong> (yoki <strong>"Batafsil"</strong>) tugmasini bosing.
                  </li>
                  <li>
                    Pastda paydo bo‘lgan <strong>"Go to Untitled project (unsafe)"</strong> havolasini bosing.
                  </li>
                  <li>
                    Keyingi oynada <strong>"Allow"</strong> (Ruxsat berish) tugmasini bosing.
                  </li>
                  <li>
                    Deployment yakunlangach, berilgan <strong>Web App URL</strong> havolasini nusxalang va bu yerga qo‘ying.
                  </li>
                  <li className="text-amber-200">
                    <strong>Muhim:</strong> Har safar Apps Script kodini o‘zgartirsangiz: <strong>Deploy &gt; Manage deployments &gt; Edit (qalamcha) &gt; Version: New version &gt; Deploy</strong> qilish kerak!
                  </li>
                </ol>
              </div>
            )}
          </div>

          {/* Method 2: Email Collection (Optional Web3Forms / Formspree) */}
          <div className="p-4 rounded-3xl bg-slate-950/70 border border-emerald-800/40 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <Mail className="w-4 h-4" />
              <span>Qo‘shimcha Email Xabarnomasi (Ixtiyoriy)</span>
            </div>
            <p className="text-xs text-slate-300">
              Har bir audit javobining nusxasini elektron pochtangizga ham jo‘natib turish.
            </p>

            <BespokeInput
              label="Qo‘mita Email Manzili"
              type="email"
              placeholder="e.g. eco-committee@myschool.org"
              value={settings.recipientEmail}
              onChange={(e) => setSettings({ ...settings, recipientEmail: e.target.value })}
              icon={Mail}
              theme="solarpunk"
            />
          </div>

          {/* Method 3: Offline Local Database */}
          <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-700/30 flex items-start gap-2.5 text-xs text-slate-300">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-emerald-300">Avtomatik Markaziy Ma'lumotlar Bazasi: </strong>
              Internet uzilib qolsa ham barcha javoblar saqlanib qoladi va Admin panelidan <strong>.CSV</strong> yoki <strong>.JSON</strong> fayl sifatida istalgan vaqtda yuklab olinadi.
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Yopish (Cancel)
          </button>

          <BespokeButton
            onClick={handleSave}
            theme="solarpunk"
            size="sm"
            icon={saved ? Check : Sparkles}
          >
            {saved ? 'Sozlamalar Saqlandi!' : 'Sozlamalarni Saqlash (Save)'}
          </BespokeButton>
        </div>

      </div>
    </div>
  );
}