import React, { useState, useEffect } from 'react';
import { 
  Users, Search, RefreshCw, ArrowLeft, PlusCircle, 
  MapPin, Clock, Calendar, CheckCircle2, Leaf, 
  Sparkles, Award, Filter, ShieldCheck, ExternalLink
} from 'lucide-react';
import { fetchRemoteSubmissions } from '../services/submissionService';
import { getTranslation } from '../services/localization';
import BespokeButton from './design-system/BespokeButton';

/**
 * CommunityResponsesView:
 * Dedicated public wall where participants can view all submitted eco-audits,
 * spotted environmental hazards, prioritised targets, and practical action pledges.
 * Styled in the organic Warm Linen & Dried Sage Herbarium design system.
 */
export default function CommunityResponsesView({
  onBackToCertificate,
  onStartNewAudit,
  lang = 'uz'
}) {
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [lastRefreshed, setLastRefreshed] = useState(null);

  const isUz = lang === 'uz';

  const loadResponses = async () => {
    setIsLoading(true);
    try {
      const data = await fetchRemoteSubmissions();
      setSubmissions(data || []);
      setLastRefreshed(new Date());
    } catch (err) {
      console.warn('Failed to load community responses:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadResponses();
    // Refresh every 10 seconds for incoming audits
    const interval = setInterval(() => {
      loadResponses();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Filter and search
  const filteredSubmissions = submissions.filter(item => {
    if (!item) return false;

    // Filter by category
    if (selectedFilter !== 'all') {
      const category = (item.venueCategory || item.scenarioTitle || '').toLowerCase();
      if (!category.includes(selectedFilter.toLowerCase())) {
        return false;
      }
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const name = (item.participantName || '').toLowerCase();
      const spot = (item.venueSpecificSpot || '').toLowerCase();
      const venue = (item.venueCategory || item.scenarioTitle || '').toLowerCase();
      const priority = (item.topPriorityTitle || '').toLowerCase();
      const action = (item.practicalAction || '').toLowerCase();
      const reason = (item.priorityReason || '').toLowerCase();
      
      return name.includes(q) || spot.includes(q) || venue.includes(q) || 
             priority.includes(q) || action.includes(q) || reason.includes(q);
    }

    return true;
  });

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500 font-serif text-stone-900 pb-16">
      
      {/* Top Navigation & Action Header */}
      <div className="eco-container p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-400/30 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-800/10 text-emerald-950 border border-emerald-800/20">
              <Users className="w-3.5 h-3.5 text-emerald-800" />
              <span>{isUz ? "Eko-Hamjamiyat Devori" : "Eco-Community Response Wall"}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              {isUz ? "Boshqa Ishtirokchilarning Javoblari" : "Fellow Auditors' Eco-Findings"}
            </h1>
            <p className="text-xs sm:text-sm text-stone-700 italic">
              {isUz 
                ? "Ishtirokchilar tomonidan maktab va hududlarda aniqlangan muammolar, tanlangan ustuvorliklar va amaliy harakat va'dalari."
                : "Explore waste hotspots, top leverage priorities, and actionable commitments submitted by fellow auditors."}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {onBackToCertificate && (
              <BespokeButton
                size="sm"
                onClick={onBackToCertificate}
                theme="theme-herbarium"
                icon={ArrowLeft}
              >
                {isUz ? "Sertifikatimga Qaytish" : "Back to Certificate"}
              </BespokeButton>
            )}

            {onStartNewAudit && (
              <BespokeButton
                size="sm"
                onClick={onStartNewAudit}
                theme="theme-herbarium"
                icon={PlusCircle}
                className="bg-emerald-800 text-white hover:bg-emerald-900"
              >
                {isUz ? "Yangi Audit Boshlash" : "Start New Audit"}
              </BespokeButton>
            )}
          </div>
        </div>

        {/* Stats & Search Toolbar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-2">
          
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isUz ? "Ism, joy, muammo yoki amaliy qadam bo'yicha qidirish..." : "Filter by name, spot, issue, or action pledge..."}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-amber-900/5 border border-stone-400/40 text-xs text-stone-900 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-700 font-sans"
            />
          </div>

          {/* Refresh & Count */}
          <div className="flex items-center justify-between md:justify-end gap-3 text-xs text-stone-700">
            <span className="font-bold">
              {isUz ? `Jami: ${submissions.length} ta audit` : `Total: ${submissions.length} audits`}
            </span>

            <button
              type="button"
              onClick={loadResponses}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-300/40 hover:bg-stone-300/80 text-stone-800 font-bold transition-all cursor-pointer"
              title="Yangilash / Refresh"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-800 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="text-[11px]">{isUz ? "Yangilash" : "Refresh"}</span>
            </button>
          </div>

        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 text-xs no-scrollbar">
          {[
            { id: 'all', labelUz: 'Barcha Hududlar', labelEn: 'All Zones' },
            { id: 'classroom', labelUz: 'Sinfxona', labelEn: 'Classrooms' },
            { id: 'office', labelUz: 'Ofis', labelEn: 'Offices' },
            { id: 'cafeteria', labelUz: 'Oshxona', labelEn: 'Cafeteria' },
            { id: 'lab', labelUz: 'Laboratoriya', labelEn: 'Science Lab' },
            { id: 'library', labelUz: 'Kutubxona', labelEn: 'Library' },
            { id: 'restroom', labelUz: 'Hojatxona', labelEn: 'Restroom' },
            { id: 'gym', labelUz: 'Sport Zali', labelEn: 'Gymnasium' },
            { id: 'computer', labelUz: 'IT Xonasi', labelEn: 'IT Suite' },
            { id: 'garden', labelUz: 'Bog‘ / Yashillik', labelEn: 'Garden' },
            { id: 'grounds', labelUz: 'Hovli / Darvoza', labelEn: 'Grounds' }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedFilter === tab.id
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'bg-amber-900/10 text-stone-700 hover:bg-amber-900/20'
              }`}
            >
              {isUz ? tab.labelUz : tab.labelEn}
            </button>
          ))}
        </div>

      </div>

      {/* Responses Grid */}
      {filteredSubmissions.length === 0 ? (
        <div className="eco-container p-12 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-emerald-900/10 text-emerald-800 inline-flex items-center justify-center mx-auto text-2xl">
            📋
          </div>
          <h3 className="text-lg font-bold text-stone-900">
            {isUz ? "Hozircha mos keluvchi auditlar topilmadi" : "No matching audits found"}
          </h3>
          <p className="text-xs text-stone-600 max-w-md mx-auto">
            {isUz 
              ? "Qidiruv parametrlarini o'zgartiring yoki birinchi bo'lib ushbu hudud bo'yicha eko-auditni yakunlang!"
              : "Try adjusting your search criteria or be the first to conduct an eco-audit for this zone!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredSubmissions.map((sub, idx) => (
            <div 
              key={sub.id || idx}
              className="eco-card p-5 sm:p-6 space-y-4 hover:shadow-lg transition-all border border-stone-400/40 relative flex flex-col justify-between"
            >
              
              <div className="space-y-3">
                {/* Card Topbar: Name, Role, Date */}
                <div className="flex items-start justify-between gap-2 border-b border-stone-400/30 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-black text-stone-900">
                        {sub.participantName || (isUz ? "E'tiborli Auditor" : "Mindful Auditor")}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-800/15 text-emerald-950">
                        {sub.participantRole || (isUz ? "O‘quvchi" : "Student")}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-stone-600 mt-0.5">
                      <span className="flex items-center gap-1 font-semibold text-emerald-900">
                        <MapPin className="w-3 h-3 text-emerald-800" />
                        <span>{sub.venueCategory || sub.scenarioTitle}</span>
                        {sub.venueSpecificSpot && (
                          <span className="text-amber-950 font-bold">• {sub.venueSpecificSpot}</span>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="text-right text-[10px] text-stone-500 whitespace-nowrap">
                    <div>{sub.date || new Date().toISOString().split('T')[0]}</div>
                    <span className="px-1.5 py-0.2 rounded bg-amber-900/10 text-amber-900 font-bold">
                      {sub.language === 'en' ? '🇬🇧 EN' : '🇺🇿 UZ'}
                    </span>
                  </div>
                </div>

                {/* Spotted Issues */}
                {sub.selectedIssues && sub.selectedIssues.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-500 block">
                      {isUz ? "Aniqlangan Muammolar:" : "Spotted Issues:"}
                    </span>
                    <ul className="space-y-1">
                      {sub.selectedIssues.map((issue, i) => (
                        <li key={i} className="text-xs text-stone-800 flex items-start gap-1.5">
                          <Leaf className="w-3 h-3 text-emerald-800 shrink-0 mt-0.5" />
                          <span>{typeof issue === 'string' ? issue : issue.title}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Top Priority Target */}
                <div className="p-3 rounded-xl bg-amber-900/10 border border-stone-400/40 space-y-1">
                  <div className="text-[10px] font-black uppercase tracking-wider text-amber-950 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-900" />
                    <span>{isUz ? "Asosiy Ustuvor Maqsad:" : "Top Priority Target:"}</span>
                  </div>
                  <div className="text-xs sm:text-sm font-black text-stone-900">
                    {sub.topPriorityTitle}
                  </div>
                  {sub.priorityReason && (
                    <p className="text-[11px] text-stone-700 italic">
                      “{sub.priorityReason}”
                    </p>
                  )}
                </div>

                {/* Practical Action Pledge */}
                <div className="p-3 rounded-xl bg-emerald-900/10 border border-emerald-800/30 space-y-1">
                  <div className="text-[10px] font-black uppercase tracking-wider text-emerald-950 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-800" />
                    <span>{isUz ? "Berilgan Amaliy Harakat Va'dasi:" : "Action Pledge:"}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-900 font-medium leading-relaxed">
                    “{sub.practicalAction}”
                  </p>
                </div>
              </div>

              {/* Turnaround Horizon Badge */}
              <div className="pt-3 border-t border-stone-400/30 flex items-center justify-between text-[11px] text-stone-600">
                <span className="font-semibold text-stone-500">
                  {isUz ? "Kutilayotgan muddat:" : "Timeframe:"}
                </span>
                <span className="px-2 py-0.5 rounded-full font-bold bg-amber-900/10 text-amber-950 border border-stone-400/40">
                  {sub.timeToFix || (isUz ? "⚡ Tezkor yechim (< 24 soat)" : "⚡ Quick win (< 24 hrs)")}
                </span>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Bottom Floating Bar */}
      <div className="text-center pt-4">
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="text-xs text-stone-600 hover:text-stone-900 underline font-bold cursor-pointer"
        >
          {isUz ? "▲ Sahifa boshiga qaytish" : "▲ Back to top"}
        </button>
      </div>

    </div>
  );
}
