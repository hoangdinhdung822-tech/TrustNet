import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Users, 
  FileText, 
  Bot, 
  Flag, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  RefreshCw,
  BarChart3,
  TrendingDown,
  ShieldCheck
} from 'lucide-react';
import { DatabaseService } from '../services/dbMock';
import { Post, ReportItem } from '../types';
import { AiStatusBadge } from '../components/AiStatusBadge';

export const AdminDashboard: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>(DatabaseService.getPosts());
  const [reports, setReports] = useState<ReportItem[]>(DatabaseService.getReports());
  const [activeTab, setActiveTab] = useState<'moderation' | 'reports' | 'stats'>('moderation');

  // KPI Calculations
  const totalUsers = 1240;
  const totalPosts = posts.length + 184;
  const totalAiChecked = posts.length + 184; // 100% of posts undergo AI checking
  const flaggedPostsCount = posts.filter(p => p.verificationStatus === 'suspicious' || p.verificationStatus === 'debunked').length;
  const pendingReportsCount = reports.filter(r => r.status === 'pending').length;

  const handleApprovePost = (postId: string) => {
    const updated = posts.map(p => {
      if (p.id === postId) {
        return { ...p, verificationStatus: 'verified' as const, verificationScore: 90 };
      }
      return p;
    });
    setPosts(updated);
  };

  const handleHidePost = (postId: string) => {
    const updated = posts.filter(p => p.id !== postId);
    setPosts(updated);
  };

  const handleResolveReport = (reportId: string) => {
    const updated = DatabaseService.updateReportStatus(reportId, 'resolved');
    setReports(updated);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      
      {/* Admin Header */}
      <section className="glass-panel rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-rose-500/15 via-indigo-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldAlert className="w-4 h-4" />
              <span>Admin & Moderation Center</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">
              Bảng Quản Trị & Kiểm Duyệt Nội Dung
            </h1>
            <p className="text-xs md:text-sm text-slate-300 mt-1">
              Hệ thống giám sát phát hiện tin giả, xử lý báo cáo từ cộng đồng và thanh tra cảnh báo AI.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-emerald-400 font-bold">Hệ thống AI tự động: HOẠT ĐỘNG</span>
          </div>
        </div>

        {/* 5 KPI Metric Cards as requested in Section 13 */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6">
          
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
            <span className="text-xl md:text-2xl font-black text-white font-mono">{totalUsers}</span>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              <span>Tổng người dùng</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
            <span className="text-xl md:text-2xl font-black text-cyan-400 font-mono">{totalPosts}</span>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>Tổng bài đăng</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
            <span className="text-xl md:text-2xl font-black text-emerald-400 font-mono">100%</span>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
              <Bot className="w-3.5 h-3.5 text-emerald-400" />
              <span>AI quét tự động</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
            <span className="text-xl md:text-2xl font-black text-amber-400 font-mono">{flaggedPostsCount}</span>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Nội dung bị đánh dấu</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 col-span-2 sm:col-span-1">
            <span className="text-xl md:text-2xl font-black text-rose-400 font-mono">{pendingReportsCount}</span>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
              <Flag className="w-3.5 h-3.5 text-rose-400" />
              <span>Báo cáo chờ xử lý</span>
            </div>
          </div>

        </div>

      </section>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('moderation')}
          className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all ${
            activeTab === 'moderation'
              ? 'bg-indigo-600 text-white shadow-glow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Hàng Đợi Kiểm Duyệt Bài Viết ({posts.length})
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all ${
            activeTab === 'reports'
              ? 'bg-indigo-600 text-white shadow-glow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Báo Cáo Từ Người Dùng ({reports.length})
        </button>

        <button
          onClick={() => setActiveTab('stats')}
          className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all ${
            activeTab === 'stats'
              ? 'bg-indigo-600 text-white shadow-glow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Phân Tích Thống Kê Tin Giả (AI Analytics)
        </button>
      </div>

      {/* Tab 1: Moderation Queue Table as specified in Section 13 */}
      {activeTab === 'moderation' && (
        <section className="glass-panel rounded-3xl overflow-hidden border border-slate-800 text-slate-100">
          <div className="p-4 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">Danh sách nội dung đang lưu hành trên TrustNet</h2>
            <span className="text-xs text-slate-400">Admin có quyền can thiệp dán nhãn hoặc ẩn khỏi luồng tin</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Nội dung bài viết</th>
                  <th className="py-3.5 px-4">Người đăng</th>
                  <th className="py-3.5 px-4">AI đánh giá</th>
                  <th className="py-3.5 px-4">Trạng thái</th>
                  <th className="py-3.5 px-4 text-right">Hành động kiểm duyệt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-900/40 transition-colors">
                    
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="font-semibold text-slate-200 line-clamp-2">{post.content}</p>
                      {post.sourceUrl && (
                        <span className="text-[10px] text-cyan-400 truncate block mt-0.5">
                          {post.sourceUrl}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <img src={post.author.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                        <div>
                          <span className="font-bold text-white block">{post.author.name}</span>
                          <span className="text-[10px] text-slate-500">@{post.author.username}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <AiStatusBadge status={post.verificationStatus} score={post.verificationScore} size="sm" />
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {post.verificationStatus === 'verified' && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                          Đã duyệt
                        </span>
                      )}
                      {post.verificationStatus === 'unverified' && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold">
                          Chờ thêm dữ liệu
                        </span>
                      )}
                      {(post.verificationStatus === 'suspicious' || post.verificationStatus === 'debunked') && (
                        <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-bold">
                          🟡 Cần xem xét
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-right space-x-1.5">
                      <button
                        onClick={() => handleApprovePost(post.id)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold transition-colors"
                        title="Xác nhận nội dung an toàn"
                      >
                        Duyệt
                      </button>
                      <button
                        onClick={() => handleHidePost(post.id)}
                        className="px-2.5 py-1 rounded-lg bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-500/30 text-[11px] font-bold transition-colors"
                        title="Ẩn bài viết khỏi dòng thời gian"
                      >
                        Ẩn bài
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Tab 2: User Reports Queue */}
      {activeTab === 'reports' && (
        <section className="glass-panel rounded-3xl p-6 space-y-4 text-slate-100">
          <h2 className="text-base font-bold text-white">Danh sách báo cáo từ người dùng ({reports.length})</h2>

          <div className="space-y-3">
            {reports.map((r) => (
              <div
                key={r.id}
                className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-rose-400 flex items-center gap-1">
                      <Flag className="w-3.5 h-3.5" /> Báo cáo từ: {r.reporterName}
                    </span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400">{r.createdAt}</span>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    r.status === 'resolved' 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {r.status === 'resolved' ? 'Đã xử lý' : 'Đang chờ xử lý'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
                  <span className="text-indigo-400 font-semibold">Tác giả bị báo cáo:</span> {r.postAuthor}
                  <p className="italic text-slate-400 mt-1">"{r.postSnippet}"</p>
                </div>

                <p className="text-slate-200">
                  <span className="text-rose-400 font-bold">Lý do: </span>
                  {r.reason}
                </p>

                {r.status === 'pending' && (
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => handleResolveReport(r.id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-sm transition-all"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Xác nhận đã xử lý</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tab 3: AI Analytics & Misinformation Stats */}
      {activeTab === 'stats' && (
        <section className="glass-panel rounded-3xl p-6 md:p-8 space-y-6 text-slate-100">
          
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-400" />
              Thống Kê Xu Hướng Thông Tin Sai Lệch (AI Analytics)
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Phân loại các hình thái tin giả và nguy cơ bảo mật được AI phân tích trong tháng
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Breakdown Bars */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Tỷ lệ các loại nội dung sai lệch
              </span>

              {[
                { label: 'Lừa đảo tài chính / Link Phishing', percent: 38, color: 'bg-rose-500' },
                { label: 'Tin giả sức khỏe / Thuốc thần kỳ', percent: 27, color: 'bg-orange-500' },
                { label: 'Cắt ghép giật gân (Clickbait / Deepfake)', percent: 20, color: 'bg-amber-500' },
                { label: 'Ngôn từ kích động thù hằn', percent: 15, color: 'bg-indigo-500' },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-300">{item.label}</span>
                    <span className="font-mono text-white">{item.percent}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* AI Performance Card */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Chỉ số hiệu năng AI Fact Check
              </span>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-300">Tốc độ quét trung bình:</span>
                  <span className="font-bold text-cyan-400 font-mono">1.2 giây/bài</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-300">Độ chuẩn xác đối chiếu nguồn:</span>
                  <span className="font-bold text-emerald-400 font-mono">98.6%</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-300">Số tên miền độc hại bị chặn:</span>
                  <span className="font-bold text-rose-400 font-mono">1,420 domains</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-300">Tỷ lệ người dùng đồng thuận với AI:</span>
                  <span className="font-bold text-amber-300 font-mono">94.2%</span>
                </div>
              </div>
            </div>

          </div>

        </section>
      )}

    </div>
  );
};
