import React, { useState } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  Award, 
  ArrowRight, 
  Sparkles, 
  HelpCircle,
  AlertCircle,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DatabaseService } from '../services/dbMock';
import { Lesson, User } from '../types';

interface Props {
  user: User;
  onUserUpdate: (u: User) => void;
}

export const AcademyPage: React.FC<Props> = ({ user, onUserUpdate }) => {
  const [lessons, setLessons] = useState<Lesson[]>(DatabaseService.getLessons());
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(lessons[0]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const handleSelectLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setSelectedOption(null);
    setQuizSubmitted(false);
  };

  const handleOptionClick = (idx: number) => {
    if (quizSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitQuiz = () => {
    if (selectedOption === null || !activeLesson) return;
    setQuizSubmitted(true);

    const isCorrect = selectedOption === activeLesson.quiz.answerIndex;
    if (isCorrect && !activeLesson.isCompleted) {
      // Trigger confetti celebration!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      const updated = DatabaseService.completeLesson(activeLesson.id);
      setLessons(updated);
      setActiveLesson({ ...activeLesson, isCompleted: true });
      onUserUpdate(DatabaseService.getCurrentUser());
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      
      {/* Header Banner */}
      <section className="glass-panel rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-purple-500/15 via-indigo-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-bold uppercase tracking-wider mb-2">
            <GraduationCap className="w-4 h-4" />
            <span>Digital Safety Academy</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            Học An Toàn Số & Kỹ Năng Phản Biện
          </h1>
          <p className="text-xs md:text-sm text-slate-300 mt-2 leading-relaxed">
            Các bài học ngắn gọn, thực chiến dành riêng cho học sinh và Gen Z.
            Hoàn thành bài học, trả lời quiz trắc nghiệm để thăng hạng và nhận huy hiệu Hiệp sĩ An toàn số.
          </p>
        </div>

        {/* Progress Stats */}
        <div className="mt-5 flex items-center gap-4 text-xs">
          <span className="font-semibold text-slate-300">
            Tiến độ hoàn thành: <strong className="text-emerald-400">{lessons.filter(l => l.isCompleted).length}/{lessons.length} bài học</strong>
          </span>
          <div className="w-36 h-2 rounded-full bg-slate-800 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-500"
              style={{ width: `${(lessons.filter(l => l.isCompleted).length / lessons.length) * 100}%` }}
            />
          </div>
        </div>

      </section>

      {/* Main Grid: Left Lessons List - Right Lesson Reader */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Lesson Selector List (5 columns) */}
        <div className="lg:col-span-4 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Chương trình đào tạo (5 Chủ đề)
          </h2>

          <div className="space-y-2">
            {lessons.map((lesson) => {
              const isSelected = activeLesson?.id === lesson.id;
              return (
                <div
                  key={lesson.id}
                  onClick={() => handleSelectLesson(lesson)}
                  className={`p-4 rounded-2xl cursor-pointer border transition-all ${
                    isSelected
                      ? 'bg-indigo-950/60 border-indigo-500/60 shadow-glow-sm'
                      : 'glass-panel hover:bg-slate-900/90 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-2xl">{lesson.icon}</span>
                    {lesson.isCompleted ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" /> Đã xong
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full">
                        +{lesson.points} XP
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-white mt-2 leading-snug">
                    {lesson.title}
                  </h3>
                  
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {lesson.readTime}
                    </span>
                    <span>•</span>
                    <span className="text-indigo-300 font-medium">{lesson.difficulty}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Interactive Lesson Reader & Quiz (8 columns) */}
        {activeLesson && (
          <div className="lg:col-span-8 space-y-6">
            
            {/* Lesson Content Card */}
            <article className="glass-panel rounded-3xl p-6 md:p-8 space-y-6 text-slate-100">
              
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 mb-1">
                    <span>{activeLesson.topic}</span>
                    <span>•</span>
                    <span className="text-slate-400">{activeLesson.readTime}</span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-black text-white">
                    {activeLesson.icon} {activeLesson.title}
                  </h2>
                  <p className="text-xs md:text-sm text-slate-300 mt-1">
                    {activeLesson.description}
                  </p>
                </div>

                <div className="shrink-0 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center">
                  <span className="text-xs font-bold text-amber-400 font-mono block">
                    +{activeLesson.points}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">XP</span>
                </div>
              </div>

              {/* Sections Breakdown */}
              <div className="space-y-5 text-xs md:text-sm text-slate-200 leading-relaxed">
                {activeLesson.content.map((sec, idx) => (
                  <div key={idx} className="space-y-2">
                    <h3 className="font-bold text-white text-sm md:text-base text-cyan-300">
                      {sec.heading}
                    </h3>
                    <p className="text-slate-300">{sec.body}</p>

                    {sec.tip && (
                      <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-indigo-200 text-xs">
                        <span className="font-bold text-indigo-300">💡 </span>
                        {sec.tip}
                      </div>
                    )}

                    {sec.example && (
                      <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 text-xs">
                        <span className="font-bold text-emerald-400">📌 Ví dụ thực tế: </span>
                        {sec.example}
                      </div>
                    )}

                    {sec.warning && (
                      <div className="p-3 rounded-2xl bg-rose-950/30 border border-rose-500/30 text-rose-200 text-xs">
                        <span className="font-bold text-rose-400">⚠️ Cảnh báo: </span>
                        {sec.warning}
                      </div>
                    )}
                  </div>
                ))}
              </div>

            </article>

            {/* Interactive Quiz Card */}
            <section className="glass-panel rounded-3xl p-6 md:p-8 space-y-5 border-indigo-500/30 text-slate-100">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-amber-400" />
                  <h3 className="text-base font-bold text-white">
                    Thử Thách Trắc Nghiệm Phản Xạ Nhanh
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                  +{activeLesson.points} XP
                </span>
              </div>

              {/* Question */}
              <p className="text-xs md:text-sm font-semibold text-slate-200 leading-relaxed">
                {activeLesson.quiz.question}
              </p>

              {/* Options */}
              <div className="space-y-2.5">
                {activeLesson.quiz.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const isAnswer = activeLesson.quiz.answerIndex === idx;

                  let optionStyle = 'bg-slate-900/80 border-slate-800 hover:border-indigo-500/50 text-slate-300';
                  if (quizSubmitted) {
                    if (isAnswer) {
                      optionStyle = 'bg-emerald-950/40 border-emerald-500 text-emerald-200 font-semibold';
                    } else if (isSelected && !isAnswer) {
                      optionStyle = 'bg-rose-950/40 border-rose-500 text-rose-200';
                    }
                  } else if (isSelected) {
                    optionStyle = 'bg-indigo-950/60 border-indigo-500 text-white font-semibold shadow-glow-sm';
                  }

                  return (
                    <div
                      key={idx}
                      onClick={() => handleOptionClick(idx)}
                      className={`p-3.5 rounded-2xl border text-xs md:text-sm cursor-pointer transition-all ${optionStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border shrink-0 ${
                          isSelected ? 'bg-indigo-500 text-white border-indigo-400' : 'border-slate-700 text-slate-400'
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Submit or Result Explanation */}
              {!quizSubmitted ? (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={selectedOption === null}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs md:text-sm shadow-glow-sm transition-all"
                  >
                    <span>Kiểm tra câu trả lời</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-4 pt-2 animate-in fade-in duration-200">
                  <div className={`p-4 rounded-2xl border text-xs md:text-sm leading-relaxed ${
                    selectedOption === activeLesson.quiz.answerIndex
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                      : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                  }`}>
                    <div className="font-bold flex items-center gap-2 mb-1.5">
                      {selectedOption === activeLesson.quiz.answerIndex ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Xuất sắc! Bạn đã chọn đáp án chính xác (+{activeLesson.points} XP)</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-4 h-4 text-rose-400" />
                          <span>Chưa chính xác! Hãy đọc kỹ giải thích dưới đây:</span>
                        </>
                      )}
                    </div>
                    <p>{activeLesson.quiz.explanation}</p>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        setQuizSubmitted(false);
                        setSelectedOption(null);
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Làm lại thử thách</span>
                    </button>
                  </div>
                </div>
              )}

            </section>

          </div>
        )}

      </div>

    </div>
  );
};
