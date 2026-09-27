import React, { useState } from 'react';
import { ShieldAlert, X, AlertTriangle, CheckCircle, Flag } from 'lucide-react';
import { DatabaseService } from '../services/dbMock';
import { Post } from '../types';

interface Props {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
  onReportSuccess?: () => void;
}

const REPORT_REASONS = [
  'Thông tin sai sự thật / Tin giả nguy hiểm về sức khỏe & an ninh',
  'Dấu hiệu lừa đảo, chiếm đoạt tài sản hoặc yêu cầu nạp tiền / OTP',
  'Đường link giả mạo (Phishing) mạo danh ngân hàng hoặc thương hiệu',
  'Ngôn ngữ thù ghét, kích động bạo lực, chia rẽ vùng miền',
  'Sử dụng công nghệ Deepfake bôi nhọ danh dự người khác',
  'Nội dung quảng cáo rác (Spam) hoặc mã độc đính kèm'
];

export const ReportModal: React.FC<Props> = ({ post, isOpen, onClose, onReportSuccess }) => {
  const [selectedReason, setSelectedReason] = useState(REPORT_REASONS[0]);
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !post) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalReason = details.trim() ? `${selectedReason} - Ghi chú thêm: ${details}` : selectedReason;
    DatabaseService.createReport(
      post.id,
      post.content.slice(0, 100) + '...',
      post.author.name,
      finalReason
    );
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
      if (onReportSuccess) onReportSuccess();
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative text-slate-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">Báo cáo đã được ghi nhận!</h3>
            <p className="text-xs text-slate-300 max-w-sm mx-auto">
              Cảm ơn bạn đã bảo vệ không gian mạng an toàn. Bài viết đã được chuyển vào hàng đợi kiểm duyệt AI & Admin. (+10 XP)
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
              <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                <Flag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Báo cáo nội dung đáng ngờ</h3>
                <p className="text-xs text-slate-400">Giúp TrustNet giữ vững môi trường thông tin minh bạch</p>
              </div>
            </div>

            {/* Target Post Snippet */}
            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300">
              <span className="font-semibold text-indigo-400">Người đăng:</span> {post.author.name} ({post.author.username})
              <p className="mt-1 line-clamp-2 italic text-slate-400">"{post.content}"</p>
            </div>

            {/* Reason Options */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                Chọn lý do báo cáo:
              </label>
              <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                {REPORT_REASONS.map((reason) => (
                  <label
                    key={reason}
                    className={`flex items-start gap-3 p-2.5 rounded-xl text-xs cursor-pointer border transition-all ${
                      selectedReason === reason
                        ? 'bg-indigo-950/40 border-indigo-500/60 text-white'
                        : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reportReason"
                      checked={selectedReason === reason}
                      onChange={() => setSelectedReason(reason)}
                      className="mt-0.5 text-indigo-500 focus:ring-0"
                    />
                    <span className="leading-tight">{reason}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Additional Details */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Ghi chú thêm (bằng chứng hoặc liên kết đối chiếu):
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="VD: Thông tin này vừa bị đính chính trên báo Tuổi Trẻ lúc 14h..."
                rows={2}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-950 transition-all"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Gửi báo cáo</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
