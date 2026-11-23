// Vercel Serverless Function: /api/settings
// Persists central backend settings (including Google Sheets Webhook URL) across all connected devices
import fs from 'node:fs';
import path from 'node:path';

const GIST_ID = process.env.GIST_ID || '393fca3786758541e1ffa25835329483';
const GIST_TOKEN = process.env.GIST_TOKEN || process.env.GITHUB_TOKEN;
const TMP_FILE = path.join('/tmp', 'eco_audit_backend_settings.json');

const DEFAULT_SETTINGS = {
  method: 'google_sheets',
  recipientEmail: 'ecology.committee@school.edu',
  formspreeEndpoint: '',
  web3FormsKey: '',
  googleSheetWebhookUrl: 'https://script.google.com/macros/s/AKfycbykoyQc6B2VBfNqWxCQuJmN7zaosKx9GZdT6h4I3Ea-evurK6li0Oo_zfMp-5iPVESc/exec'
};

function readTmp() {
  try {
    if (fs.existsSync(TMP_FILE)) {
      const content = fs.readFileSync(TMP_FILE, 'utf-8');
      return { ...DEFAULT_SETTINGS, ...JSON.parse(content) };
    }
  } catch (_) {}
  return DEFAULT_SETTINGS;
}

function writeTmp(data) {
  try {
    fs.writeFileSync(TMP_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (_) {}
}

async function fetchFromGist() {
  if (GIST_TOKEN) {
    try {
      const res = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
        headers: {
          'Authorization': `Bearer ${GIST_TOKEN}`,
          'User-Agent': 'The-60-Second-Eco-Audit-App',
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      if (res.ok) {
        const gist = await res.json();
        const content = gist.files && gist.files['settings.json'] && gist.files['settings.json'].content;
        if (content) {
          const parsed = JSON.parse(content);
          const merged = { ...DEFAULT_SETTINGS, ...parsed };
          writeTmp(merged);
          return merged;
        }
      }
    } catch (_) {}
  }
  return readTmp();
}

async function saveToGist(settings) {
  writeTmp(settings);
  if (!GIST_TOKEN) return false;
  try {
    await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${GIST_TOKEN}`,
        'User-Agent': 'The-60-Second-Eco-Audit-App',
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json'
      },
      body: JSON.stringify({
        files: {
          'settings.json': { content: JSON.stringify(settings, null, 2) }
        }
      })
    });
    return true;
  } catch (_) {
    return false;
  }
}

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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    const settings = await fetchFromGist();
    return res.status(200).json({ success: true, settings });
  }

  if (req.method === 'POST') {
    const body = await parseBody(req);
    const current = await fetchFromGist();
    const updated = { ...current, ...body, updatedAt: new Date().toISOString() };
    await saveToGist(updated);
    return res.status(200).json({ success: true, settings: updated });
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
