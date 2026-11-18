// Vercel Serverless Function: /api/submissions
// Handles GET (fetch shared submissions), POST (record new audit from any mobile/remote device), DELETE (clear)
import fs from 'node:fs';
import path from 'node:path';

const TMP_FILE = path.join('/tmp', 'eco_audit_remote_submissions.json');
let inMemoryStore = [];

function loadStore() {
  try {
    if (fs.existsSync(TMP_FILE)) {
      const content = fs.readFileSync(TMP_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        inMemoryStore = parsed;
        return inMemoryStore;
      }
    }
  } catch (err) {
    console.warn('Error reading /tmp storage:', err);
  }
  return inMemoryStore;
}

function saveStore(data) {
  inMemoryStore = data;
  try {
    fs.writeFileSync(TMP_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Error writing to /tmp storage:', err);
  }
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

  const current = loadStore();

  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      count: current.length,
      submissions: current
    });
  }

  if (req.method === 'POST') {
    let payload = req.body;
    if (typeof payload === 'string') {
      try {
        payload = JSON.parse(payload);
      } catch (e) {
        return res.status(400).json({ success: false, error: 'Malformed JSON payload' });
      }
    }

    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({ success: false, error: 'Empty payload' });
    }

    const enriched = {
      ...payload,
      id: payload.id || `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      submittedAt: payload.submittedAt || new Date().toISOString(),
      origin: 'remote_mobile',
      status: 'synced_remote'
    };

    const updated = [enriched, ...current.filter(item => item.id !== enriched.id)];
    saveStore(updated);

    return res.status(201).json({
      success: true,
      submission: enriched
    });
  }

  if (req.method === 'DELETE') {
    saveStore([]);
    return res.status(200).json({
      success: true,
      count: 0,
      submissions: []
    });
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
