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
  const ensureStorage = () => {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    if (!fs.existsSync(dataFile)) {
      fs.writeFileSync(dataFile, JSON.stringify([]), 'utf-8');
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

  const handleMiddleware = (req, res, next) => {
    const url = req.url ? req.url.split('?')[0] : '';
    if (url !== '/api/submissions') {
      return next();
    }

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization');

    if (req.method === 'OPTIONS') {
      res.statusCode = 204;
      return res.end();
    }

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
      res.statusCode = 200;
      return res.end(JSON.stringify({ success: true, count: 0, submissions: [] }));
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
