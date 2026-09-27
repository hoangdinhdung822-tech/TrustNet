import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Lock, 
  User, 
  School, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  ArrowRight, 
  Users, 
  Award, 
  Bot, 
  Sun, 
  Moon,
  Flame,
  Check,
  ShieldAlert
} from 'lucide-react';
import { DatabaseService } from '../services/dbMock';
import { User as UserType } from '../types';

interface Props {
  onLoginSuccess: (user: UserType) => void;
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
}

const AVATAR_PRESETS = [
  {
    label: 'Nam sinh Công nghệ (Dũng)',
    url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
  },
  {
    label: 'Nữ sinh Năng động (Trâm)',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  },
  {
    label: 'Admin / Hiệp sĩ số',
    url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=250&q=80',
  },
  {
    label: 'Nam sinh Trí thức',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
  },
  {
    label: 'Nữ sinh Sáng tạo',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
  },
  {
    label: 'Nhà phân tích Fact-Check',
    url: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&w=250&q=80',
  },
  {
    label: 'Đại sứ Đoàn Trường',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80',
  },
  {
    label: 'Chiến binh An ninh mạng',
    url: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=250&q=80',
  },
];

export const AuthPage: React.FC<Props> = ({ onLoginSuccess, isDark, setIsDark }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regSchool, setRegSchool] = useState('Trường THPT Số 1 Phan Đình Phùng');
  const [regClass, setRegClass] = useState('Lớp 11A1');
  const [regAvatar, setRegAvatar] = useState(AVATAR_PRESETS[0].url);
  const [regAgreed, setRegAgreed] = useState(true);
  const [regError, setRegError] = useState<string | null>(null);

  const initialAccounts = DatabaseService.getAllAccounts();

  // Quick 1-click login handler
  const handleQuickLogin = (acc: UserType) => {
    const logged = DatabaseService.switchAccount(acc.id);
    onLoginSuccess(logged);
  };

  // Submit Sign In
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    if (!loginIdentifier.trim()) {
      setLoginError('Vui lòng nhập tên người dùng hoặc email');
      return;
    }
    const user = DatabaseService.login(loginIdentifier.trim(), loginPassword);
    onLoginSuccess(user);
  };

  // Submit Sign Up
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);
    if (!regName.trim()) {
      setRegError('Vui lòng nhập họ và tên của bạn');
      return;
    }
    if (!regAgreed) {
      setRegError('Vui lòng đồng ý với cam kết công dân số văn minh');
      return;
    }

    const cleanUsername = regUsername.trim() || `user_${Date.now().toString().slice(-4)}`;
    const user = DatabaseService.registerUser({
      name: regName.trim(),
      username: cleanUsername,
      password: regPassword,
      school: regSchool.trim() || 'Trường THPT Số 1 Phan Đình Phùng',
      className: regClass.trim() || 'Học sinh',
      avatar: regAvatar,
      bio: 'Thành viên mới tích cực tham gia mạng xã hội kiểm chứng TrustNet.'
    });

    onLoginSuccess(user);
  };

  return (
    <div className={`min-h-screen relative flex flex-col justify-between overflow-x-hidden transition-colors ${
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* Dynamic Cyber Light Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -left-32 w-[32rem] h-[32rem] bg-indigo-600/15 rounded-full blur-[140px]" />
        <div className="absolute top-1/4 -right-32 w-[30rem] h-[30rem] bg-cyan-500/15 rounded-full blur-[150px]" />
        <div className="absolute -bottom-32 left-1/3 w-[36rem] h-[36rem] bg-purple-600/15 rounded-full blur-[150px]" />
      </div>

      {/* Top Header Bar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1.5px] shadow-glow-md">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-cyan-300" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl md:text-2xl font-black tracking-tight bg-gradient-to-r from-white via-indigo-100 to-cyan-300 bg-clip-text text-transparent">
                TrustNet
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-indigo-500/20 text-cyan-300 border border-indigo-500/40">
                THPT Số 1 Phan Đình Phùng
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Mạng xã hội học đường & Kiểm chứng tin tức bằng AI
            </p>
          </div>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => setIsDark(!isDark)}
          className="p-2.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all shadow-sm"
          title="Đổi giao diện Sáng / Tối"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
        </button>
      </header>

      {/* Main Hero & Auth Section */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16">
        
        {/* Left Side: Brand Story & School Introduction */}
        <div className="flex-1 space-y-6 text-center lg:text-left max-w-xl">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Nền tảng an toàn số chính thức của Đoàn Trường</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Đừng chỉ tin. <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
              Hãy kiểm chứng!
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Chào mừng bạn đến với <strong className="text-white">TrustNet</strong> — Môi trường mạng xã hội thông minh dành cho học sinh 
            <span className="text-cyan-300 font-semibold"> Trường THPT Số 1 Phan Đình Phùng</span>. Nơi trang bị cho bạn tư duy phản biện, 
            kỹ năng nhận diện tin giả, và công nghệ AI tra cứu sự thật từ nguồn chính thống.
          </p>

          {/* Key Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur text-left">
              <Bot className="w-5 h-5 text-cyan-400 mb-2" />
              <h4 className="text-xs font-bold text-white">AI Kiểm Chứng</h4>
              <p className="text-[11px] text-slate-400 mt-1">Đối chiếu Google & dữ liệu báo chí trong 3 giây.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur text-left">
              <School className="w-5 h-5 text-indigo-400 mb-2" />
              <h4 className="text-xs font-bold text-white">Bản Tin Trường</h4>
              <p className="text-[11px] text-slate-400 mt-1">Thông báo chính thức từ Đoàn trường & Ban giám hiệu.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur text-left">
              <Award className="w-5 h-5 text-amber-400 mb-2" />
              <h4 className="text-xs font-bold text-white">Tích Điểm & Danh Hiệu</h4>
              <p className="text-[11px] text-slate-400 mt-1">Vượt qua các tình huống để nhận huy hiệu Hiệp sĩ số.</p>
            </div>
          </div>

          {/* Quote / Slogan */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/40 to-slate-900/60 border border-indigo-500/20 text-xs text-slate-300 italic flex items-center gap-3">
            <Flame className="w-5 h-5 text-amber-400 shrink-0" />
            <span>"Một cú nhấp chuột có trách nhiệm là một lá chắn bảo vệ bạn và bạn bè trên không gian mạng."</span>
          </div>

        </div>

        {/* Right Side: Auth Card (Login / Register) */}
        <div className="w-full max-w-md shrink-0">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl border border-indigo-500/30 bg-slate-900/90 backdrop-blur-xl relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Tab Switcher */}
            <div className="flex rounded-2xl bg-slate-950/80 p-1 border border-slate-800 mb-6">
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'login'
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Đăng nhập
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('register')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'register'
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Tạo tài khoản mới
              </button>
            </div>

            {/* ======================================================== */}
            {/* TAB 1: ĐĂNG NHẬP                                         */}
            {/* ======================================================== */}
            {activeTab === 'login' && (
              <div className="space-y-5">
                
                {/* 1-Click Fast Accounts */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Đăng nhập nhanh 1 chạm (Tài khoản mẫu):
                  </span>
                  
                  <div className="space-y-2">
                    {initialAccounts.slice(0, 3).map((acc) => (
                      <button
                        key={acc.id}
                        type="button"
                        onClick={() => handleQuickLogin(acc)}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 hover:bg-indigo-950/40 border border-slate-800 hover:border-indigo-500/50 transition-all group text-left"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={acc.avatar}
                            alt={acc.name}
                            className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-700 group-hover:ring-cyan-400 shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-white group-hover:text-cyan-300 truncate">
                                {acc.name}
                              </span>
                              {acc.role === 'admin' && (
                                <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 text-[9px] font-bold">
                                  Admin
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono block truncate">
                              @{acc.username} • ⭐ {acc.points} XP
                            </span>
                          </div>
                        </div>

                        <span className="text-xs font-semibold text-indigo-400 group-hover:text-cyan-300 flex items-center gap-1 shrink-0">
                          Vào ngay <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative flex items-center justify-center my-3">
                  <div className="border-t border-slate-800 w-full" />
                  <span className="bg-slate-900 px-3 text-[11px] text-slate-500 uppercase font-bold">
                    Hoặc nhập tài khoản
                  </span>
                </div>

                {/* Form Input */}
                <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                  {loginError && (
                    <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold">
                      {loginError}
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">
                      Tên người dùng (@username) hoặc Email
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        placeholder="VD: hoangdinhdung822 hoặc Đình Dũng"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-300">
                        Mật khẩu
                      </label>
                      <span className="text-[10px] text-cyan-400 cursor-pointer hover:underline">
                        Đăng nhập tự do không cần mật khẩu
                      </span>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                      <input
                        type={showLoginPassword ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Nhập mật khẩu (tùy chọn)"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300"
                      >
                        {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 mt-2"
                  >
                    <span>Đăng nhập vào TrustNet</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

              </div>
            )}

            {/* ======================================================== */}
            {/* TAB 2: TẠO TÀI KHOẢN MỚI                                 */}
            {/* ======================================================== */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                {regError && (
                  <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold">
                    {regError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">
                      Họ và tên học sinh *
                    </label>
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="VD: Nguyễn Văn An"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">
                      Tên người dùng (@)
                    </label>
                    <input
                      type="text"
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value)}
                      placeholder="VD: nguyenvanan"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">
                      Trường học
                    </label>
                    <input
                      type="text"
                      value={regSchool}
                      onChange={(e) => setRegSchool(e.target.value)}
                      placeholder="Trường THPT Số 1 Phan Đình Phùng"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">
                      Lớp / Khối
                    </label>
                    <input
                      type="text"
                      value={regClass}
                      onChange={(e) => setRegClass(e.target.value)}
                      placeholder="Lớp 11A1"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">
                    Mật khẩu (Tùy chọn)
                  </label>
                  <div className="relative">
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Tạo mật khẩu cho tài khoản"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                    >
                      {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Avatar Presets Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                    <span>Chọn Avatar đại sứ an toàn số</span>
                    <span className="text-[10px] text-cyan-400">8 mẫu chọn lọc</span>
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                    {AVATAR_PRESETS.map((preset, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setRegAvatar(preset.url)}
                        className={`rounded-xl overflow-hidden aspect-square border-2 transition-all relative ${
                          regAvatar === preset.url
                            ? 'border-cyan-400 scale-105 shadow-md shadow-cyan-500/30 ring-2 ring-cyan-400'
                            : 'border-slate-800 opacity-60 hover:opacity-100'
                        }`}
                        title={preset.label}
                      >
                        <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                        {regAvatar === preset.url && (
                          <div className="absolute inset-0 bg-cyan-500/25 flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 text-white drop-shadow" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Safety Commitment Checkbox */}
                <label className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={regAgreed}
                    onChange={(e) => setRegAgreed(e.target.checked)}
                    className="mt-0.5 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-[11px] leading-relaxed">
                    Tôi cam kết thực hiện văn hóa ứng xử số văn minh, không chia sẻ tin thất thiệt, và luôn kiểm chứng trước khi like/share.
                  </span>
                </label>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 mt-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Tạo tài khoản & Bắt đầu (+150 XP)</span>
                </button>
              </form>
            )}

          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-xs text-slate-500 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>© 2026 TrustNet • Trường THPT Số 1 Phan Đình Phùng</span>
        <span>Phát triển vì một môi trường Internet học đường an toàn, tin cậy</span>
      </footer>

    </div>
  );
};
