// Localization Service for The 60-Second Eco-Audit
// Supports English ('en') and Uzbek ('uz')

export const DICTIONARY = {
  en: {
    // Header & Meta
    committeeBadge: 'Ecology Committee',
    title: 'THE 60-SECOND ECO-AUDIT',
    subtitle: 'Spot it. Prioritise it. Solve it.',
    mindfulAuditBadge: 'Mindful Environmental Audit',
    
    // Gate Phase
    targetVenueLabel: 'Target Venue',
    fieldLocationBadge: 'Field Location',
    observationalCount: 'Observational opportunities: {count} eco-hazards',
    previewSceneBtn: 'Preview venue drawing',
    nameLabel: 'Your Name or Auditor Tag',
    namePlaceholder: 'e.g., Alex Rivers, Eco-Committee',
    nameHelper: 'This will be inscribed on your completed Eco-Pledge Certificate.',
    roleLabel: 'Participant Role',
    roles: {
      Student: 'Pupil / Student',
      Teacher: 'Teacher / Staff',
      EcoRep: 'Eco-Representative',
      Visitor: 'Visitor / Facilitator'
    },
    agreementText: 'I agree to participate in this mindful eco-audit. I will dedicate 60 seconds of focused observation to uncover hidden waste and commit to one tangible solution.',
    agreeValidation: 'Please indicate your agreement to proceed with the audit.',
    timerReadyLabel: 'Observation window: 4 minutes of focused audit and writing',
    beginAuditBtn: 'I Agree & Begin Audit ➔',

    // Phase 1: 60s Intro (Staring & Scanning Window)
    phase1Badge: 'Phase 1 of 4 • Spatial Observation & Contemplation',
    phase1DefaultPrompt: 'Look closely. What could be more sustainable here?',
    phase1Helper: 'Take a quiet full minute to scan the environment before recording observations.',
    introTimerRemaining: 'Observational contemplation: {seconds}s remaining',
    readyToRecordBtn: "I'm Ready to Record (4 Min) ➔",

    // Phase 2: 4-Min Spotting & Writing Challenge
    phase2Badge: 'Phase 2 of 4 • 4-Minute Observation & Spotting',
    phase2DefaultPrompt: 'Find as many as you can — spot up to 3 eco-issues.',
    phase2Helper: 'Record energy leaks, single-use waste, dripping taps, heat loss, or missing recycling points.',
    obs1Label: 'Observation #1 (Primary Target)',
    obs1Placeholder: 'e.g., Computer screens & projectors left running overnight',
    obs2Label: 'Observation #2',
    obs2Placeholder: 'e.g., Single-use plastic cutlery and cups in trash bins',
    obs3Label: 'Observation #3',
    obs3Placeholder: 'e.g., Draughty single-glazed windows losing radiator heat',
    quickSpotTitle: 'Quick-Spot Inspiration (Tap to insert):',
    loggedCountText: 'Logged: {count} of 3',
    proceedToPrioritizeBtn: 'Proceed to Prioritise ➔',
    validationNeedOneIssue: 'Please record at least one observation before proceeding.',

    // Phase 3: Prioritise
    phase3Badge: 'Phase 3 of 4 • Prioritisation',
    phase3DefaultPrompt: 'Which issue would you tackle first, and why?',
    phase3Helper: 'Select your #1 target among your observations and state your rationale.',
    selectPriorityLabel: 'Select Your #1 Top Priority:',
    observedItemSubtitle: 'Observed item #{number}',
    activePriorityBadge: '★ #1 Priority',
    optionBadge: 'Option',
    whyPriorityLabel: 'Why is this your #1 priority?',
    whyPriorityPlaceholder: 'e.g., Quick win requiring zero cost, creates immediate habit change, or prevents significant ongoing energy waste.',
    whyPriorityHelper: 'Consider: High impact vs. quick win, feasibility, and school-wide awareness.',
    backToObservationsBtn: 'Back to observations',
    proceedToActionBtn: 'Proceed to Action Pledge ➔',

    // Phase 4: Practical Action
    phase4Badge: 'Phase 4 of 4 • Practical Action Pledge',
    phase4DefaultPrompt: 'What is one realistic first step you could take today?',
    phase4Helper: 'Make it concrete and achievable — who needs to be involved, and how soon can it start?',
    targetedIssueLabel: 'Targeted Issue:',
    actionStepLabel: 'One Realistic First Step',
    actionStepPlaceholder: 'e.g., Create a 2-minute end-of-day checklist and assign an Eco-Monitor to switch off the computer trolley.',
    actionStepHelper: 'Be specific: A small real step beats an ambitious plan that never happens.',
    timeframeLabel: 'Expected Implementation Timeframe',
    timeframeOptions: {
      quick: '⚡ Quick Win (< 24h)',
      week: '📅 1-Week Project',
      policy: '🏛️ Long-Term Policy'
    },
    validationNeedAction: 'Please write one realistic first step you or your group can take.',
    backToPrioritiseBtn: 'Back to prioritisation',
    submitAuditBtn: 'Submit My Eco-Audit ➔',

    // Phase 5: Certificate
    certificateHeader: 'ECOLOGY COMMITTEE CERTIFIED ACTION',
    certificateTitle: '60-Second Eco-Audit Action Pledge',
    certificateDesc: 'This certifies that {name} has observed the environment, identified critical resource leaks, and committed to practical action.',
    envAudited: 'Environment Audited:',
    issuesSpotted: 'Issues Spotted: {count} Eco-Hazards Noted',
    topTargetLabel: 'TOP PRIORITY TARGET:',
    actionPledgeLabel: 'ACTION PLEDGE:',
    printSaveBtn: 'Print / Save Pledge Card',
    viewDebriefBtn: 'View Facilitator Debrief Key',
    auditAnotherBtn: 'Audit Another Scene',
    seeOthersResponsesBtn: "See Others' Responses",
    closeBtn: 'Close',

    // Community Responses Wall
    communityWallTitle: 'Community Eco-Audit Responses',
    communityWallSubtitle: 'Explore environmental findings, priorities, and action pledges submitted by fellow auditors.',
    backToMyCertBtn: 'Back to My Certificate',
    startNewAuditBtn: 'Start New Audit',
    refreshResponsesBtn: 'Refresh Responses',
    searchResponsesPlaceholder: 'Filter by auditor name, spot, issue, or pledge...',
    filterAllScenarios: 'All Zones',
    totalAuditsCount: 'Total Submissions Logged: {count}',
    noResponsesYetTitle: 'No Community Audits Yet',
    noResponsesYetDesc: 'Be the first to complete an eco-audit and share your practical action with everyone!',
    auditorBadge: 'Auditor',
    priorityBadge: 'Top Priority Target',
    actionPledgeBadge: 'Committed Practical Action',
    turnaroundBadge: 'Time Horizon',
    spottedIssuesBadge: 'Spotted Issues',
    submittedAtBadge: 'Submitted',

    // QR & Pre-configured spot
    preConfiguredZoneBadge: 'Pre-configured Audit Zone',
    partSpotLabel: 'Specific Spot / Section:',
    autoPrePopulatedHint: 'Location auto-verified via scanned QR badge'
  },

  uz: {
    // Header & Meta
    committeeBadge: "Ekologiya Qo'mitasi",
    title: '60 SONIYALI EKO-AUDIT',
    subtitle: 'Aniqlang. Saralang. Hal qiling.',
    mindfulAuditBadge: "E'tiborli Ekologik Audit",
    
    // Gate Phase
    targetVenueLabel: 'Audit Obyekti',
    fieldLocationBadge: 'Amaliy Hudud',
    observationalCount: 'Kuzatuv imkoniyatlari: {count} ta ekologik muammo',
    previewSceneBtn: 'Joy rasmini ko\'rish',
    nameLabel: 'Ismingiz yoki Eko-Ishtirokchi Nomi',
    namePlaceholder: 'masalan: Jasur Aliyev, Eko-Guruh',
    nameHelper: "Ushbu ism Eko-Va'da Sertifikatingizga yoziladi.",
    roleLabel: 'Ishtirokchi Maqomi',
    roles: {
      Student: "O'quvchi / Talaba",
      Teacher: "O'qituvchi / Xodim",
      EcoRep: "Eko-Faol / Mas'ul",
      Visitor: 'Mehmon / Kuzatuvchi'
    },
    agreementText: "Men ushbu e'tiborli eko-auditda ishtirok etishga, atrof-muhitdagi isrofgarchiliklarni sinchiklab aniqlashga va bitta aniq amaliy yechim taklif qilishga roziman.",
    agreeValidation: 'Davom etish uchun rozilik bildirish katakchasini belgilang.',
    timerReadyLabel: 'Kuzatuv vaqti: 4 daqiqalik chuqur tahlil va qayd etish',
    beginAuditBtn: 'Roziman va Auditni Boshlash ➔',

    // Phase 1: 60s Intro (Staring & Scanning Window)
    phase1Badge: "1-bosqich (4 tadan) • Muhitni Kuzatish va Tafakkur",
    phase1DefaultPrompt: 'Diqqat bilan qarang. Bu yerda nimalarni yanada tejamkor va barqaror qilish mumkin?',
    phase1Helper: "Kuzatuvlarni yozishdan oldin to'liq 1 daqiqa davomida atrof-muhitni xotirjam ko'zdan kechiring.",
    introTimerRemaining: "Kuzatuv va tafakkur: {seconds}s qoldi",
    readyToRecordBtn: "Yozishga tayyorman (4 Daqiqa) ➔",

    // Phase 2: 4-Min Spotting & Writing Challenge
    phase2Badge: "2-bosqich (4 tadan) • 4-Daqiqali Aniqlash va Yozish",
    phase2DefaultPrompt: "Imkon qadar ko'proq toping — 3 tagacha ekologik muammoni aniqlang.",
    phase2Helper: "Elektr isrofi, bir martalik chiqindilar, tomayotgan jo'mraklar, issiqlik yo'qotilishi yoki saralanmagan qutilarni qayd eting.",
    obs1Label: '1-Kuzatuv (Asosiy Maqsad)',
    obs1Placeholder: "masalan: Kechasi o'chiq xonada yoqiq qolgan kompyuterlar va proyektorlar",
    obs2Label: '2-Kuzatuv',
    obs2Placeholder: 'masalan: Axlat qutisidagi bir martalik plastik idishlar va stakanlar',
    obs3Label: '3-Kuzatuv',
    obs3Placeholder: 'masalan: Batareya issiqligini tashqariga chiqarib yuborayotgan ochiq derazalar',
    quickSpotTitle: "Tezkor Maslahatlar (Bosib qo'shing):",
    loggedCountText: 'Kiritildi: {count} ta (3 tadan)',
    proceedToPrioritizeBtn: "Saralashga O'tish ➔",
    validationNeedOneIssue: 'Davom etish uchun kamida bitta kuzatuvni yozing.',

    // Phase 3: Prioritise
    phase3Badge: "3-bosqich (4 tadan) • Ustuvorlikni Saralash",
    phase3DefaultPrompt: "Qaysi muammoni birinchi bo'lib hal qilgan bo'lardingiz va nima uchun?",
    phase3Helper: "Kuzatuvlaringiz orasidan #1 asosiy maqsadni tanlang va sababini tushuntiring.",
    selectPriorityLabel: 'Asosiy #1 Ustuvor Vazifani Tanlang:',
    observedItemSubtitle: 'Kuzatilgan muammo #{number}',
    activePriorityBadge: '★ #1 Ustuvor',
    optionBadge: 'Variant',
    whyPriorityLabel: 'Nima uchun aynan shu muammo #1 ustuvor vazifa?',
    whyPriorityPlaceholder: "masalan: Hech qanday xarajat talab qilmaydi, darhol odatni o'zgartiradi yoki katta isrofning oldini oladi.",
    whyPriorityHelper: "E'tibor bering: Katta ta'sir, tezkorlik, oson amalga oshirish va umumiy xabardorlik.",
    backToObservationsBtn: 'Orqaga (kuzatuvlarga)',
    proceedToActionBtn: "Amaliy Va'daga O'tish ➔",

    // Phase 4: Practical Action
    phase4Badge: "4-bosqich (4 tadan) • Amaliy Harakat Va'dasi",
    phase4DefaultPrompt: 'Bugun qila oladigan bitta aniq va real birinchi qadamingiz nima?',
    phase4Helper: "Aniq va erishsa bo'ladigan qadam — kimlar jalb qilinadi va qachon boshlanadi?",
    targetedIssueLabel: 'Tanlangan Asosiy Muammo:',
    actionStepLabel: 'Bitta Real Birinchi Qadam',
    actionStepPlaceholder: "masalan: Kun oxirida 2 daqiqalik tekshiruv eslatmasi qo'yish va kompyuterlarni o'chirish uchun navbatchi belgilash.",
    actionStepHelper: "Aniq bo'lsin: Kichik real amaliy qadam, bajarilmaydigan ulkan rejalardan ancha foydali.",
    timeframeLabel: 'Amalga Oshirish Muddatini Belgilang',
    timeframeOptions: {
      quick: '⚡ Tezkor Yechim (< 24 soat)',
      week: '📅 1 Haftalik Reja',
      policy: '🏛️ Uzoq Muddatli Tizim'
    },
    validationNeedAction: 'Iltimos, siz yoki guruhingiz qila oladigan bitta real qadamni yozing.',
    backToPrioritiseBtn: 'Orqaga (saralashga)',
    submitAuditBtn: 'Eko-Auditni Yuborish ➔',

    // Phase 5: Certificate
    certificateHeader: "EKOLOGIYA QO'MITASI TASDIQLAGAN HARAKAT",
    certificateTitle: "60-Soniyali Eko-Audit Harakat Va'dasi",
    certificateDesc: "Ushbu sertifikat {name} atrof-muhitni sinchiklab kuzatib, asosiy isrofgarchiliklarni aniqlagani va amaliy qadam tashlashga va'da berganini tasdiqlaydi.",
    envAudited: 'Audit Qilingan Joy:',
    issuesSpotted: 'Aniqlangan Muammolar: {count} ta eko-isrof qayd etildi',
    topTargetLabel: 'ASOSIY USTUVOR VAZIFA:',
    actionPledgeLabel: "AMALIY HARAKAT VA'DASI:",
    printSaveBtn: 'Sertifikatni Saqlash / Chop Etish',
    viewDebriefBtn: 'Muhokama Savollarini Ko\'rish',
    auditAnotherBtn: 'Boshqa Joyni Audit Qilish',
    seeOthersResponsesBtn: "Boshqalarning Javoblarini Ko'rish",
    closeBtn: 'Yopish',

    // Community Responses Wall
    communityWallTitle: 'Jamiyat Eko-Audit Javoblari',
    communityWallSubtitle: "Boshqa ishtirokchilar tomonidan aniqlangan ekologik muammolar, ustuvorliklar va amaliy harakatlar devori.",
    backToMyCertBtn: 'Mening Sertifikatimga Qaytish',
    startNewAuditBtn: 'Yangi Audit Boshlash',
    refreshResponsesBtn: 'Javoblarni Yangilash',
    searchResponsesPlaceholder: "Ism, joy, muammo yoki va'da bo'yicha qidirish...",
    filterAllScenarios: 'Barcha Hududlar',
    totalAuditsCount: 'Jami Qayd Etilgan Auditlar: {count} ta',
    noResponsesYetTitle: 'Hali Javoblar Mavjud Emas',
    noResponsesYetDesc: "Birinchi bo'lib auditni yakunlang va o'z amaliy harakatingizni boshqalar bilan ulashing!",
    auditorBadge: 'Auditor',
    priorityBadge: 'Asosiy Ustuvor Maqsad',
    actionPledgeBadge: "Amaliy Harakat Va'dasi",
    turnaroundBadge: 'Muddat',
    spottedIssuesBadge: 'Kuzatilgan Muammolar',
    submittedAtBadge: 'Topshirilgan Vaqt',

    // QR & Pre-configured spot
    preConfiguredZoneBadge: 'Oldindan Belgilangan Audit Zonasi',
    partSpotLabel: 'Aniq Hudud / Bo\'lim:',
    autoPrePopulatedHint: 'Joylashuv skanerlangan QR kod orqali avtomatik tasdiqlandi'
  }
};

const LANG_STORAGE_KEY = 'eco_audit_language';

export const getStoredLanguage = () => {
  try {
    if (typeof window !== 'undefined') {
      const urlLang = new URLSearchParams(window.location.search).get('lang');
      if (urlLang && (urlLang === 'uz' || urlLang === 'en')) {
        return urlLang;
      }
      const stored = localStorage.getItem(LANG_STORAGE_KEY);
      if (stored === 'uz' || stored === 'en') return stored;
    }
  } catch (_) {}
  return 'en';
};

export const setStoredLanguage = (lang) => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LANG_STORAGE_KEY, lang);
    }
  } catch (_) {}
};

export const getTranslation = (key, lang = 'uz', interpolations = {}) => {
  const dict = DICTIONARY[lang] || DICTIONARY.uz || DICTIONARY.en;
  let text = dict[key] || DICTIONARY.en[key] || key;
  
  if (typeof text === 'string') {
    Object.entries(interpolations).forEach(([k, v]) => {
      text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
    });
  }
  return text;
};
