import React, { useState } from 'react';
import { 
  Gamepad2, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Flame, 
  Award, 
  ArrowRight, 
  RefreshCw,
  ShieldAlert,
  MessageSquare,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DatabaseService } from '../services/dbMock';
import { Scenario, User } from '../types';

interface Props {
  user: User;
  onUserUpdate: (u: User) => void;
}

export const ScenariosPage: React.FC<Props> = ({ user, onUserUpdate }) => {
  const [scenarios, setScenarios] = useState<Scenario[]>(DatabaseService.getScenarios());
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(scenarios[0].id);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);

  const activeScenario = scenarios.find(s => s.id === selectedScenarioId) || scenarios[0];

  const handleSelectOption = (optId: string) => {
    if (isAnswerRevealed) return;
    setSelectedOptionId(optId);
  };

  const handleConfirmDecision = () => {
    if (!selectedOptionId) return;
    setIsAnswerRevealed(true);

    const chosen = activeScenario.options.find(o => o.id === selectedOptionId);
    if (chosen?.isCorrect && !activeScenario.isCompleted) {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });

      const updated = DatabaseService.completeScenario(activeScenario.id);
      setScenarios(updated);
      onUserUpdate(DatabaseService.getCurrentUser());
    }
  };

  const handleResetScenario = () => {
    setSelectedOptionId(null);
    setIsAnswerRevealed(false);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      
      {/* Header Banner */}
      <section className="glass-panel rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-amber-500/15 via-rose-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Gamepad2 className="w-4 h-4" />
            <span>Cyber Scenario Simulator</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            Phòng Thí Nghiệm Tình Huống Giả Lập
          </h1>
          <p className="text-xs md:text-sm text-slate-300 mt-2 leading-relaxed">
            Đặt mình vào trung tâm của các đợt bùng nổ tin giả, bẫy lừa đảo trúng thưởng, Deepfake mạo danh và chiêu trò kích động.
            Luyện tập phản xạ để không bao giờ trở thành nạn nhân trên không gian số.
          </p>
        </div>

        {/* Level & completed count */}
        <div className="mt-5 flex items-center gap-4 text-xs">
          <span className="font-semibold text-slate-300">
            Đã chinh phục: <strong className="text-amber-400">{scenarios.filter(s => s.isCompleted).length}/{scenarios.length} tình huống</strong>
          </span>
          <div className="w-36 h-2 rounded-full bg-slate-800 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-rose-400 transition-all duration-500"
              style={{ width: `${(scenarios.filter(s => s.isCompleted).length / scenarios.length) * 100}%` }}
            />
          </div>
        </div>

      </section>

      {/* Main Grid: Left Scenario Navigation - Right Simulator Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left List (4 columns) */}
        <div className="lg:col-span-4 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Danh sách kịch bản (5 Tình huống)
          </h2>

          <div className="space-y-2">
            {scenarios.map((scen, idx) => {
              const isSelected = activeScenario.id === scen.id;
              return (
                <div
                  key={scen.id}
                  onClick={() => {
                    setSelectedScenarioId(scen.id);
                    setSelectedOptionId(null);
                    setIsAnswerRevealed(false);
                  }}
                  className={`p-4 rounded-2xl cursor-pointer border transition-all ${
                    isSelected
                      ? 'bg-gradient-to-br from-indigo-950/80 to-slate-900 border-indigo-500/60 shadow-glow-sm'
                      : 'glass-panel hover:bg-slate-900/90 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1.5">
                    <span className="font-bold text-indigo-400 uppercase">
                      {scen.categoryLabel}
                    </span>
                    {scen.isCompleted ? (
                      <span className="flex items-center gap-1 font-bold text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Hoàn thành
                      </span>
                    ) : (
                      <span className="font-bold text-amber-400">
                        +{scen.pointsReward} XP
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-white leading-snug">
                    {scen.title}
                  </h3>

                  <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                    {scen.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Sandbox (8 columns) */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="glass-panel rounded-3xl p-6 md:p-8 space-y-6 text-slate-100 relative">
            
            {/* Context Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-1">
                  <Flame className="w-4 h-4 fill-amber-400" />
                  <span>Kịch bản mô phỏng trực tiếp</span>
                </div>
                <h2 className="text-xl md:text-2xl font-black text-white">
                  {activeScenario.title}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-bold">
                  {activeScenario.urgencyLevel}
                </span>
                <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-bold font-mono">
                  +{activeScenario.pointsReward} XP
                </span>
              </div>
            </div>

            {/* Context narrative description */}
            <div className="text-xs md:text-sm text-slate-300 italic bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800/80">
              {activeScenario.description}
            </div>

            {/* Simulated Live Post / Message Box (Mock Social / Chat UI) */}
            <div className="rounded-2xl border border-indigo-500/30 bg-slate-950 p-4 md:p-5 space-y-3 shadow-inner">
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={activeScenario.simulatedMessage.senderAvatar}
                    alt={activeScenario.simulatedMessage.senderName}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/40"
                  />
                  <div>
                    <span className="font-bold text-white text-xs md:text-sm block">
                      {activeScenario.simulatedMessage.senderName}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {activeScenario.simulatedMessage.senderHandle} • {activeScenario.simulatedMessage.timeAgo}
                    </span>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 border border-slate-800 text-[11px] font-mono">
                  {activeScenario.simulatedMessage.platform}
                </span>
              </div>

              {/* Message Content */}
              <p className="text-xs md:text-sm text-slate-100 font-medium leading-relaxed whitespace-pre-line bg-slate-900/40 p-3 rounded-xl border border-slate-800/60">
                {activeScenario.simulatedMessage.messageText}
              </p>

              {/* Media attached if any */}
              {activeScenario.simulatedMessage.mediaUrl && (
                <div className="rounded-xl overflow-hidden max-h-56 bg-slate-900 border border-slate-800">
                  <img
                    src={activeScenario.simulatedMessage.mediaUrl}
                    alt="Ảnh tình huống"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Tag marker */}
              {activeScenario.simulatedMessage.metadataTag && (
                <div className="text-[11px] font-semibold text-rose-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{activeScenario.simulatedMessage.metadataTag}</span>
                </div>
              )}

            </div>

            {/* Decision Question */}
            <div className="space-y-3">
              <h3 className="text-sm md:text-base font-extrabold text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-indigo-400" />
                {activeScenario.question}
              </h3>

              {/* Option Choices A, B, C, D */}
              <div className="space-y-2.5">
                {activeScenario.options.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;

                  let cardStyle = 'bg-slate-900/80 border-slate-800 hover:border-indigo-500/50 text-slate-300';
                  if (isAnswerRevealed) {
                    if (opt.isCorrect) {
                      cardStyle = 'bg-emerald-950/40 border-emerald-500 text-emerald-200 font-semibold shadow-glow-emerald';
                    } else if (isSelected && !opt.isCorrect) {
                      cardStyle = 'bg-rose-950/40 border-rose-500 text-rose-200';
                    }
                  } else if (isSelected) {
                    cardStyle = 'bg-indigo-950/60 border-indigo-500 text-white font-semibold shadow-glow-sm';
                  }

                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      className={`p-4 rounded-2xl border text-xs md:text-sm cursor-pointer transition-all ${cardStyle}`}
                    >
                      <div className="flex items-start gap-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border shrink-0 mt-0.5 ${
                          isSelected ? 'bg-indigo-500 text-white border-indigo-400' : 'border-slate-700 text-slate-400'
                        }`}>
                          {opt.id.replace('opt-', '').toUpperCase()}
                        </span>
                        <div className="space-y-1">
                          <p>{opt.text}</p>
                          {isAnswerRevealed && (
                            <p className={`text-xs mt-1 italic ${
                              opt.isCorrect ? 'text-emerald-400 font-medium' : 'text-rose-300'
                            }`}>
                              👉 {opt.feedback}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Decision Controls */}
            {!isAnswerRevealed ? (
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleConfirmDecision}
                  disabled={!selectedOptionId}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 disabled:opacity-50 text-slate-950 font-black text-xs md:text-sm shadow-md transition-all"
                >
                  <span>Chốt phương án xử lý</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </button>
              </div>
            ) : (
              <div className="space-y-4 pt-3 border-t border-slate-800 animate-in fade-in duration-200">
                
                {/* Expert Cyber Tip Callout */}
                <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-xs md:text-sm text-indigo-200 flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-300 block mb-0.5">
                      Bí quyết từ chuyên gia an ninh mạng:
                    </span>
                    <p className="leading-relaxed">{activeScenario.expertTip}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400">
                    {activeScenario.options.find(o => o.id === selectedOptionId)?.isCorrect 
                      ? '🎉 Bạn đã xuất sắc giải quyết tình huống an toàn!'
                      : '💡 Hãy ghi nhớ kinh nghiệm này để áp dụng ngoài đời thực!'}
                  </span>
                  <button
                    onClick={handleResetScenario}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Thử lại tình huống</span>
                  </button>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
