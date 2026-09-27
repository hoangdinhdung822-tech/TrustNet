import React from 'react';
import { VerificationStatus } from '../types';
import { CheckCircle2, HelpCircle, AlertTriangle, XCircle, Loader2 } from 'lucide-react';

interface Props {
  status: VerificationStatus;
  score?: number;
  size?: 'sm' | 'md' | 'lg';
  showScore?: boolean;
}

export const AiStatusBadge: React.FC<Props> = ({ 
  status, 
  score, 
  size = 'md', 
  showScore = true 
}) => {
  const getBadgeConfig = () => {
    switch (status) {
      case 'verified':
        return {
          label: 'Đã kiểm chứng',
          subLabel: 'Có cơ sở chính thống',
          icon: CheckCircle2,
          bgColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          dotColor: 'bg-emerald-400',
          glow: 'shadow-[0_0_12px_rgba(16,185,129,0.25)]',
          badgeText: '🟢'
        };
      case 'unverified':
        return {
          label: 'Chưa đủ dữ liệu để xác minh',
          subLabel: 'Cần kiểm chứng thêm',
          icon: HelpCircle,
          bgColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          dotColor: 'bg-amber-400',
          glow: 'shadow-[0_0_12px_rgba(245,158,11,0.2)]',
          badgeText: '🟡'
        };
      case 'suspicious':
        return {
          label: 'Có dấu hiệu đáng ngờ',
          subLabel: 'Thiếu căn cứ khoa học',
          icon: AlertTriangle,
          bgColor: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
          dotColor: 'bg-orange-400',
          glow: 'shadow-[0_0_12px_rgba(249,115,22,0.25)]',
          badgeText: '🟠'
        };
      case 'debunked':
        return {
          label: 'Có khả năng sai lệch',
          subLabel: 'Cảnh báo lừa đảo / Tin giả',
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
    lg: 'text-sm md:text-base px-4 py-2 gap-2.5 font-medium'
  };

  return (
    <div className={`inline-flex items-center rounded-full border backdrop-blur-md transition-all ${config.bgColor} ${config.glow} ${sizeClasses[size]}`}>
      <span className="relative flex h-2 w-2">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${config.dotColor}`}></span>
        <span className={`relative inline-flex rounded-full h-2 w-2 ${config.dotColor}`}></span>
      </span>
      <Icon className={`w-3.5 h-3.5 md:w-4 md:h-4 ${status === 'analyzing' ? 'animate-spin' : ''}`} />
      <span className="font-semibold">{config.label}</span>
      {showScore && score !== undefined && (
        <span className="ml-1 px-1.5 py-0.5 rounded-full bg-black/25 text-[11px] font-mono font-bold tracking-tight">
          {score}/100
        </span>
      )}
    </div>
  );
};
