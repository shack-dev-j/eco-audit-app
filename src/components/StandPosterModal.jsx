import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { X, Printer, Sparkles, Smartphone, Clock, Target, CheckCircle2 } from 'lucide-react';

export default function StandPosterModal({ scenario, isOpen, onClose, customHostUrl = '' }) {
  const [qrUrl, setQrUrl] = useState('');

  const targetUrl = customHostUrl 
    ? `${customHostUrl}?scenario=${scenario?.id || 'school'}`
    : `${window.location.origin}${window.location.pathname}?scenario=${scenario?.id || 'school'}`;

  useEffect(() => {
    if (!isOpen || !scenario) return;
    QRCode.toDataURL(targetUrl, {
      width: 320,
      margin: 1,
      color: {
        dark: '#06281c',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'H'
    }).then(setQrUrl).catch(console.error);
  }, [isOpen, scenario, targetUrl]);

  if (!isOpen || !scenario) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white print:fixed print:inset-0">
      <div className="relative w-full max-w-4xl bg-white text-slate-900 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl border-4 border-emerald-700/40 print:border-none print:shadow-none print:rounded-none print:p-6">
        
        {/* Close & Action Buttons (Hidden when printing) */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-200 print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-600" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Ecology Committee Official Stand Display Poster
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Poster (A4 / A3)</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Poster Content */}
        <div className="mt-6 text-center space-y-6">
          <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-extrabold uppercase tracking-widest">
            STAND SIGN • INTERACTIVE ACTIVITY
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-emerald-950 tracking-tight">
            CAN YOU SPOT THE PROBLEM?
          </h2>

          <h3 className="text-3xl sm:text-5xl font-black text-emerald-700 tracking-tight font-serif">
            THE 60-SECOND ECO-AUDIT
          </h3>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto font-medium">
            Look at the scene: <strong className="text-slate-900">{scenario.title}</strong>. Find the environmental issues. Choose one priority. Suggest one action.
          </p>

          {/* Three Phases Box matching PDF Guide */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto pt-2">
            <div className="p-4 rounded-2xl bg-blue-50 border-2 border-blue-200 text-blue-950 flex flex-col items-center">
              <Clock className="w-6 h-6 text-blue-600 mb-1" />
              <div className="text-xs font-extrabold uppercase tracking-wider text-blue-800">1 MINUTE</div>
              <div className="text-sm font-bold mt-0.5">Spot the issues</div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-200 text-emerald-950 flex flex-col items-center">
              <Target className="w-6 h-6 text-emerald-600 mb-1" />
              <div className="text-xs font-extrabold uppercase tracking-wider text-emerald-800">30 SECONDS</div>
              <div className="text-sm font-bold mt-0.5">Choose a priority</div>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50 border-2 border-purple-200 text-purple-950 flex flex-col items-center">
              <CheckCircle2 className="w-6 h-6 text-purple-600 mb-1" />
              <div className="text-xs font-extrabold uppercase tracking-wider text-purple-800">30 SECONDS</div>
              <div className="text-sm font-bold mt-0.5">Suggest an action</div>
            </div>
          </div>

          {/* Centerpiece: Attached Scenario QR Code with Instructions */}
          <div className="max-w-xl mx-auto p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-emerald-50 to-teal-50 border-2 border-emerald-400 shadow-inner flex flex-col sm:flex-row items-center justify-center gap-8">
            <div className="p-3 bg-white rounded-2xl shadow-xl border-2 border-emerald-700/20 shrink-0">
              {qrUrl ? (
                <img 
                  src={qrUrl} 
                  alt={`QR Code for ${scenario.title}`}
                  className="w-48 h-48 sm:w-56 sm:h-56 object-contain"
                />
              ) : (
                <div className="w-48 h-48 sm:w-56 sm:h-56 bg-slate-200 animate-pulse rounded-xl" />
              )}
            </div>

            <div className="text-left space-y-3">
              <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-sm uppercase">
                <Smartphone className="w-5 h-5 text-emerald-600" />
                <span>Scan with your phone</span>
              </div>
              <h4 className="text-lg font-bold text-slate-900 leading-snug">
                Join the challenge on your own device!
              </h4>
              <ul className="text-xs sm:text-sm text-slate-600 space-y-1.5 list-disc list-inside">
                <li>Instant 60-second interactive timer</li>
                <li>Tap to spot hidden waste & energy leaks</li>
                <li>Submit your practical action pledge</li>
              </ul>
              <div className="text-[11px] font-mono text-emerald-900 bg-white/80 p-2 rounded-lg border border-emerald-200 break-all select-all">
                {targetUrl}
              </div>
            </div>
          </div>

          {/* Footer Note from PDF */}
          <div className="pt-4 border-t border-slate-200 text-xs text-slate-500 font-semibold flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>OPEN TO EVERYONE • NO EXPERIENCE NEEDED • 2–3 MINUTES PER ROUND</span>
            <span className="italic">Ecology Committee Eco-Audit Initiative</span>
          </div>
        </div>

      </div>
    </div>
  );
}
