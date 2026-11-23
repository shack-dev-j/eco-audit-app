// Vercel's instances share the configured Gist. Instance-local storage is
// unsuitable here because the next request may reach a different instance.
const gistId = process.env.GIST_ID;
const gistToken = process.env.GIST_TOKEN || process.env.GITHUB_TOKEN;
let pendingWrite = Promise.resolve();

async function gistRequest(method, submissions) {
  if (!gistId || !gistToken) {
    throw new Error('Shared storage requires GIST_ID and GIST_TOKEN.');
  }
  const response = await fetch(`https://api.github.com/gists/${gistId}`, {
    method,
    headers: {
      Authorization: `Bearer ${gistToken}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
      'User-Agent': 'eco-audit-app',
      'Cache-Control': 'no-cache'
    },
    signal: AbortSignal.timeout(5000),
    body: submissions && JSON.stringify({
      files: { 'submissions.json': { content: JSON.stringify(submissions) } }
    })
  });
  if (!response.ok) throw new Error(`Gist request failed (${response.status}).`);
  return response;
}

async function readSubmissions() {
  const gist = await (await gistRequest('GET')).json();
  const file = gist.files?.['submissions.json'];
  if (!file) return [];
  if (file.truncated) throw new Error('The submissions file exceeds the Gist API read limit.');
  const submissions = JSON.parse(file.content);
  if (!Array.isArray(submissions)) throw new Error('Invalid submissions file.');
  return submissions;
}

function writeInOrder(operation) {
  const result = pendingWrite.then(operation);
  pendingWrite = result.catch(() => {});
  return result;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  try {
    if (req.method === 'GET') {
      await pendingWrite;
      const submissions = await readSubmissions();
      return res.status(200).json({ success: true, count: submissions.length, submissions });
    }

    if (req.method === 'POST') {
      let payload;
      try {
        payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      } catch {
        return res.status(400).json({ success: false, error: 'Invalid JSON payload.' });
      }
      if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
        return res.status(400).json({ success: false, error: 'Invalid submission.' });
      }

      const submission = {
        ...payload,
        id: payload.id || crypto.randomUUID(),
        submittedAt: payload.submittedAt || payload.auditTimestamp || new Date().toISOString(),
        origin: payload.origin || 'remote_mobile',
        status: 'synced_remote'
      };
      await writeInOrder(async () => {
        const current = await readSubmissions();
        await gistRequest('PATCH', [submission, ...current.filter(item => item?.id !== submission.id)]);
      });
      return res.status(201).json({ success: true, submission });
    }

    if (req.method === 'DELETE') {
      const adminKey = process.env.ADMIN_CLEAR_KEY;
      if (!adminKey) {
        return res.status(503).json({ success: false, error: 'Clear requires ADMIN_CLEAR_KEY on the server.' });
      }
      if (req.headers.authorization !== `Bearer ${adminKey}`) {
        return res.status(403).json({ success: false, error: 'Incorrect admin clear key.' });
      }
      await writeInOrder(() => gistRequest('PATCH', []));
      return res.status(200).json({ success: true, count: 0, submissions: [] });
    }

    res.setHeader('Allow', 'GET, POST, DELETE');
    return res.status(405).json({ success: false, error: 'Method not allowed.' });
  } catch (error) {
    console.error('Shared submissions storage failed:', error.message);
    return res.status(503).json({ success: false, error: 'Shared storage is unavailable. Please try again.' });
  }
}
