import React from 'react';
import { 
  School, 
  MapPin, 
  ExternalLink, 
  Award, 
  Calendar, 
  Users, 
  Globe, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Sparkles, 
  BookOpen, 
  Compass, 
  CheckCircle2, 
  Heart,
  Share2
} from 'lucide-react';

interface Props {
  setActiveTab?: (tab: string) => void;
}

const GOOGLE_MAPS_URL = "https://www.google.com/maps/place/Tr%C6%B0%E1%BB%9Dng+THPT+Phan+%C4%90%C3%ACnh+Ph%C3%B9ng/@12.7519232,108.4212827,17z/data=!4m15!1m8!3m7!1s0x3171e77b54892d2f:0x40b383fe875f149f!2zVHLGsOG7nW5nIFRIUFQgUGhhbiDEkMOsbmggUGjDuW5n!8m2!3d12.751867!4d108.4213146!10e5!16s%2Fg%2F11c42b471z!3m5!1s0x3171e77b54892d2f:0x40b383fe875f149f!8m2!3d12.751867!4d108.4213146!16s%2Fg%2F11c42b471z?entry=ttu&g_ep=EgoyMDI2MDkyMy4wIKXMDSoASAFQAw%3D%3D";

export const SchoolIntroPage: React.FC<Props> = ({ setActiveTab }) => {
  return (
    <div className="space-y-6 pb-20 md:pb-8">
      
      {/* Hero Header Section */}
      <section className="glass-panel rounded-3xl p-6 md:p-8 relative overflow-hidden text-slate-100">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-indigo-500/20 via-cyan-500/15 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 border border-indigo-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider">
              <School className="w-4 h-4 text-cyan-400" />
              <span>Ngôi trường khởi nguồn dự án TrustNet</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
              Trường THPT Số 1 Phan Đình Phùng
            </h1>

            <div className="flex items-center gap-2 text-xs md:text-sm text-indigo-300 font-medium flex-wrap">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-rose-400" />
                Xã Ea Kly, Huyện Krông Pắc, Tỉnh Đắk Lắk
              </span>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <span className="flex items-center gap-1 text-emerald-400 font-bold">
                <Award className="w-4 h-4" /> Trường Chuẩn Quốc Gia Mức Độ 1
              </span>
            </div>

            <p className="text-xs md:text-sm text-slate-300 leading-relaxed pt-1">
              Trải qua chặng đường 30 năm xây dựng và phát triển (1996 – 2026), Trường THPT Số 1 Phan Đình Phùng là điểm sáng giáo dục của huyện Krông Pắc, luôn đi đầu trong đổi mới phương pháp giảng dạy, phong trào STEM, nghiên cứu khoa học kỹ thuật và xây dựng văn hóa ứng xử văn minh, an toàn trên không gian mạng cho học sinh.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-extrabold text-xs md:text-sm shadow-glow-sm hover:shadow-lg transition-all group"
              >
                <Compass className="w-4 h-4 group-hover:rotate-45 transition-transform" />
                <span>Xem vị trí trên Google Maps 📍</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              {setActiveTab && (
                <button
                  onClick={() => setActiveTab('feed')}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-semibold text-xs md:text-sm transition-colors"
                >
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>Khám phá TrustNet</span>
                </button>
              )}
            </div>

          </div>

          {/* School Badge / Emblem Visual Card */}
          <div className="shrink-0 p-5 rounded-3xl bg-gradient-to-b from-indigo-950/70 to-slate-900 border border-indigo-500/30 text-center space-y-3 shadow-xl">
            <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-400 p-[2px] shadow-glow-sm">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center flex-col">
                <School className="w-10 h-10 text-cyan-300" />
                <span className="text-[10px] font-black text-indigo-300 mt-1">1996 - 2026</span>
              </div>
            </div>

            <div>
              <span className="text-sm font-bold text-white block">THPT Số 1 Phan Đình Phùng</span>
              <span className="text-[11px] text-slate-400">Krông Pắc, Đắk Lắk</span>
            </div>

            <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-bold text-emerald-400">
              30 Năm Trồng Người
            </div>
          </div>

        </div>

        {/* 4 Stat Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-slate-800">
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold mb-1">
              <Calendar className="w-4 h-4" /> Năm thành lập
            </div>
            <span className="text-xl md:text-2xl font-black text-white font-mono">1996</span>
            <span className="text-[11px] text-slate-400 block">30 năm phát triển</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold mb-1">
              <Users className="w-4 h-4" /> Quy mô học sinh
            </div>
            <span className="text-xl md:text-2xl font-black text-white font-mono">&gt;1.200</span>
            <span className="text-[11px] text-slate-400 block">Học sinh các khối 10, 11, 12</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold mb-1">
              <Award className="w-4 h-4" /> Kiểm định chất lượng
            </div>
            <span className="text-base md:text-lg font-black text-emerald-400">Mức Độ 1</span>
            <span className="text-[11px] text-slate-400 block">Trường chuẩn Quốc gia</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold mb-1">
              <Sparkles className="w-4 h-4" /> Chuyển đổi số
            </div>
            <span className="text-base md:text-lg font-black text-amber-300">Tiên Phong</span>
            <span className="text-[11px] text-slate-400 block">CLB STEM & Sáng tạo số</span>
          </div>
        </div>

      </section>

      {/* TrustNet Connection Spotlight Banner */}
      <section className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-indigo-950/90 via-slate-900 to-cyan-950/80 border border-indigo-500/40 relative overflow-hidden shadow-xl text-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Dấu ấn khoa học kỹ thuật học đường</span>
            </div>
            <h2 className="text-lg md:text-xl font-extrabold text-white">
              Sứ Mạng Ra Đời Của Dự Án TrustNet Tại Trường
            </h2>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              Nhận thấy nguy cơ học sinh THPT dễ rơi vào bẫy tin giả, thông tin độc hại và các chiêu trò lừa đảo qua mạng xã hội, nhóm học sinh trường <strong>THPT Số 1 Phan Đình Phùng</strong> đã nghiên cứu và phát triển nền tảng <strong>TrustNet</strong>.
              Dự án kết hợp trí tuệ nhân tạo (AI) giúp đoàn viên thanh niên hình thành tư duy phản biện <em>"Đọc → Kiểm tra → Suy nghĩ → Đánh giá → Quyết định"</em>, trở thành những công dân số gương mẫu.
            </p>
          </div>

          <div className="shrink-0 p-4 rounded-2xl bg-slate-950/80 border border-indigo-500/30 text-xs space-y-2">
            <span className="font-bold text-cyan-300 block">🏆 Mục tiêu dự án học đường:</span>
            <ul className="space-y-1.5 text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>100% học sinh được rèn luyện kỹ năng an toàn số</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Kiểm chứng tin đồn giả mạo trước khi chia sẻ</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Ứng dụng AI vì lợi ích giáo dục cộng đồng</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Interactive Map & Contact Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Direct Google Maps Embed Card (7 cols) */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-5 md:p-6 space-y-4 text-slate-100">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-rose-400" />
              <h2 className="text-base font-bold text-white">Vị trí trường trên bản đồ</h2>
            </div>
            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
            >
              <span>Mở Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Interactive Map Container */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 aspect-[16/10] group">
            {/* Embedded Google Maps Iframe */}
            <iframe
              title="Vị trí Trường THPT Số 1 Phan Đình Phùng"
              src="https://maps.google.com/maps?q=12.751867,108.4213146&hl=vi&z=16&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full filter invert-[0.9] hue-rotate-180 contrast-125 group-hover:filter-none transition-all duration-300"
            />

            {/* Float Overlay on bottom */}
            <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-slate-950/90 backdrop-blur-md border border-slate-800 text-xs flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Trường THPT Số 1 Phan Đình Phùng</span>
                <span className="text-[11px] text-slate-400">Tọa độ: 12.751867, 108.4213146 (Ea Kly, Krông Pắc)</span>
              </div>
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] shrink-0"
              >
                Chỉ đường
              </a>
            </div>
          </div>

          <p className="text-xs text-slate-400 italic">
            * Nhấn nút <strong>"Mở Google Maps"</strong> hoặc <strong>"Chỉ đường"</strong> để mở ứng dụng Google Maps trực tiếp trên thiết bị của bạn với lộ trình di chuyển chính xác nhất.
          </p>
        </div>

        {/* Right Column: Contact & School Highlights (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Contact Details Card */}
          <div className="glass-panel rounded-3xl p-5 md:p-6 space-y-4 text-slate-100">
            <h2 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              Thông tin liên hệ & Địa chỉ
            </h2>

            <div className="space-y-3 text-xs md:text-sm">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                <MapPin className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Địa chỉ chính thức:</span>
                  <span className="text-slate-300">Xã Ea Kly, Huyện Krông Pắc, Tỉnh Đắk Lắk</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                <Globe className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Cổng thông tin điện tử:</span>
                  <a
                    href="http://c3phandinhphungdaklak.edu.vn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:underline break-all"
                  >
                    c3phandinhphungdaklak.edu.vn
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                <Phone className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Cơ quan chủ quản:</span>
                  <span className="text-slate-300">Sở Giáo dục và Đào tạo tỉnh Đắk Lắk</span>
                </div>
              </div>
            </div>

            {/* Google Maps External Button */}
            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-bold text-xs md:text-sm shadow-md transition-all"
            >
              <MapPin className="w-4 h-4" />
              <span>Xem vị trí chính xác trên Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Core Values Card */}
          <div className="glass-panel rounded-3xl p-5 md:p-6 space-y-3 text-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
              Giá trị cốt lõi nhà trường
            </h3>

            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-cyan-300 font-bold block">TRÍ TUỆ</span>
                <span className="text-[11px] text-slate-400">Hiếu học & Sáng tạo</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-emerald-300 font-bold block">BẢN LĨNH</span>
                <span className="text-[11px] text-slate-400">Tự tin & Phản biện</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-indigo-300 font-bold block">TRÁCH NHIỆM</span>
                <span className="text-[11px] text-slate-400">Công dân số gương mẫu</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-amber-300 font-bold block">ĐỔI MỚI</span>
                <span className="text-[11px] text-slate-400">Tiên phong công nghệ</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
