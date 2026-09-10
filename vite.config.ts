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
                  dbMod.insertOrUpdateScholarship(item);
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
