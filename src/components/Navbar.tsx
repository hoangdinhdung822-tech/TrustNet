import React, { useState } from 'react';
import { ShieldCheck, Sparkles, Bell, Sun, Moon, Search, Award, CheckCircle, LogOut } from 'lucide-react';
import { User } from '../types';

interface Props {
  user: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
  isAdminMode: boolean;
  setIsAdminMode: (admin: boolean) => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<Props> = ({
  user,
  setActiveTab,
  isDark,
  setIsDark,
  isAdminMode,
  setIsAdminMode,
  onLogout,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, title: 'AI đã kiểm chứng bài viết của bạn', time: '10 phút trước', read: false },
    { id: 2, title: '🔥 Thử thách hôm nay: Tình huống Tin nóng khẩn cấp (+50 XP)', time: '1 giờ trước', read: false },
    { id: 3, title: 'Bạn nhận được huy hiệu Fact Checker!', time: '1 ngày trước', read: true },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/80 dark:bg-slate-950/80 border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Motto */}
        <div 
          onClick={() => setActiveTab('feed')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1.5px] shadow-glow-sm group-hover:shadow-glow-md transition-all">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-indigo-400 group-hover:text-cyan-300 transition-colors" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-indigo-100 to-cyan-300 bg-clip-text text-transparent">
                TrustNet
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                AI Fact Check
              </span>
            </div>
            <p className="hidden md:block text-[11px] font-medium text-slate-400">
              Đừng chỉ tin. Hãy kiểm chứng!
            </p>
          </div>
        </div>

        {/* Center Quick Search Button */}
        <div className="hidden lg:flex items-center flex-1 max-w-md mx-6">
          <button 
            onClick={() => setActiveTab('search')}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 text-slate-400 hover:text-slate-200 text-sm transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 transition-colors" />
              <span>Tìm kiếm & kiểm tra nguồn tin uy tín...</span>
            </div>
            <kbd className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-800 text-slate-400 border border-slate-700">
              Ctrl+K
            </kbd>
          </button>
        </div>

        {/* Right Action Icons & User Stats */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          
          {/* Admin Switcher Pill */}
          <button
            onClick={() => {
              setIsAdminMode(!isAdminMode);
              if (!isAdminMode) setActiveTab('admin');
            }}
            className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              isAdminMode 
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm' 
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
            }`}
            title="Chuyển chế độ Quản trị viên / Kiểm duyệt"
          >
            <span className={`w-2 h-2 rounded-full ${isAdminMode ? 'bg-rose-400 animate-pulse' : 'bg-slate-500'}`} />
            {isAdminMode ? 'Chế độ Admin' : 'Admin Demo'}
          </button>

          {/* XP & Level Badge */}
          <div 
            onClick={() => setActiveTab('profile')}
            className="cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-950/60 to-purple-950/40 border border-indigo-500/30 hover:border-indigo-500/60 transition-all group"
          >
            <div className="w-6 h-6 rounded-lg bg-indigo-500/20 flex items-center justify-center text-amber-400">
              <Award className="w-4 h-4" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider group-hover:text-slate-300">
                {user.rankTitle}
              </span>
              <span className="text-xs font-bold text-amber-300 font-mono flex items-center gap-1">
                {user.points} <span className="text-[10px] text-amber-500/80">XP</span>
              </span>
            </div>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={() => setIsDark(!isDark)}
            aria-label="Toggle theme"
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-colors"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Thông báo mới
                  </span>
                  <span className="text-[11px] text-indigo-400 cursor-pointer hover:underline">
                    Đánh dấu đã đọc
                  </span>
                </div>
                <div className="space-y-2">
                  {notifications.map((n) => (
                    <div 
                      key={n.id} 
                      className={`p-2.5 rounded-xl text-xs transition-colors cursor-pointer ${
                        n.read ? 'bg-slate-950/40 text-slate-400' : 'bg-indigo-950/30 text-slate-200 border border-indigo-500/20'
                      }`}
                    >
                      <div className="font-semibold flex items-center justify-between">
                        <span>{n.title}</span>
                        {!n.read && <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />}
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1 block">{n.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar */}
          <div 
            onClick={() => setActiveTab('profile')}
            className="cursor-pointer relative flex items-center justify-center p-0.5 rounded-full ring-2 ring-indigo-500/40 hover:ring-indigo-400 transition-all"
            title={`Xem hồ sơ của ${user.name}`}
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-950 rounded-full" />
          </div>

          {/* Quick Logout Button */}
          {onLogout && (
            <button
              onClick={() => {
                if (window.confirm('Bạn có chắc chắn muốn đăng xuất tài khoản?')) {
                  onLogout();
                }
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-colors"
              title="Đăng xuất khỏi TrustNet"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}

        </div>
      </div>
    </header>
  );
};
