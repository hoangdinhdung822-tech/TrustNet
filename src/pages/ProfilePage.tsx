import React from 'react';
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
  Lock
} from 'lucide-react';
import { DatabaseService } from '../services/dbMock';
import { User } from '../types';
import { AiStatusBadge } from '../components/AiStatusBadge';

interface Props {
  user: User;
}

export const ProfilePage: React.FC<Props> = ({ user }) => {
  const history = DatabaseService.getFactCheckHistory();
  const lessons = DatabaseService.getLessons();
  const scenarios = DatabaseService.getScenarios();

  const completedLessonsCount = lessons.filter(l => l.isCompleted).length;
  const completedScenariosCount = scenarios.filter(s => s.isCompleted).length;

  // Calculate progress toward next milestone (1000 XP)
  const currentXP = user.points;
  const nextTarget = currentXP >= 1000 ? 2000 : currentXP >= 500 ? 1000 : 500;
  const progressPercent = Math.min(100, Math.round((currentXP / nextTarget) * 100));

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      
      {/* Profile Card Header */}
      <section className="glass-panel rounded-3xl p-6 md:p-8 relative overflow-hidden text-slate-100">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-indigo-500/20 via-cyan-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 md:w-24 md:h-24 rounded-3xl object-cover ring-4 ring-indigo-500/30 shadow-xl"
              />
              <span className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-4 border-slate-950 rounded-full flex items-center justify-center">
                <CheckCircle className="w-3 h-3 text-white" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl md:text-2xl font-black text-white">
                  {user.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold font-mono">
                  @{user.username}
                </span>
              </div>
              
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs md:text-sm font-semibold text-cyan-400">
                  {user.rankTitle}
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-400">Thành viên từ 08/2026</span>
              </div>

              {/* Progress to next level */}
              <div className="mt-3 space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-300 font-bold">{currentXP} XP</span>
                  <span className="text-slate-500">Mục tiêu: {nextTarget} XP</span>
                </div>
                <div className="w-48 sm:w-64 h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Rank Badge Display */}
          <div className="sm:text-right p-4 rounded-2xl bg-slate-900/80 border border-slate-800 self-start sm:self-auto">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Hạng kỹ năng số</span>
            <span className="text-lg md:text-xl font-extrabold text-amber-300 font-mono">
              ⭐ {user.points} XP
            </span>
            <span className="text-xs text-slate-400 block mt-0.5">
              {user.points >= 1000 ? 'Đẳng cấp Hiệp sĩ' : user.points >= 500 ? 'Cấp bậc Kiểm chứng viên' : 'Tân binh khởi đầu'}
            </span>
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

      {/* Badges Showcase Section */}
      <section className="glass-panel rounded-3xl p-6 md:p-8 space-y-4 text-slate-100">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h2 className="text-base md:text-lg font-bold text-white">
              Bộ Sưu Tập Huy Hiệu An Toàn Số
            </h2>
          </div>
          <span className="text-xs text-slate-400">
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
      <section className="glass-panel rounded-3xl p-6 md:p-8 space-y-4 text-slate-100">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base md:text-lg font-bold text-white">
              Lịch Sử Kiểm Tra Thông Tin Gần Đây
            </h2>
          </div>
          <span className="text-xs text-slate-400">
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
          Cam Kết Công Dân Số TrustNet
        </h3>
        <p className="text-xs text-slate-300 max-w-md mx-auto italic">
          "Tôi cam kết không lan truyền tin giả, luôn kiểm tra nguồn chính thống trước khi nhấn Like hoặc Share, và giữ vững tinh thần phản biện lành mạnh trên mạng xã hội."
        </p>
      </div>

    </div>
  );
};
