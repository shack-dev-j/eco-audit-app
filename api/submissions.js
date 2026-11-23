// Vercel Serverless Function: /api/submissions
// Handles GET (fetch shared submissions), POST (record new audit from any mobile/remote device), DELETE (clear)
// Integrates with persistent GitHub Gist cloud storage + /tmp fallback so submissions persist across serverless instances
import fs from 'node:fs';
import path from 'node:path';

const GIST_ID = process.env.GIST_ID || '393fca3786758541e1ffa25835329483';
const GIST_TOKEN = process.env.GIST_TOKEN || process.env.GITHUB_TOKEN;
const TMP_FILE = path.join('/tmp', 'eco_audit_remote_submissions.json');

// In-memory cache to prevent unnecessary external round-trips
let memoryCache = {
  data: null,
  timestamp: 0
};
const CACHE_TTL_MS = 2500; // 2.5 seconds cache

function loadFromTmp() {
  try {
    if (fs.existsSync(TMP_FILE)) {
      const content = fs.readFileSync(TMP_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Error reading /tmp storage:', err);
  }
  return [];
}

function saveToTmp(data) {
  try {
    fs.writeFileSync(TMP_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Error writing to /tmp storage:', err);
  }
}

async function fetchFromGist() {
  const now = Date.now();
  if (memoryCache.data && (now - memoryCache.timestamp) < CACHE_TTL_MS) {
    return memoryCache.data;
  }

  // 1. Try authenticated GitHub API
  if (GIST_TOKEN) {
    try {
      const response = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
        headers: {
          'Authorization': `Bearer ${GIST_TOKEN}`,
          'User-Agent': 'The-60-Second-Eco-Audit-App',
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      if (response.ok) {
        const gist = await response.json();
        const content = gist.files && gist.files['submissions.json'] && gist.files['submissions.json'].content;
        if (content) {
          const parsed = JSON.parse(content);
          if (Array.isArray(parsed)) {
            memoryCache = { data: parsed, timestamp: Date.now() };
            saveToTmp(parsed);
            return parsed;
          }
        }
      }
    } catch (err) {
      console.warn('Gist API fetch error:', err);
    }
  }

  // 2. Fallback: local /tmp
  const tmpData = loadFromTmp();
  memoryCache = { data: tmpData, timestamp: Date.now() };
  return tmpData;
}

async function saveToGist(submissions) {
  memoryCache = { data: submissions, timestamp: Date.now() };
  saveToTmp(submissions);

  if (!GIST_TOKEN) {
    return false;
  }

  try {
    const response = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${GIST_TOKEN}`,
        'User-Agent': 'The-60-Second-Eco-Audit-App',
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json'
      },
      body: JSON.stringify({
        files: {
          'submissions.json': {
            content: JSON.stringify(submissions, null, 2)
          }
        }
      })
    });
    return response.ok;
  } catch (err) {
    console.warn('Gist API save error:', err);
    return false;
  }
}

async function parseBody(req) {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }
  if (typeof req.body === 'string' && req.body.trim()) {
    try {
      return JSON.parse(req.body);
    } catch (_) {}
  }
  return new Promise((resolve) => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
    });
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : null);
      } catch (e) {
        resolve(null);
      }
    });
    req.on('error', () => resolve(null));
  });
}

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    const current = await fetchFromGist();
    return res.status(200).json({
      success: true,
      count: current.length,
      submissions: current
    });
  }

  if (req.method === 'POST') {
    const payload = await parseBody(req);

    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({ success: false, error: 'Empty or invalid JSON payload' });
    }

    const current = await fetchFromGist();

    const enriched = {
      ...payload,
      id: payload.id || `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      submittedAt: payload.submittedAt || payload.auditTimestamp || new Date().toISOString(),
      origin: payload.origin || 'remote_mobile',
      status: 'synced_remote'
    };

    // Prepend new submission and deduplicate by id
    const updated = [enriched, ...current.filter(item => item && item.id !== enriched.id)];
    await saveToGist(updated);

    // Forward to Google Sheet Webhook if configured in central settings
    try {
      let webhookUrl = 'https://script.google.com/macros/s/AKfycbykoyQc6B2VBfNqWxCQuJmN7zaosKx9GZdT6h4I3Ea-evurK6li0Oo_zfMp-5iPVESc/exec';
      const settingsTmp = path.join('/tmp', 'eco_audit_backend_settings.json');
      if (fs.existsSync(settingsTmp)) {
        const s = JSON.parse(fs.readFileSync(settingsTmp, 'utf-8'));
        if (s && s.googleSheetWebhookUrl) webhookUrl = s.googleSheetWebhookUrl;
      }
      if (webhookUrl && webhookUrl.startsWith('http')) {
        fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(enriched)
        }).catch(() => {});
      }
    } catch (_) {}

    return res.status(201).json({
      success: true,
      submission: enriched
    });
  }

  if (req.method === 'DELETE') {
    await saveToGist([]);
    try {
      if (fs.existsSync(TMP_FILE)) fs.unlinkSync(TMP_FILE);
    } catch (_) {}
    memoryCache = { data: [], timestamp: Date.now() };
    return res.status(200).json({
      success: true,
      count: 0,
      submissions: []
    });
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
