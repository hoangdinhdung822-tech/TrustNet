import React, { useState } from 'react';
import { 
  Search, 
  ExternalLink, 
  ShieldCheck, 
  Building2, 
  GraduationCap, 
  Cpu, 
  Share2, 
  Clock, 
  Filter,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { DatabaseService } from '../services/dbMock';
import { SearchResultItem } from '../types';

export const SearchPage: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [results, setResults] = useState<SearchResultItem[]>(DatabaseService.getSearchResults());

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const res = DatabaseService.getSearchResults(keyword, selectedCategory);
    setResults(res);
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    const res = DatabaseService.getSearchResults(keyword, cat);
    setResults(res);
  };

  const categories = [
    { id: 'all', label: 'Tất cả nguồn' },
    { id: 'official', label: '🏛️ Website chính thống (.gov.vn)' },
    { id: 'news', label: '📰 Báo chí chính ngạch' },
    { id: 'edu', label: '🎓 Giáo dục & Nghiên cứu' },
    { id: 'tech', label: '💻 Công nghệ & An ninh mạng' },
  ];

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      
      {/* Header Banner */}
      <section className="glass-panel rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-indigo-500/15 via-cyan-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Search className="w-4 h-4" />
            <span>Smart Credible Search</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            Tra Cứu Thông Tin & Nguồn Tin Uy Tín
          </h1>
          <p className="text-xs md:text-sm text-slate-300 mt-2 leading-relaxed">
            Công cụ tìm kiếm ưu tiên các cổng thông tin Nhà nước, báo chí được cấp phép và cơ sở dữ liệu xử lý tin giả quốc gia.
          </p>
        </div>

        {/* Search Bar Form */}
        <form onSubmit={handleSearch} className="mt-6 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                const res = DatabaseService.getSearchResults(e.target.value, selectedCategory);
                setResults(res);
              }}
              placeholder="Nhập câu hỏi, từ khóa hoặc sự kiện (VD: 'Thông tin này có thật không?', 'Lịch thi tốt nghiệp THPT')..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-all shadow-inner"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs md:text-sm shadow-glow-sm transition-all"
          >
            Tìm kiếm
          </button>
        </form>

        {/* Category Filters */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                  : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

      </section>

      {/* Results Feed */}
      <section className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>Tìm thấy <strong className="text-white">{results.length}</strong> kết quả được chứng thực</span>
          <span>Sắp xếp theo: <span className="text-indigo-400 font-semibold">Độ uy tín nguồn cao nhất</span></span>
        </div>

        {results.length === 0 ? (
          <div className="glass-panel p-10 rounded-3xl text-center space-y-3">
            <Search className="w-10 h-10 mx-auto text-slate-600" />
            <h3 className="text-base font-bold text-white">Không tìm thấy tài liệu phù hợp</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Hãy thử tìm kiếm với các từ khóa ngắn gọn hơn hoặc gửi nội dung sang mục "AI Fact Check" để phân tích chi tiết.
            </p>
          </div>
        ) : (
          results.map((item) => (
            <article
              key={item.id}
              className="glass-panel glass-card-hover rounded-3xl p-5 md:p-6 space-y-3 text-slate-100"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-semibold">
                    {item.sourceType}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {item.date}
                  </span>
                </div>

                {/* Credibility Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Độ uy tín: {item.reliability} ({item.credibilityScore}%)</span>
                </div>
              </div>

              {/* Title & snippet */}
              <div>
                <h3 className="text-base md:text-lg font-bold text-white hover:text-indigo-300 transition-colors">
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    {item.title}
                  </a>
                </h3>
                <p className="text-xs md:text-sm text-slate-300 mt-1.5 leading-relaxed">
                  {item.summary}
                </p>
              </div>

              {/* Footer source link */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">
                  Nguồn: <strong className="text-slate-200">{item.source}</strong>
                </span>

                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-indigo-300 text-xs font-semibold group transition-all"
                >
                  <span>Mở nguồn gốc</span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </article>
          ))
        )}
      </section>

    </div>
  );
};
