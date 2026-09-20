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

  // Helper for admin auth header
  const getAuthToken = () => {
    const authHeader = req.headers['authorization'] || '';
    if (authHeader.startsWith('Bearer ')) {
      return authHeader.slice(7).trim();
    }
    return req.headers['x-admin-token'] || '';
  };

  const requireAdmin = () => {
    const token = getAuthToken();
    const { verifyAdminToken } = require('./db.cjs');
    if (!verifyAdminToken(token)) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Unauthorized: Valid admin authentication token required' }));
      return false;
    }
    return true;
  };

  // Admin Login Endpoint
  if (urlPath === '/api/admin/login' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        const { password } = JSON.parse(body || '{}');
        const { verifyAdminPassword, generateAdminToken, logActivity } = require('./db.cjs');
        if (verifyAdminPassword(password)) {
          const token = generateAdminToken();
          logActivity('LOGIN', 'admin_session', 'admin', 'Successful admin authentication');
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true, token }));
        } else {
          res.statusCode = 401;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Invalid administrator password' }));
        }
      } catch (err) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // Admin Dashboard Stats Endpoint
  if (urlPath === '/api/admin/stats' && req.method === 'GET') {
    if (!requireAdmin()) return;
    const { getAdminDashboardStats } = require('./db.cjs');
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(getAdminDashboardStats()));
    return;
  }

  // Admin Activity Logs Endpoint
  if (urlPath === '/api/admin/activity' && req.method === 'GET') {
    if (!requireAdmin()) return;
    const { getActivityLogs } = require('./db.cjs');
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(getActivityLogs(30)));
    return;
  }

  // Admin Categories Summary Endpoint
  if (urlPath === '/api/admin/categories' && req.method === 'GET') {
    if (!requireAdmin()) return;
    const { getCategoriesWithCount } = require('./db.cjs');
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(getCategoriesWithCount()));
    return;
  }

  // Database Status
  if (urlPath === '/api/database/status' && req.method === 'GET') {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(getDatabaseStats()));
    return;
  }

  // Scholarships Endpoints
  if (urlPath.startsWith('/api/scholarships')) {
    const sub = urlPath.replace('/api/scholarships', '').replace(/^\//, '');

    // DELETE /api/scholarships/:id
    if (req.method === 'DELETE' && sub) {
      if (!requireAdmin()) return;
      const { deleteScholarship } = require('./db.cjs');
      const success = deleteScholarship(decodeURIComponent(sub));
      if (!success) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Scholarship not found to delete' }));
        return;
      }
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: true, message: 'Scholarship successfully removed from SQLite database' }));
      return;
    }

    // PATCH /api/scholarships/:id/toggle-feature or /toggle-verify
    if (req.method === 'PATCH' && sub) {
      if (!requireAdmin()) return;
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      });
      req.on('end', () => {
        try {
          const payload = JSON.parse(body || '{}');
          const cleanSub = decodeURIComponent(sub);
          const { toggleScholarshipFeature, toggleScholarshipVerify } = require('./db.cjs');

          if (cleanSub.endsWith('/toggle-feature')) {
            const targetId = cleanSub.replace('/toggle-feature', '');
            const updated = toggleScholarshipFeature(targetId, Boolean(payload.isFeatured));
            if (!updated) {
              res.statusCode = 404;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Scholarship not found' }));
              return;
            }
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(updated));
            return;
          }

          if (cleanSub.endsWith('/toggle-verify')) {
            const targetId = cleanSub.replace('/toggle-verify', '');
            const updated = toggleScholarshipVerify(targetId, Boolean(payload.isVerified));
            if (!updated) {
              res.statusCode = 404;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Scholarship not found' }));
              return;
            }
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(updated));
            return;
          }

          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Invalid PATCH action' }));
        } catch (err) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err.message }));
        }
      });
      return;
    }

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
          const token = getAuthToken();
          const { verifyAdminToken } = require('./db.cjs');
          const source = verifyAdminToken(token) ? 'admin' : 'public_api';
          insertOrUpdateScholarship(item, source);
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
