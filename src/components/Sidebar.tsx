import React from 'react';
import { 
  Home, 
  Search, 
  Bot, 
  Code2, 
  GraduationCap, 
  Gamepad2, 
  UserCircle2, 
  ShieldAlert,
  School,
  Flame,
  Sparkles
} from 'lucide-react';

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdminMode: boolean;
}

export const Sidebar: React.FC<Props> = ({ activeTab, setActiveTab, isAdminMode }) => {
  const navItems = [
    { id: 'feed', label: 'Trang chủ', icon: Home, badge: 'Feed' },
    { id: 'school', label: 'THPT Số 1 Phan Đình Phùng', icon: School, badge: 'Đắk Lắk' },
    { id: 'search', label: 'Tìm kiếm', icon: Search },
    { id: 'factcheck', label: 'AI Kiểm chứng', icon: Bot, highlight: true },
    { id: 'inspector', label: 'Kiểm tra mã & nội dung', icon: Code2 },
    { id: 'academy', label: 'Học an toàn số', icon: GraduationCap, badge: '5 bài' },
    { id: 'scenarios', label: 'Tình huống mô phỏng', icon: Gamepad2, badge: 'Hot' },
    { id: 'profile', label: 'Hồ sơ cá nhân', icon: UserCircle2 },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 py-6 px-4 space-y-6">
      
      {/* Navigation List */}
      <nav className="space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all group ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-glow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-white' : item.highlight ? 'text-cyan-400' : 'text-slate-400'
                }`} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                  isActive 
                    ? 'bg-white/20 text-white' 
                    : item.badge === 'Hot'
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Admin Dashboard Nav Item */}
        <button
          onClick={() => setActiveTab('admin')}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all group ${
            activeTab === 'admin'
              ? 'bg-rose-600 text-white shadow-md font-semibold'
              : 'text-slate-400 hover:text-rose-300 hover:bg-rose-950/20'
          }`}
        >
          <div className="flex items-center gap-3">
            <ShieldAlert className={`w-5 h-5 ${activeTab === 'admin' ? 'text-white' : 'text-rose-400'}`} />
            <span>Admin & Kiểm duyệt</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-bold">
            Live
          </span>
        </button>
      </nav>

      {/* Safety Daily Motivation Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/60 via-slate-900/80 to-slate-950 border border-indigo-500/20 shadow-lg relative overflow-hidden">
        <div className="absolute -top-6 -right-6 w-20 h-20 bg-cyan-500/10 rounded-full blur-xl pointer-events-none" />
        
        <div className="flex items-center gap-2 mb-2 text-cyan-400">
          <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span className="text-xs font-bold uppercase tracking-wider">Thông điệp TrustNet</span>
        </div>

        <p className="text-xs text-slate-300 font-medium leading-relaxed italic mb-3">
          "Đọc → Kiểm tra → Suy nghĩ → Đánh giá → Quyết định thay vì Đọc → Tin → Chia sẻ."
        </p>

        <button 
          onClick={() => setActiveTab('factcheck')}
          className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-glow-sm hover:shadow-glow-md transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Kiểm chứng ngay</span>
        </button>
      </div>

      {/* Footer Info */}
      <div className="pt-2 border-t border-slate-800/60 text-[11px] text-slate-500 space-y-1">
        <div className="flex items-center justify-between">
          <span>TrustNet v1.0 Gen Z</span>
          <span className="flex items-center gap-1 text-emerald-400 font-mono text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            AI Online
          </span>
        </div>
        <p>Bảo vệ giới trẻ khỏi thông tin sai lệch</p>
      </div>

    </aside>
  );
};
