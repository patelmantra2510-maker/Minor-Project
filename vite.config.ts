import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

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
              language = 'en',
              prompt = '',
              quickKey,
              currentPage = 'home',
            } = data;

            // Strict server-side scholarship ID validation against trusted dataset
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

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    edvoraAiPlugin(),
  ],
})
