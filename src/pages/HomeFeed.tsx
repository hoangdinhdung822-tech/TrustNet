import React, { useState } from 'react';
import { 
  PlusCircle, 
  Sparkles, 
  Flame, 
  CheckCircle2, 
  Target, 
  Gamepad2, 
  Award, 
  Filter,
  ShieldCheck,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { Post, User, Scenario } from '../types';
import { PostCard } from '../components/PostCard';
import { CreatePostModal } from '../components/CreatePostModal';
import { ReportModal } from '../components/ReportModal';
import { DatabaseService } from '../services/dbMock';

interface Props {
  user: User;
  onUserUpdate: (u: User) => void;
  setActiveTab: (tab: string) => void;
}

export const HomeFeed: React.FC<Props> = ({ user, onUserUpdate, setActiveTab }) => {
  const [posts, setPosts] = useState<Post[]>(DatabaseService.getPosts());
  const [scenarios] = useState<Scenario[]>(DatabaseService.getScenarios());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [reportingPost, setReportingPost] = useState<Post | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Featured Daily Scenario (Tình huống hôm nay)
  const todayScenario = scenarios.find(s => !s.isCompleted) || scenarios[0];

  const handleLikeToggle = (postId: string) => {
    const updated = DatabaseService.toggleLike(postId);
    setPosts(updated);
  };

  const handlePostCreated = (newPost: Post) => {
    setPosts([newPost, ...posts]);
    onUserUpdate(DatabaseService.getCurrentUser());
  };

  const filteredPosts = posts.filter(p => {
    if (filterStatus === 'all') return true;
    return p.verificationStatus === filterStatus;
  });

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      
      {/* Section 17: Welcome Banner & Daily Stats Dashboard */}
      <section className="glass-panel rounded-3xl p-5 md:p-6 text-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-indigo-500/15 via-cyan-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Bảng theo dõi kỹ năng số</span>
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold text-white">
              👋 Xin chào, {user.name}!
            </h1>
            <p className="text-xs md:text-sm text-slate-300 mt-0.5">
              Hôm nay bạn đã kiểm chứng <span className="font-bold text-cyan-400">3 thông tin</span> mới. Hãy giữ vững phản biện số nhé!
            </p>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs md:text-sm shadow-glow-sm hover:shadow-glow-cyan transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Đăng bài & Kiểm chứng AI</span>
          </button>
        </div>

        {/* 4 KPI Grid Cards as requested in Section 17 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex flex-col justify-between">
            <span className="text-2xl md:text-3xl font-extrabold text-white font-mono">
              {user.factChecksCount}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>Bài đã kiểm tra</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex flex-col justify-between">
            <span className="text-2xl md:text-3xl font-extrabold text-cyan-400 font-mono">
              {user.quizAccuracy}%
            </span>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
              <Target className="w-3.5 h-3.5 text-cyan-400" />
              <span>Độ chính xác quiz</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex flex-col justify-between">
            <span className="text-2xl md:text-3xl font-extrabold text-emerald-400 font-mono">
              {user.scenariosCompletedCount}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
              <Gamepad2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tình huống hoàn thành</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex flex-col justify-between">
            <span className="text-2xl md:text-3xl font-extrabold text-amber-300 font-mono flex items-center gap-1">
              {user.points} <span className="text-xs text-amber-500">XP</span>
            </span>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Điểm kỹ năng số</span>
            </div>
          </div>

        </div>

      </section>

      {/* Featured Daily Scenario Card (Tình huống hôm nay) */}
      {todayScenario && (
        <section className="p-4 md:p-5 rounded-3xl bg-gradient-to-r from-indigo-950/70 via-slate-900 to-purple-950/50 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 shrink-0">
              <Flame className="w-6 h-6 fill-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  🔥 Tình huống hôm nay
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold">
                  +{todayScenario.pointsReward} XP
                </span>
              </div>
              <h3 className="text-sm md:text-base font-bold text-white mt-0.5">
                {todayScenario.title}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                {todayScenario.description}
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('scenarios')}
            className="self-start sm:self-center shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-md transition-all"
          >
            <span>Luyện tập ngay</span>
          </button>
        </section>
      )}

      {/* Quick Create Post Bar */}
      <div 
        onClick={() => setIsCreateModalOpen(true)}
        className="glass-panel p-3.5 md:p-4 rounded-2xl flex items-center gap-3 cursor-pointer hover:border-indigo-500/50 transition-all group"
      >
        <img
          src={user.avatar}
          alt={user.name}
          className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/30"
        />
        <div className="flex-1 px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs md:text-sm text-slate-400 group-hover:text-slate-200 transition-colors">
          Chia sẻ thông tin mới hoặc dán đường link cần AI kiểm chứng...
        </div>
        <button className="flex items-center gap-1 px-3 py-2 rounded-xl bg-indigo-600 group-hover:bg-indigo-500 text-white text-xs font-bold shadow-glow-sm transition-all">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Kiểm tra</span>
        </button>
      </div>

      {/* Social Feed Filter Chips */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Lọc:
          </span>
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'verified', label: '🟢 Đã kiểm chứng' },
            { id: 'suspicious', label: '🟠 Đáng ngờ' },
            { id: 'debunked', label: '🔴 Cảnh báo' },
            { id: 'unverified', label: '🟡 Chờ xác minh' },
          ].map((chip) => (
            <button
              key={chip.id}
              onClick={() => setFilterStatus(chip.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-all ${
                filterStatus === chip.id
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                  : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Stream */}
      <div className="space-y-5">
        {filteredPosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onLikeToggle={handleLikeToggle}
            onReportClick={(p) => setReportingPost(p)}
          />
        ))}
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        currentUser={user}
        onPostCreated={handlePostCreated}
      />

      {/* Report Modal */}
      <ReportModal
        isOpen={Boolean(reportingPost)}
        post={reportingPost}
        onClose={() => setReportingPost(null)}
        onReportSuccess={() => onUserUpdate(DatabaseService.getCurrentUser())}
      />

    </div>
  );
};
