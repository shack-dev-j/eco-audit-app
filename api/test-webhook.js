// Vercel Serverless Function: /api/test-webhook
// Sends a live diagnostic test row to the configured Google Apps Script Web App
import fs from 'node:fs';
import path from 'node:path';

const TMP_FILE = path.join('/tmp', 'eco_audit_backend_settings.json');

async function parseBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch (_) { return {}; }
  }
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try { resolve(JSON.parse(body || '{}')); } catch (_) { resolve({}); }
    });
  });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const body = await parseBody(req);
    let targetUrl = body.url;

    if (!targetUrl && fs.existsSync(TMP_FILE)) {
      try {
        const stored = JSON.parse(fs.readFileSync(TMP_FILE, 'utf-8'));
        targetUrl = stored.googleSheetWebhookUrl;
      } catch (_) {}
    }

    if (!targetUrl || typeof targetUrl !== 'string' || !targetUrl.startsWith('http')) {
      return res.status(400).json({ success: false, error: 'Havola kiritilmagan yoki yaroqsiz.' });
    }

    const testPayload = {
      participantName: "Eco-Audit Ulanish Testi",
      participantRole: "Administrator",
      scenarioTitle: "Google Sheet Sinxronizatsiyasi",
      venueCategory: "Nazorat Xonasi",
      venueSpecificSpot: "Asosiy Ekran",
      selectedIssues: ["Webhook Ulanishini Tekshirish"],
      topPriorityTitle: "Jonli Sinxronizatsiya O‘rnatildi",
      priorityReason: "Barcha qurilmalardan javoblar Google Jadvalga tushishini tasdiqlash",
      practicalAction: "Webhook muvaffaqiyatli ulandi va faollashtirildi",
      timeToFix: "Darhol"
    };

    const remoteRes = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testPayload)
    });

    const text = await remoteRes.text();
    if (remoteRes.ok || text.includes('success')) {
      return res.status(200).json({
        success: true,
        message: "Test qator Google Jadvalingizga muvaffaqiyatli qo‘shildi!",
        response: text
      });
    } else {
      return res.status(200).json({
        success: false,
        error: "Google Apps Script javob qaytardi, ammo ruxsat yo‘q. 'Who has access' (Kimlar kira oladi) 'Anyone' qilinganini tekshiring.",
        response: text
      });
    }
  } catch (err) {
    return res.status(200).json({
      success: false,
      error: `Ulanishda xatolik: ${err.message}`
    });
  }
}
