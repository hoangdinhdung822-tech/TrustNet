import React from 'react';
import { FactCheckVerdict, VerificationStatus } from '../types';
import { CheckCircle2, HelpCircle, AlertTriangle, XCircle, Loader2 } from 'lucide-react';

interface Props {
  status?: VerificationStatus;
  verdict?: FactCheckVerdict;
  score?: number;
  size?: 'sm' | 'md' | 'lg';
  showScore?: boolean;
}

export const AiStatusBadge: React.FC<Props> = ({ 
  status, 
  verdict,
  score, 
  size = 'md', 
  showScore = true 
}) => {
  const getBadgeConfig = () => {
    // Ưu tiên chuẩn verdict 4 bậc mới của TrustNet
    if (verdict) {
      switch (verdict) {
        case 'TRUE':
          return {
            label: 'THÔNG TIN ĐÚNG',
            subLabel: 'Có bằng chứng đáng tin cậy hỗ trợ',
            icon: CheckCircle2,
            bgColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40',
            dotColor: 'bg-emerald-400',
            glow: 'shadow-[0_0_14px_rgba(16,185,129,0.3)]',
            badgeText: '🟢'
          };
        case 'FALSE':
          return {
            label: 'THÔNG TIN SAI',
            subLabel: 'Có bằng chứng đáng tin cậy mâu thuẫn',
            icon: XCircle,
            bgColor: 'bg-rose-500/10 text-rose-400 border-rose-500/40',
            dotColor: 'bg-rose-400',
            glow: 'shadow-[0_0_14px_rgba(244,63,94,0.35)]',
            badgeText: '🔴'
          };
        case 'MISLEADING':
          return {
            label: 'THÔNG TIN GÂY HIỂU LẦM',
            subLabel: 'Một phần đúng nhưng sai bối cảnh',
            icon: AlertTriangle,
            bgColor: 'bg-amber-500/10 text-amber-300 border-amber-500/40',
            dotColor: 'bg-amber-400',
            glow: 'shadow-[0_0_14px_rgba(245,158,11,0.25)]',
            badgeText: '🟡'
          };
        case 'INSUFFICIENT_EVIDENCE':
        default:
          return {
            label: 'CHƯA ĐỦ DỮ LIỆU',
            subLabel: 'Chưa đủ bằng chứng để kết luận',
            icon: HelpCircle,
            bgColor: 'bg-slate-700/30 text-slate-300 border-slate-500/40',
            dotColor: 'bg-slate-300',
            glow: 'shadow-[0_0_12px_rgba(148,163,184,0.2)]',
            badgeText: '⚪'
          };
      }
    }

    // Tương thích ngược với status cũ
    switch (status) {
      case 'verified':
        return {
          label: 'THÔNG TIN ĐÚNG',
          subLabel: 'Có cơ sở chính thống',
          icon: CheckCircle2,
          bgColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          dotColor: 'bg-emerald-400',
          glow: 'shadow-[0_0_12px_rgba(16,185,129,0.25)]',
          badgeText: '🟢'
        };
      case 'unverified':
        return {
          label: 'CHƯA ĐỦ DỮ LIỆU',
          subLabel: 'Cần kiểm chứng thêm',
          icon: HelpCircle,
          bgColor: 'bg-slate-700/30 text-slate-300 border-slate-500/40',
          dotColor: 'bg-slate-300',
          glow: 'shadow-[0_0_12px_rgba(148,163,184,0.2)]',
          badgeText: '⚪'
        };
      case 'suspicious':
        return {
          label: 'THÔNG TIN GÂY HIỂU LẦM',
          subLabel: 'Thiếu căn cứ khoa học',
          icon: AlertTriangle,
          bgColor: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
          dotColor: 'bg-amber-400',
          glow: 'shadow-[0_0_12px_rgba(245,158,11,0.25)]',
          badgeText: '🟡'
        };
      case 'debunked':
        return {
          label: 'THÔNG TIN SAI',
          subLabel: 'Cảnh báo tin giả / Sai lệch',
          icon: XCircle,
          bgColor: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
          dotColor: 'bg-rose-400',
          glow: 'shadow-[0_0_12px_rgba(244,63,94,0.3)]',
          badgeText: '🔴'
        };
      case 'analyzing':
      default:
        return {
          label: 'AI đang phân tích...',
          subLabel: 'Đang quét nguồn dữ liệu',
          icon: Loader2,
          bgColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
          dotColor: 'bg-indigo-400',
          glow: 'shadow-[0_0_12px_rgba(99,102,241,0.25)]',
          badgeText: '🤖'
        };
    }
  };

  const config = getBadgeConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1 gap-1.5',
    md: 'text-xs md:text-sm px-3 py-1.5 gap-2',
    lg: 'text-sm md:text-base px-4 py-2 gap-2.5 font-bold tracking-wide'
  };

  return (
    <div className={`inline-flex items-center rounded-full border backdrop-blur-md transition-all ${config.bgColor} ${config.glow} ${sizeClasses[size]}`}>
      <span className="relative flex h-2.5 w-2.5">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${config.dotColor}`}></span>
        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${config.dotColor}`}></span>
      </span>
      <span className="text-xs mr-0.5">{config.badgeText}</span>
      <Icon className={`w-3.5 h-3.5 md:w-4 md:h-4 ${status === 'analyzing' ? 'animate-spin' : ''}`} />
      <span className="font-extrabold uppercase">{config.label}</span>
      {showScore && score !== undefined && (
        <span className="ml-1 px-1.5 py-0.5 rounded-full bg-black/35 text-[11px] font-mono font-bold tracking-tight">
          {score}/100
        </span>
      )}
    </div>
  );
};
