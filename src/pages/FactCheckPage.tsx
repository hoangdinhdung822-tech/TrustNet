import React, { useState } from 'react';
import { 
  Bot, 
  Search, 
  Sparkles, 
  ExternalLink, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle, 
  XCircle, 
  FileText, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  Loader2, 
  Settings,
  Zap,
  Key,
  Eye,
  EyeOff,
  X,
  Globe,
  AlertTriangle,
  Clock,
  Calendar,
  Layers
} from 'lucide-react';
import { AiVerificationService } from '../services/aiService';
import { DatabaseService } from '../services/dbMock';
import { AiVerificationResult, FactCheckRecord, User } from '../types';
import { AiStatusBadge } from '../components/AiStatusBadge';

interface FactCheckResultViewProps {
  result: AiVerificationResult;
  scrollToSource: (index: number) => void;
}

const FactCheckResultView: React.FC<FactCheckResultViewProps> = ({ result, scrollToSource }) => {
  const confidence = result.confidence ?? result.score ?? 50;
  const keyEvidence = result.keyEvidence ?? [];
  const limitations = result.limitations ?? result.unverifiedPoints ?? [];
  const searchQueries = result.searchQueries ?? result.googleSearchQueries ?? [];
  const sources = result.sources ?? [];

  return (
    <section className="glass-panel rounded-3xl p-6 md:p-8 space-y-7 animate-in zoom-in-95 duration-200">
      
      {/* Top Header: BÁO CÁO KIỂM CHỨNG & VERDICT BADGE & SCORE */}
      <div className="pb-6 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap text-xs font-bold uppercase tracking-wider text-slate-400">
            <span className="flex items-center gap-1.5 text-indigo-400">
              <Sparkles className="w-4 h-4" />
              BÁO CÁO KIỂM CHỨNG
            </span>
            {result.modelUsed && (
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
                <Zap className="w-3 h-3 text-cyan-400" />
                {result.modelUsed}
              </span>
            )}
            {result.timestampChecked && (
              <span className="text-[10px] text-slate-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Đã kiểm tra web tại: {result.timestampChecked}
              </span>
            )}
          </div>

          {/* [VERDICT BADGE] */}
          <div className="flex items-center gap-3 pt-1">
            <AiStatusBadge verdict={result.verdict} size="lg" showScore={false} />
          </div>
        </div>

        {/* Confidence Score Gauge */}
        <div className="flex items-center gap-4 bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shrink-0">
          <div className="text-center pr-3 border-r border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Mức độ tin cậy
            </span>
            <span className={`text-2xl md:text-3xl font-black font-mono ${
              confidence >= 80 ? 'text-emerald-400' :
              confidence >= 50 ? 'text-amber-400' :
              confidence >= 30 ? 'text-orange-400' : 'text-slate-400'
            }`}>
              {confidence}<span className="text-xs font-normal text-slate-500">/100</span>
            </span>
          </div>
          <div className="text-[11px] text-slate-400 max-w-[140px] leading-tight">
            {confidence >= 80 
              ? 'Độ tin cậy cao: Đã được nhiều nguồn uy tín xác thực'
              : confidence >= 50
              ? 'Độ tin cậy trung bình: Có căn cứ xác thực'
              : 'Độ tin cậy thấp: Chưa đủ nguồn kiểm chứng'}
          </div>
        </div>
      </div>

      {/* Section 13: Xử lý chuyên biệt khi "CHƯA ĐỦ DỮ LIỆU" (INSUFFICIENT_EVIDENCE) */}
      {result.verdict === 'INSUFFICIENT_EVIDENCE' && (
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-slate-200 space-y-3">
          <div className="flex items-center gap-2 text-slate-300 font-extrabold text-sm uppercase tracking-wide">
            <HelpCircle className="w-5 h-5 text-slate-400" />
            <span>⚪ CHƯA ĐỦ DỮ LIỆU</span>
          </div>
          <p className="text-sm font-semibold text-slate-200">
            TrustNet chưa tìm thấy đủ bằng chứng đáng tin cậy để xác minh hoàn toàn thông tin này.
          </p>
          <div className="text-xs text-slate-400 space-y-1.5 pt-1">
            <div>• <strong>Lý do chưa thể kết luận:</strong> {result.explanation || result.summary}</div>
            {limitations.length > 0 && (
              <div>• <strong>Dữ liệu còn thiếu:</strong> {limitations.join('; ')}</div>
            )}
          </div>
        </div>
      )}

      {/* User-Provided URL Context Report (nếu có) */}
      {result.urlContextAnalysis && (
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300 flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-cyan-400" />
              Đường dẫn nguồn người dùng đính kèm:
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              result.urlContextAnalysis.accessible 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
            }`}>
              {result.urlContextAnalysis.accessible ? '✓ Đã đọc & phân tích' : '✕ Không thể truy cập'}
            </span>
          </div>
          <div className="text-xs font-mono text-cyan-300 break-all">
            {result.urlContextAnalysis.providedUrl}
          </div>
          {result.urlContextAnalysis.error && (
            <div className="text-xs text-rose-400">
              {result.urlContextAnalysis.error}
            </div>
          )}
          {result.urlContextAnalysis.independentComparison && (
            <div className="text-[11px] text-slate-400 italic">
              * {result.urlContextAnalysis.independentComparison}
            </div>
          )}
        </div>
      )}

      {/* Section: CLAIM ĐƯỢC KIỂM TRA (Claim Extraction Decomposition) */}
      <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            CLAIM ĐƯỢC KIỂM TRA
          </h3>
          {result.claimAnalysis?.isVerifiable !== undefined && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {result.claimAnalysis.isVerifiable ? 'Có thể kiểm chứng' : 'Khó kiểm chứng'}
            </span>
          )}
        </div>

        <div className="text-sm md:text-base font-bold text-white bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80">
          "{result.claim || result.summary}"
        </div>

        {/* Bóc tách các thành phần cấu trúc của Claim */}
        {result.claimAnalysis && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
            {result.claimAnalysis.subject && (
              <div className="p-2 rounded-lg bg-slate-900/50 border border-slate-800">
                <span className="text-slate-500 block text-[10px] uppercase">Chủ thể</span>
                <span className="text-slate-200 font-semibold">{result.claimAnalysis.subject}</span>
              </div>
            )}
            {result.claimAnalysis.actionOrEvent && (
              <div className="p-2 rounded-lg bg-slate-900/50 border border-slate-800">
                <span className="text-slate-500 block text-[10px] uppercase">Hành động / Sự kiện</span>
                <span className="text-slate-200 font-semibold">{result.claimAnalysis.actionOrEvent}</span>
              </div>
            )}
            {result.claimAnalysis.time && (
              <div className="p-2 rounded-lg bg-slate-900/50 border border-slate-800">
                <span className="text-slate-500 block text-[10px] uppercase">Thời gian</span>
                <span className="text-slate-200 font-semibold">{result.claimAnalysis.time}</span>
              </div>
            )}
            {result.claimAnalysis.location && (
              <div className="p-2 rounded-lg bg-slate-900/50 border border-slate-800">
                <span className="text-slate-500 block text-[10px] uppercase">Địa điểm</span>
                <span className="text-slate-200 font-semibold">{result.claimAnalysis.location}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Section: KẾT LUẬN & TRỰC DIỆN (Google AI Overview Style) */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-950 border border-indigo-500/30 space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
          <span className="text-cyan-400 text-lg font-bold">✦</span>
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
            KẾT LUẬN & ĐÁP ÁN SỰ THẬT
          </h3>
        </div>

        <p className="text-sm md:text-base text-slate-100 font-medium leading-relaxed">
          {result.factAnswer || result.summary}
        </p>

        {result.explanation && result.explanation !== result.factAnswer && (
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed pt-1">
            {result.explanation}
          </p>
        )}
      </div>

      {/* Section: BẰNG CHỨNG (Evidence Items with Clickable Citations) */}
      <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-cyan-400" />
          BẰNG CHỨNG ĐÃ ĐỐI CHIẾU
        </h3>

        <div className="space-y-2.5">
          {keyEvidence.length === 0 ? (
            <p className="text-xs text-slate-400 italic">Đang tổng hợp bằng chứng từ mạng Internet...</p>
          ) : (
            keyEvidence.map((ev, idx) => (
              <div 
                key={idx}
                className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/90 text-xs text-slate-200 flex items-start gap-2.5 leading-relaxed"
              >
                <span className="text-indigo-400 font-bold shrink-0 mt-0.5">•</span>
                <div className="flex-1">
                  <span>{ev.statement}</span>

                  {/* Citations badges [1], [2] */}
                  {ev.citationIndices && ev.citationIndices.length > 0 && (
                    <span className="inline-flex items-center gap-1 ml-2">
                      {ev.citationIndices.map((cIdx) => (
                        <button
                          key={cIdx}
                          onClick={() => scrollToSource(cIdx)}
                          className="px-1.5 py-0.5 rounded bg-indigo-500/20 hover:bg-cyan-500/30 text-cyan-300 hover:text-white border border-indigo-500/40 text-[10px] font-mono font-bold transition-all cursor-pointer"
                          title={`Xem nguồn số [${cIdx}]`}
                        >
                          [{cIdx}]
                        </button>
                      ))}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Section: NGUỒN ĐÃ KIỂM TRA (Source Cards) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-cyan-400" />
            NGUỒN ĐÃ KIỂM TRA ({sources.length} NGUỒN THỰC TẾ)
          </h3>
          <span className="text-[10px] text-slate-400">
            Nguồn được trích xuất trực tiếp từ Google Search Grounding
          </span>
        </div>

        {sources.length === 0 ? (
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 italic">
            Không thu thập được đủ nguồn web độc lập qua Google Search Grounding.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {sources.map((source, idx) => {
              const citationIndex = idx + 1;
              return (
                <div
                  id={`source-card-${citationIndex}`}
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-3 group shadow-lg"
                >
                  <div className="space-y-2">
                    {/* Source Header: Citation Index + SourceType Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono font-bold text-xs">
                        [{citationIndex}]
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-cyan-300">
                        {source.sourceType || 'UNKNOWN'}
                      </span>
                    </div>

                    {/* Title */}
                    <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                      {source.title}
                    </h4>

                    {/* Publisher & Domain */}
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span className="truncate">{source.publisher || source.domain}</span>
                      {source.domain && <span className="text-slate-600">•</span>}
                      {source.domain && <span className="font-mono text-slate-400">{source.domain}</span>}
                    </div>

                    {/* Published Date if available */}
                    {source.publishedDate && (
                      <div className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{source.publishedDate}</span>
                      </div>
                    )}

                    {/* Why this source matters / Summary */}
                    {(source.summary || source.evidenceSummary) && (
                      <p className="text-[11px] text-slate-300 leading-snug line-clamp-3 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800/80">
                        <strong className="text-cyan-400">Ý nghĩa: </strong>{source.summary || source.evidenceSummary}
                      </p>
                    )}
                  </div>

                  {/* Footer: Stance & Open Source Link */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5">
                      {source.contradictsClaim && (
                        <span className="text-[10px] text-rose-400 font-semibold flex items-center gap-1">
                          <XCircle className="w-3 h-3" /> Phản bác claim
                        </span>
                      )}
                      {source.supportsClaim && (
                        <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Hỗ trợ claim
                        </span>
                      )}
                      {!source.contradictsClaim && !source.supportsClaim && (
                        <span className="text-[10px] text-slate-400">Nguồn tham chiếu</span>
                      )}
                    </div>

                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-cyan-400 hover:text-white font-semibold transition-colors group/link"
                    >
                      <span>Mở nguồn</span>
                      <ExternalLink className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Section: TRUY VẤN ĐÃ SỬ DỤNG (Search Queries) */}
      <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Search className="w-3.5 h-3.5 text-cyan-400" />
          TRUY VẤN ĐÃ SỬ DỤNG TRÊN GOOGLE SEARCH
        </span>
        <div className="flex flex-wrap gap-2 pt-1">
          {searchQueries.map((query, idx) => (
            <a
              key={idx}
              href={`https://www.google.com/search?q=${encodeURIComponent(query)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500/50 text-cyan-300 hover:text-white text-xs font-mono transition-all group"
              title="Nhấn để tìm kiếm truy vấn này trực tiếp trên Google"
            >
              <span>🔍 "{query}"</span>
              <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-cyan-400" />
            </a>
          ))}
        </div>
      </div>

      {/* Section: GIỚI HẠN KIỂM CHỨNG & THỜI ĐIỂM (Limitations) */}
      <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          GIỚI HẠN KIỂM CHỨNG
        </span>
        <div className="text-xs text-slate-400 space-y-1">
          {limitations.length > 0 ? (
            limitations.map((lim, idx) => (
              <p key={idx}>• {lim}</p>
            ))
          ) : (
            <p>• Báo cáo phản ánh thông tin tính đến thời điểm tra cứu ({result.timestampChecked || 'vừa xong'}).</p>
          )}
          {result.timestampChecked && (
            <p className="text-[11px] text-cyan-300 pt-1 font-mono">
              • Đã kiểm tra web tại: {result.timestampChecked}
            </p>
          )}
        </div>
      </div>

      {/* Recommendation Box */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/60 to-purple-950/40 border border-indigo-500/30 text-xs md:text-sm text-indigo-200">
        <span className="font-bold text-cyan-300">💡 Lời khuyên công dân số: </span>
        {result.recommendation}
      </div>

    </section>
  );
};

interface Props {
  user: User;
  onUserUpdate: (u: User) => void;
}

export const FactCheckPage: React.FC<Props> = ({ user, onUserUpdate }) => {
  const [inputText, setInputText] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [inputMode, setInputMode] = useState<'text' | 'statement' | 'social_post' | 'url' | 'image'>('text');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState('');
  const [result, setResult] = useState<AiVerificationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [simulatedImageName, setSimulatedImageName] = useState<string | null>(null);

  // Gemini Settings State
  const [apiKey, setApiKey] = useState<string>(() => AiVerificationService.getGeminiApiKey() || '');
  const [selectedModel, setSelectedModel] = useState<string>(() => AiVerificationService.getGeminiModel() || 'gemini-2.5-flash');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showKeyText, setShowKeyText] = useState(false);
  const [testState, setTestState] = useState<{ testing: boolean; message: string | null; success: boolean | null }>({
    testing: false,
    message: null,
    success: null
  });

  const hasGeminiKey = Boolean(apiKey && apiKey.trim().length > 0);

  // Sample Presets for Gen Z and Students to test immediately
  const samplePresets = [
    {
      label: 'Wat Pho Thái Lan (TEST 3)',
      text: 'Chùa Wat Pho là cây cầu nổi tiếng của Thái Lan',
      url: ''
    },
    {
      label: 'Thủ đô Việt Nam là Hà Nội (TEST 1)',
      text: 'Thủ đô của Việt Nam là Hà Nội.',
      url: ''
    },
    {
      label: 'Thủ đô là TP.HCM (TEST 2)',
      text: 'Thủ đô của Việt Nam là Thành phố Hồ Chí Minh.',
      url: ''
    },
    {
      label: 'Claim mơ hồ khó kiểm chứng (TEST 4)',
      text: 'Vào năm 1742, người ngoài hành tinh đã bí mật ký hiệp ước với các nhà giả kim thuật tại châu Âu.',
      url: ''
    },
    {
      label: 'Thông tin một phần đúng (TEST 5)',
      text: 'Cà rốt chứa vitamin A giúp mắt sáng và chữa khỏi 100% bệnh cận thị trong 1 tuần.',
      url: ''
    },
    {
      label: 'Thời sự mới nhất (TEST 6)',
      text: 'Thời tiết hiện nay tại Hà Nội đang có nhiệt độ khoảng bao nhiêu độ C?',
      url: ''
    },
    {
      label: 'Lừa đảo trúng thưởng',
      text: 'Chúc mừng bạn đã trúng 50.000.000 VNĐ. Nhấn vào link http://nhanthuong-50trieu.gift-claim.xyz để nhận tiền.',
      url: 'http://nhanthuong-50trieu.gift-claim.xyz'
    }
  ];

  const handleRunCheck = async () => {
    if (!inputText.trim() && !sourceUrl.trim()) return;

    setIsAnalyzing(true);
    setResult(null);
    setErrorMessage(null);

    try {
      const fullText = inputText || `Kiểm tra nội dung tại địa chỉ: ${sourceUrl}`;
      const res = await AiVerificationService.verifyContent(fullText, sourceUrl, (step) => {
        setAnalysisStep(step);
      });
      setResult(res);

      // Lưu lịch sử kiểm chứng & cộng điểm XP
      const record: FactCheckRecord = {
        id: 'fc-' + Date.now(),
        userId: user.id,
        inputText: fullText,
        inputCategory: inputMode,
        result: res,
        createdAt: 'Vừa xong'
      };
      DatabaseService.saveFactCheckRecord(record);
      onUserUpdate(DatabaseService.getCurrentUser());

    } catch (err: any) {
      console.error('Fact-check failure:', err);
      const msg = err?.message || 'Có lỗi xảy ra trong quá trình kiểm chứng thông tin.';
      setErrorMessage(msg);
      if (msg.includes('API_KEY') || msg.includes('GEMINI_API_KEY')) {
        setIsSettingsOpen(true);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectPreset = (preset: typeof samplePresets[0]) => {
    setInputText(preset.text);
    setSourceUrl(preset.url);
    setResult(null);
    setErrorMessage(null);
  };

  const handleSimulateImageUpload = () => {
    setSimulatedImageName('screenshot_tinnhan_fb.png');
    setInputText('Hệ thống OCR trích xuất: "Wat Pho là cây cầu dây văng lớn nhất nối liền hai bờ sông Chao Phraya ở Thái Lan."');
  };

  const handleTestConnection = async () => {
    setTestState({ testing: true, message: 'Đang gửi kiểm tra tới Google Gemini qua máy chủ...', success: null });
    const res = await AiVerificationService.testGeminiConnection(apiKey, selectedModel);
    if (res.resolvedModel && res.resolvedModel !== selectedModel) {
      setSelectedModel(res.resolvedModel);
      AiVerificationService.setGeminiModel(res.resolvedModel);
    }
    setTestState({ testing: false, message: res.message, success: res.success });
  };

  const handleSaveSettings = () => {
    AiVerificationService.setGeminiApiKey(apiKey);
    AiVerificationService.setGeminiModel(selectedModel);
    setIsSettingsOpen(false);
  };

  const handleClearKey = () => {
    AiVerificationService.setGeminiApiKey('');
    setApiKey('');
    setTestState({ testing: false, message: null, success: null });
  };

  const scrollToSource = (index: number) => {
    const el = document.getElementById(`source-card-${index}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('ring-2', 'ring-cyan-400');
      setTimeout(() => {
        el.classList.remove('ring-2', 'ring-cyan-400');
      }, 1800);
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      
      {/* Header Banner */}
      <section className="glass-panel rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-indigo-500/20 via-cyan-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Bot className="w-4 h-4" />
              <span>Hệ Thống Fact-Checking Chuyên Sâu • Google Search Grounding</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-white">
              Kiểm Chứng Tính Xác Thực Đa Nguồn Bằng AI
            </h1>
            <p className="text-xs md:text-sm text-slate-300 mt-2 leading-relaxed">
              Nhập nội dung, bài báo hoặc đường link cần kiểm tra. Hệ thống kích hoạt <strong>Google Search Grounding</strong> để truy xuất dữ liệu độc lập thời gian thực, bóc tách luận điểm, đối chiếu bằng chứng và cung cấp trích dẫn nguồn thực tế.
            </p>
          </div>

          {/* Model Status & Config Button */}
          <div className="shrink-0 flex items-center gap-2">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold border border-emerald-500/40 bg-emerald-950/40 text-emerald-300 shadow-glow-emerald hover:bg-emerald-900/40 transition-all"
              title="Google Search Grounding đang kích hoạt. Nhấn để xem cấu hình hoặc thêm API Key."
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>Google Gemini ({selectedModel}) • {hasGeminiKey ? 'Khóa riêng' : 'Server Default'}</span>
              <Settings className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </button>
          </div>
        </div>

        {/* Input Mode Selector Chips */}
        <div className="flex items-center gap-2 mt-5 overflow-x-auto pb-1">
          {[
            { id: 'text', label: 'Văn bản / Câu nói', icon: FileText },
            { id: 'url', label: 'Đường dẫn liên kết (URL)', icon: LinkIcon },
            { id: 'image', label: 'Quét ảnh / Ảnh chụp màn hình (OCR)', icon: ImageIcon },
          ].map((mode) => {
            const Icon = mode.icon;
            const isSelected = inputMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setInputMode(mode.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-glow-sm'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>

      </section>

      {/* Main Fact-Check Input Card */}
      <section className="glass-panel rounded-3xl p-5 md:p-6 space-y-4">
        
        {/* Presets Chips */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Thử nhanh các tình huống thực tế:
          </span>
          <div className="flex flex-wrap gap-2">
            {samplePresets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectPreset(preset)}
                className="px-3 py-1 rounded-xl text-xs bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
              >
                👉 {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Text Input Area */}
        <div className="relative">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Dán nội dung bài đăng Facebook, tin đồn TikTok, phát ngôn hoặc thông tin bạn muốn kiểm tra vào đây..."
            rows={4}
            className="w-full px-4 py-3 rounded-2xl bg-slate-950/80 border border-slate-800 focus:border-indigo-500 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none transition-all resize-none font-sans"
          />

          {inputMode === 'image' && (
            <div className="mt-2 p-3 rounded-xl bg-slate-900 border border-dashed border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <ImageIcon className="w-4 h-4 text-cyan-400" />
                <span>{simulatedImageName || 'Tải lên ảnh chụp màn hình tin nhắn hoặc bài đăng'}</span>
              </div>
              <button
                onClick={handleSimulateImageUpload}
                className="px-3 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 text-xs font-semibold border border-indigo-500/30"
              >
                Chọn ảnh mô phỏng
              </button>
            </div>
          )}
        </div>

        {/* Source URL Optional Input */}
        <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-3">
          <LinkIcon className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="url"
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
            placeholder="Đường dẫn nguồn bài viết gốc (nếu có, VD: https://chinhphu.vn/...)"
            className="w-full bg-transparent text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none"
          />
        </div>

        {/* Error Alert if any */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-start justify-between gap-3 animate-in fade-in">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block mb-0.5">Không thể hoàn tất kiểm chứng:</span>
                <span>{errorMessage}</span>
              </div>
            </div>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-rose-900/60 hover:bg-rose-800/80 text-rose-200 font-bold shrink-0 text-[11px] border border-rose-500/30"
            >
              Mở Cấu hình
            </button>
          </div>
        )}

        {/* Submit Button & Model Status indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <span className="text-cyan-400 font-semibold flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-cyan-400" /> Google Search Grounding trực tiếp • Đối chiếu nguồn độc lập
            </span>
          </div>

          <button
            onClick={handleRunCheck}
            disabled={(!inputText.trim() && !sourceUrl.trim()) || isAnalyzing}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 disabled:opacity-50 text-white font-extrabold text-xs md:text-sm shadow-glow-sm hover:shadow-glow-cyan transition-all"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang quét Google Search...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>🔍 Kiểm tra bằng AI</span>
              </>
            )}
          </button>
        </div>

      </section>

      {/* Scanning Radar Progress Animation */}
      {isAnalyzing && (
        <section className="glass-panel rounded-3xl p-6 text-center space-y-4 animate-pulse">
          <div className="relative w-16 h-16 mx-auto">
            <div className="w-full h-full rounded-full border-2 border-indigo-500/40 flex items-center justify-center">
              <Bot className="w-8 h-8 text-cyan-400" />
            </div>
            <div className="absolute inset-0 rounded-full border border-cyan-400 radar-beam" />
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">TrustNet AI Fact-Checking Engine đang phân tích...</h3>
            <p className="text-xs text-indigo-300 font-mono">
              {analysisStep || 'Đang kết nối Google Search Grounding để đối soát dữ liệu trên mạng Internet...'}
            </p>
          </div>

          <div className="w-full max-w-md mx-auto bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 animate-shimmer" style={{ width: '100%' }} />
          </div>
        </section>
      )}

      {/* DETAILED FACT-CHECK RESULTS (Theo chuẩn Section 12 & 13) */}
      {result && !isAnalyzing && (
        <FactCheckResultView result={result} scrollToSource={scrollToSource} />
      )}

      {/* Gemini Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative text-slate-100 space-y-5">
            
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-cyan-300 border border-indigo-500/30">
                  <Zap className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Cấu hình Google Gemini AI</h3>
                  <p className="text-xs text-slate-400">Kết nối máy chủ kiểm chứng với Google Search Grounding</p>
                </div>
              </div>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white bg-slate-800/60"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Feature Note: Google Search Grounding */}
            <div className="p-3.5 rounded-2xl bg-blue-950/30 border border-blue-500/20 text-xs text-blue-200 flex items-start gap-2.5">
              <Globe className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-cyan-300 block mb-0.5">Google Search Grounding kích hoạt:</span>
                Hệ thống tự động sử dụng Google Search để tìm kiếm và đối chiếu với các bài viết thực tế trên mạng Internet trước khi kết luận.
              </div>
            </div>

            {/* API Key Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>Google Gemini API Key:</span>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:underline flex items-center gap-1 font-normal text-[11px]"
                >
                  <span>Lấy key miễn phí tại AI Studio</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </label>

              <div className="relative">
                <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showKeyText ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => {
                    setApiKey(e.target.value);
                    setTestState({ testing: false, message: null, success: null });
                  }}
                  placeholder="AIzaSy... (hoặc để trống nếu server đã có .env)"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowKeyText(!showKeyText)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showKeyText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-500">
                * Khóa API được gửi an toàn tới endpoint máy chủ để thực hiện truy vấn và không bao giờ xuất hiện trong mã nguồn client.
              </p>
            </div>

            {/* Model Selection */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 block">
                  Chọn phiên bản mô hình Gemini:
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedModel('gemini-2.5-flash');
                    AiVerificationService.setGeminiModel('gemini-2.5-flash');
                  }}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1 font-semibold"
                >
                  ⚡ Đặt về gemini-2.5-flash (Ổn định nhất)
                </button>
              </div>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="gemini-2.5-flash">gemini-2.5-flash (Khuyên dùng: Tốc độ cao, ổn định nhất của Google)</option>
                <option value="gemini-2.0-flash">gemini-2.0-flash (Thế hệ Flash 2.0 phản hồi siêu nhanh)</option>
                <option value="gemini-1.5-flash">gemini-1.5-flash (Thế hệ 1.5 ổn định cao)</option>
                <option value="gemini-3.8-flash">gemini-3.8-flash (Bản mới nhất - Có thể quá tải tạm thời trên Google)</option>
              </select>
            </div>

            {/* Test Status feedback */}
            {testState.message && (
              <div className={`p-3 rounded-xl border text-xs leading-relaxed ${
                testState.success 
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' 
                  : testState.success === false
                  ? 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                  : 'bg-indigo-950/40 border-indigo-500/40 text-indigo-300'
              }`}>
                {testState.message}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testState.testing || !apiKey.trim()}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                {testState.testing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Kiểm tra kết nối</span>
              </button>

              <div className="flex items-center gap-2">
                {hasGeminiKey && (
                  <button
                    type="button"
                    onClick={handleClearKey}
                    className="px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-950/30 text-xs font-semibold"
                  >
                    Ngắt kết nối
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleSaveSettings}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-bold shadow-glow-sm"
                >
                  Lưu & Áp dụng
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
