import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck, 
  Loader2,
  RefreshCw
} from 'lucide-react';
import { AiVerificationService } from '../services/aiService';
import { DatabaseService } from '../services/dbMock';
import { AiVerificationResult, Post, User } from '../types';
import { AiStatusBadge } from './AiStatusBadge';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onPostCreated: (post: Post) => void;
}

export const CreatePostModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentUser,
  onPostCreated
}) => {
  const [content, setContent] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [showSourceInput, setShowSourceInput] = useState(false);

  // AI Verification State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState('');
  const [aiResult, setAiResult] = useState<AiVerificationResult | null>(null);

  if (!isOpen) return null;

  const handleStartVerification = async () => {
    if (!content.trim()) return;
    setIsAnalyzing(true);
    setAiResult(null);

    try {
      const result = await AiVerificationService.verifyContent(content, sourceUrl, (step) => {
        setAnalysisStep(step);
      });
      setAiResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePublish = () => {
    if (!content.trim() || !aiResult) return;

    const newPost: Post = {
      id: 'post-' + Date.now(),
      userId: currentUser.id,
      author: {
        id: currentUser.id,
        name: currentUser.name,
        username: currentUser.username,
        avatar: currentUser.avatar,
        rankTitle: currentUser.rankTitle,
        isVerifiedUser: true
      },
      content: content.trim(),
      imageUrl: imageUrl.trim() || undefined,
      sourceUrl: sourceUrl.trim() || undefined,
      verificationStatus: aiResult.status,
      verificationScore: aiResult.score,
      aiExplanation: aiResult,
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      isLiked: false,
      isSaved: false,
      createdAt: 'Vừa xong'
    };

    DatabaseService.createPost(newPost);
    onPostCreated(newPost);
    
    // Reset form
    setContent('');
    setSourceUrl('');
    setImageUrl('');
    setAiResult(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative text-slate-100 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Tạo bài viết mới & Kiểm chứng AI</h2>
              <p className="text-xs text-slate-400">Đăng tin có trách nhiệm – AI tự động hỗ trợ xác minh</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto py-4 space-y-4 flex-1 pr-1">
          
          {/* Author snippet */}
          <div className="flex items-center gap-3">
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/30" 
            />
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-1.5">
                {currentUser.name}
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-500/20">
                  {currentUser.rankTitle}
                </span>
              </div>
              <p className="text-xs text-slate-500">Mọi bài đăng sẽ được AI cấp chứng chỉ kiểm chứng trước khi công khai</p>
            </div>
          </div>

          {/* Text input area */}
          <div>
            <textarea
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (aiResult) setAiResult(null); // Reset analysis if text changes
              }}
              placeholder="Bạn muốn chia sẻ thông tin hoặc phát hiện tin tức gì hôm nay? Đừng quên đính kèm nguồn để đạt điểm uy tín cao..."
              rows={4}
              className="w-full px-4 py-3 rounded-2xl bg-slate-950/70 border border-slate-800 focus:border-indigo-500 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none transition-all resize-none"
            />
          </div>

          {/* Optional Attachments Toggle */}
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <button
              type="button"
              onClick={() => setShowSourceInput(!showSourceInput)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all ${
                showSourceInput || sourceUrl
                  ? 'bg-cyan-950/50 border-cyan-500/40 text-cyan-300'
                  : 'bg-slate-800/50 border-slate-700/60 hover:text-slate-200'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Đính kèm nguồn chính thức</span>
            </button>

            <button
              type="button"
              onClick={() => setShowImageInput(!showImageInput)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all ${
                showImageInput || imageUrl
                  ? 'bg-indigo-950/50 border-indigo-500/40 text-indigo-300'
                  : 'bg-slate-800/50 border-slate-700/60 hover:text-slate-200'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Thêm ảnh minh họa</span>
            </button>
          </div>

          {/* Source URL Input */}
          {(showSourceInput || sourceUrl) && (
            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1 animate-in fade-in">
              <label className="text-[11px] font-semibold text-cyan-400 flex items-center gap-1">
                <LinkIcon className="w-3 h-3" />
                Đường dẫn liên kết nguồn (VD: https://chinhphu.vn/...):
              </label>
              <input
                type="url"
                value={sourceUrl}
                onChange={(e) => {
                  setSourceUrl(e.target.value);
                  if (aiResult) setAiResult(null);
                }}
                placeholder="https://tuoitre.vn/bai-viet-goc..."
                className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>
          )}

          {/* Image URL Input */}
          {(showImageInput || imageUrl) && (
            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1 animate-in fade-in">
              <label className="text-[11px] font-semibold text-indigo-400 flex items-center gap-1">
                <ImageIcon className="w-3 h-3" />
                URL hình ảnh trực quan:
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}

          {/* AI Scanning Banner Animation */}
          {isAnalyzing && (
            <div className="p-4 rounded-2xl bg-indigo-950/50 border border-indigo-500/40 space-y-3 animate-pulse">
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
                <div className="text-xs font-semibold text-slate-200">
                  {analysisStep || 'Hệ thống AI đang khởi động kiểm tra chéo dữ liệu...'}
                </div>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 animate-shimmer" style={{ width: '100%' }} />
              </div>
              <p className="text-[11px] text-slate-400 italic">
                * AI phân tích tính nhất quán, tra cứu cổng thông tin chính thống và cảnh báo dấu hiệu bóp méo ngữ cảnh.
              </p>
            </div>
          )}

          {/* AI Result Card Preview */}
          {aiResult && !isAnalyzing && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-indigo-500/30 space-y-3 animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  Kết quả đánh giá từ AI Trợ lý:
                </span>
                <AiStatusBadge status={aiResult.status} score={aiResult.score} />
              </div>

              <div className="text-xs text-slate-200 leading-relaxed bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <p className="font-semibold text-white mb-1">
                  {aiResult.summary}
                </p>
                <p className="text-slate-400">
                  <span className="text-indigo-300 font-medium">Lý do: </span>
                  {aiResult.reasoning}
                </p>
              </div>

              {/* Claims Breakdown */}
              {aiResult.claims.length > 0 && (
                <div className="text-xs space-y-1">
                  <span className="font-semibold text-slate-400">Các tuyên bố chính phát hiện:</span>
                  <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                    {aiResult.claims.map((c, i) => (
                      <li key={i} className="line-clamp-1">{c}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommendation */}
              <div className="text-xs p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300">
                <span className="font-bold">Khuyến nghị: </span>
                {aiResult.recommendation}
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500 hidden sm:block">
            {aiResult ? '✨ Đã sẵn sàng xuất bản' : '⚠️ Cần kiểm chứng AI trước khi đăng'}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 transition-colors"
            >
              Hủy
            </button>

            {!aiResult ? (
              <button
                type="button"
                onClick={handleStartVerification}
                disabled={!content.trim() || isAnalyzing}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-glow-sm hover:shadow-glow-cyan transition-all"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang kiểm tra...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Kiểm tra bằng AI trước khi đăng</span>
                  </>
                )}
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleStartVerification}
                  className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 text-xs"
                  title="Kiểm tra lại"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handlePublish}
                  className="flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-glow-emerald transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Xác nhận xuất bản (+25 XP)</span>
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
