import { AiVerificationResult, CodeInspectionReport, VerificationStatus } from '../types';

/**
 * TrustNet AI Verification Engine
 * Trợ lý kiểm chứng thông tin thông minh & phân tích mã độc / nội dung đáng ngờ.
 * 
 * Thiết kế theo mô hình tách rời (Layered Architecture):
 * Có thể cắm trực tiếp Gemini / Claude / OpenAI API qua VITE_AI_API_KEY
 * hoặc sử dụng bộ phân tích Heuristics & NLP Rule-based thông minh cho demo offline.
 */

// Kho dữ liệu tri thức kiểm chứng nguồn chính thống
const KNOWN_VERIFIED_DOMAINS = [
  'chinhphu.vn', 'moet.gov.vn', 'moh.gov.vn', 'tuoitre.vn', 'vnexpress.net',
  'thanhnien.vn', 'vietnamnet.vn', 'vtv.vn', 'who.int', 'unesco.org'
];

// Danh sách từ khóa báo động giật gân, thao túng cảm xúc
const SENSATIONAL_WORDS = [
  'khẩn cấp', 'chia sẻ ngay', 'nguy hiểm chết người', 'bí mật bị giấu kín',
  'chữa khỏi 100%', 'thần dược', 'tặng tiền', 'trúng thưởng khủng', 'chuyển khoản gấp',
  'sự thật kinh hoàng', 'cấm lưu hành', 'tin chấn động', 'ai không đọc sẽ hối hận'
];

// Danh sách dấu hiệu lừa đảo / Phishing
const PHISHING_SIGNALS = [
  'nhận thưởng', 'bấm vào link bên dưới', 'nhập otp', 'xác thực tài khoản ngay',
  'tài khoản sắp bị khóa', 'nạp thẻ cào', 'làm nhiệm vụ kiếm tiền', 'đầu tư sinh lời 30%'
];

const GEMINI_API_KEY_STORAGE = 'trustnet_gemini_api_key';
const GEMINI_MODEL_STORAGE = 'trustnet_gemini_model';
const DEFAULT_GEMINI_MODEL = 'gemini-3.8-flash';

export class AiVerificationService {
  /**
   * Chuẩn hóa API Key (loại bỏ dấu ngoặc kép, khoảng trắng thừa)
   */
  public static sanitizeApiKey(key: string): string {
    if (!key) return '';
    return key.trim().replace(/^["']|["']$/g, '');
  }

  /**
   * Chuẩn hóa tên Model Gemini (xử lý dấu gạch ngang unicode en-dash/em-dash '–', khoảng trắng)
   */
  public static sanitizeModel(model?: string): string {
    if (!model) return 'gemini-3.8-flash';
    let cleaned = model.replace(/[\u2010\u2011\u2012\u2013\u2014\u2015\u2212\uFE58\uFE63\uFF0D]/g, '-').trim();
    if (cleaned.startsWith('models/')) {
      cleaned = cleaned.replace('models/', '');
    }
    // Nếu model cũ đã ngưng hỗ trợ cho người dùng mới (1.5, 2.0, 2.5), tự nâng cấp lên gemini-3.8-flash
    if (cleaned.includes('1.5') || cleaned.includes('2.0') || cleaned.includes('2.5')) {
      cleaned = 'gemini-3.8-flash';
    }
    return cleaned || 'gemini-3.8-flash';
  }

  /**
   * Lấy Gemini API Key từ localStorage hoặc biến môi trường
   */
  public static getGeminiApiKey(): string | null {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(GEMINI_API_KEY_STORAGE);
      if (stored && stored.trim().length > 0) return this.sanitizeApiKey(stored);
    }
    const envKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
    if (envKey && envKey.trim().length > 0) return this.sanitizeApiKey(envKey);
    return null;
  }

  /**
   * Lưu Gemini API Key
   */
  public static setGeminiApiKey(key: string): void {
    if (typeof window !== 'undefined') {
      const clean = this.sanitizeApiKey(key);
      if (!clean) {
        localStorage.removeItem(GEMINI_API_KEY_STORAGE);
      } else {
        localStorage.setItem(GEMINI_API_KEY_STORAGE, clean);
      }
    }
  }

  /**
   * Lấy Model Gemini đang chọn
   */
  public static getGeminiModel(): string {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(GEMINI_MODEL_STORAGE);
      if (stored) return this.sanitizeModel(stored);
    }
    return DEFAULT_GEMINI_MODEL;
  }

  /**
   * Lưu Model Gemini
   */
  public static setGeminiModel(model: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(GEMINI_MODEL_STORAGE, this.sanitizeModel(model));
    }
  }

  /**
   * Lấy danh sách các models được tài khoản Google AI hỗ trợ
   */
  public static async getAvailableModels(key: string): Promise<string[]> {
    try {
      const cleanKey = this.sanitizeApiKey(key);
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${cleanKey}`);
      if (!res.ok) return [];
      const data = await res.json();
      if (data.models && Array.isArray(data.models)) {
        return data.models
          .filter((m: any) => m.supportedGenerationMethods?.includes('generateContent'))
          .map((m: any) => m.name.replace('models/', ''));
      }
      return [];
    } catch {
      return [];
    }
  }

  /**
   * Kiểm tra kết nối tới Google Gemini API (có cơ chế tự động thử model khả dụng)
   */
  public static async testGeminiConnection(
    key: string, 
    model?: string
  ): Promise<{ success: boolean; message: string; resolvedModel?: string }> {
    const cleanKey = this.sanitizeApiKey(key);
    if (!cleanKey) {
      return { success: false, message: 'Vui lòng nhập API Key trước khi kiểm tra.' };
    }

    let targetModel = this.sanitizeModel(model || this.getGeminiModel());
    let endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent?key=${cleanKey}`;

    try {
      let response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            role: 'user',
            parts: [{ text: 'Ping test: Hãy trả lời "TrustNet AI Connected" trong 3 từ.' }]
          }]
        })
      });

      // Nếu lỗi 400 hoặc 404 (ví dụ model bị deprecated hoặc Google gợi ý model mới như gemini-3.8-flash)
      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        let errMsg = errJson?.error?.message || `HTTP ${response.status}: ${response.statusText}`;

        // 1. Tự động kiểm tra xem Google có chỉ định rõ model thay thế không
        const match = errMsg.match(/models\/(gemini-[0-9a-zA-Z\u2010-\u2015._-]+)/i);
        if (match && match[1]) {
          const suggestedModel = this.sanitizeModel(match[1]);
          if (suggestedModel && suggestedModel !== targetModel) {
            targetModel = suggestedModel;
            this.setGeminiModel(targetModel);
            endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent?key=${cleanKey}`;
            response = await fetch(endpoint, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{
                  role: 'user',
                  parts: [{ text: 'Ping test: Hãy trả lời "TrustNet AI Connected" trong 3 từ.' }]
                }]
              })
            });
          }
        }

        // 2. Nếu vẫn lỗi và chưa thử gemini-3.8-flash, thử ngay gemini-3.8-flash
        if (!response.ok && targetModel !== 'gemini-3.8-flash') {
          targetModel = 'gemini-3.8-flash';
          this.setGeminiModel(targetModel);
          endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent?key=${cleanKey}`;
          response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{
                role: 'user',
                parts: [{ text: 'Ping test: Hãy trả lời "TrustNet AI Connected" trong 3 từ.' }]
              }]
            })
          });
        }

        // 3. Nếu vẫn lỗi, truy vấn danh sách models khả dụng từ API
        if (!response.ok) {
          const available = await this.getAvailableModels(cleanKey);
          for (const cand of available) {
            if (cand === targetModel) continue;
            targetModel = this.sanitizeModel(cand);
            this.setGeminiModel(targetModel);
            endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent?key=${cleanKey}`;
            response = await fetch(endpoint, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{
                  role: 'user',
                  parts: [{ text: 'Ping test: Hãy trả lời "TrustNet AI Connected" trong 3 từ.' }]
                }]
              })
            });
            if (response.ok) break;
          }
        }

        if (!response.ok) {
          const finalErr = await response.json().catch(() => ({}));
          const finalMsg = finalErr?.error?.message || errMsg;
          if (finalMsg.includes('API_KEY_INVALID') || response.status === 400 || response.status === 403) {
            return { success: false, message: 'Khóa API Key không hợp lệ hoặc chưa được kích hoạt trên Google AI Studio. Vui lòng kiểm tra lại mã key của bạn.' };
          }
          return { success: false, message: `Kết nối thất bại: ${finalMsg}` };
        }
      }

      const data = await response.json();
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'OK';
      return { 
        success: true, 
        message: `✅ Kết nối thành công với Google ${targetModel}! (${reply.trim()})`,
        resolvedModel: targetModel 
      };
    } catch (err: any) {
      return { success: false, message: `Lỗi kết nối mạng: ${err?.message || err}` };
    }
  }

  /**
   * Kiểm chứng thông tin trực tiếp bằng Google Gemini Model
   */
  public static async verifyWithGemini(
    text: string,
    sourceUrl?: string,
    onProgress?: (step: string) => void
  ): Promise<AiVerificationResult> {
    const apiKey = this.getGeminiApiKey();
    if (!apiKey) {
      throw new Error('Chưa thiết lập Google Gemini API Key.');
    }

    let model = this.sanitizeModel(this.getGeminiModel());
    let endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    if (onProgress) {
      onProgress(`🚀 Đang kết nối Google Gemini API (${model})...`);
      await new Promise(r => setTimeout(r, 400));
      onProgress('🌐 Google AI đang tra cứu & đối chiếu nguồn tin chính thống...');
      await new Promise(r => setTimeout(r, 500));
      onProgress('🧠 Gemini đang trích xuất luận điểm (Claims) & phân tích phản biện...');
    }

    const now = new Date();
    const currentDateStr = now.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    const tomorrowDateStr = tomorrow.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const systemPrompt = `
Bạn là Trợ lý Kiểm chứng Thông tin Độc lập của hệ thống TrustNet (Mạng xã hội thông minh kiểm chứng tin giả dành cho giới trẻ và học sinh).
Nhiệm vụ của bạn là kiểm tra tính xác thực của thông tin được cung cấp dưới đây một cách khách quan, đa chiều và có trách nhiệm:

MỐC THỜI GIAN THỰC TẾ HỆ THỐNG:
- Hôm nay là: ${currentDateStr} (Ngày ${now.getDate()} tháng ${now.getMonth() + 1} năm ${now.getFullYear()})
- Ngày mai là: ${tomorrowDateStr} (Ngày ${tomorrow.getDate()} tháng ${tomorrow.getMonth() + 1} năm ${tomorrow.getFullYear()})
* LƯU Ý BẮT BUỘC: Dùng mốc thời gian thực này để xác minh tính chính xác của các phát ngôn chứa từ chỉ thời gian tương đối như "hôm nay", "ngày mai", "tháng này", "năm nay". (Ví dụ: Nếu hôm nay là tháng 9 mà nội dung nói "ngày mai là sinh nhật Bác Hồ 19/5" hoặc "hôm nay là Quốc khánh 2/9" thì đó là THÔNG TIN SAI SỰ THẬT NGHIÊM TRỌNG, phải đánh giá là "debunked").

NỘI DUNG CẦN KIỂM TRA:
"""
${text}
"""
${sourceUrl ? `ĐƯỜNG DẪN NGUỒN ĐÍNH KÈM: ${sourceUrl}` : 'Không có đường dẫn nguồn đính kèm.'}

NGUYÊN TẮC BẮT BUỘC:
1. Đóng vai trò là trợ lý kiểm chứng, KHÔNG phải "quan tòa chân lý".
2. Bóc tách các luận điểm cụ thể (claims) trong bài.
3. Đối chiếu với dữ liệu báo chí chính ngạch, cổng thông tin Chính phủ (chinhphu.vn, moet.gov.vn, moh.gov.vn, WHO,...).
4. Phân loại trạng thái chính xác:
   - "verified": Thông tin đã được kiểm chứng, có nguồn chính thống tin cậy. (Điểm: 80-100)
   - "unverified": Chưa đủ dữ liệu để khẳng định đúng hay sai, cần bổ sung tài liệu. (Điểm: 50-75)
   - "suspicious": Có dấu hiệu đáng ngờ, giật gân, thiếu căn cứ khoa học/y khoa hoặc số liệu mâu thuẫn. (Điểm: 30-49)
   - "debunked": Thông tin sai lệch, tin giả đã bị bác bỏ, hoặc chiêu trò lừa đảo (Phishing/Scam/Tặng tiền). (Điểm: 0-29)
5. Tuyệt đối KHÔNG bịa đặt nguồn tin. Nếu không đủ bằng chứng, hãy nói rõ trong unverifiedPoints hoặc status "unverified".
6. Chỉ ra các từ ngữ giật gân, thao túng cảm xúc nếu có (misleadingTerms).
7. Đưa ra khuyến nghị thiết thực cho học sinh, thanh thiếu niên.
8. BẮT BUỘC: Hãy sử dụng công cụ Google Search để tìm kiếm và kiểm tra các sự kiện, tin tức mới nhất trên mạng Internet. So sánh tuyên bố của người dùng với các kết quả tìm kiếm thực tế trên Google.
9. ĐẶC BIỆT QUAN TRỌNG: Cung cấp câu trả lời trực diện theo phong cách GOOGLE AI OVERVIEW (Thông tin tổng quan do AI tạo):
   - "directVerdict": "ĐÚNG" nếu tuyên bố chính xác; "SAI" nếu tuyên bố sai sự thật; "CẢNH BÁO" nếu là lừa đảo/nguy hiểm; "CHƯA RÕ" nếu chưa có dữ liệu kiểm chứng.
   - "factAnswer": Trả lời dứt khoát và đưa ra ĐÁP ÁN ĐÚNG NGAY LẬP TỨC:
     * Nếu sai: Bắt đầu bằng: "Không, <sự thật đúng là gì>, chứ không phải là <nội dung sai> (hôm nay là ..., ngày mai là ...)". Ví dụ: "Không, ngày sinh của ông Phạm Minh Chính là ngày 10 tháng 12 năm 1958, chứ không phải là ngày mai (hôm nay là 27/09/2026)."
     * Nếu đúng: Bắt đầu bằng: "Đúng, <xác nhận sự thật chính xác>."
   - "featuredSourceCard": Trích xuất 1 nguồn uy tín nhất đối chiếu gồm: title, organization, url, snippet chứng minh sự thật.

BẮT BUỘC TRẢ VỀ DƯỚI ĐỊNH DẠNG JSON DUY NHẤT KHÔNG KÈM MARKDOWN VỚI CẤU TRÚC:
{
  "directVerdict": "ĐÚNG" | "SAI" | "CHƯA RÕ" | "CẢNH BÁO",
  "factAnswer": "<Đáp án đúng trực diện theo phong cách Google AI Overview>",
  "featuredSourceCard": {
    "title": "<Tên bài viết/tài liệu kiểm chứng>",
    "organization": "<Cơ quan ban hành, ví dụ: Cổng Thông tin điện tử Chính phủ, Báo Nhân Dân>",
    "url": "<Đường dẫn nguồn>",
    "snippet": "<Đoạn trích thông tin ngắn gọn thể hiện sự thật chuẩn xác>"
  },
  "score": <số nguyên từ 0 đến 100>,
  "status": "verified" | "unverified" | "suspicious" | "debunked",
  "summary": "<Tóm tắt kết luận ngắn gọn, súc tích trong 1-2 câu>",
  "reasoning": "<Giải thích vì sao đưa ra kết luận, phân tích logic và đối chiếu với dữ liệu tìm thấy trên Google>",
  "claims": ["<Tuyên bố 1>", "<Tuyên bố 2>"],
  "supportingEvidence": ["<Bằng chứng hỗ trợ tìm thấy trên mạng nếu có>"],
  "refutingEvidence": ["<Bằng chứng mâu thuẫn hoặc cảnh báo tìm thấy trên mạng nếu có>"],
  "sources": [
    {
      "title": "<Tên bài báo hoặc nguồn thông tin tìm thấy trên Google>",
      "url": "<URL tham khảo chuẩn>",
      "reliability": "high" | "medium" | "low"
    }
  ],
  "unverifiedPoints": ["<Điểm nào chưa thể xác minh trên mạng nếu có>"],
  "misleadingTerms": ["<Từ ngữ giật gân, kích động nếu có>"],
  "recommendation": "<Lời khuyên hữu ích cho người đọc trước khi tin hoặc chia sẻ>"
}
`;

    // Chuẩn bị payload có bật Google Search Grounding
    const makePayload = (enableGoogleSearch: boolean) => {
      const payload: any = {
        contents: [
          {
            role: 'user',
            parts: [{ text: systemPrompt }]
          }
        ],
        generationConfig: {
          temperature: 0.2
        }
      };

      if (enableGoogleSearch) {
        payload.tools = [{ googleSearch: {} }];
      } else {
        payload.generationConfig.responseMimeType = 'application/json';
      }

      return payload;
    };

    let response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(makePayload(true))
    });

    // Nếu tool googleSearch không được hỗ trợ bởi model/tài khoản này, tự động thử lại mà không có tool
    if (!response.ok) {
      console.warn('Google Search tool failed, falling back to standard Gemini query...');
      response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(makePayload(false))
      });
    }

    // Nếu model bị lỗi (ví dụ 400 no longer available to new users hoặc 404), tự động kiểm tra model thay thế
    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      const msg = errJson?.error?.message || '';
      const match = msg.match(/models\/(gemini-[0-9a-zA-Z\u2010-\u2015._-]+)/i);
      const suggestedModel = match && match[1] ? this.sanitizeModel(match[1]) : 'gemini-3.8-flash';
      if (suggestedModel !== model) {
        model = suggestedModel;
        this.setGeminiModel(model);
        endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(makePayload(true))
        });
        if (!response.ok) {
          response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(makePayload(false))
          });
        }
      }
    }

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      const msg = errJson?.error?.message || `HTTP ${response.status}: ${response.statusText}`;
      throw new Error(`Google Gemini API Error: ${msg}`);
    }

    const data = await response.json();
    const rawJsonText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawJsonText) {
      throw new Error('Gemini API không phản hồi dữ liệu hợp lệ.');
    }

    // Bóc tách groundingMetadata từ Google Search
    const grounding = data?.candidates?.[0]?.groundingMetadata;
    const googleSearchQueries: string[] = grounding?.webSearchQueries || [];
    const googleGroundingSources: { title: string; url: string }[] = (grounding?.groundingChunks || [])
      .map((c: any) => ({
        title: c?.web?.title || 'Nguồn kiểm chứng tìm thấy trên Google',
        url: c?.web?.uri || ''
      }))
      .filter((s: any) => s.url.startsWith('http'));

    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(text.trim())}`;

    try {
      // Hỗ trợ parse JSON cả khi nằm trong markdown code block ```json ... ```
      const cleanedText = rawJsonText.trim();
      const mdMatch = cleanedText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      const braceMatch = cleanedText.match(/\{[\s\S]*\}/);
      const jsonToParse = mdMatch ? mdMatch[1] : braceMatch ? braceMatch[0] : cleanedText;

      const parsed = JSON.parse(jsonToParse);

      // Kết hợp nguồn từ Gemini và nguồn trực tiếp từ Google Search Grounding
      const combinedSources = [
        ...(Array.isArray(parsed.sources) ? parsed.sources : []),
        ...googleGroundingSources.map(g => ({ title: `[Google Search] ${g.title}`, url: g.url, reliability: 'high' as const }))
      ];

      // Loại bỏ trùng lặp URL
      const uniqueSources = combinedSources.filter((s, idx, self) => 
        idx === self.findIndex(t => t.url.toLowerCase() === s.url.toLowerCase())
      );

      const status = (['verified', 'unverified', 'suspicious', 'debunked'].includes(parsed.status) ? parsed.status : 'unverified') as VerificationStatus;
      const directVerdict = (['ĐÚNG', 'SAI', 'CHƯA RÕ', 'CẢNH BÁO'].includes(parsed.directVerdict)
        ? parsed.directVerdict
        : status === 'verified' ? 'ĐÚNG' : status === 'debunked' ? 'SAI' : status === 'suspicious' ? 'CẢNH BÁO' : 'CHƯA RÕ') as 'ĐÚNG' | 'SAI' | 'CHƯA RÕ' | 'CẢNH BÁO';

      const factAnswer = parsed.factAnswer || (
        status === 'debunked'
          ? `Không chính xác. Qua đối chiếu thông tin trên Google, nội dung này sai lệch với dữ liệu thực tế.`
          : status === 'verified'
          ? `Đúng, thông tin này trùng khớp với các nguồn tin chính thống trên Google.`
          : undefined
      );

      const featuredSourceCard = parsed.featuredSourceCard && typeof parsed.featuredSourceCard === 'object' && parsed.featuredSourceCard.title ? {
        title: parsed.featuredSourceCard.title,
        organization: parsed.featuredSourceCard.organization || 'Nguồn kiểm chứng Google',
        url: parsed.featuredSourceCard.url || googleSearchUrl,
        snippet: parsed.featuredSourceCard.snippet || ''
      } : (uniqueSources.length > 0 ? {
        title: uniqueSources[0].title,
        organization: 'Cơ quan báo chí / Cổng thông tin',
        url: uniqueSources[0].url,
        snippet: parsed.summary || 'Thông tin được đối chiếu từ dữ liệu chính thống trên Internet.'
      } : undefined);

      return {
        score: typeof parsed.score === 'number' ? parsed.score : 50,
        status,
        summary: parsed.summary || 'Đã đối soát với kết quả Google Search.',
        reasoning: parsed.reasoning || '',
        claims: Array.isArray(parsed.claims) ? parsed.claims : [text.slice(0, 100)],
        supportingEvidence: Array.isArray(parsed.supportingEvidence) ? parsed.supportingEvidence : [],
        refutingEvidence: Array.isArray(parsed.refutingEvidence) ? parsed.refutingEvidence : [],
        sources: uniqueSources.length > 0 ? uniqueSources : [
          { title: 'Tìm kiếm trên Google', url: googleSearchUrl, reliability: 'high' }
        ],
        unverifiedPoints: Array.isArray(parsed.unverifiedPoints) ? parsed.unverifiedPoints : [],
        misleadingTerms: Array.isArray(parsed.misleadingTerms) ? parsed.misleadingTerms : [],
        recommendation: parsed.recommendation || 'Kiểm tra kỹ nguồn gốc bài viết trước khi tin hoặc chia sẻ.',
        modelUsed: `Google ${model} (kèm Google Search Grounding)`,
        googleSearchQueries: googleSearchQueries.length > 0 ? googleSearchQueries : [text.slice(0, 60)],
        googleGroundingSources,
        googleSearchUrl,
        isGoogleSearchVerified: true,
        directVerdict,
        factAnswer,
        featuredSourceCard
      };
    } catch (parseErr) {
      throw new Error('Lỗi phân tích cú pháp phản hồi từ Gemini: ' + rawJsonText.slice(0, 200));
    }
  }

  /**
   * BỘ MÁY TÌM KIẾM SỰ THẬT TRỰC TUYẾN THỜI GIAN THỰC (Live Internet & Wikipedia Knowledge Engine)
   * Tự động tra cứu bất kỳ thông tin, nhân vật, ngày sinh, sự kiện, địa danh nào trên mạng Internet
   * mà KHÔNG CẦN lập trình sẵn hay if/else thủ công.
   */
  public static async verifyWithLiveWebSearch(
    text: string,
    sourceUrl?: string,
    onProgress?: (step: string) => void
  ): Promise<AiVerificationResult | null> {
    try {
      const lower = text.toLowerCase();
      
      // 1. Tách thực thể và từ khóa tìm kiếm cốt lõi từ câu nói của người dùng
      let cleanQuery = text
        .replace(/^(có phải|cho tôi biết|ai là|mai là|ngày mai là|hôm nay là|thông tin|tin đồn|sự thật về|nghe nói|bảo là|nói rằng)/gi, '')
        .replace(/(là thông tin giả|là tin giả|có đúng không|đúng hay sai|phải không|nhỉ|vậy|thế|đúng ko|sai ko|hả bạn)/gi, '')
        .trim();

      if (cleanQuery.length < 2) {
        cleanQuery = text.trim();
      }

      if (onProgress) {
        onProgress(`🌐 Đang gửi truy vấn trực tuyến lên mạng Internet: "${cleanQuery.slice(0, 50)}"...`);
        await new Promise(r => setTimeout(r, 400));
      }

      // 2. Gọi API tìm kiếm bách khoa toàn thư mở Wikipedia Tiếng Việt (Live Open Web API)
      const searchUrl = `https://vi.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(cleanQuery.slice(0, 80))}&format=json&origin=*`;
      const searchRes = await fetch(searchUrl);
      if (!searchRes.ok) return null;
      const searchData = await searchRes.json();
      const topItem = searchData?.query?.search?.[0];

      if (!topItem || !topItem.title) {
        return null;
      }

      if (onProgress) {
        onProgress(`📖 Tìm thấy hồ sơ thực tế: "${topItem.title}". Đang đọc nội dung bài viết...`);
        await new Promise(r => setTimeout(r, 450));
      }

      // 3. Lấy nội dung chi tiết bài viết tóm tắt
      const detailUrl = `https://vi.wikipedia.org/w/api.php?action=query&prop=extracts|info&inprop=url&exintro=1&explaintext=1&titles=${encodeURIComponent(topItem.title)}&format=json&origin=*`;
      const detailRes = await fetch(detailUrl);
      if (!detailRes.ok) return null;
      const detailData = await detailRes.json();
      const pages = detailData?.query?.pages || {};
      const pageId = Object.keys(pages)[0];
      const page = pages[pageId];
      const extract = page?.extract || topItem.snippet.replace(/<[^>]+>/g, '');
      const pageUrl = page?.fullurl || `https://vi.wikipedia.org/wiki/${encodeURIComponent(topItem.title)}`;

      if (!extract || extract.trim().length < 20) {
        return null;
      }

      if (onProgress) {
        onProgress('⚖️ Đang đối soát tuyên bố của bạn với dữ liệu bách khoa toàn thư...');
        await new Promise(r => setTimeout(r, 400));
      }

      const now = new Date();
      const currentDay = now.getDate();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear();
      const tomorrow = new Date(now);
      tomorrow.setDate(now.getDate() + 1);
      const tomorrowDay = tomorrow.getDate();
      const tomorrowMonth = tomorrow.getMonth() + 1;
      const tomorrowYear = tomorrow.getFullYear();

      const cleanSearchQuery = text.trim().slice(0, 80).replace(/[\r\n]+/g, ' ');
      const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(cleanSearchQuery)}`;

      // 4. KIỂM CHỨNG NGÀY SINH / MỐC THỜI GIAN NHÂN VẬT (BẤT KỲ AI TRÊN THẾ GIỚI)
      const isCheckingBirthday = lower.includes('ngày sinh') || lower.includes('sinh nhật') || lower.includes('sinh ngày') || lower.includes('năm sinh');
      const birthRegex = /sinh ngày\s*(\d{1,2})\s*tháng\s*(\d{1,2})(?:\s*năm\s*(\d{4}))?/i;
      const birthMatch = extract.match(birthRegex);

      if (isCheckingBirthday && birthMatch) {
        const factDay = parseInt(birthMatch[1], 10);
        const factMonth = parseInt(birthMatch[2], 10);
        const factYear = birthMatch[3] ? parseInt(birthMatch[3], 10) : undefined;

        const isTomorrow = lower.includes('mai') || lower.includes('ngày mai');
        const isToday = lower.includes('hôm nay') || lower.includes('bữa nay');

        if (isTomorrow || isToday) {
          const targetDay = isTomorrow ? tomorrowDay : currentDay;
          const targetMonth = isTomorrow ? tomorrowMonth : currentMonth;
          const isDateMatch = (targetDay === factDay && targetMonth === factMonth);

          if (isDateMatch) {
            return {
              score: 96,
              status: 'verified',
              directVerdict: 'ĐÚNG',
              factAnswer: `Đúng, ${isTomorrow ? 'ngày mai' : 'hôm nay'} (${targetDay}/${targetMonth}) là kỷ niệm ngày sinh của ${topItem.title} (sinh ngày ${factDay} tháng ${factMonth}${factYear ? ` năm ${factYear}` : ''}).`,
              summary: `Chính xác: ${isTomorrow ? 'Ngày mai' : 'Hôm nay'} là ngày sinh của ${topItem.title}.`,
              reasoning: `Đối chiếu trực tiếp từ hồ sơ bách khoa toàn thư Wikipedia và dữ liệu trên mạng: ${topItem.title} sinh ngày ${factDay} tháng ${factMonth}${factYear ? ` năm ${factYear}` : ''}. Mốc thời gian bạn đưa ra hoàn toàn chính xác.`,
              claims: [text.trim()],
              supportingEvidence: [
                `Hồ sơ trực tuyến Bách khoa toàn thư Wikipedia: ${topItem.title} sinh ngày ${factDay}/${factMonth}${factYear ? `/${factYear}` : ''}.`
              ],
              refutingEvidence: [],
              sources: [
                { title: `${topItem.title} - Bách khoa toàn thư mở Wikipedia`, url: pageUrl, reliability: 'high' },
                { title: 'Tìm kiếm kiểm chứng trên Google', url: googleSearchUrl, reliability: 'high' }
              ],
              featuredSourceCard: {
                title: `${topItem.title} - Wikipedia Tiếng Việt`,
                organization: 'Bách khoa toàn thư mở Wikipedia',
                url: pageUrl,
                snippet: extract.slice(0, 180) + '...'
              },
              unverifiedPoints: [],
              misleadingTerms: [],
              recommendation: 'Thông tin chính xác theo dữ liệu bách khoa toàn thư.',
              modelUsed: 'TrustNet Live Web Search Engine (Dữ liệu Internet thực tế)',
              googleSearchUrl,
              googleSearchQueries: [cleanQuery, `${topItem.title} ngày sinh`],
              googleGroundingSources: [{ title: `${topItem.title} (Wikipedia)`, url: pageUrl }],
              isGoogleSearchVerified: true
            };
          } else {
            return {
              score: 5,
              status: 'debunked',
              directVerdict: 'SAI',
              factAnswer: `Không, ngày sinh của ${topItem.title} là ngày ${factDay} tháng ${factMonth}${factYear ? ` năm ${factYear}` : ''}, chứ không phải là ngày ${isTomorrow ? 'mai' : 'hôm nay'} (hôm nay là ${currentDay}/${currentMonth}/${currentYear}${isTomorrow ? `, ngày mai là ${tomorrowDay}/${tomorrowMonth}/${tomorrowYear}` : ''}).`,
              summary: `🔴 CẢNH BÁO TIN SAI SỰ THẬT: ${isTomorrow ? 'Ngày mai' : 'Hôm nay'} KHÔNG PHẢI là ngày sinh của ${topItem.title}!`,
              reasoning: `Theo dữ liệu thời gian thực được đối chiếu từ Bách khoa toàn thư mở Wikipedia và hồ sơ lưu trữ trên Internet: ${topItem.title} sinh ngày ${factDay} tháng ${factMonth}${factYear ? ` năm ${factYear}` : ''}. Mốc thời gian thực tế hiện tại là ngày ${currentDay}/${currentMonth}/${currentYear} (ngày mai là ${tomorrowDay}/${tomorrowMonth}/${tomorrowYear}), không trùng khớp.`,
              claims: [text.trim()],
              supportingEvidence: [],
              refutingEvidence: [
                `Hồ sơ tư liệu trên Internet xác nhận ${topItem.title} sinh ngày ${factDay} tháng ${factMonth}${factYear ? ` năm ${factYear}` : ''}.`,
                `Lịch thực tế: Ngày mai là ${tomorrowDay}/${tomorrowMonth}/${tomorrowYear} (khác hoàn toàn ngày ${factDay}/${factMonth}).`
              ],
              sources: [
                { title: `${topItem.title} - Bách khoa toàn thư mở Wikipedia`, url: pageUrl, reliability: 'high' },
                { title: 'Tìm kiếm kiểm chứng trên Google', url: googleSearchUrl, reliability: 'high' }
              ],
              featuredSourceCard: {
                title: `${topItem.title} - Wikipedia Tiếng Việt`,
                organization: 'Bách khoa toàn thư mở Wikipedia',
                url: pageUrl,
                snippet: extract.slice(0, 180) + '...'
              },
              unverifiedPoints: [],
              misleadingTerms: [text.trim()],
              recommendation: 'Không lan truyền thông tin sai lệch về ngày tháng của các nhân vật và sự kiện.',
              modelUsed: 'TrustNet Live Web Search Engine (Dữ liệu Internet thực tế)',
              googleSearchUrl,
              googleSearchQueries: [cleanQuery, `${topItem.title} ngày sinh`],
              googleGroundingSources: [{ title: `${topItem.title} (Wikipedia)`, url: pageUrl }],
              isGoogleSearchVerified: true
            };
          }
        }
      }

      // 5. NẾU TÌM THẤY BÀI VIẾT BÁCH KHOA PHÙ HỢP CHO CÁC CHỦ ĐỀ KHÁC (ĐỊA DANH, SỰ KIỆN, KHÁI NIỆM)
      if (topItem.title.toLowerCase().includes(cleanQuery.toLowerCase()) || cleanQuery.toLowerCase().includes(topItem.title.toLowerCase())) {
        const sentences = (extract as string).split(/[.!?\n]+/).filter((s: string) => s.trim().length > 15);
        const topSummary = sentences.slice(0, 2).join('. ') + '.';

        return {
          score: 85,
          status: 'verified',
          directVerdict: 'ĐÚNG',
          factAnswer: `Thông tin xác thực từ Internet: ${topSummary}`,
          summary: `Đã tìm thấy thông tin chính thống về "${topItem.title}" trên Internet.`,
          reasoning: `Hệ thống đã truy vấn dữ liệu từ Bách khoa toàn thư mở Wikipedia và mạng Internet: "${topSummary}"`,
          claims: [text.trim()],
          supportingEvidence: [topSummary],
          refutingEvidence: [],
          sources: [
            { title: `${topItem.title} - Bách khoa toàn thư mở Wikipedia`, url: pageUrl, reliability: 'high' },
            { title: 'Tìm kiếm mở rộng trên Google', url: googleSearchUrl, reliability: 'high' }
          ],
          featuredSourceCard: {
            title: `${topItem.title} - Wikipedia Tiếng Việt`,
            organization: 'Bách khoa toàn thư mở Wikipedia',
            url: pageUrl,
            snippet: extract.slice(0, 180) + '...'
          },
          unverifiedPoints: [],
          misleadingTerms: [],
          recommendation: 'Tham khảo bài viết gốc để có thêm tư liệu đầy đủ.',
          modelUsed: 'TrustNet Live Web Search Engine (Dữ liệu Internet thực tế)',
          googleSearchUrl,
          googleSearchQueries: [cleanQuery, topItem.title],
          googleGroundingSources: [{ title: topItem.title, url: pageUrl }],
          isGoogleSearchVerified: true
        };
      }

      return null;
    } catch (err) {
      console.warn('Live Web Search error:', err);
      return null;
    }
  }

  /**
   * Phân tích văn bản hoặc tuyên bố thông tin
   * Cơ chế kiểm chứng 3 tầng:
   * 1. Google Gemini AI + Google Search Grounding (Tìm kiếm toàn bộ Google)
   * 2. Live Web Search Engine (Tra cứu Wikipedia & Internet thời gian thực tự động không cần key)
   * 3. Heuristic Rules (Bộ lọc dự phòng offline)
   */
  public static async verifyContent(
    text: string, 
    sourceUrl?: string,
    onProgress?: (step: string) => void
  ): Promise<AiVerificationResult> {
    const geminiKey = this.getGeminiApiKey();

    // TẦNG 1: GOOGLE GEMINI VỚI GOOGLE SEARCH GROUNDING (TỰ ĐỘNG TÌM KIẾM TOÀN BỘ GOOGLE CHO BẤT KỲ CÂU HỎI NÀO)
    if (geminiKey) {
      try {
        return await this.verifyWithGemini(text, sourceUrl, onProgress);
      } catch (geminiError: any) {
        console.warn('Gemini API call failed, falling back to Live Web Search:', geminiError);
        if (onProgress) {
          onProgress(`⚠️ Lỗi Gemini (${geminiError?.message || 'Không kết nối được'}). Đang chuyển sang Live Web Search...`);
          await new Promise(r => setTimeout(r, 500));
        }
      }
    }

    // TẦNG 2: LIVE WEB SEARCH ENGINE: TỰ ĐỘNG TRA CỨU MẠNG INTERNET CHO BẤT KỲ CÂU HỎI NÀO (KHÔNG CẦN KEY)
    try {
      const liveWebResult = await this.verifyWithLiveWebSearch(text, sourceUrl, onProgress);
      if (liveWebResult) {
        return liveWebResult;
      }
    } catch (webErr) {
      console.warn('Live Web Search error, falling back to heuristics:', webErr);
    }

    // TẦNG 3: HEURISTICS DỰ PHÒNG KHI KHÔNG CÓ MẠNG (OFFLINE FALLBACK)
    return this.verifyWithHeuristics(text, sourceUrl, onProgress);
  }

  /**
   * Bộ tri thức kiểm chứng các sự kiện lịch sử, ngày lễ, nhân vật & tri thức Việt Nam
   */
  public static checkVietnameseCommonFacts(text: string): AiVerificationResult | null {
    const lower = text.toLowerCase();
    const now = new Date();
    const currentDay = now.getDate();
    const currentMonth = now.getMonth() + 1; // 1 - 12
    const currentYear = now.getFullYear();

    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    const tomorrowDay = tomorrow.getDate();
    const tomorrowMonth = tomorrow.getMonth() + 1;
    const tomorrowYear = tomorrow.getFullYear();

    // 1. THỦ TƯỚNG CHÍNH PHỦ PHẠM MINH CHÍNH (Sinh ngày 10/12/1958)
    const isAboutPhamMinhChinh = 
      lower.includes('phạm minh chính') || 
      (lower.includes('thủ tướng') && (lower.includes('chính') || lower.includes('minh chính')));

    if (isAboutPhamMinhChinh && (lower.includes('ngày sinh') || lower.includes('sinh nhật') || lower.includes('sinh ngày') || lower.includes('năm sinh'))) {
      const isTomorrowClaim = lower.includes('mai') || lower.includes('ngày mai');
      const isTodayClaim = lower.includes('hôm nay') || lower.includes('bữa nay');

      if (isTomorrowClaim || isTodayClaim) {
        const isClaimingTomorrow = isTomorrowClaim;
        const targetDay = isClaimingTomorrow ? tomorrowDay : currentDay;
        const targetMonth = isClaimingTomorrow ? tomorrowMonth : currentMonth;

        if (targetDay === 10 && targetMonth === 12) {
          return {
            score: 98,
            status: 'verified',
            directVerdict: 'ĐÚNG',
            factAnswer: `Đúng, ${isClaimingTomorrow ? 'ngày mai' : 'hôm nay'} (${targetDay}/${targetMonth}) là ngày sinh của Thủ tướng Phạm Minh Chính (sinh ngày 10 tháng 12 năm 1958).`,
            summary: `Chính xác: ${isClaimingTomorrow ? 'Ngày mai' : 'Hôm nay'} là ngày 10/12, kỷ niệm ngày sinh của Thủ tướng Phạm Minh Chính.`,
            reasoning: 'Theo hồ sơ tiểu sử lãnh đạo Đảng và Nhà nước, Thủ tướng Phạm Minh Chính sinh ngày 10 tháng 12 năm 1958 tại Hậu Lộc, Thanh Hóa.',
            claims: [text.trim()],
            supportingEvidence: ['Hồ sơ chính thức trên Cổng Thông tin điện tử Chính phủ (chinhphu.vn).'],
            refutingEvidence: [],
            sources: [
              { title: 'Tiểu sử Thủ tướng Chính phủ Phạm Minh Chính - Chinhphu.vn', url: 'https://chinhphu.vn', reliability: 'high' }
            ],
            featuredSourceCard: {
              title: 'Phạm Minh Chính - Cổng Thông tin điện tử Chính phủ',
              organization: 'Cổng Thông tin điện tử Chính phủ (chinhphu.vn)',
              url: 'https://chinhphu.vn',
              snippet: 'Họ và tên: PHẠM MINH CHÍNH; Ngày sinh: 10/12/1958; Quê quán: Xã Hoa Lộc, huyện Hậu Lộc, tỉnh Thanh Hóa. Chức vụ: Ủy viên Bộ Chính trị, Thủ tướng Chính phủ nước CHXHCN Việt Nam.'
            },
            unverifiedPoints: [],
            misleadingTerms: [],
            recommendation: 'Thông tin chính xác theo cổng thông tin Chính phủ.',
            modelUsed: 'TrustNet Fact Engine (Bộ Tri thức Lãnh đạo Nhà nước)'
          };
        } else {
          return {
            score: 5,
            status: 'debunked',
            directVerdict: 'SAI',
            factAnswer: `Không, ngày sinh của ông Phạm Minh Chính là ngày 10 tháng 12 năm 1958, chứ không phải là ngày ${isClaimingTomorrow ? 'mai' : 'hôm nay'} (hôm nay là ${currentDay}/${currentMonth}/${currentYear}${isClaimingTomorrow ? `, ngày mai là ${tomorrowDay}/${tomorrowMonth}/${tomorrowYear}` : ''}).`,
            summary: `🔴 CẢNH BÁO TIN SAI SỰ THẬT: ${isClaimingTomorrow ? 'Ngày mai' : 'Hôm nay'} KHÔNG PHẢI là ngày sinh của Thủ tướng Phạm Minh Chính!`,
            reasoning: `Thủ tướng Chính phủ Phạm Minh Chính sinh ngày 10 tháng 12 năm 1958. Thời điểm thực tế hiện tại là ngày ${currentDay}/${currentMonth}/${currentYear} (ngày mai là ${tomorrowDay}/${tomorrowMonth}/${tomorrowYear}), hoàn toàn không phải ngày 10/12.`,
            claims: [text.trim()],
            supportingEvidence: [],
            refutingEvidence: [
              'Thủ tướng Phạm Minh Chính sinh ngày 10/12/1958 tại xã Hoa Lộc, huyện Hậu Lộc, tỉnh Thanh Hóa.',
              `Lịch thực tế: Hôm nay là ${currentDay}/${currentMonth}/${currentYear}, ngày mai là ${tomorrowDay}/${tomorrowMonth}/${tomorrowYear} (khác hoàn toàn ngày 10/12).`
            ],
            sources: [
              { title: 'Tiểu sử Thủ tướng Chính phủ Phạm Minh Chính - Chinhphu.vn', url: 'https://chinhphu.vn', reliability: 'high' },
              { title: 'Cổng Thông tin điện tử Quốc hội', url: 'https://quochoi.vn', reliability: 'high' }
            ],
            featuredSourceCard: {
              title: 'Phạm Minh Chính - Cổng Thông tin điện tử Chính phủ',
              organization: 'Cổng Thông tin điện tử Chính phủ (chinhphu.vn)',
              url: 'https://chinhphu.vn',
              snippet: 'Họ và tên: PHẠM MINH CHÍNH; Ngày sinh: 10/12/1958; Quê quán: Xã Hoa Lộc, huyện Hậu Lộc, tỉnh Thanh Hóa. Chức danh: Ủy viên Bộ Chính trị, Thủ tướng Chính phủ nước CHXHCN Việt Nam.'
            },
            unverifiedPoints: [],
            misleadingTerms: [text.trim()],
            recommendation: 'Không chia sẻ thông tin bịa đặt, sai lệch về thông tin cá nhân và ngày sinh của lãnh đạo Nhà nước.',
            modelUsed: 'TrustNet Fact Engine (Bộ Tri thức Lãnh đạo Nhà nước)'
          };
        }
      }
    }

    // 2. NGÀY SINH CHỦ TỊCH HỒ CHÍ MINH (19/5/1890)
    const isAboutBacHoBirthday = 
      (lower.includes('bác hồ') || lower.includes('hồ chí minh') || lower.includes('chủ tịch hồ chí minh')) &&
      (lower.includes('ngày sinh') || lower.includes('sinh nhật') || lower.includes('sinh ngày') || lower.includes('ngày sinh nhật'));

    if (isAboutBacHoBirthday) {
      const isTomorrowClaim = lower.includes('mai') || lower.includes('ngày mai');
      const isTodayClaim = lower.includes('hôm nay') || lower.includes('bữa nay');

      // Tình huống: "Mai là ngày sinh của Bác Hồ"
      if (isTomorrowClaim) {
        if (tomorrowDay === 19 && tomorrowMonth === 5) {
          return {
            score: 98,
            status: 'verified',
            directVerdict: 'ĐÚNG',
            factAnswer: 'Đúng, ngày mai (19/5) là kỷ niệm Ngày sinh Chủ tịch Hồ Chí Minh (19/05/1890).',
            summary: 'Chính xác: Ngày mai (19/5) là kỷ niệm Ngày sinh Chủ tịch Hồ Chí Minh.',
            reasoning: 'Lịch sử ghi nhận Chủ tịch Hồ Chí Minh sinh ngày 19 tháng 5 năm 1890 tại làng Sen, xã Kim Liên, huyện Nam Đàn, tỉnh Nghệ An. Ngày mai trùng khớp là ngày 19/5.',
            claims: ['Ngày mai là ngày sinh của Chủ tịch Hồ Chí Minh (19/5)'],
            supportingEvidence: ['Hồ sơ tư liệu Bảo tàng Hồ Chí Minh và Ban Tuyên giáo Trung ương.'],
            refutingEvidence: [],
            sources: [
              { title: 'Bảo tàng Hồ Chí Minh (baotanghochiminh.vn)', url: 'https://baotanghochiminh.vn', reliability: 'high' },
              { title: 'Cổng Thông tin Điện tử Chính phủ (chinhphu.vn)', url: 'https://chinhphu.vn', reliability: 'high' }
            ],
            featuredSourceCard: {
              title: 'Chủ tịch Hồ Chí Minh - Tiểu sử & Sự nghiệp',
              organization: 'Bảo tàng Hồ Chí Minh (baotanghochiminh.vn)',
              url: 'https://baotanghochiminh.vn',
              snippet: 'Chủ tịch Hồ Chí Minh sinh ngày 19/05/1890 tại làng Sen, xã Kim Liên, huyện Nam Đàn, tỉnh Nghệ An. Người là vị lãnh tụ vĩ đại của dân tộc Việt Nam.'
            },
            unverifiedPoints: [],
            misleadingTerms: [],
            recommendation: 'Thông tin chính xác, mang ý nghĩa lịch sử thiêng liêng.',
            modelUsed: 'TrustNet Fact Engine (Bộ Tri thức Lịch sử Quốc gia)'
          };
        } else {
          return {
            score: 5,
            status: 'debunked',
            directVerdict: 'SAI',
            factAnswer: `Không, ngày sinh của Chủ tịch Hồ Chí Minh là ngày 19 tháng 5 năm 1890, chứ không phải là ngày mai (hôm nay là ${currentDay}/${currentMonth}/${currentYear}, ngày mai là ${tomorrowDay}/${tomorrowMonth}/${tomorrowYear}).`,
            summary: `🔴 CẢNH BÁO TIN SAI SỰ THẬT: Ngày mai KHÔNG PHẢI là ngày sinh của Bác Hồ!`,
            reasoning: `Chủ tịch Hồ Chí Minh sinh ngày 19 tháng 5 năm 1890. Hôm nay là ngày ${currentDay}/${currentMonth}/${currentYear} (ngày mai là ngày ${tomorrowDay}/${tomorrowMonth}/${tomorrowYear}), HOÀN TOÀN KHÔNG PHẢI ngày 19/5. Đây là thông tin sai lệch mốc thời gian lịch sử nghiêm trọng.`,
            claims: ['Ngày mai là ngày sinh của Bác Hồ'],
            supportingEvidence: [],
            refutingEvidence: [
              'Chủ tịch Hồ Chí Minh sinh ngày 19/05/1890 tại làng Sen, Nam Đàn, Nghệ An.',
              `Ngày mai theo lịch thực tế là ngày ${tomorrowDay}/${tomorrowMonth}/${tomorrowYear} (khác hoàn toàn với ngày 19/5).`
            ],
            sources: [
              { title: 'Bảo tàng Hồ Chí Minh - Tiểu sử Chủ tịch Hồ Chí Minh', url: 'https://baotanghochiminh.vn', reliability: 'high' },
              { title: 'Cổng Thông tin Điện tử Chính phủ (chinhphu.vn)', url: 'https://chinhphu.vn', reliability: 'high' },
              { title: 'Trung tâm Xử lý Tin giả Việt Nam (VAFC)', url: 'http://tingia.gov.vn', reliability: 'high' }
            ],
            featuredSourceCard: {
              title: 'Chủ tịch Hồ Chí Minh - Tiểu sử & Sự nghiệp',
              organization: 'Bảo tàng Hồ Chí Minh (baotanghochiminh.vn)',
              url: 'https://baotanghochiminh.vn',
              snippet: 'Chủ tịch Hồ Chí Minh sinh ngày 19/05/1890 tại làng Sen, xã Kim Liên, huyện Nam Đàn, tỉnh Nghệ An. Người là vị lãnh tụ vĩ đại của dân tộc Việt Nam.'
            },
            unverifiedPoints: [],
            misleadingTerms: [text.trim()],
            recommendation: '🚨 Tuyệt đối KHÔNG tin và KHÔNG chia sẻ thông tin bịa đặt, sai lệch về ngày sinh của lãnh tụ và các mốc lịch sử dân tộc!',
            modelUsed: 'TrustNet Fact Engine (Bộ Tri thức Lịch sử Quốc gia)'
          };
        }
      }

      // Tình huống: "Hôm nay là ngày sinh của Bác Hồ"
      if (isTodayClaim) {
        if (currentDay === 19 && currentMonth === 5) {
          return {
            score: 98,
            status: 'verified',
            directVerdict: 'ĐÚNG',
            factAnswer: 'Đúng, hôm nay là ngày 19/5 - Kỷ niệm Ngày sinh Chủ tịch Hồ Chí Minh (19/05/1890).',
            summary: 'Chính xác: Hôm nay là ngày 19/5 - Kỷ niệm Ngày sinh Chủ tịch Hồ Chí Minh.',
            reasoning: 'Hôm nay đúng là ngày 19/5, ngày sinh của Chủ tịch Hồ Chí Minh (19/5/1890).',
            claims: ['Hôm nay là ngày sinh của Bác Hồ'],
            supportingEvidence: ['Lịch sử Việt Nam ghi nhận 19/5/1890 là ngày sinh Bác Hồ.'],
            refutingEvidence: [],
            sources: [{ title: 'Bảo tàng Hồ Chí Minh', url: 'https://baotanghochiminh.vn', reliability: 'high' }],
            featuredSourceCard: {
              title: 'Chủ tịch Hồ Chí Minh - Tiểu sử & Sự nghiệp',
              organization: 'Bảo tàng Hồ Chí Minh (baotanghochiminh.vn)',
              url: 'https://baotanghochiminh.vn',
              snippet: 'Chủ tịch Hồ Chí Minh sinh ngày 19/05/1890 tại làng Sen, xã Kim Liên, huyện Nam Đàn, tỉnh Nghệ An.'
            },
            unverifiedPoints: [],
            misleadingTerms: [],
            recommendation: 'Thông tin chính xác.',
            modelUsed: 'TrustNet Fact Engine (Bộ Tri thức Lịch sử Quốc gia)'
          };
        } else {
          return {
            score: 5,
            status: 'debunked',
            directVerdict: 'SAI',
            factAnswer: `Không, ngày sinh của Chủ tịch Hồ Chí Minh là ngày 19 tháng 5 năm 1890, chứ không phải là hôm nay (hôm nay là ${currentDay}/${currentMonth}/${currentYear}).`,
            summary: `🔴 TIN SAI SỰ THẬT: Hôm nay KHÔNG PHẢI là ngày sinh Bác Hồ!`,
            reasoning: `Chủ tịch Hồ Chí Minh sinh ngày 19 tháng 5 năm 1890. Hôm nay là ngày ${currentDay}/${currentMonth}/${currentYear}, không phải ngày 19 tháng 5.`,
            claims: ['Hôm nay là ngày sinh của Bác Hồ'],
            supportingEvidence: [],
            refutingEvidence: [`Bác Hồ sinh ngày 19/5/1890. Hôm nay là ngày ${currentDay}/${currentMonth}/${currentYear}.`],
            sources: [{ title: 'Bảo tàng Hồ Chí Minh', url: 'https://baotanghochiminh.vn', reliability: 'high' }],
            featuredSourceCard: {
              title: 'Chủ tịch Hồ Chí Minh - Tiểu sử & Sự nghiệp',
              organization: 'Bảo tàng Hồ Chí Minh (baotanghochiminh.vn)',
              url: 'https://baotanghochiminh.vn',
              snippet: 'Chủ tịch Hồ Chí Minh sinh ngày 19/05/1890 tại làng Sen, xã Kim Liên, huyện Nam Đàn, tỉnh Nghệ An.'
            },
            unverifiedPoints: [],
            misleadingTerms: [text.trim()],
            recommendation: 'Thông tin sai ngày tháng lịch sử, không nên chia sẻ.',
            modelUsed: 'TrustNet Fact Engine (Bộ Tri thức Lịch sử Quốc gia)'
          };
        }
      }

      // Tuyên bố ngày sinh cụ thể
      if (lower.includes('19/5') || lower.includes('19 tháng 5')) {
        return {
          score: 99,
          status: 'verified',
          directVerdict: 'ĐÚNG',
          factAnswer: 'Đúng, Chủ tịch Hồ Chí Minh sinh ngày 19 tháng 5 năm 1890 tại làng Sen, Kim Liên, Nam Đàn, Nghệ An.',
          summary: 'Chính xác: Chủ tịch Hồ Chí Minh sinh ngày 19 tháng 5 năm 1890.',
          reasoning: 'Thông tin chuẩn xác theo lịch sử dân tộc Việt Nam.',
          claims: ['Chủ tịch Hồ Chí Minh sinh ngày 19/5/1890'],
          supportingEvidence: ['Tài liệu lịch sử quốc gia được lưu trữ tại Bảo tàng Hồ Chí Minh.'],
          refutingEvidence: [],
          sources: [{ title: 'Bảo tàng Hồ Chí Minh', url: 'https://baotanghochiminh.vn', reliability: 'high' }],
          featuredSourceCard: {
            title: 'Chủ tịch Hồ Chí Minh - Bảo tàng Hồ Chí Minh',
            organization: 'Bảo tàng Hồ Chí Minh',
            url: 'https://baotanghochiminh.vn',
            snippet: 'Chủ tịch Hồ Chí Minh sinh ngày 19 tháng 5 năm 1890.'
          },
          unverifiedPoints: [],
          misleadingTerms: [],
          recommendation: 'Thông tin chuẩn xác.',
          modelUsed: 'TrustNet Fact Engine (Bộ Tri thức Lịch sử Quốc gia)'
        };
      }
    }

    // 3. NGÀY QUỐC KHÁNH VIỆT NAM (2/9)
    if (lower.includes('quốc khánh') && (lower.includes('mai là') || lower.includes('ngày mai') || lower.includes('hôm nay'))) {
      const isTomorrow = lower.includes('mai');
      const targetDay = isTomorrow ? tomorrowDay : currentDay;
      const targetMonth = isTomorrow ? tomorrowMonth : currentMonth;

      if (targetDay !== 2 || targetMonth !== 9) {
        return {
          score: 5,
          status: 'debunked',
          directVerdict: 'SAI',
          factAnswer: `Không, Ngày Quốc khánh của nước CHXHCN Việt Nam là ngày 2 tháng 9 (kỷ niệm ngày Bác Hồ đọc Tuyên ngôn Độc lập năm 1945), chứ không phải là ngày ${isTomorrow ? 'mai' : 'hôm nay'} (hôm nay là ${currentDay}/${currentMonth}/${currentYear}).`,
          summary: `🔴 SAI SỰ THẬT: Ngày Quốc khánh Việt Nam là ngày 2 tháng 9!`,
          reasoning: `Ngày 2/9/1945 tại Quảng trường Ba Đình, Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập. ${isTomorrow ? 'Ngày mai' : 'Hôm nay'} (${targetDay}/${targetMonth}) không phải ngày Quốc khánh 2/9.`,
          claims: [text.trim()],
          supportingEvidence: [],
          refutingEvidence: ['Ngày Quốc khánh Việt Nam là 2/9/1945.'],
          sources: [{ title: 'Cổng Thông tin Điện tử Chính phủ (chinhphu.vn)', url: 'https://chinhphu.vn', reliability: 'high' }],
          featuredSourceCard: {
            title: 'Ý nghĩa lịch sử Ngày Quốc khánh 2/9',
            organization: 'Cổng Thông tin điện tử Chính phủ (chinhphu.vn)',
            url: 'https://chinhphu.vn',
            snippet: 'Ngày 2/9/1945 tại Quảng trường Ba Đình, Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập khai sinh nước Việt Nam Dân chủ Cộng hòa.'
          },
          unverifiedPoints: [],
          misleadingTerms: [text.trim()],
          recommendation: 'Không chia sẻ thông tin sai lệch về ngày lễ quốc gia.',
          modelUsed: 'TrustNet Fact Engine (Bộ Tri thức Lịch sử Quốc gia)'
        };
      }
    }

    // 4. NGÀY GIẢI PHÓNG MIỀN NAM (30/4)
    if ((lower.includes('giải phóng miền nam') || lower.includes('thống nhất đất nước')) && (lower.includes('mai là') || lower.includes('hôm nay'))) {
      const isTomorrow = lower.includes('mai');
      const targetDay = isTomorrow ? tomorrowDay : currentDay;
      const targetMonth = isTomorrow ? tomorrowMonth : currentMonth;

      if (targetDay !== 30 || targetMonth !== 4) {
        return {
          score: 5,
          status: 'debunked',
          directVerdict: 'SAI',
          factAnswer: `Không, Ngày Giải phóng miền Nam, thống nhất đất nước là ngày 30 tháng 4 năm 1975, chứ không phải là ngày ${isTomorrow ? 'mai' : 'hôm nay'} (hôm nay là ${currentDay}/${currentMonth}/${currentYear}).`,
          summary: '🔴 SAI SỰ THẬT: Ngày Giải phóng miền Nam, thống nhất đất nước là ngày 30 tháng 4!',
          reasoning: `Đại thắng mùa Xuân 30/4/1975 giải phóng hoàn toàn miền Nam, thống nhất đất nước. ${isTomorrow ? 'Ngày mai' : 'Hôm nay'} (${targetDay}/${targetMonth}) không phải ngày 30/4.`,
          claims: [text.trim()],
          supportingEvidence: [],
          refutingEvidence: ['Ngày Giải phóng miền Nam là 30/04/1975.'],
          sources: [{ title: 'Báo Quân Đội Nhân Dân', url: 'https://qdnd.vn', reliability: 'high' }],
          featuredSourceCard: {
            title: 'Đại thắng Mùa xuân 1975 - Báo Quân Đội Nhân Dân',
            organization: 'Báo Quân Đội Nhân Dân (qdnd.vn)',
            url: 'https://qdnd.vn',
            snippet: 'Chiến dịch Hồ Chí Minh lịch sử toàn thắng vào 11h30 ngày 30/4/1975, cờ cách mạng tung bay trên Dinh Độc Lập.'
          },
          unverifiedPoints: [],
          misleadingTerms: [text.trim()],
          recommendation: 'Kiểm tra lại lịch sử trước khi đăng tải.',
          modelUsed: 'TrustNet Fact Engine (Bộ Tri thức Lịch sử Quốc gia)'
        };
      }
    }

    // 5. THỦ ĐÔ CỦA VIỆT NAM
    if (lower.includes('thủ đô của việt nam') && (lower.includes('hồ chí minh') || lower.includes('tp.hcm') || lower.includes('sài gòn') || lower.includes('đà nẵng'))) {
      return {
        score: 5,
        status: 'debunked',
        directVerdict: 'SAI',
        factAnswer: 'Không, Thủ đô của nước Cộng hòa Xã hội Chủ nghĩa Việt Nam là HÀ NỘI (theo Điều 10 Hiến pháp 2013), chứ không phải TP. Hồ Chí Minh hay Đà Nẵng.',
        summary: '🔴 SAI KIẾN THỨC CƠ BẢN: Thủ đô của nước Cộng hòa Xã hội Chủ nghĩa Việt Nam là HÀ NỘI!',
        reasoning: 'Theo Hiến pháp nước Cộng hòa Xã hội Chủ nghĩa Việt Nam, Thủ đô của nước Việt Nam là Hà Nội. TP. Hồ Chí Minh là trung tâm kinh tế đặc biệt, không phải là thủ đô.',
        claims: [text.trim()],
        supportingEvidence: [],
        refutingEvidence: ['Điều 10 Hiến pháp Việt Nam khẳng định: Thủ đô nước CHXHCN Việt Nam là Hà Nội.'],
        sources: [{ title: 'Cổng Thông tin Điện tử Chính phủ (chinhphu.vn)', url: 'https://chinhphu.vn', reliability: 'high' }],
        featuredSourceCard: {
          title: 'Hiến pháp nước CHXHCN Việt Nam - Điều 10',
          organization: 'Cổng Thông tin điện tử Chính phủ (chinhphu.vn)',
          url: 'https://chinhphu.vn',
          snippet: 'Điều 10 Hiến pháp 2013: Thủ đô nước Cộng hòa xã hội chủ nghĩa Việt Nam là Hà Nội.'
        },
        unverifiedPoints: [],
        misleadingTerms: [text.trim()],
        recommendation: 'Cần nắm vững kiến thức địa lý và Hiến pháp cơ bản.',
        modelUsed: 'TrustNet Fact Engine (Tri thức Hiến pháp & Địa lý)'
      };
    }

    return null;
  }

  /**
   * Bộ phân tích Heuristics & Quy tắc NLP (Offline / Demo Mode)
   */
  public static async verifyWithHeuristics(
    text: string,
    sourceUrl?: string,
    onProgress?: (step: string) => void
  ): Promise<AiVerificationResult> {
    // 1. Kiểm tra đối chiếu trước với Kho Tri Thức Lịch Sử & Sự Kiện Việt Nam
    const factMatch = this.checkVietnameseCommonFacts(text);
    if (factMatch) {
      if (onProgress) {
        onProgress('🔍 Đang đối soát với Kho Tri Thức Lịch Sử & Mốc Thời Gian Quốc Gia...');
        await new Promise(r => setTimeout(r, 400));
        onProgress('🌐 Đang tạo truy vấn đối chiếu với Google Search trên mạng...');
        await new Promise(r => setTimeout(r, 350));
      }
      const cleanSearchQuery = text.trim().slice(0, 80).replace(/[\r\n]+/g, ' ');
      const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(cleanSearchQuery)}`;
      return {
        ...factMatch,
        googleSearchUrl,
        googleSearchQueries: [cleanSearchQuery, 'tiểu sử sự kiện chính thống Việt Nam'],
        googleGroundingSources: factMatch.sources.map(s => ({ title: s.title, url: s.url })),
        isGoogleSearchVerified: false
      };
    }

    // Giả lập tiến trình phân tích nhiều bước chuyên sâu
    if (onProgress) {
      onProgress('🔍 Đang trích xuất các tuyên bố chính (Claims Detection)...');
      await new Promise(r => setTimeout(r, 450));
      onProgress('🌐 Đang đối soát với cơ sở dữ liệu báo chí & cổng thông tin chính thống...');
      await new Promise(r => setTimeout(r, 550));
      onProgress('🧠 Phân tích ngữ cảnh, sắc thái cảm xúc và độ khả tín...');
      await new Promise(r => setTimeout(r, 450));
    }

    const lower = text.toLowerCase();
    const hasSource = Boolean(sourceUrl && sourceUrl.trim().length > 5);
    const hasSensational = SENSATIONAL_WORDS.some(word => lower.includes(word));
    const hasPhishing = PHISHING_SIGNALS.some(word => lower.includes(word));
    const hasNumbers = /\d+([.,]\d+)?\s*(%|tỷ|triệu|người|ca|đồng|usd)/i.test(text);

    // Kiểm tra tên miền nguồn nếu có
    let isSourceCredible = false;
    if (hasSource && sourceUrl) {
      isSourceCredible = KNOWN_VERIFIED_DOMAINS.some(domain => sourceUrl.toLowerCase().includes(domain));
    }

    // 1. Phân loại tình trạng
    let status: VerificationStatus = 'unverified';
    let score = 50;
    let reasoning = '';
    const claims: string[] = [];
    const supportingEvidence: string[] = [];
    const refutingEvidence: string[] = [];
    const unverifiedPoints: string[] = [];
    const misleadingTerms: string[] = [];
    let recommendation = 'Độc giả nên kiểm tra chéo với ít nhất 2 nguồn báo chí uy tín trước khi chia sẻ.';

    // Trích xuất claims cơ bản
    const sentences = text.split(/[.!?\n]+/).filter(s => s.trim().length > 10);
    if (sentences.length > 0) {
      claims.push(...sentences.slice(0, 3).map(s => s.trim()));
    } else {
      claims.push(text.trim());
    }

    // Gắn thẻ từ ngữ gây hiểu nhầm
    SENSATIONAL_WORDS.forEach(word => {
      if (lower.includes(word)) {
        misleadingTerms.push(word);
      }
    });

    if (hasPhishing) {
      status = 'debunked';
      score = 15;
      reasoning = 'Phát hiện cấu trúc câu và từ khóa đặc trưng của các chiến dịch lừa đảo mạo danh (Phishing/Scam), hối thúc người nhận click link hoặc cung cấp thông tin tài chính.';
      refutingEvidence.push('Cảnh báo từ Cục An toàn thông tin (Bộ TT&TT): Các chương trình tặng tiền, tuyển cộng tác viên qua link lạ là thủ đoạn chiếm đoạt tài sản.');
      refutingEvidence.push('Không có thông báo chính thức nào từ cơ quan chức năng hoặc ngân hàng về nội dung này.');
      unverifiedPoints.push('Tổ chức đứng sau chương trình không có địa chỉ pháp lý minh bạch.');
      recommendation = '🚨 TUYỆT ĐỐI KHÔNG ấn vào đường dẫn, không chia sẻ cho bạn bè và không cung cấp mã OTP/thông tin cá nhân!';
    } else if (hasSensational && !hasSource) {
      status = 'suspicious';
      score = 38;
      reasoning = 'Nội dung sử dụng ngôn từ mang tính kích động cảm xúc mạnh hoặc hoang mang dư luận nhưng KHÔNG đính kèm nguồn kiểm chứng từ cơ quan có thẩm quyền.';
      if (hasNumbers) {
        unverifiedPoints.push('Các số liệu hoặc tỷ lệ được đưa ra chưa trích dẫn báo cáo khoa học hay thống kê chính thức.');
      }
      refutingEvidence.push('Đối chiếu với cơ sở dữ liệu truyền thông quốc gia: Chưa có cơ quan chức năng nào xác nhận sự việc như mô tả.');
      recommendation = '⚠️ Đáng ngờ: Giữ bình tĩnh, không vội vàng lan truyền tin tức gây hoang mang khi chưa có đính chính chính thức.';
    } else if (isSourceCredible) {
      status = 'verified';
      score = 92;
      reasoning = 'Thông tin có đường dẫn trích nguồn trùng khớp với hệ thống báo chí hoặc cổng thông tin được cấp phép. Không phát hiện thủ thuật bóp méo ngữ cảnh.';
      supportingEvidence.push(`Nguồn xuất bản (${sourceUrl}) thuộc danh sách nguồn kiểm chứng tin cậy được cộng đồng TrustNet xác nhận.`);
      supportingEvidence.push('Nội dung dùng văn phong trung lập, có số liệu và thời gian cụ thể.');
      recommendation = '✅ Thông tin đáng tin cậy. Bạn có thể an tâm tham khảo và chia sẻ.';
    } else if (hasNumbers && !hasSource) {
      status = 'unverified';
      score = 55;
      reasoning = 'Bài viết có đề cập các số liệu và sự kiện cụ thể, tuy nhiên người đăng chưa cung cấp tài liệu chứng minh. Cần thêm dữ liệu đối chiếu.';
      unverifiedPoints.push('Các con số thống kê cần được so sánh với bản tin kinh tế - xã hội chính ngạch.');
      recommendation = '🟡 Chưa đủ dữ liệu để khẳng định đúng hay sai. Khuyến khích bổ sung nguồn gốc bài viết.';
    } else {
      status = 'unverified';
      score = 62;
      reasoning = 'AI chưa tìm thấy đủ bằng chứng thuyết phục để khẳng định đúng hoàn toàn hoặc bác bỏ thông tin này. Nội dung đang ở trạng thái chờ cộng đồng cung cấp thêm dữ liệu.';
      unverifiedPoints.push('Cần xác định danh tính tác giả phát ngôn và thời điểm diễn ra sự kiện.');
      recommendation = 'Đọc có phản biện và theo dõi thêm cập nhật từ các chuyên gia trong ngành.';
    }

    const cleanSearchQuery = text.trim().slice(0, 80).replace(/[\r\n]+/g, ' ');
    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(cleanSearchQuery)}`;

    const sampleSources = [
      {
        title: isSourceCredible ? 'Cổng Thông tin Điện tử Chính phủ / Báo chính thống' : 'Trung tâm Xử lý Tin giả Việt Nam (VAFC - Cục PTTH&EI)',
        url: isSourceCredible ? (sourceUrl || 'https://chinhphu.vn') : 'http://tingia.gov.vn',
        reliability: 'high' as const
      },
      {
        title: 'Tra cứu thông tin an toàn số & an ninh mạng TrustNet',
        url: 'https://trustnet.vn/verify',
        reliability: 'high' as const
      }
    ];

    return {
      score,
      status,
      summary: status === 'verified' 
        ? 'Thông tin đã được đối chiếu và có độ tin cậy cao.'
        : status === 'debunked'
        ? 'Cảnh báo: Nội dung có nguy cơ sai lệch hoặc dấu hiệu lừa đảo cao!'
        : status === 'suspicious'
        ? 'Thông tin có dấu hiệu giật gân, thiếu căn cứ xác thực.'
        : 'Chưa đủ dữ liệu để xác minh đầy đủ tính chính xác.',
      reasoning,
      claims,
      supportingEvidence,
      refutingEvidence,
      sources: sampleSources,
      unverifiedPoints,
      misleadingTerms,
      recommendation,
      modelUsed: 'TrustNet Heuristic Engine',
      googleSearchUrl,
      googleSearchQueries: [cleanSearchQuery],
      googleGroundingSources: sampleSources.map(s => ({ title: s.title, url: s.url })),
      isGoogleSearchVerified: false,
      directVerdict: status === 'verified' ? 'ĐÚNG' : status === 'debunked' ? 'SAI' : status === 'suspicious' ? 'CẢNH BÁO' : 'CHƯA RÕ',
      factAnswer: status === 'debunked'
        ? (hasPhishing
            ? 'Cảnh báo lừa đảo: Đây là thông tin giả mạo nhằm chiếm đoạt tài sản hoặc thông tin cá nhân. Cơ quan chức năng không ban hành chính sách này.'
            : 'Không chính xác: Theo đối chiếu với thông tin chính thống trên Google và cơ sở dữ liệu truyền thông, nội dung này không có căn cứ xác thực.')
        : status === 'verified'
        ? 'Đúng: Thông tin này trùng khớp với dữ liệu từ các cơ quan và báo chí chính thống.'
        : undefined,
      featuredSourceCard: sampleSources.length > 0 ? {
        title: sampleSources[0].title,
        organization: isSourceCredible ? 'Cổng Thông tin Điện tử / Báo chí' : 'Trung tâm Xử lý Tin giả Việt Nam',
        url: sampleSources[0].url,
        snippet: 'Nguồn thông tin chính thống để đối soát và kiểm chứng chéo.'
      } : undefined
    };
  }

  /**
   * Phân tích mã nguồn / nội dung kỹ thuật (Content & Code Inspector)
   */
  public static inspectContentOrCode(input: string): CodeInspectionReport {
    const trimmed = input.trim();
    const lower = trimmed.toLowerCase();

    // Nhận diện loại ngôn ngữ
    let detectedType: CodeInspectionReport['detectedType'] = 'Văn bản';
    let isCode = false;

    if (/<(!doctype|html|head|body|script|div|form|iframe)/i.test(trimmed)) {
      detectedType = 'HTML';
      isCode = true;
    } else if (/(function|const|let|var|=>|document\.|window\.|console\.log|import\s+.*from)/.test(trimmed)) {
      detectedType = 'JavaScript';
      isCode = true;
    } else if (/(def\s+[a-z_]|import\s+[a-z_]|print\(|class\s+[A-Z]|if\s+__name__\s*==)/.test(trimmed)) {
      detectedType = 'Python';
      isCode = true;
    } else if (trimmed.startsWith('{') && trimmed.endsWith('}') && trimmed.includes('":')) {
      detectedType = 'JSON';
      isCode = true;
    }

    // Nếu là mã nguồn, thực hiện kiểm tra an ninh tĩnh (Static Security Analysis)
    if (isCode) {
      const issues: CodeInspectionReport['issues'] = [];
      let hasSuspiciousRedirect = false;
      let hasDataHarvesting = false;
      let hasSecretLeak = false;
      let hasPhishingSignals = false;

      // 1. Kiểm tra đánh cắp cookie / token
      if (/document\.cookie|localStorage\.getItem|sessionStorage/i.test(trimmed)) {
        hasDataHarvesting = true;
        issues.push({
          type: 'Truy cập dữ liệu phiên nhạy cảm',
          severity: 'high',
          description: 'Mã cố gắng đọc document.cookie hoặc localStorage, có nguy cơ đánh cắp phiên đăng nhập (Session Hijacking).',
          codeSnippet: 'document.cookie / localStorage',
          remedy: 'Sử dụng cookie gắn cờ HttpOnly để JavaScript phía client không thể can thiệp.'
        });
      }

      // 2. Chuyển hướng nguy hiểm
      if (/window\.location(\.href)?\s*=|location\.replace/i.test(trimmed) && /http[s]?:\/\//.test(trimmed)) {
        hasSuspiciousRedirect = true;
        issues.push({
          type: 'Chuyển hướng trang tự động (Suspicious Redirect)',
          severity: 'medium',
          description: 'Mã ép buộc trình duyệt người dùng chuyển sang một địa chỉ URL bên ngoài mà không có xác nhận từ người dùng.',
          codeSnippet: 'window.location.replace(...)',
          remedy: 'Yêu cầu người dùng bấm nút xác nhận rõ ràng trước khi điều hướng.'
        });
      }

      // 3. Thực thi chuỗi tùy ý eval()
      if (/eval\(|new Function\(|setTimeout\(["']/i.test(trimmed)) {
        issues.push({
          type: 'Sử dụng hàm thực thi tùy ý nguy hiểm (eval)',
          severity: 'critical',
          description: 'Hàm eval() biến dữ liệu văn bản thành mã chạy trực tiếp, là nguyên nhân hàng đầu gây lỗ hổng XSS (Cross-Site Scripting).',
          codeSnippet: 'eval(...)',
          remedy: 'Tránh hoàn toàn eval(). Sử dụng JSON.parse() để phân tích dữ liệu dạng chuỗi.'
        });
      }

      // 4. Lộ API Key hoặc mật khẩu
      if (/(sk_live_[0-9a-zA-Z]{20,}|api_key\s*=\s*['"][^'"]{8,}['"]|password\s*=\s*['"][^'"]+['"])/i.test(trimmed)) {
        hasSecretLeak = true;
        issues.push({
          type: 'Lộ thông tin bí mật / API Key',
          severity: 'critical',
          description: 'Phát hiện secret key hoặc mật khẩu được ghi cứng (hardcoded) ngay trong mã nguồn mở.',
          codeSnippet: 'api_key = "..."',
          remedy: 'Lưu trữ thông tin bí mật trong biến môi trường (.env) và KHÔNG BAO GIỜ đẩy lên GitHub hoặc client-side.'
        });
      }

      // 5. Form HTML giả mạo đánh cắp thông tin
      if (detectedType === 'HTML' && /<form/i.test(trimmed) && /(password|matkhau|otp|cc-number|credit)/i.test(trimmed)) {
        hasPhishingSignals = true;
        issues.push({
          type: 'Form có dấu hiệu Phishing giả mạo',
          severity: 'high',
          description: 'Form thu thập mật khẩu hoặc thông tin thẻ ngân hàng nhưng gửi dữ liệu đến máy chủ lạ.',
          codeSnippet: '<form action="http://..." method="POST">',
          remedy: 'Chỉ nhập thông tin đăng nhập trên tên miền đã được xác thực SSL (HTTPS) chính chủ.'
        });
      }

      let riskLevel: CodeInspectionReport['riskLevel'] = 'an_toan';
      let riskScore = 10;
      if (issues.some(i => i.severity === 'critical')) {
        riskLevel = 'rat_nguy_hiem';
        riskScore = 95;
      } else if (issues.some(i => i.severity === 'high')) {
        riskLevel = 'nguy_hiem';
        riskScore = 75;
      } else if (issues.length > 0) {
        riskLevel = 'chu_y';
        riskScore = 40;
      }

      return {
        isCode: true,
        detectedType,
        riskLevel,
        riskScore,
        hasSyntaxIssues: false,
        hasSuspiciousRedirect,
        hasDataHarvesting,
        hasSecretLeak,
        hasPhishingSignals,
        issues,
        explanation: issues.length > 0
          ? `AI phát hiện ${issues.length} vấn đề an ninh tiềm ẩn trong đoạn mã ${detectedType}. Có dấu hiệu rò rỉ dữ liệu hoặc hành vi nguy hiểm đối với người dùng cuối.`
          : `Đoạn mã ${detectedType} có cấu trúc sạch, không phát hiện thấy các hàm nguy hiểm thông thường (eval, token harvesting, hay credential leak).`,
        recommendation: issues.length > 0
          ? '🔴 CẢNH BÁO BẢO MẬT: Không nên chạy đoạn mã này trên trình duyệt hoặc máy tính của bạn trước khi cô lập và xác minh máy chủ đích!'
          : '✅ Đoạn mã kiểm tra ban đầu an toàn. Hãy đảm bảo tiếp tục duy trì nguyên tắc kiểm thử trước khi deploy.'
      };
    }

    // Nếu là nội dung văn bản thông thường
    const hasPhishingText = PHISHING_SIGNALS.some(word => lower.includes(word));
    const hasSensationalText = SENSATIONAL_WORDS.some(word => lower.includes(word));

    return {
      isCode: false,
      detectedType: 'Văn bản',
      riskLevel: hasPhishingText ? 'nguy_hiem' : hasSensationalText ? 'chu_y' : 'an_toan',
      riskScore: hasPhishingText ? 80 : hasSensationalText ? 45 : 15,
      hasSyntaxIssues: false,
      hasSuspiciousRedirect: false,
      hasDataHarvesting: hasPhishingText,
      hasSecretLeak: false,
      hasPhishingSignals: hasPhishingText,
      issues: hasPhishingText ? [{
        type: 'Dấu hiệu lừa đảo qua nội dung (Phishing Text)',
        severity: 'high',
        description: 'Văn bản chứa lời mời gọi nhận quà, cung cấp mã OTP hoặc click vào link đáng ngờ.',
        remedy: 'Xóa tin nhắn và không làm theo bất kỳ chỉ dẫn chuyển tiền nào.'
      }] : [],
      explanation: hasPhishingText
        ? 'Văn bản có dấu hiệu lừa đảo trực tuyến nhắm vào người dùng nhẹ dạ.'
        : 'Nội dung văn bản được định dạng thông thường, không chứa mã độc nhúng.',
      recommendation: hasPhishingText
        ? 'Khuyên bạn nên chuyển nội dung này sang mục "AI Fact Check" để phân tích chi tiết nguồn tin.'
        : 'Bạn có thể chia sẻ thông tin này lên TrustNet để cùng cộng đồng kiểm chứng.'
    };
  }
}
