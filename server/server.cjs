const http = require('http');
const {
  getAllScholarships,
  getScholarshipByIdOrSlug,
  insertOrUpdateScholarship,
  getDatabaseStats,
  dbPath,
} = require('./db.cjs');

const PORT = process.env.PORT || 5000;

const server = http.createServer((req, res) => {
  // CORS Headers for cross-origin access
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  const [urlPath] = (req.url || '').split('?');

  // Database Status
  if (urlPath === '/api/database/status' && req.method === 'GET') {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(getDatabaseStats()));
    return;
  }

  // Scholarships Endpoints
  if (urlPath.startsWith('/api/scholarships')) {
    const sub = urlPath.replace('/api/scholarships', '').replace(/^\//, '');

    if (req.method === 'GET') {
      if (!sub) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(getAllScholarships()));
        return;
      } else {
        const item = getScholarshipByIdOrSlug(decodeURIComponent(sub));
        if (!item) {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Scholarship not found in SQLite database' }));
          return;
        }
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(item));
        return;
      }
    }

    if (req.method === 'POST') {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      });
      req.on('end', () => {
        try {
          const item = JSON.parse(body);
          insertOrUpdateScholarship(item);
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true, message: 'Saved to SQLite database' }));
        } catch (err) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err.message }));
        }
      });
      return;
    }
  }

  // AI Chat Endpoint
  if (urlPath === '/api/ai/chat' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', async () => {
      try {
        const data = JSON.parse(body || '{}');
        const { callGroqChat } = require('./groqService.cjs');
        const scholarships = getAllScholarships();
        const targetScholarship = data.scholarshipId
          ? scholarships.find((s) => s.id === data.scholarshipId || s.slug === data.scholarshipId)
          : undefined;

        const groqResult = await callGroqChat({
          prompt: data.prompt,
          conversation: data.conversation || [],
          scholarship: targetScholarship,
          studentContext: data.studentContext,
          matchResult: data.matchResult,
          language: data.language || 'en',
          allScholarships: scholarships,
        });

        if (groqResult) {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(groqResult));
          return;
        }

        res.setHeader('Content-Type', 'application/json');
        res.end(
          JSON.stringify({
            message: 'Edvora AI is ready. How can I help you with scholarships today?',
          })
        );
      } catch (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  res.statusCode = 404;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ error: 'Endpoint not found' }));
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 Edvora SQLite Backend Server running on http://localhost:${PORT}`);
  console.log(`📁 Database File: ${dbPath}`);
  console.log(`======================================================\n`);
});
