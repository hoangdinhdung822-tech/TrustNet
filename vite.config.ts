import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import { defineConfig } from 'vite';
import type { Plugin } from 'vite';

dotenv.config();

function trustnetApiPlugin(): Plugin {
  return {
    name: 'trustnet-api-server',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const urlPath = req.url ? req.url.split('?')[0].replace(/\/+$/, '') : '';

        // [GET] /api/v1/health
        if (urlPath === '/api/v1/health' && req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            status: 'online',
            system: 'TrustNet Integrated Server Engine',
            aiStatus: 'Operational',
            searchGrounding: 'Enabled (@google/genai)',
            timestamp: new Date().toISOString()
          }));
          return;
        }

        // [POST] /api/v1/fact-check/ping
        if (urlPath === '/api/v1/fact-check/ping' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              const parsed = body ? JSON.parse(body) : {};
              const userApiKey = (req.headers['x-gemini-api-key'] as string) || parsed?.apiKey;
              const apiKey = (userApiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '').trim();
              const model = parsed?.model || process.env.GEMINI_MODEL || 'gemini-3.8-flash';

              if (!apiKey) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                  success: false,
                  message: 'Chưa cấu hình API Key. Vui lòng thêm GEMINI_API_KEY vào .env hoặc nhập trong Cấu hình.'
                }));
                return;
              }

              const { GoogleGenAI } = await import('@google/genai');
              const ai = new GoogleGenAI({ apiKey });

              let discoveredModels: string[] = [];
              try {
                const list = await ai.models.list();
                console.log('=== DISCOVERED MODELS FROM GOOGLE AI STUDIO ===');
                for await (const item of list) {
                  if (item.name) {
                    const cleanName = item.name.replace(/^models\//, '');
                    discoveredModels.push(cleanName);
                    console.log('MODEL:', cleanName);
                  }
                }
              } catch (e: any) {
                console.warn('Could not list models:', e?.message);
              }

              const candidateModels = [
                model,
                ...discoveredModels.filter(m => m.includes('flash')),
                ...discoveredModels.filter(m => !m.includes('flash')),
                'gemini-2.5-flash',
                'gemini-2.0-flash',
                'gemini-1.5-flash',
                'gemini-3.8-flash'
              ].filter(Boolean);
              const uniqueModels = Array.from(new Set(candidateModels));

              let resolvedModel = model;
              let reply = 'Connected';
              let lastPingErr: any = null;
              let pingSuccess = false;

              for (const m of uniqueModels) {
                try {
                  const response = await ai.models.generateContent({
                    model: m,
                    contents: 'Ping test: Hãy trả lời "TrustNet AI Connected" trong 3 từ.'
                  });
                  reply = response.text || 'Connected';
                  resolvedModel = m;
                  pingSuccess = true;
                  break;
                } catch (err: any) {
                  lastPingErr = err;
                  let msg = err?.message || String(err);
                  try {
                    const parsedErr = JSON.parse(msg);
                    if (parsedErr?.error?.message) msg = parsedErr.error.message;
                  } catch {}

                  if (msg.includes('API_KEY_INVALID') || msg.includes('API key not valid')) {
                    throw new Error('Khóa Gemini API Key không hợp lệ hoặc đã bị vô hiệu hóa trên Google AI Studio.');
                  }
                  console.warn(`[Ping] Model ${m} lỗi: ${msg.slice(0, 100)}... Thử model tiếp theo...`);
                  continue;
                }
              }

              if (!pingSuccess) {
                let errorMsg = lastPingErr?.message || String(lastPingErr);
                try {
                  const parsedJson = JSON.parse(errorMsg);
                  if (parsedJson?.error?.message) errorMsg = parsedJson.error.message;
                } catch {}

                if (errorMsg.includes('high demand') || errorMsg.includes('503')) {
                  throw new Error('Mô hình Gemini đang trải qua thời điểm quá tải tạm thời (503 High Demand). Vui lòng thử lại sau giây lát hoặc chọn gemini-2.5-flash.');
                } else if (errorMsg.includes('RESOURCE_EXHAUSTED') || errorMsg.includes('quota') || errorMsg.includes('429')) {
                  throw new Error('Hạn mức truy vấn (Quota) của API Key tạm thời đã hết hoặc bị giới hạn trên AI Studio.');
                } else {
                  throw new Error(errorMsg);
                }
              }

              const isSwitched = resolvedModel !== model;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                success: true,
                message: isSwitched
                  ? `✅ Kết nối thành công với Google ${resolvedModel}! (Lưu ý: ${model} tạm quá tải 503 trên AI Studio, hệ thống đã tự động kết nối qua ${resolvedModel})`
                  : `✅ Kết nối thành công với Google ${resolvedModel}! (${reply.trim()})`,
                resolvedModel
              }));
            } catch (err: any) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                success: false,
                message: `Kết nối thất bại: ${err?.message || err}`
              }));
            }
          });
          return;
        }

        // [POST] /api/v1/fact-check
        if (urlPath === '/api/v1/fact-check' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              const parsed = body ? JSON.parse(body) : {};
              const userApiKey = req.headers['x-gemini-api-key'] as string | undefined;

              const { FactCheckService } = await import('./backend/services/factCheckService.ts');
              const result = await FactCheckService.verifyClaim({
                text: parsed.text || '',
                sourceUrl: parsed.sourceUrl || undefined,
                userApiKey: userApiKey || undefined,
                requestedModel: parsed.model || undefined
              });

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, result }));
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                success: false,
                error: err?.message || 'Lỗi kiểm chứng trên máy chủ.'
              }));
            }
          });
          return;
        }

        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), trustnetApiPlugin()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
});
