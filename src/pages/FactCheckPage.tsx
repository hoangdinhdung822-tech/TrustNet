import React, { useState, useEffect } from 'react';
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
  ShieldCheck, 
  Loader2, 
  ArrowRight, 
  BookmarkCheck, 
  Share2,
  Settings,
  Zap,
  Key,
  Eye,
  EyeOff,
  Check,
  X,
  Globe,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { AiVerificationService } from '../services/aiService';
import { DatabaseService } from '../services/dbMock';
import { AiVerificationResult, FactCheckRecord, User } from '../types';
import { AiStatusBadge } from '../components/AiStatusBadge';

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
  const [simulatedImageName, setSimulatedImageName] = useState<string | null>(null);

  // Gemini Settings State
  const [apiKey, setApiKey] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('gemini-1.5-flash');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showKeyText, setShowKeyText] = useState(false);
  const [testState, setTestState] = useState<{ testing: boolean; message: string | null; success: boolean | null }>({
    testing: false,
    message: null,
    success: null
  });

  useEffect(() => {
    setApiKey(AiVerificationService.getGeminiApiKey() || '');
    setSelectedModel(AiVerificationService.getGeminiModel());
  }, []);

  const hasGeminiKey = Boolean(apiKey && apiKey.trim().length > 0);

  // Sample Presets for Gen Z and Students to try immediately
  const samplePresets = [
    {
      label: 'Thủ tướng Phạm Minh Chính (Ảnh mẫu)',
      text: 'mai là ngày sinh của thủ tướng phạm minh chính',
      url: ''
    },
    {
      label: 'Ca sĩ Mỹ Tâm (Live Web)',
      text: 'mai là ngày sinh của ca sĩ Mỹ Tâm',
      url: ''
    },
    {
      label: 'Sơn Tùng M-TP (Live Web)',
      text: 'mai là ngày sinh của ca sĩ Sơn Tùng M-TP',
      url: ''
    },
    {
      label: 'Sinh nhật Bác Hồ',
      text: 'Mai là ngày sinh của Bác Hồ',
      url: ''
    },
    {
      label: 'Địa lý: Tháp Eiffel (Live Web)',
      text: 'Tháp Eiffel nằm ở Paris có đúng không',
      url: ''
    },
    {
      label: 'Lừa đảo trúng thưởng',
      text: 'Chúc mừng bạn đã trúng 50.000.000 VNĐ. Nhấn vào link http://nhanthuong-50trieu.gift-claim.xyz để nhận tiền.',
      url: 'http://nhanthuong-50trieu.gift-claim.xyz'
    },
    {
      label: 'Sức khỏe giật gân',
      text: 'Uống nước chanh sả gừng lúc sáng sớm chữa khỏi 100% mọi biến thể cúm mùa và virus mới mà không cần tới bệnh viện!',
      url: ''
    }
  ];

  const handleRunCheck = async () => {
    if (!inputText.trim() && !sourceUrl.trim()) return;

    setIsAnalyzing(true);
    setResult(null);

    try {
      const fullText = inputText || `Kiểm tra địa chỉ website: ${sourceUrl}`;
      const res = await AiVerificationService.verifyContent(fullText, sourceUrl, (step) => {
        setAnalysisStep(step);
      });
      setResult(res);

      // Save to Fact-Check history & award XP
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

    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectPreset = (preset: typeof samplePresets[0]) => {
    setInputText(preset.text);
    setSourceUrl(preset.url);
    setResult(null);
  };

  const handleSimulateImageUpload = () => {
    setSimulatedImageName('screenshot_tinnhan_fb.png');
    setInputText('Hệ thống OCR nhận diện văn bản từ ảnh: "Cảnh báo khẩn cấp: Nhập mã OTP để nhận 5 triệu đồng hỗ trợ sinh viên nghèo từ quỹ khuyến học trực tuyến"');
  };

  const handleTestConnection = async () => {
    if (!apiKey.trim()) {
      setTestState({ testing: false, message: 'Vui lòng nhập API Key trước khi kiểm tra.', success: false });
      return;
    }
    setTestState({ testing: true, message: 'Đang gửi ping kiểm tra tới Google Gemini API...', success: null });
    const res = await AiVerificationService.testGeminiConnection(apiKey, selectedModel);
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

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      
      {/* Header Banner */}
      <section className="glass-panel rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-indigo-500/20 via-cyan-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Bot className="w-4 h-4" />
              <span>AI Fact Check Engine & Google Search Grounding</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-white">
              Kiểm Chứng Tính Xác Thực Bằng AI & Google
            </h1>
            <p className="text-xs md:text-sm text-slate-300 mt-2 leading-relaxed">
              Dán một đoạn văn, một câu nói, đường link bài báo hoặc hình ảnh bạn còn nghi ngờ.
              Trợ lý AI tự động nhờ <strong>Google Search</strong> tra cứu và đối chiếu với dữ liệu thời gian thực trên mạng Internet để xác minh tính chính xác, phát hiện tin giả và lừa đảo.
            </p>
          </div>

          {/* Gemini AI Status Pill & Config Button */}
          <div className="shrink-0 flex items-center gap-2">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold border transition-all ${
                hasGeminiKey
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 shadow-glow-emerald hover:bg-emerald-900/40'
                  : 'bg-indigo-950/50 hover:bg-indigo-900/60 border-indigo-500/40 text-cyan-300 shadow-glow-sm'
              }`}
            >
              {hasGeminiKey ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <Zap className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Google {selectedModel}</span>
                  <Settings className="w-3.5 h-3.5 text-slate-400 ml-1" />
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                  <span>Kết nối Gemini / Google AI</span>
                  <Settings className="w-3.5 h-3.5 text-slate-400 ml-1" />
                </>
              )}
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
            Thử nhanh các tình huống mẫu:
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
            rows={5}
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

        {/* Submit Button & Model Status indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            {hasGeminiKey ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" /> Chế độ Google Gemini ({selectedModel}) đang sẵn sàng
              </span>
            ) : (
              <span>
                * Chế độ AI Demo Heuristics. Bạn có thể bấm <strong onClick={() => setIsSettingsOpen(true)} className="text-indigo-400 cursor-pointer underline">Kết nối Gemini</strong> để phân tích trực tiếp với Google AI!
              </span>
            )}
          </div>

          <button
            onClick={handleRunCheck}
            disabled={(!inputText.trim() && !sourceUrl.trim()) || isAnalyzing}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 disabled:opacity-50 text-white font-extrabold text-xs md:text-sm shadow-glow-sm hover:shadow-glow-cyan transition-all"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang quét dữ liệu...</span>
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
            <h3 className="text-base font-bold text-white">AI đang phân tích & đối soát chéo...</h3>
            <p className="text-xs text-indigo-300 font-mono">
              {analysisStep || (hasGeminiKey ? 'Đang gửi dữ liệu phân tích tới Google Gemini API...' : 'Đang kết nối kho dữ liệu báo chí chính thống & cổng an toàn thông tin')}
            </p>
          </div>

          <div className="w-full max-w-md mx-auto bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 animate-shimmer" style={{ width: '100%' }} />
          </div>
        </section>
      )}

      {/* Section 4: Detailed AI Fact Check Results */}
      {result && !isAnalyzing && (
        <section className="glass-panel rounded-3xl p-6 md:p-8 space-y-6 animate-in zoom-in-95 duration-200">
          
          {/* Top Result Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap text-xs font-bold uppercase tracking-wider text-slate-400">
                <span className="flex items-center gap-1.5 text-indigo-400">
                  <Sparkles className="w-4 h-4" />
                  Báo cáo kiểm chứng kết luận
                </span>
                {result.modelUsed && (
                  <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 text-cyan-300 border border-indigo-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
                    <Zap className="w-3 h-3 text-cyan-400" />
                    {result.modelUsed}
                  </span>
                )}
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white">
                {result.summary}
              </h2>
            </div>

            {/* Score Gauge & Status Pill */}
            <div className="flex items-center gap-4 bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800">
              <div className="text-center pr-3 border-r border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Độ tin cậy</span>
                <span className={`text-2xl font-black font-mono ${
                  result.score >= 80 ? 'text-emerald-400' :
                  result.score >= 50 ? 'text-amber-400' :
                  result.score >= 30 ? 'text-orange-400' : 'text-rose-400'
                }`}>
                  {result.score}<span className="text-xs font-normal text-slate-500">/100</span>
                </span>
              </div>
              <AiStatusBadge status={result.status} score={result.score} size="lg" />
            </div>

          </div>

          {/* GOOGLE AI OVERVIEW COMPONENT - "✦ Thông tin tổng quan do AI tạo & Đáp án sự thật" */}
          <div className="rounded-3xl p-5 md:p-6 bg-gradient-to-br from-slate-900/90 via-indigo-950/40 to-slate-950 border border-indigo-500/30 shadow-xl relative overflow-hidden space-y-4">
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header: Sparkle + Title + Direct Verdict Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-cyan-400 text-xl font-bold animate-pulse">✦</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-indigo-200 to-cyan-300 font-extrabold text-sm md:text-base">
                  Thông tin tổng quan do AI tạo
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                  Google Search AI Overview
                </span>
              </div>

              {result.directVerdict && (
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase flex items-center gap-1.5 shadow-sm ${
                    result.directVerdict === 'ĐÚNG'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : result.directVerdict === 'SAI'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : result.directVerdict === 'CẢNH BÁO'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                  }`}>
                    {result.directVerdict === 'ĐÚNG' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    {result.directVerdict === 'SAI' && <XCircle className="w-3.5 h-3.5 text-rose-400" />}
                    {result.directVerdict === 'CẢNH BÁO' && <AlertCircle className="w-3.5 h-3.5 text-amber-400" />}
                    {result.directVerdict === 'CHƯA RÕ' && <HelpCircle className="w-3.5 h-3.5 text-blue-400" />}
                    <span>KẾT LUẬN: {result.directVerdict}</span>
                  </span>
                </div>
              )}
            </div>

            {/* Fact Answer & Side Official Source Card */}
            <div className="flex flex-col lg:flex-row items-stretch gap-5 pt-1">
              <div className="flex-1 space-y-3">
                <p className="text-sm md:text-base text-slate-100 leading-relaxed font-normal">
                  {result.factAnswer || result.reasoning}
                </p>

                {/* Subtext Warning & Action Buttons like Google AI Overview */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400 pt-3 border-t border-slate-800/80">
                  <span className="flex items-center gap-1.5 text-slate-400 italic">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    AI có thể mắc sai sót. Vì vậy, hãy luôn xác minh câu trả lời với tài liệu chính thống.
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button 
                      type="button"
                      title="Hữu ích"
                      className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-emerald-400 transition-colors"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      type="button"
                      title="Chưa chính xác"
                      className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      type="button"
                      title="Chia sẻ kết quả"
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({ title: 'TrustNet AI Fact Check', text: result.factAnswer || result.summary, url: window.location.href });
                        }
                      }}
                      className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition-colors"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Side Source Card - Trích xuất nguồn chính thức */}
              {result.featuredSourceCard && (
                <a
                  href={result.featuredSourceCard.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lg:w-80 shrink-0 p-4 rounded-2xl bg-slate-950/90 border border-indigo-500/30 hover:border-cyan-400/60 transition-all group flex flex-col justify-between space-y-2 shadow-xl hover:shadow-cyan-500/10"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-cyan-300">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      <span className="truncate">{result.featuredSourceCard.organization}</span>
                    </div>
                    <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                      {result.featuredSourceCard.title}
                    </h4>
                    <p className="text-[11px] text-slate-300 leading-snug line-clamp-3">
                      {result.featuredSourceCard.snippet}
                    </p>
                  </div>
                  <div className="pt-2 flex items-center justify-between text-[11px] text-indigo-400 border-t border-slate-800 font-medium">
                    <span>Xem văn bản đối chiếu</span>
                    <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </a>
              )}
            </div>

          </div>

          {/* Claims, Evidence & Unverified Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Tuyên bố chính */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                Tuyên bố chính trong nội dung (Claims)
              </h3>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                {result.claims.map((claim, idx) => (
                  <li key={idx} className="leading-snug">{claim}</li>
                ))}
              </ul>
            </div>

            {/* Bằng chứng hỗ trợ hoặc mâu thuẫn */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              {result.supportingEvidence.length > 0 ? (
                <>
                  <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Bằng chứng hỗ trợ
                  </h3>
                  <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                    {result.supportingEvidence.map((ev, idx) => (
                      <li key={idx}>{ev}</li>
                    ))}
                  </ul>
                </>
              ) : (
                <>
                  <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                    <XCircle className="w-4 h-4 text-rose-400" />
                    Bằng chứng mâu thuẫn / Bác bỏ
                  </h3>
                  <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                    {result.refutingEvidence.map((ev, idx) => (
                      <li key={idx}>{ev}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            {/* Điểm chưa thể xác minh */}
            {result.unverifiedPoints.length > 0 && (
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  Điểm chưa thể xác minh
                </h3>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                  {result.unverifiedPoints.map((p, idx) => (
                    <li key={idx}>{p}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Từ ngữ gây hiểu lầm */}
            {result.misleadingTerms.length > 0 && (
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                <h3 className="text-xs font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-orange-400" />
                  Từ ngữ có dấu hiệu gây hiểu lầm / Thao túng
                </h3>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {result.misleadingTerms.map((term, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-orange-500/10 text-orange-300 border border-orange-500/20 text-xs font-medium">
                      "{term}"
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Google Search Live Grounding & Internet Verification Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-950/40 via-slate-900 to-indigo-950/40 border border-blue-500/30 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-blue-500/20">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  <Globe className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    Đối chiếu & Kiểm chứng thực tế từ Google Search trên Internet
                  </h3>
                  <p className="text-xs text-slate-400">
                    Hệ thống AI tự động tra cứu dữ liệu web thời gian thực để đối soát tính xác thực của tuyên bố
                  </p>
                </div>
              </div>
              <div>
                {result.isGoogleSearchVerified ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Google Search Live Grounding ⚡
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-semibold">
                    <Globe className="w-3.5 h-3.5 text-cyan-400" />
                    Đối chiếu dữ liệu trực tuyến Google
                  </span>
                )}
              </div>
            </div>

            {/* Từ khóa Google đã tra cứu */}
            {result.googleSearchQueries && result.googleSearchQueries.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5 text-cyan-400" />
                  Từ khóa AI tạo để đối soát trên Google:
                </span>
                <div className="flex flex-wrap gap-2">
                  {result.googleSearchQueries.map((query, idx) => (
                    <a
                      key={idx}
                      href={`https://www.google.com/search?q=${encodeURIComponent(query)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-950/80 border border-slate-700 hover:border-cyan-500/50 text-cyan-300 hover:text-white text-xs font-mono transition-all group"
                      title="Nhấn để tìm kiếm truy vấn này trực tiếp trên Google"
                    >
                      <span>🔍 "{query}"</span>
                      <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-cyan-400" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Danh sách kết quả web tìm thấy từ Google Grounding (nếu có) */}
            {result.googleGroundingSources && result.googleGroundingSources.length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  Tài liệu & Bài viết được Google xác thực trên mạng:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {result.googleGroundingSources.map((gSource, idx) => (
                    <a
                      key={idx}
                      href={gSource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-blue-500/40 text-slate-300 hover:text-white text-xs transition-all group"
                    >
                      <span className="truncate pr-2 font-medium">{gSource.title}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-blue-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Nút kiểm tra chéo 1-chạm trên Google */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
              <p className="text-xs text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Bạn muốn tự tay xem kết quả trực tiếp từ hàng triệu trang web trên Google?</span>
              </p>
              <a
                href={result.googleSearchUrl || `https://www.google.com/search?q=${encodeURIComponent(inputText.slice(0, 80))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] shrink-0"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Mở Google tìm kiếm trực tiếp nội dung này</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Sources List */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
              🌐 Nguồn tham khảo chính thống để tự đối chiếu:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {result.sources.map((s, idx) => (
                <a
                  key={idx}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 text-slate-200 hover:text-white transition-all group"
                >
                  <span className="text-xs font-medium truncate pr-2">{s.title}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-indigo-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                </a>
              ))}
            </div>
          </div>

          {/* Recommendation Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/60 to-purple-950/40 border border-indigo-500/30 text-xs md:text-sm text-indigo-200">
            <span className="font-bold text-cyan-300">💡 Lời khuyên công dân số: </span>
            {result.recommendation}
          </div>

        </section>
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
                  <p className="text-xs text-slate-400">Kết nối trực tiếp trí tuệ nhân tạo của Google & Google Search</p>
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
                <span className="font-bold text-cyan-300 block mb-0.5">Tích hợp Google Search Grounding:</span>
                Khi kết nối Gemini, AI tự động nhờ Google tìm kiếm và đối chiếu với các bài viết, tin tức mới nhất trên mạng Internet để xác minh tính chính xác trước khi phản hồi.
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
                  placeholder="AIzaSy..."
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
                * Khóa API được lưu cục bộ an toàn trên trình duyệt của bạn (LocalStorage) và không gửi đi bất kỳ bên thứ ba nào.
              </p>
            </div>

            {/* Model Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 block">
                Chọn phiên bản mô hình Gemini:
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="gemini-1.5-flash">gemini-1.5-flash (Khuyên dùng: Siêu nhanh, miễn phí & chính xác)</option>
                <option value="gemini-2.0-flash">gemini-2.0-flash (Thế hệ mới nhất của Google)</option>
                <option value="gemini-1.5-pro">gemini-1.5-pro (Tư duy suy luận sâu)</option>
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
