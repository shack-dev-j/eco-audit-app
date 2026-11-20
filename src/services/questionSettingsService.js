// Question & Prompt Settings Service for The 60-Second Eco-Audit
// Allows Facilitators to edit survey wording, questions, and instructions dynamically.

const QUESTIONS_KEY = 'eco_audit_custom_questions';

export const DEFAULT_QUESTIONS = {
  en: {
    introPrompt: 'Look closely. What could be more sustainable here?',
    introHelper: 'Take a quiet full minute to scan the environment before recording observations.',
    spotPrompt: 'Find as many as you can — spot up to 3 eco-issues.',
    spotHelper: 'Record energy leaks, single-use waste, dripping taps, heat loss, or missing recycling points.',
    prioritizePrompt: 'Which issue would you tackle first, and why?',
    prioritizeHelper: 'Select your #1 target among your observations and state your rationale.',
    actionPrompt: 'What is one realistic first step you could take today?',
    actionHelper: 'Make it concrete and achievable — who needs to be involved, and how soon can it start?',
    agreementStatement: 'I agree to participate in this mindful eco-audit. I will dedicate focused observation to uncover hidden waste and commit to one tangible solution.'
  },
  uz: {
    introPrompt: 'Diqqat bilan qarang. Bu yerda nimalarni yanada tejamkor va barqaror qilish mumkin?',
    introHelper: 'Kuzatuvlarni yozishdan oldin to‘liq 1 daqiqa davomida atrof-muhitni xotirjam ko‘zdan kechiring.',
    spotPrompt: 'Imkon qadar ko‘proq toping — 3 tagacha ekologik muammoni aniqlang.',
    spotHelper: 'Elektr isrofi, bir martalik chiqindilar, tomayotgan jo‘mraklar, issiqlik yo‘qotilishi yoki saralanmagan qutilarni qayd eting.',
    prioritizePrompt: 'Qaysi muammoni birinchi bo‘lib hal qilgan bo‘lardingiz va nima uchun?',
    prioritizeHelper: 'Kuzatuvlaringiz orasidan #1 asosiy maqsadni tanlang va sababini tushuntiring.',
    actionPrompt: 'Bugun qila oladigan bitta aniq va real birinchi qadamingiz nima?',
    actionHelper: 'Aniq va erishsa bo‘ladigan qadam — kimlar jalb qilinadi va qachon boshlanadi?',
    agreementStatement: 'Men ushbu e\'tiborli eko-auditda ishtirok etishga, atrof-muhitdagi isrofgarchiliklarni sinchiklab aniqlashga va bitta amaliy yechim taklif qilishga roziman.'
  }
};

export const getQuestionSettings = () => {
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(QUESTIONS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          en: { ...DEFAULT_QUESTIONS.en, ...(parsed.en || {}) },
          uz: { ...DEFAULT_QUESTIONS.uz, ...(parsed.uz || {}) }
        };
      }
    }
  } catch (_) {}
  return DEFAULT_QUESTIONS;
};

export const saveQuestionSettings = (settings) => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(QUESTIONS_KEY, JSON.stringify(settings));
    }
  } catch (_) {}
};

export const resetQuestionSettings = () => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(QUESTIONS_KEY);
    }
  } catch (_) {}
  return DEFAULT_QUESTIONS;
};
