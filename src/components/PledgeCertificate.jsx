import React, { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Award, CheckCircle2, Download, RefreshCw, Sparkles, Printer, Share2 } from 'lucide-react';
import { sounds } from '../services/soundEffects';
import BespokeButton from './design-system/BespokeButton';

export default function PledgeCertificate({ 
  formData, 
  scenario, 
  onRestart, 
  onOpenDebrief,
  theme = 'herbarium',
  lang = 'uz' 
}) {
  const certificateRef = useRef(null);
  const isUz = lang === 'uz';

  useEffect(() => {
    sounds.playFanfare();
    // Warm botanical green, gold, terracotta confetti
    confetti({
      particleCount: 75,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#2d4534', '#8b4a32', '#d4af37', '#7a9980', '#e4dcd0']
    });
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const priorityTitle = 
    (typeof formData.topPriority === 'string' && formData.topPriority) ||
    formData.selectedIssues?.find(i => i.id === formData.topPriority)?.title ||
    scenario.issues?.find(i => i.id === formData.topPriority)?.title ||
    (isUz ? 'Atrof-muhit isrofini kamaytirish' : 'Environmental Waste Reduction');

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-500">
      
      {/* Certificate Frame */}
      <div 
        ref={certificateRef}
        className="eco-container p-6 sm:p-10 text-center relative overflow-hidden text-stone-900 shadow-2xl print:bg-white print:text-black print:border-emerald-800"
      >
        {/* Decorative badge */}
        <div className="flex justify-center mb-4">
          <div className="p-4 rounded-full bg-emerald-900/10 border-2 border-emerald-800 text-emerald-900 shadow-xl inline-flex items-center justify-center">
            <Award className="w-12 h-12 text-emerald-800 animate-bounce" />
          </div>
        </div>

        <div className="inline-block px-4 py-1 rounded-full bg-emerald-800/15 border border-emerald-800/30 text-emerald-950 text-xs font-black uppercase tracking-widest mb-2">
          {isUz ? "EKOLOGIYA QO'MITASI TASDIQLAGAN HARAKAT" : 'ECOLOGY COMMITTEE CERTIFIED ACTION'}
        </div>

        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-stone-900 font-serif">
          {isUz ? "60-Soniyali Eko-Audit Harakat Va'dasi" : '60-Second Eco-Audit Action Pledge'}
        </h2>

        <p className="text-xs sm:text-sm text-stone-700 max-w-lg mx-auto mt-2 leading-relaxed">
          {isUz ? (
            <>
              Ushbu sertifikat <strong className="text-emerald-950 underline">{formData.participantName || "E'tiborli Eko-Ishtirokchi"}</strong> atrof-muhitni sinchiklab kuzatib, asosiy isrofgarchiliklarni aniqlagani va amaliy yechimga sodiqligini tasdiqlaydi.
            </>
          ) : (
            <>
              This certifies that <strong className="text-emerald-950 underline">{formData.participantName || 'A Dedicated Changemaker'}</strong> has observed the environment, identified critical resource leaks, and committed to practical action.
            </>
          )}
        </p>

        {/* Audit Details Summary Card */}
        <div className="my-6 p-5 sm:p-6 rounded-2xl bg-amber-900/5 border border-stone-400/40 text-left space-y-4 max-w-xl mx-auto shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-stone-400/30 text-xs">
            <span className="text-stone-600 font-semibold">{isUz ? 'Audit Qilingan Obyekt:' : 'Environment Audited:'}</span>
            <span className="font-bold text-emerald-950">{scenario.title}</span>
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-stone-400/30 text-xs">
            <span className="text-stone-600 font-semibold">{isUz ? 'Aniqlangan Eko-Isroflar:' : 'Issues Spotted:'}</span>
            <span className="font-bold text-stone-900">{formData.selectedIssues?.length || 0} {isUz ? 'ta muammo qayd etildi' : 'Eco-Hazards Noted'}</span>
          </div>

          <div className="space-y-1">
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-amber-900">
              {isUz ? 'ASOSIY USTUVOR VAZIFA:' : 'CHOSEN TOP PRIORITY:'}
            </div>
            <div className="text-sm sm:text-base font-bold text-stone-900">
              {priorityTitle}
            </div>
            {formData.priorityReason && (
              <p className="text-xs text-stone-700 italic">
                “{formData.priorityReason}”
              </p>
            )}
          </div>

          <div className="space-y-1 pt-2 border-t border-stone-400/30">
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-900">
              {isUz ? "SHAXSIY AMALIY HARAKAT VA'DASI:" : 'PERSONAL ACTION COMMITMENT:'}
            </div>
            <div className="p-3 rounded-xl bg-emerald-900/10 border border-emerald-800/30 text-xs sm:text-sm text-stone-900 font-medium">
              “{formData.practicalAction || (isUz ? 'Foydalanilmayotgan elektrni o\'chirish, chiqindini saralash va eko-madaniyatni oshirish.' : 'Turn off unused utilities, sort recyclables properly, and spread eco-awareness.')}”
            </div>
          </div>
        </div>

        {/* Date and Signoff */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-600 border-t border-stone-400/30 max-w-xl mx-auto">
          <span>{isUz ? 'Sana:' : 'Date:'} {formData.date || new Date().toLocaleDateString()}</span>
          <span className="font-serif italic text-emerald-900 mt-1 sm:mt-0">
            {isUz ? "“Aniqlang. Saralang. Hal qiling.”" : "“Spot it. Prioritise it. Solve it.”"}
          </span>
        </div>
      </div>

      {/* Bespoke Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2 print:hidden">
        <BespokeButton
          onClick={handlePrint}
          theme="theme-herbarium"
          icon={Printer}
        >
          {isUz ? "Sertifikatni Saqlash / Chop Etish" : "Print / Save Pledge Card"}
        </BespokeButton>

        {onOpenDebrief && (
          <BespokeButton
            onClick={onOpenDebrief}
            theme="theme-herbarium"
            icon={Sparkles}
          >
            {isUz ? "Muhokama Savollarini Ko'rish" : "View Facilitator Debrief Key"}
          </BespokeButton>
        )}

        <BespokeButton
          onClick={onRestart}
          theme="theme-herbarium"
          icon={RefreshCw}
        >
          {isUz ? "Boshqa Joyni Audit Qilish" : "Audit Another Scene"}
        </BespokeButton>
      </div>

    </div>
  );
}
