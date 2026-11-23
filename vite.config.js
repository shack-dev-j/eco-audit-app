import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'node:fs'
import path from 'node:path'

/**
 * Custom Vite plugin to handle /api/submissions during development and preview.
 * Allows mobile devices on local Wi-Fi / LAN (e.g. http://192.168.0.203:5173/) to
 * transmit survey submissions directly to the host machine's data/submissions.json file,
 * so the facilitator's Admin Panel (/admin) displays them immediately in real-time.
 */
function submissionApiPlugin() {
  const dataDir = path.resolve(process.cwd(), 'data');
  const dataFile = path.join(dataDir, 'submissions.json');
  const settingsFile = path.join(dataDir, 'settings.json');
  const GIST_ID = process.env.GIST_ID || '393fca3786758541e1ffa25835329483';
  const GIST_TOKEN = process.env.GIST_TOKEN || process.env.GITHUB_TOKEN;

  const defaultSettings = {
    method: 'google_sheets',
    recipientEmail: 'ecology.committee@school.edu',
    formspreeEndpoint: '',
    web3FormsKey: '',
    googleSheetWebhookUrl: ''
  };

  const ensureStorage = () => {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    if (!fs.existsSync(dataFile)) {
      fs.writeFileSync(dataFile, JSON.stringify([]), 'utf-8');
    }
    if (!fs.existsSync(settingsFile)) {
      fs.writeFileSync(settingsFile, JSON.stringify(defaultSettings, null, 2), 'utf-8');
    }
  };

  const readSubmissions = () => {
    try {
      ensureStorage();
      const content = fs.readFileSync(dataFile, 'utf-8');
      const parsed = JSON.parse(content);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  };

  const writeSubmissions = (subs) => {
    ensureStorage();
    fs.writeFileSync(dataFile, JSON.stringify(subs, null, 2), 'utf-8');
  };

  const readSettings = () => {
    try {
      ensureStorage();
      const content = fs.readFileSync(settingsFile, 'utf-8');
      return { ...defaultSettings, ...JSON.parse(content) };
    } catch (e) {
      return defaultSettings;
    }
  };

  const writeSettings = (newSettings) => {
    ensureStorage();
    const merged = { ...readSettings(), ...newSettings };
    fs.writeFileSync(settingsFile, JSON.stringify(merged, null, 2), 'utf-8');
    return merged;
  };

  const forwardToGoogleSheet = (submission, webhookUrl) => {
    if (!webhookUrl || typeof webhookUrl !== 'string' || !webhookUrl.startsWith('http')) return;
    try {
      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission)
      }).catch(err => {
        console.warn('[Vite Google Sheet Forward Warning]:', err.message);
      });
    } catch (err) {
      console.warn('[Vite Google Sheet Forward Exception]:', err.message);
    }
  };

  const syncGistBackground = (subs) => {
    try {
      fetch(`https://api.github.com/gists/${GIST_ID}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${GIST_TOKEN}`,
          'User-Agent': 'The-60-Second-Eco-Audit-DevServer',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          files: { 'submissions.json': { content: JSON.stringify(subs, null, 2) } }
        })
      }).catch(() => {});
    } catch (_) {}
  };

  const handleMiddleware = (req, res, next) => {
    const url = req.url ? req.url.split('?')[0] : '';
    if (!['/api/submissions', '/api/settings', '/api/test-webhook'].includes(url)) {
      return next();
    }

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

    if (req.method === 'OPTIONS') {
      res.statusCode = 204;
      return res.end();
    }

    // --- /api/settings ---
    if (url === '/api/settings') {
      if (req.method === 'GET') {
        const settings = readSettings();
        res.statusCode = 200;
        return res.end(JSON.stringify({ success: true, settings }));
      }
      if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
          try {
            const data = JSON.parse(body || '{}');
            const updated = writeSettings(data);
            res.statusCode = 200;
            return res.end(JSON.stringify({ success: true, settings: updated }));
          } catch (err) {
            res.statusCode = 400;
            return res.end(JSON.stringify({ success: false, error: err.message }));
          }
        });
        return;
      }
    }

    // --- /api/test-webhook ---
    if (url === '/api/test-webhook') {
      if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
          try {
            const parsed = JSON.parse(body || '{}');
            const targetUrl = parsed.url || readSettings().googleSheetWebhookUrl;
            if (!targetUrl || !targetUrl.startsWith('http')) {
              res.statusCode = 400;
              return res.end(JSON.stringify({ success: false, error: 'Havola kiritilmagan yoki noto‘g‘ri formatda.' }));
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
              res.statusCode = 200;
              return res.end(JSON.stringify({ 
                success: true, 
                message: "Test qator Google Jadvalingizga muvaffaqiyatli qo‘shildi!",
                response: text
              }));
            } else {
              res.statusCode = 200;
              return res.end(JSON.stringify({ 
                success: false, 
                error: "Google Apps Script javob qaytardi, ammo xatolik mavjud. 'Who has access' (Kimlar kira oladi) 'Anyone' qilinganini tekshiring.",
                response: text
              }));
            }
          } catch (err) {
            res.statusCode = 200;
            return res.end(JSON.stringify({ 
              success: false, 
              error: `Ulanishda xatolik: ${err.message}` 
            }));
          }
        });
        return;
      }
    }

    // --- /api/submissions ---
    if (url === '/api/submissions') {
      if (req.method === 'GET') {
        const subs = readSubmissions();
        res.statusCode = 200;
        return res.end(JSON.stringify({ success: true, count: subs.length, submissions: subs }));
      }

      if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
          try {
            const item = JSON.parse(body || '{}');
            const subs = readSubmissions();
            const enriched = {
              ...item,
              id: item.id || `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
              submittedAt: item.submittedAt || new Date().toISOString(),
              origin: item.origin || 'remote_mobile',
              status: 'synced_remote'
            };
            const updated = [enriched, ...subs.filter(s => s.id !== enriched.id)];
            writeSubmissions(updated);
            syncGistBackground(updated);

            // Forward to Google Sheet Webhook if configured
            const settings = readSettings();
            if (settings.googleSheetWebhookUrl) {
              forwardToGoogleSheet(enriched, settings.googleSheetWebhookUrl);
            }

            res.statusCode = 201;
            return res.end(JSON.stringify({ success: true, submission: enriched }));
          } catch (err) {
            res.statusCode = 400;
            return res.end(JSON.stringify({ success: false, error: err.message }));
          }
        });
        return;
      }

      if (req.method === 'DELETE') {
        writeSubmissions([]);
        syncGistBackground([]);
        res.statusCode = 200;
        return res.end(JSON.stringify({ success: true, count: 0, submissions: [] }));
      }
    }

    next();
  };

  return {
    name: 'submission-api-plugin',
    configureServer(server) {
      server.middlewares.use(handleMiddleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handleMiddleware);
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    submissionApiPlugin(),
  ],
  server: {
    watch: {
      ignored: ['**/data/**', '**/screenshots/**']
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
  },
})
