import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import { QrCode, Copy, Check, ExternalLink, Printer, Sparkles } from 'lucide-react';

export default function AttachedQrBadge({ 
  scenarioId, 
  scenarioTitle, 
  customUrl,
  variant = 'compact', // 'compact', 'banner', 'poster'
  onOpenPoster = null
}) {
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copied, setCopied] = useState(false);

  // Compute the URL this QR code points to
  const getAuditUrl = () => {
    if (customUrl) {
      const url = new URL(customUrl, window.location.href);
      url.searchParams.set('scenario', scenarioId);
      return url.toString();
    }
    const currentOrigin = window.location.origin;
    const currentPath = window.location.pathname;
    return `${currentOrigin}${currentPath}?scenario=${scenarioId}`;
  };

  const fullUrl = getAuditUrl();

  useEffect(() => {
    QRCode.toDataURL(fullUrl, {
      width: variant === 'poster' ? 320 : 180,
      margin: 1,
      color: {
        dark: '#06281c', // Deep organic green
        light: '#ffffff'
      },
      errorCorrectionLevel: 'M'
    })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error('QR generation error:', err));
  }, [fullUrl, variant]);

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/95 text-slate-900 shadow-lg border-2 border-emerald-500/40 backdrop-blur-sm">
        {qrDataUrl ? (
          <img 
            src={qrDataUrl} 
            alt={`QR code for ${scenarioTitle}`} 
            className="w-14 h-14 rounded-lg border border-emerald-950/20 object-contain shadow-sm shrink-0" 
          />
        ) : (
          <div className="w-14 h-14 bg-emerald-100 rounded-lg animate-pulse shrink-0" />
        )}
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
              Scan With Phone
            </span>
            <span className="text-[10px] font-bold text-slate-500">60s Audit</span>
          </div>
          <span className="text-xs font-bold text-slate-800 truncate mt-0.5">
            {scenarioTitle}
          </span>
          <div className="flex items-center gap-2 mt-1">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 transition-colors"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy link'}</span>
            </button>
            {onOpenPoster && (
              <button
                onClick={(e) => { e.stopPropagation(); onOpenPoster(); }}
                className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              >
                <Printer className="w-3 h-3" />
                <span>Stand Poster</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Banner variant attached directly beneath a scenario picture
  return (
    <div className="p-4 rounded-3xl bg-white/95 text-slate-900 shadow-xl border-2 border-emerald-600/50 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        {qrDataUrl && (
          <img 
            src={qrDataUrl} 
            alt={`QR Code for ${scenarioTitle}`} 
            className="w-20 h-20 rounded-xl border-2 border-emerald-800/30 shadow-md shrink-0" 
          />
        )}
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-extrabold rounded-full bg-emerald-700 text-white">
              MOBILE READY
            </span>
            <span className="text-xs font-semibold text-emerald-800 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" /> Quick QR Redirect
            </span>
          </div>
          <h4 className="text-base font-bold text-slate-900 mt-1">
            Scan to start "{scenarioTitle}"
          </h4>
          <p className="text-xs text-slate-600 mt-0.5">
            Point phone camera here to launch the 60-second timer and submit audit findings.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition-colors cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Link Copied' : 'Copy Direct URL'}</span>
        </button>

        {onOpenPoster && (
          <button
            onClick={onOpenPoster}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Stand Sign</span>
          </button>
        )}
      </div>
    </div>
  );
}
