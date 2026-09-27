import React, { useState } from 'react';
import { 
  UserCircle2, 
  Award, 
  ShieldCheck, 
  Target, 
  Gamepad2, 
  Clock, 
  History, 
  CheckCircle, 
  ExternalLink,
  Sparkles,
  Lock,
  Edit3,
  LogIn,
  LogOut,
  Users,
  UserPlus,
  School,
  Check,
  X,
  Camera,
  RefreshCw,
  Key,
  ShieldAlert,
  Eye,
  EyeOff
} from 'lucide-react';
import { DatabaseService } from '../services/dbMock';
import { User } from '../types';
import { AiStatusBadge } from '../components/AiStatusBadge';

interface Props {
  user: User;
  onUserUpdate?: (user: User) => void;
  onLogout?: () => void;
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

export const ProfilePage: React.FC<Props> = ({ user, onUserUpdate, onLogout }) => {
  const history = DatabaseService.getFactCheckHistory();
  const lessons = DatabaseService.getLessons();
  const scenarios = DatabaseService.getScenarios();
  const allAccounts = DatabaseService.getAllAccounts();

  const completedLessonsCount = lessons.filter(l => l.isCompleted).length;
  const completedScenariosCount = scenarios.filter(s => s.isCompleted).length;

  // Calculate progress toward next milestone (1000 XP)
  const currentXP = user.points;
  const nextTarget = currentXP >= 1000 ? 2000 : currentXP >= 500 ? 1000 : 500;
  const progressPercent = Math.min(100, Math.round((currentXP / nextTarget) * 100));

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'switch' | 'login' | 'register'>('switch');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Security Verification Modal State (Bảo mật thông tin cá nhân - Bắt buộc nhập đúng tài khoản và mật khẩu mới vào được)
  const [isSecurityVerifyOpen, setIsSecurityVerifyOpen] = useState(false);
  const [verifyAccountInput, setVerifyAccountInput] = useState(user.username);
  const [verifyPasswordInput, setVerifyPasswordInput] = useState('');
  const [showVerifyPassword, setShowVerifyPassword] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [profileModalTab, setProfileModalTab] = useState<'profile' | 'security'>('profile');

  // Change Password Form State
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmNewPasswordInput, setConfirmNewPasswordInput] = useState('');
  const [passwordChangeError, setPasswordChangeError] = useState<string | null>(null);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState<string | null>(null);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Switch Account Modal State (Yêu cầu mật khẩu của tài khoản muốn chuyển)
  const [selectedSwitchUser, setSelectedSwitchUser] = useState<User | null>(null);
  const [switchPasswordInput, setSwitchPasswordInput] = useState('');
  const [showSwitchPassword, setShowSwitchPassword] = useState(false);
  const [switchError, setSwitchError] = useState<string | null>(null);

  // Direct Login Form State in Modal
  const [loginInput, setLoginInput] = useState('');
  const [loginPasswordInput, setLoginPasswordInput] = useState('');
  const [showLoginModalPassword, setShowLoginModalPassword] = useState(false);
  const [authModalLoginError, setAuthModalLoginError] = useState<string | null>(null);

  // Register Form State in Modal
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regSchool, setRegSchool] = useState('Trường THPT Số 1 Phan Đình Phùng');
  const [regClass, setRegClass] = useState('Lớp 11A1');
  const [regAvatar, setRegAvatar] = useState(AVATAR_PRESETS[0].url);
  const [regError, setRegError] = useState<string | null>(null);

  // Edit Profile Form State
  const [editName, setEditName] = useState(user.name);
  const [editUsername, setEditUsername] = useState(user.username);
  const [editSchool, setEditSchool] = useState(user.school || 'Trường THPT Số 1 Phan Đình Phùng');
  const [editClass, setEditClass] = useState(user.className || 'Khối 11 - Đoàn Trường');
  const [editBio, setEditBio] = useState(user.bio || '');
  const [editAvatar, setEditAvatar] = useState(user.avatar);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Bắt đầu quy trình xác thực để vào "Bảo mật thông tin cá nhân"
  const requestAccessPersonalSecurity = (targetTab: 'profile' | 'security' = 'profile') => {
    setProfileModalTab(targetTab);
    setVerifyAccountInput(user.username);
    setVerifyPasswordInput('');
    setVerifyError(null);
    setIsSecurityVerifyOpen(true);
  };

  // Xác thực tài khoản & mật khẩu để mở khóa thông tin cá nhân
  const handleVerifySecurityAccess = (e: React.FormEvent) => {
    e.preventDefault();
    setVerifyError(null);

    const cleanInputUser = verifyAccountInput.trim().toLowerCase().replace('@', '');
    const currentClean = user.username.toLowerCase();

    if (cleanInputUser !== currentClean && cleanInputUser !== user.email?.toLowerCase()) {
      setVerifyError(`Tên tài khoản không khớp với hồ sơ hiện tại (@${user.username})!`);
      return;
    }

    if (!verifyPasswordInput.trim()) {
      setVerifyError('Vui lòng nhập mật khẩu tài khoản để xác minh danh tính!');
      return;
    }

    const check = DatabaseService.verifyUserPassword(user.id, verifyPasswordInput);
    if (!check.success) {
      setVerifyError(check.error || 'Mật khẩu không chính xác! Không thể truy cập khu vực bảo mật thông tin cá nhân.');
      return;
    }

    // Xác thực thành công -> Mở khóa và nạp dữ liệu vào form
    setEditName(user.name);
    setEditUsername(user.username);
    setEditSchool(user.school || 'Trường THPT Số 1 Phan Đình Phùng');
    setEditClass(user.className || 'Khối 11 - Đoàn Trường');
    setEditBio(user.bio || '');
    setEditAvatar(user.avatar);
    setCurrentPasswordInput('');
    setNewPasswordInput('');
    setConfirmNewPasswordInput('');
    setPasswordChangeError(null);
    setPasswordChangeSuccess(null);

    setIsSecurityVerifyOpen(false);
    setIsEditModalOpen(true);
    showToast('🔓 Xác thực thành công! Đã mở quyền quản lý bảo mật thông tin cá nhân.');
  };

  // Lưu thông tin cá nhân
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = DatabaseService.updateUserProfile({
      name: editName.trim() || user.name,
      username: editUsername.trim().replace('@', '') || user.username,
      school: editSchool.trim(),
      className: editClass.trim(),
      bio: editBio.trim(),
      avatar: editAvatar
    });
    if (onUserUpdate) {
      onUserUpdate(updated);
    }
    setIsEditModalOpen(false);
    showToast('✅ Đã cập nhật thông tin cá nhân thành công!');
  };

  // Xử lý đổi mật khẩu
  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeError(null);
    setPasswordChangeSuccess(null);

    if (!currentPasswordInput.trim()) {
      setPasswordChangeError('Vui lòng nhập mật khẩu hiện tại của bạn!');
      return;
    }
    if (!newPasswordInput.trim() || newPasswordInput.trim().length < 3) {
      setPasswordChangeError('Mật khẩu mới phải có ít nhất 3 ký tự!');
      return;
    }
    if (newPasswordInput.trim() !== confirmNewPasswordInput.trim()) {
      setPasswordChangeError('Mật khẩu xác nhận không trùng khớp!');
      return;
    }

    const res = DatabaseService.changePassword(user.id, currentPasswordInput, newPasswordInput);
    if (!res.success) {
      setPasswordChangeError(res.error || 'Đổi mật khẩu thất bại!');
      return;
    }

    setPasswordChangeSuccess('✅ Đã đổi mật khẩu bảo mật tài khoản thành công!');
    setCurrentPasswordInput('');
    setNewPasswordInput('');
    setConfirmNewPasswordInput('');
    showToast('🔒 Đổi mật khẩu tài khoản thành công!');
  };

  // Chọn tài khoản để chuyển đổi -> mở popup nhập mật khẩu
  const handleSelectSwitchAccount = (target: User) => {
    if (target.id === user.id) return;
    setSelectedSwitchUser(target);
    const pwd = target.password || (target.role === 'admin' ? 'admin123' : '123456');
    setSwitchPasswordInput(pwd);
    setSwitchError(null);
  };

  // Xác nhận chuyển tài khoản có mật khẩu
  const handleConfirmSwitchAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSwitchUser) return;
    if (!switchPasswordInput.trim()) {
      setSwitchError('Vui lòng nhập mật khẩu của tài khoản để đăng nhập!');
      return;
    }
    const res = DatabaseService.switchAccountSecure(selectedSwitchUser.id, switchPasswordInput);
    if (!res.success || !res.user) {
      setSwitchError(res.error || 'Mật khẩu không chính xác! Không thể đăng nhập vào tài khoản này.');
      return;
    }
    if (onUserUpdate) {
      onUserUpdate(res.user);
    }
    setSelectedSwitchUser(null);
    setIsAuthModalOpen(false);
    showToast(`🎉 Chào mừng trở lại, ${res.user.name}!`);
  };

  // Đăng nhập trực tiếp bằng tên + mật khẩu
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthModalLoginError(null);
    if (!loginInput.trim()) {
      setAuthModalLoginError('Vui lòng nhập tên tài khoản hoặc email!');
      return;
    }
    if (!loginPasswordInput.trim()) {
      setAuthModalLoginError('Vui lòng nhập mật khẩu tài khoản!');
      return;
    }
    const res = DatabaseService.loginSecure(loginInput.trim(), loginPasswordInput);
    if (!res.success || !res.user) {
      setAuthModalLoginError(res.error || 'Tài khoản hoặc mật khẩu không chính xác!');
      return;
    }
    if (onUserUpdate) {
      onUserUpdate(res.user);
    }
    setIsAuthModalOpen(false);
    setLoginInput('');
    setLoginPasswordInput('');
    showToast(`🎉 Đăng nhập thành công với tài khoản: ${res.user.name}`);
  };

  // Đăng ký tài khoản mới có mật khẩu
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);
    if (!regName.trim()) {
      setRegError('Vui lòng nhập họ và tên của bạn!');
      return;
    }
    if (!regPassword.trim() || regPassword.length < 3) {
      setRegError('Mật khẩu phải có ít nhất 3 ký tự!');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setRegError('Mật khẩu xác nhận không trùng khớp!');
      return;
    }
    const cleanUsername = regUsername.trim() || `user_${Date.now().toString().slice(-4)}`;
    const updated = DatabaseService.registerUser({
      name: regName.trim(),
      username: cleanUsername,
      password: regPassword.trim(),
      school: regSchool.trim(),
      className: regClass.trim(),
      avatar: regAvatar
    });
    if (onUserUpdate) {
      onUserUpdate(updated);
    }
    setIsAuthModalOpen(false);
    setRegName('');
    setRegUsername('');
    setRegPassword('');
    setRegConfirmPassword('');
    showToast(`🌟 Chúc mừng ${updated.name} đã gia nhập TrustNet!`);
  };

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất khỏi TrustNet?')) {
      DatabaseService.logout();
      if (onLogout) {
        onLogout();
      } else if (onUserUpdate) {
        const fallback = DatabaseService.getCurrentUser();
        onUserUpdate(fallback);
      }
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 md:right-8 z-50 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400/30 animate-in fade-in slide-in-from-top-3 duration-200">
          <Sparkles className="w-5 h-5 text-amber-300 animate-spin" />
          <span className="text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Profile Card Header */}
      <section className="glass-panel rounded-3xl p-6 md:p-8 relative overflow-hidden text-slate-100 shadow-2xl border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-indigo-500/20 via-cyan-500/15 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          
          {/* Avatar and Basic Details */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-5">
            <div className="relative group self-start">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 md:w-28 md:h-28 rounded-3xl object-cover ring-4 ring-indigo-500/40 shadow-2xl transition-transform group-hover:scale-105"
              />
              <span className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-500 border-4 border-slate-950 rounded-full flex items-center justify-center shadow-lg" title="Trạng thái: Trực tuyến">
                <CheckCircle className="w-3.5 h-3.5 text-white" />
              </span>
              <button
                onClick={() => requestAccessPersonalSecurity('profile')}
                className="absolute inset-0 bg-slate-950/60 rounded-3xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-xs font-semibold text-white transition-opacity gap-1"
                title="Thay đổi ảnh đại diện (Yêu cầu mật khẩu)"
              >
                <Camera className="w-5 h-5 text-cyan-300" />
                <span>Đổi ảnh</span>
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                  {user.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/25 text-indigo-300 border border-indigo-500/40 text-xs font-bold font-mono">
                  @{user.username}
                </span>
                {user.role === 'admin' && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-bold">
                    Admin
                  </span>
                )}
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Đã bảo mật
                </span>
              </div>

              {/* School and Class Badges */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900/90 text-slate-200 border border-slate-700/80 font-medium">
                  <School className="w-3.5 h-3.5 text-cyan-400" />
                  {user.school || 'Trường THPT Số 1 Phan Đình Phùng'}
                </span>
                {user.className && (
                  <span className="px-2.5 py-1 rounded-xl bg-slate-900/80 text-indigo-300 border border-indigo-500/30 font-medium">
                    {user.className}
                  </span>
                )}
                <span className="px-2.5 py-1 rounded-xl bg-indigo-950/60 text-cyan-400 border border-cyan-500/30 font-bold">
                  {user.rankTitle}
                </span>
              </div>

              {/* Bio */}
              <p className="text-xs md:text-sm text-slate-300 max-w-xl leading-relaxed pt-1">
                {user.bio || 'Học sinh năng động, đam mê an toàn số & xây dựng môi trường mạng lành mạnh, nói không với tin giả.'}
              </p>

              {/* XP Progress Bar */}
              <div className="pt-2 max-w-md space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-amber-300 font-bold flex items-center gap-1">
                    ⭐ {currentXP} XP
                  </span>
                  <span className="text-slate-400">Mục tiêu mốc tiếp theo: {nextTarget} XP</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-900 border border-slate-800 overflow-hidden p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 rounded-full transition-all duration-700 shadow-sm"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons: Edit, Switch/Login, Logout */}
          <div className="flex flex-wrap lg:flex-col items-stretch gap-2.5 shrink-0 self-start lg:self-center border-t lg:border-t-0 lg:border-l border-slate-800/80 pt-4 lg:pt-0 lg:pl-6 w-full lg:w-auto">
            
            <button
              onClick={() => requestAccessPersonalSecurity('profile')}
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
              title="Yêu cầu nhập đúng tài khoản và mật khẩu để mở"
            >
              <Edit3 className="w-4 h-4" />
              <span>Chỉnh sửa hồ sơ</span>
            </button>

            <button
              onClick={() => requestAccessPersonalSecurity('security')}
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
              title="Quản lý mật khẩu và an toàn tài khoản"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-200" />
              <span>Bảo mật & Đổi MK</span>
            </button>

            <button
              onClick={() => {
                setAuthTab('switch');
                setIsAuthModalOpen(true);
              }}
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 hover:border-cyan-400 font-bold text-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Đổi tài khoản / Đăng nhập</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950/60 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-slate-800 hover:border-rose-500/30 text-xs font-semibold transition-all"
              title="Đăng xuất hoặc chuyển tài khoản"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Đăng xuất</span>
            </button>

          </div>

        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-slate-800">
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80">
            <span className="text-xl md:text-2xl font-black text-white font-mono">{user.factChecksCount}</span>
            <span className="text-xs text-slate-400 block mt-0.5">Lượt Fact-Check</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80">
            <span className="text-xl md:text-2xl font-black text-cyan-400 font-mono">{completedLessonsCount}/5</span>
            <span className="text-xs text-slate-400 block mt-0.5">Bài học hoàn thành</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80">
            <span className="text-xl md:text-2xl font-black text-emerald-400 font-mono">{completedScenariosCount}/5</span>
            <span className="text-xs text-slate-400 block mt-0.5">Tình huống vượt qua</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80">
            <span className="text-xl md:text-2xl font-black text-amber-300 font-mono">{user.quizAccuracy}%</span>
            <span className="text-xs text-slate-400 block mt-0.5">Độ chuẩn xác Quiz</span>
          </div>
        </div>

      </section>

      {/* ============================================================ */}
      {/* SECTION: BẢO MẬT THÔNG TIN CÁ NHÂN & TÀI KHOẢN HỌC ĐƯỜNG      */}
      {/* ============================================================ */}
      <section className="glass-panel rounded-3xl p-6 md:p-8 space-y-5 text-slate-100 border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shadow-glow-emerald">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-bold text-white flex items-center gap-2 flex-wrap">
                Bảo Mật Thông Tin Cá Nhân & Quyền Riêng Tư
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                  Bảo vệ mức cao
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Chỉ người dùng nhập đúng tài khoản và mật khẩu mới được vào xem và chỉnh sửa thông tin cá nhân.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => requestAccessPersonalSecurity('profile')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Xác thực vào thông tin cá nhân</span>
            </button>
            <button
              onClick={() => requestAccessPersonalSecurity('security')}
              className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30 hover:border-amber-400 font-bold text-xs transition-all flex items-center gap-1.5"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Đổi mật khẩu</span>
            </button>
          </div>
        </div>

        {/* 3 Security Status Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">Khóa tài khoản</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <p className="text-sm font-black text-white font-mono">@{user.username}</p>
            <span className="text-[11px] text-slate-400 block truncate">Liên kết email: {user.email || 'Học sinh TrustNet'}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">Cơ chế bảo vệ</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">Xác thực 100%</span>
            </div>
            <p className="text-sm font-black text-emerald-400">Yêu cầu đúng Mật khẩu</p>
            <span className="text-[11px] text-slate-400 block">Ngăn chặn đổi thông tin trái phép và mạo danh</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">Định danh học đường</span>
              <span className="px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">Chính thức</span>
            </div>
            <p className="text-sm font-black text-cyan-300 truncate">{user.school || 'THPT Số 1 Phan Đình Phùng'}</p>
            <span className="text-[11px] text-slate-400 block truncate">{user.className || 'Khối 11'} • Đã kích hoạt lá chắn số</span>
          </div>
        </div>
      </section>

      {/* Badges Showcase Section */}
      <section className="glass-panel rounded-3xl p-6 md:p-8 space-y-4 text-slate-100 border border-slate-800">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h2 className="text-base md:text-lg font-bold text-white">
              Bộ Sưu Tập Huy Hiệu An Toàn Số
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {user.badges.filter(b => b.isUnlocked).length}/{user.badges.length} đã mở khóa
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {user.badges.map((b) => (
            <div
              key={b.id}
              className={`p-4 rounded-2xl border transition-all ${
                b.isUnlocked
                  ? 'bg-gradient-to-b from-indigo-950/40 to-slate-900 border-indigo-500/40 shadow-sm'
                  : 'bg-slate-950/40 border-slate-800/80 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">{b.icon}</span>
                {b.isUnlocked ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                    Đã đạt
                  </span>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" /> Chưa mở
                  </span>
                )}
              </div>

              <h3 className="text-sm font-bold text-white mb-1">
                {b.name}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {b.description}
              </p>
              {b.unlockedAt && (
                <span className="text-[10px] text-slate-500 mt-2 block font-mono">
                  Ngày nhận: {b.unlockedAt}
                </span>
              )}
            </div>
          ))}
        </div>

      </section>

      {/* Fact-Check History Logs */}
      <section className="glass-panel rounded-3xl p-6 md:p-8 space-y-4 text-slate-100 border border-slate-800">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base md:text-lg font-bold text-white">
              Lịch Sử Kiểm Tra Thông Tin Gần Đây
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {history.length} bản ghi
          </span>
        </div>

        {history.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 italic">
            Chưa có lượt kiểm tra nào được lưu trữ. Hãy thử tính năng "AI Fact Check" để kiểm tra một phát ngôn bạn nghi ngờ!
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((record) => (
              <div
                key={record.id}
                className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="font-medium text-slate-400 text-[11px] font-mono">
                    {record.createdAt} • Thể loại: {record.inputCategory}
                  </span>
                  <AiStatusBadge status={record.result.status} score={record.result.score} size="sm" />
                </div>

                <p className="font-semibold text-slate-200 line-clamp-2">
                  "{record.inputText}"
                </p>

                <p className="text-slate-400 text-[11px] leading-relaxed">
                  <span className="text-indigo-400 font-semibold">Kết luận: </span>
                  {record.result.summary}
                </p>
              </div>
            ))}
          </div>
        )}

      </section>

      {/* Gen Z Safety Pledge */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-cyan-950/60 border border-cyan-500/30 text-center space-y-2">
        <Sparkles className="w-6 h-6 mx-auto text-cyan-400" />
        <h3 className="text-sm font-extrabold text-white">
          Cam Kết Công Dân Số TrustNet - THPT Số 1 Phan Đình Phùng
        </h3>
        <p className="text-xs text-slate-300 max-w-md mx-auto italic">
          "Tôi cam kết không lan truyền tin giả, luôn kiểm tra nguồn chính thống trước khi nhấn Like hoặc Share, và giữ vững tinh thần phản biện lành mạnh trên mạng xã hội."
        </p>
      </div>

      {/* ============================================================ */}
      {/* MODAL 0: XÁC THỰC BẢO MẬT THÔNG TIN CÁ NHÂN                    */}
      {/* (BẮT BUỘC NHẬP ĐÚNG TÀI KHOẢN VÀ MẬT KHẨU MỚI VÀO ĐƯỢC)      */}
      {/* ============================================================ */}
      {isSecurityVerifyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-indigo-500/50 p-6 md:p-8 shadow-2xl space-y-5 text-slate-100">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-500/30">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Xác thực bảo mật thông tin cá nhân</h3>
                  <p className="text-xs text-slate-400">Phải nhập đúng tài khoản và mật khẩu để mở khóa</p>
                </div>
              </div>
              <button
                onClick={() => setIsSecurityVerifyOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleVerifySecurityAccess} className="space-y-4">
              {verifyError && (
                <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs font-semibold flex items-start gap-2 animate-in fade-in duration-200">
                  <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{verifyError}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Tên tài khoản người dùng (@username) *
                </label>
                <input
                  type="text"
                  required
                  value={verifyAccountInput}
                  onChange={(e) => setVerifyAccountInput(e.target.value)}
                  placeholder="VD: hoangdinhdung822"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300">
                    Mật khẩu cá nhân *
                  </label>
                  <span className="text-[10px] text-amber-300 font-mono">
                    Mẫu: 123456 (Admin: admin123)
                  </span>
                </div>
                <div className="relative">
                  <input
                    type={showVerifyPassword ? 'text' : 'password'}
                    required
                    autoFocus
                    value={verifyPasswordInput}
                    onChange={(e) => setVerifyPasswordInput(e.target.value)}
                    placeholder="Nhập mật khẩu của bạn..."
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowVerifyPassword(!showVerifyPassword)}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                  >
                    {showVerifyPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsSecurityVerifyOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Xác nhận & Vào khu vực</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 1: QUẢN LÝ & BẢO MẬT THÔNG TIN CÁ NHÂN                  */}
      {/* ============================================================ */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-indigo-500/40 p-6 md:p-8 shadow-2xl space-y-6 text-slate-100">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Quản Lý & Bảo Mật Thông Tin Cá Nhân</h3>
                  <p className="text-xs text-slate-400">Đã xác thực danh tính • Cho phép chỉnh sửa hồ sơ và đổi mật khẩu</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sub-tabs inside Personal Security Modal */}
            <div className="flex rounded-2xl bg-slate-950 p-1 border border-slate-800">
              <button
                type="button"
                onClick={() => setProfileModalTab('profile')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  profileModalTab === 'profile'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Thông tin cá nhân</span>
              </button>
              <button
                type="button"
                onClick={() => setProfileModalTab('security')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  profileModalTab === 'security'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Key className="w-3.5 h-3.5 text-amber-300" />
                <span>Bảo mật & Đổi mật khẩu</span>
              </button>
            </div>

            {/* TAB 1: EDIT PROFILE */}
            {profileModalTab === 'profile' && (
              <form onSubmit={handleSaveProfile} className="space-y-5">
                
                {/* Avatar Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                    Chọn ảnh đại diện phong cách TrustNet
                  </label>
                  <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                    <img
                      src={editAvatar}
                      alt="Preview"
                      className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500"
                    />
                    <div className="flex-1 space-y-1">
                      <span className="text-xs font-bold text-white">Ảnh hiện tại</span>
                      <input
                        type="text"
                        value={editAvatar}
                        onChange={(e) => setEditAvatar(e.target.value)}
                        placeholder="Hoặc dán URL ảnh trực tiếp..."
                        className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 pt-2">
                    {AVATAR_PRESETS.map((preset, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setEditAvatar(preset.url)}
                        className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all ${
                          editAvatar === preset.url
                            ? 'border-cyan-400 scale-105 shadow-md shadow-cyan-500/30 ring-2 ring-cyan-400'
                            : 'border-slate-800 hover:border-slate-600 opacity-70 hover:opacity-100'
                        }`}
                        title={preset.label}
                      >
                        <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                        {editAvatar === preset.url && (
                          <div className="absolute inset-0 bg-cyan-500/20 flex items-center justify-center">
                            <Check className="w-4 h-4 text-cyan-300 drop-shadow" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name & Username */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">
                      Họ và tên hiển thị *
                    </label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="VD: Hoàng Đình Dũng"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">
                      Tên người dùng (@username) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-slate-500 font-mono text-sm">@</span>
                      <input
                        type="text"
                        required
                        value={editUsername}
                        onChange={(e) => setEditUsername(e.target.value)}
                        placeholder="hoangdinhdung822"
                        className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm font-mono focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                {/* School and Class */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">
                      Trường học
                    </label>
                    <input
                      type="text"
                      value={editSchool}
                      onChange={(e) => setEditSchool(e.target.value)}
                      placeholder="Trường THPT Số 1 Phan Đình Phùng"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">
                      Lớp / Khối / Đơn vị
                    </label>
                    <input
                      type="text"
                      value={editClass}
                      onChange={(e) => setEditClass(e.target.value)}
                      placeholder="Khối 11 - Đoàn Trường"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    Tiểu sử / Châm ngôn an toàn mạng
                  </label>
                  <textarea
                    rows={3}
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    placeholder="Chia sẻ đôi điều về bạn và quan điểm chống tin giả..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500 leading-relaxed resize-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
                  >
                    Lưu thay đổi
                  </button>
                </div>

              </form>
            )}

            {/* TAB 2: CHANGE PASSWORD & SECURITY */}
            {profileModalTab === 'security' && (
              <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
                
                {/* Security info card */}
                <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-xs space-y-1.5">
                  <div className="flex items-center gap-2 text-indigo-300 font-bold">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Bảo vệ tài khoản @{user.username}</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Mật khẩu giúp bảo vệ lịch sử Fact-Check, điểm XP và thông tin học sinh của bạn khỏi việc bị người khác truy cập trái phép.
                  </p>
                </div>

                {passwordChangeError && (
                  <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs font-semibold flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>{passwordChangeError}</span>
                  </div>
                )}

                {passwordChangeSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{passwordChangeSuccess}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    Mật khẩu hiện tại *
                  </label>
                  <input
                    type="password"
                    required
                    value={currentPasswordInput}
                    onChange={(e) => setCurrentPasswordInput(e.target.value)}
                    placeholder="Nhập mật khẩu đang dùng..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-300">
                      Mật khẩu mới *
                    </label>
                    <span className="text-[10px] text-slate-400">Tối thiểu 3 ký tự</span>
                  </div>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      value={newPasswordInput}
                      onChange={(e) => setNewPasswordInput(e.target.value)}
                      placeholder="Nhập mật khẩu mới..."
                      className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    Xác nhận mật khẩu mới *
                  </label>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={confirmNewPasswordInput}
                    onChange={(e) => setConfirmNewPasswordInput(e.target.value)}
                    placeholder="Nhập lại mật khẩu mới..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
                  >
                    Đóng
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5"
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>Lưu mật khẩu mới</span>
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 2: ĐỔI TÀI KHOẢN & ĐĂNG NHẬP                           */}
      {/* (BẮT BUỘC MẬT KHẨU MỚI VÀO ĐƯỢC)                             */}
      {/* ============================================================ */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-cyan-500/40 p-6 md:p-8 shadow-2xl space-y-6 text-slate-100">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Quản lý Tài Khoản & Đăng Nhập</h3>
                  <p className="text-xs text-slate-400">Yêu cầu xác thực tài khoản và mật khẩu trước khi đăng nhập</p>
                </div>
              </div>
              <button
                onClick={() => setIsAuthModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex rounded-2xl bg-slate-950 p-1 border border-slate-800">
              <button
                type="button"
                onClick={() => setAuthTab('switch')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  authTab === 'switch'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Danh sách tài khoản
              </button>
              <button
                type="button"
                onClick={() => setAuthTab('login')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  authTab === 'login'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Đăng nhập bằng mật khẩu
              </button>
              <button
                type="button"
                onClick={() => setAuthTab('register')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  authTab === 'register'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Đăng ký mới
              </button>
            </div>

            {/* TAB 1: QUICK ACCOUNT SWITCHER WITH PASSWORD PROMPT */}
            {authTab === 'switch' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-400">
                  Chọn tài khoản bên dưới và nhập đúng mật khẩu để chuyển đổi:
                </p>

                <div className="space-y-2.5">
                  {allAccounts.map((acc) => {
                    const isCurrent = acc.id === user.id;
                    const pwd = acc.password || (acc.role === 'admin' ? 'admin123' : '123456');
                    return (
                      <div
                        key={acc.id}
                        className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                          isCurrent
                            ? 'bg-indigo-950/40 border-cyan-400/60 ring-1 ring-cyan-400/40'
                            : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <img
                            src={acc.avatar}
                            alt={acc.name}
                            className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-700 shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-sm font-bold text-white truncate">{acc.name}</h4>
                              {isCurrent && (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                                  Đang chọn
                                </span>
                              )}
                              {acc.role === 'admin' && (
                                <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold">
                                  Admin
                                </span>
                              )}
                              <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-mono font-bold">
                                MK: {pwd}
                              </span>
                            </div>
                            <span className="text-xs text-indigo-300 font-mono">@{acc.username}</span>
                            <div className="text-[11px] text-slate-400 truncate">
                              {acc.school || 'Trường THPT Số 1 Phan Đình Phùng'} • ⭐ {acc.points} XP
                            </div>
                          </div>
                        </div>

                        <div>
                          {isCurrent ? (
                            <span className="text-xs font-semibold text-cyan-400 flex items-center gap-1">
                              <Check className="w-4 h-4" /> Hiện tại
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSelectSwitchAccount(acc)}
                              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-md hover:scale-105 active:scale-95 flex items-center gap-1"
                            >
                              <Lock className="w-3 h-3" />
                              <span>Đăng nhập</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: DIRECT LOGIN WITH IDENTIFIER & PASSWORD */}
            {authTab === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {authModalLoginError && (
                  <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs font-semibold flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>{authModalLoginError}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    Tên tài khoản (@username) hoặc Email *
                  </label>
                  <input
                    type="text"
                    required
                    value={loginInput}
                    onChange={(e) => setLoginInput(e.target.value)}
                    placeholder="VD: hoangdinhdung822 hoặc baotram_digital"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-300">
                      Mật khẩu tài khoản *
                    </label>
                    <span className="text-[10px] text-amber-300 font-mono">
                      Mẫu: 123456 (Admin: admin123)
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type={showLoginModalPassword ? 'text' : 'password'}
                      required
                      value={loginPasswordInput}
                      onChange={(e) => setLoginPasswordInput(e.target.value)}
                      placeholder="Nhập mật khẩu..."
                      className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginModalPassword(!showLoginModalPassword)}
                      className="absolute right-3.5 top-2.5 text-slate-500 hover:text-slate-300"
                    >
                      {showLoginModalPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Xác thực & Đăng nhập</span>
                </button>
              </form>
            )}

            {/* TAB 3: REGISTER NEW ACCOUNT */}
            {authTab === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                {regError && (
                  <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs font-semibold flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>{regError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">Họ và tên *</label>
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="VD: Nguyễn Văn An"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">Username (@)</label>
                    <input
                      type="text"
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value)}
                      placeholder="VD: an_genz"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">Mật khẩu bảo vệ *</label>
                    <div className="relative">
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Tối thiểu 3 ký tự"
                        className="w-full pl-3 pr-9 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute right-2.5 top-2.5 text-slate-500 hover:text-slate-300"
                      >
                        {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">Xác nhận mật khẩu *</label>
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="Nhập lại mật khẩu"
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">Trường học</label>
                    <input
                      type="text"
                      value={regSchool}
                      onChange={(e) => setRegSchool(e.target.value)}
                      placeholder="Trường THPT Số 1 Phan Đình Phùng"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">Lớp / Khối</label>
                    <input
                      type="text"
                      value={regClass}
                      onChange={(e) => setRegClass(e.target.value)}
                      placeholder="Lớp 11A1"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Avatar Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Chọn Ảnh đại diện</label>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {AVATAR_PRESETS.map((preset, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setRegAvatar(preset.url)}
                        className={`rounded-xl overflow-hidden aspect-square border-2 transition-all ${
                          regAvatar === preset.url
                            ? 'border-cyan-400 scale-105 shadow-md shadow-cyan-500/30 ring-2 ring-cyan-400'
                            : 'border-slate-800 opacity-60 hover:opacity-100'
                        }`}
                        title={preset.label}
                      >
                        <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Tạo tài khoản & Đăng nhập</span>
                </button>
              </form>
            )}

          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* POPUP SUB-MODAL: XÁC THỰC MẬT KHẨU KHI CHUYỂN TÀI KHOẢN       */}
      {/* ============================================================ */}
      {selectedSwitchUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-cyan-500/40 p-5 space-y-4 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <img
                  src={selectedSwitchUser.avatar}
                  alt={selectedSwitchUser.name}
                  className="w-9 h-9 rounded-xl object-cover ring-2 ring-cyan-400/50"
                />
                <div>
                  <h4 className="text-sm font-bold text-white leading-tight">{selectedSwitchUser.name}</h4>
                  <span className="text-[11px] text-cyan-400 font-mono">@{selectedSwitchUser.username}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedSwitchUser(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmSwitchAccount} className="space-y-3.5">
              <p className="text-xs text-slate-300">
                Nhập mật khẩu của <strong className="text-white">@{selectedSwitchUser.username}</strong> để đăng nhập:
              </p>

              {switchError && (
                <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs font-semibold flex items-start gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{switchError}</span>
                </div>
              )}

              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Mật khẩu *</span>
                  <span className="text-amber-300 font-mono">
                    Gợi ý: {selectedSwitchUser.role === 'admin' ? 'admin123' : '123456'}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type={showSwitchPassword ? 'text' : 'password'}
                    required
                    autoFocus
                    value={switchPasswordInput}
                    onChange={(e) => setSwitchPasswordInput(e.target.value)}
                    placeholder="Nhập mật khẩu..."
                    className="w-full pl-3 pr-9 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSwitchPassword(!showSwitchPassword)}
                    className="absolute right-2.5 top-2 text-slate-500 hover:text-slate-300"
                  >
                    {showSwitchPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedSwitchUser(null)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Xác nhận đăng nhập</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
