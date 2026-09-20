import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { createRequire } from 'node:module'
import path from 'node:path'

const require = createRequire(import.meta.url)

function edvoraAiPlugin(): Plugin {
  return {
    name: 'edvora-ai-api',
    configureServer(server) {
      server.middlewares.use('/api/ai/chat', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        let body = '';
        req.on('data', (chunk: Buffer) => {
          body += chunk.toString();
        });

        req.on('end', async () => {
          try {
            const data = JSON.parse(body || '{}');
            const mod = await server.ssrLoadModule('/src/services/aiKnowledgeEngine.ts');
            const dataMod = await server.ssrLoadModule('/src/data/scholarships.ts');
            const scholarships = dataMod.SCHOLARSHIPS_DATA;

            const {
              mode,
              scholarshipId,
              studentContext,
              matchResult,
              conversation = [],
              language = 'en',
              prompt = '',
              quickKey,
              currentPage = 'home',
            } = data;

            // 1. Try Groq AI (if prompt is provided and not a quickKey action)
            if (prompt && !quickKey) {
              try {
                const groqMod = require(path.resolve(process.cwd(), 'server/groqService.cjs'));
                const targetScholarship = scholarshipId
                  ? scholarships.find(
                      (s: { id: string; slug: string }) =>
                        s.id === scholarshipId || s.slug === scholarshipId
                    )
                  : undefined;

                const groqResult = await groqMod.callGroqChat({
                  prompt,
                  conversation,
                  scholarship: targetScholarship,
                  studentContext,
                  matchResult,
                  language,
                  allScholarships: scholarships,
                });

                if (groqResult && groqResult.message) {
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify(groqResult));
                  return;
                }
              } catch (groqErr) {
                console.warn('[Vite AI API] Groq attempt failed, using fallback engine:', groqErr);
              }
            }

            // 2. Strict server-side scholarship ID validation against trusted dataset
            if (mode === 'scholarship' && scholarshipId) {
              const scholarship = scholarships.find(
                (s: { id: string; slug: string }) => s.id === scholarshipId || s.slug === scholarshipId
              );
              if (scholarship) {
                let payload;
                if (quickKey) {
                  payload = mod.processScholarshipQuickQuestion(
                    quickKey,
                    scholarship,
                    studentContext,
                    matchResult,
                    language
                  );
                } else if (!prompt || prompt.toLowerCase().includes('complete guide')) {
                  payload = mod.generateScholarshipGuide(
                    scholarship,
                    studentContext,
                    matchResult,
                    language
                  );
                } else {
                  payload = mod.generateScholarshipGuide(
                    scholarship,
                    studentContext,
                    matchResult,
                    language
                  );
                }
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(payload));
                return;
              }
            }

            // Global mode
            const payload = mod.processGlobalQuery(prompt, {
              studentAnswers: studentContext,
              currentPage,
              language,
            });

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(payload));
          } catch (err) {
            console.error('API AI Error:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: String(err) }));
          }
        });
      });
    },
  };
}
function edvoraSqlitePlugin(): Plugin {
  return {
    name: 'edvora-sqlite-api',
    configureServer(server) {
      let dbMod: any;
      try {
        dbMod = require(path.resolve(process.cwd(), 'server/db.cjs'));
      } catch (err) {
        console.error('Failed to load server/db.cjs in Vite plugin:', err);
      }

      server.middlewares.use((req, res, next) => {
        const rawUrl = req.url || '';
        const [url] = rawUrl.split('?');

        if (!dbMod) {
          next();
          return;
        }

        // Helper for admin auth header
        const getAuthToken = () => {
          const authHeader = (req.headers['authorization'] as string) || '';
          if (authHeader.startsWith('Bearer ')) {
            return authHeader.slice(7).trim();
          }
          return ((req.headers['x-admin-token'] as string) || '').trim();
        };

        const requireAdmin = () => {
          const token = getAuthToken();
          if (!dbMod.verifyAdminToken(token)) {
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Unauthorized: Valid admin token required' }));
            return false;
          }
          return true;
        };

        // POST /api/admin/login
        if (url === '/api/admin/login' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: Buffer) => {
            body += chunk.toString();
          });
          req.on('end', () => {
            try {
              const { password } = JSON.parse(body || '{}');
              if (dbMod.verifyAdminPassword(password)) {
                const token = dbMod.generateAdminToken();
                dbMod.logActivity('LOGIN', 'admin_session', 'admin', 'Successful admin authentication');
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true, token }));
              } else {
                res.statusCode = 401;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Invalid administrator password' }));
              }
            } catch (err: any) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err?.message || 'Invalid request' }));
            }
          });
          return;
        }

        // GET /api/admin/stats
        if (url === '/api/admin/stats' && req.method === 'GET') {
          if (!requireAdmin()) return;
          try {
            const stats = dbMod.getAdminDashboardStats();
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(stats));
            return;
          } catch (e: any) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: e?.message || 'Database error' }));
            return;
          }
        }

        // GET /api/admin/activity
        if (url === '/api/admin/activity' && req.method === 'GET') {
          if (!requireAdmin()) return;
          try {
            const logs = dbMod.getActivityLogs(30);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(logs));
            return;
          } catch (e: any) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: e?.message || 'Database error' }));
            return;
          }
        }

        // GET /api/admin/categories
        if (url === '/api/admin/categories' && req.method === 'GET') {
          if (!requireAdmin()) return;
          try {
            const cats = dbMod.getCategoriesWithCount();
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(cats));
            return;
          } catch (e: any) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: e?.message || 'Database error' }));
            return;
          }
        }

        // GET /api/database/status
        if (url === '/api/database/status' && req.method === 'GET') {
          try {
            const stats = dbMod.getDatabaseStats();
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(stats));
            return;
          } catch (e: any) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: e?.message || 'Database error' }));
            return;
          }
        }

        // /api/scholarships endpoint
        if (url.startsWith('/api/scholarships')) {
          try {
            const subPath = url.replace('/api/scholarships', '').replace(/^\//, '');

            // DELETE /api/scholarships/:id
            if (req.method === 'DELETE' && subPath) {
              if (!requireAdmin()) return;
              const success = dbMod.deleteScholarship(decodeURIComponent(subPath));
              if (!success) {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Scholarship not found' }));
                return;
              }
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, message: 'Deleted from SQLite database' }));
              return;
            }

            // PATCH /api/scholarships/:id/toggle-feature or toggle-verify
            if (req.method === 'PATCH' && subPath) {
              if (!requireAdmin()) return;
              let body = '';
              req.on('data', (chunk: Buffer) => {
                body += chunk.toString();
              });
              req.on('end', () => {
                try {
                  const payload = JSON.parse(body || '{}');
                  const cleanSub = decodeURIComponent(subPath);

                  if (cleanSub.endsWith('/toggle-feature')) {
                    const targetId = cleanSub.replace('/toggle-feature', '');
                    const updated = dbMod.toggleScholarshipFeature(targetId, Boolean(payload.isFeatured));
                    if (!updated) {
                      res.statusCode = 404;
                      res.end(JSON.stringify({ error: 'Scholarship not found' }));
                      return;
                    }
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(updated));
                    return;
                  }

                  if (cleanSub.endsWith('/toggle-verify')) {
                    const targetId = cleanSub.replace('/toggle-verify', '');
                    const updated = dbMod.toggleScholarshipVerify(targetId, Boolean(payload.isVerified));
                    if (!updated) {
                      res.statusCode = 404;
                      res.end(JSON.stringify({ error: 'Scholarship not found' }));
                      return;
                    }
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(updated));
                    return;
                  }

                  res.statusCode = 400;
                  res.end(JSON.stringify({ error: 'Invalid PATCH action' }));
                } catch (err: any) {
                  res.statusCode = 400;
                  res.end(JSON.stringify({ error: err?.message || 'Invalid JSON' }));
                }
              });
              return;
            }

            if (req.method === 'GET') {
              if (!subPath) {
                const list = dbMod.getAllScholarships();
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(list));
                return;
              } else {
                const single = dbMod.getScholarshipByIdOrSlug(decodeURIComponent(subPath));
                if (!single) {
                  res.statusCode = 404;
                  res.end(JSON.stringify({ error: 'Scholarship not found in SQLite database' }));
                  return;
                }
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(single));
                return;
              }
            }

            if (req.method === 'POST') {
              let body = '';
              req.on('data', (chunk: Buffer) => {
                body += chunk.toString();
              });
              req.on('end', () => {
                try {
                  const item = JSON.parse(body);
                  const token = getAuthToken();
                  const source = dbMod.verifyAdminToken(token) ? 'admin' : 'public_api';
                  dbMod.insertOrUpdateScholarship(item, source);
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ success: true, message: 'Saved to SQLite database' }));
                } catch (err: any) {
                  res.statusCode = 400;
                  res.end(JSON.stringify({ error: err?.message || 'Invalid JSON' }));
                }
              });
              return;
            }
          } catch (err: any) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err?.message || 'Database error' }));
            return;
          }
        }

        next();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    edvoraAiPlugin(),
    edvoraSqlitePlugin(),
  ],
})
