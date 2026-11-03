import React, { useState } from 'react';
import {
  FLASHCARDS,
  QUIZ_QUESTIONS,
  MNEMONIC_TABLES,
  FlashcardItem,
} from '../data/learningQuizData';
import {
  X,
  GraduationCap,
  Sparkles,
  Zap,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Volume2,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Table,
  Check,
} from 'lucide-react';
import { neuroAudio } from '../audio/NeuroAudio';

interface StudyHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJumpToNode: (nodeId: string) => void;
  isDark: boolean;
}

export const StudyHubModal: React.FC<StudyHubModalProps> = ({
  isOpen,
  onClose,
  onJumpToNode,
  isDark,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'flashcard' | 'quiz' | 'tables'>('flashcard');

  // -------------------------------------------------------------
  // FLASHCARD STATE
  // -------------------------------------------------------------
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCards, setMasteredCards] = useState<Record<string, boolean>>({});
  const [isSpeaking, setIsSpeaking] = useState(false);

  const currentCard: FlashcardItem = FLASHCARDS[currentCardIndex];

  const handleNextCard = () => {
    setIsFlipped(false);
    stopSpeech();
    setCurrentCardIndex(prev => (prev + 1) % FLASHCARDS.length);
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    stopSpeech();
    setCurrentCardIndex(prev => (prev - 1 + FLASHCARDS.length) % FLASHCARDS.length);
  };

  const toggleMastered = (id: string) => {
    setMasteredCards(prev => ({ ...prev, [id]: !prev[id] }));
    neuroAudio.playSprout();
  };

  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // -------------------------------------------------------------
  // QUIZ STATE
  // -------------------------------------------------------------
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const handleSelectQuizOption = (questionId: string, optionIndex: number) => {
    if (quizAnswers[questionId] !== undefined) return; // already answered
    setQuizAnswers(prev => ({ ...prev, [questionId]: optionIndex }));

    const question = QUIZ_QUESTIONS.find(q => q.id === questionId);
    if (question && question.correctIndex === optionIndex) {
      neuroAudio.playActionPotential(1.3);
    } else {
      neuroAudio.playPrune();
    }
  };

  const resetQuiz = () => {
    setQuizAnswers({});
    setQuizScore(null);
  };

  const totalAnswered = Object.keys(quizAnswers).length;
  const correctCount = QUIZ_QUESTIONS.filter(
    q => quizAnswers[q.id] === q.correctIndex
  ).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-md">
      <div
        className={`w-full max-w-4xl h-[90vh] rounded-2xl border shadow-2xl overflow-hidden flex flex-col ${
          isDark
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-inherit bg-slate-950/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Pusat Belajar & Uji Hafalan Bab I
              </h3>
              <p className="text-[11px] text-slate-400">
                Latih ingatan aktif (*active recall*), uji pemahaman HOTS, dan kuasai materi pedagogi
              </p>
            </div>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center gap-1 p-1 bg-slate-950/70 border border-slate-800 rounded-xl text-xs">
            <button
              onClick={() => {
                setActiveTab('flashcard');
                stopSpeech();
              }}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'flashcard'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Kartu Hafalan ({Object.values(masteredCards).filter(Boolean).length}/{FLASHCARDS.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('quiz');
                stopSpeech();
              }}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'quiz'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Kuis & HOTS ({totalAnswered}/{QUIZ_QUESTIONS.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('tables');
                stopSpeech();
              }}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'tables'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Tabel Komparasi
            </button>
          </div>

          <button
            onClick={() => {
              stopSpeech();
              onClose();
            }}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-950/20">
          {/* TAB 1: FLASHCARDS (ACTIVE RECALL) */}
          {activeTab === 'flashcard' && (
            <div className="max-w-2xl mx-auto flex flex-col h-full justify-between space-y-4">
              {/* Progress & Tools */}
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono">
                  Kartu {currentCardIndex + 1} dari {FLASHCARDS.length}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      speakText(
                        isFlipped
                          ? `${currentCard.question}. Jawabannya: ${currentCard.keyAnswer}. ${currentCard.explanation}`
                          : currentCard.question
                      )
                    }
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] transition-colors ${
                      isSpeaking
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 animate-pulse'
                        : 'border-slate-800 bg-slate-900 text-slate-300 hover:text-white'
                    }`}
                    title="Dengarkan suara penjelasan kartu"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{isSpeaking ? 'Hentikan Suara' : 'Dengarkan Audio'}</span>
                  </button>

                  <button
                    onClick={() => {
                      onJumpToNode(currentCard.nodeId);
                      stopSpeech();
                      onClose();
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-cyan-500/40 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 text-[11px] font-medium transition-colors"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Lihat di Jaringan Syaraf</span>
                  </button>
                </div>
              </div>

              {/* Flashcard Body */}
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className={`relative min-h-[300px] p-6 md:p-8 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col justify-between shadow-xl ${
                  isFlipped
                    ? 'bg-slate-900/95 border-cyan-500/60 shadow-cyan-500/10'
                    : 'bg-slate-950/90 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300">
                      {currentCard.category}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {isFlipped ? 'Sisi Jawaban (Klik untuk balik)' : 'Sisi Pertanyaan (Klik untuk lihat kunci)'}
                    </span>
                  </div>

                  {!isFlipped ? (
                    // Front
                    <div className="py-6 space-y-4">
                      <h4 className="text-base md:text-lg font-bold text-white leading-relaxed">
                        {currentCard.question}
                      </h4>
                      <p className="text-xs text-slate-400 italic">
                        Tip: Cobalah mengingat jawaban dan contohnya di dalam pikiran Anda sebelum membalik kartu.
                      </p>
                    </div>
                  ) : (
                    // Back
                    <div className="space-y-4 py-2">
                      <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 block mb-1">
                          Inti Jawaban:
                        </span>
                        <p className="text-xs md:text-sm font-semibold text-white leading-relaxed">
                          {currentCard.keyAnswer}
                        </p>
                      </div>

                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                          Penjelasan Pedagogis:
                        </span>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {currentCard.explanation}
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-800/40 text-xs">
                        <strong className="text-purple-300">Aplikasi Pembelajaran Informatika:</strong>
                        <p className="text-slate-300 mt-1">{currentCard.inforExample}</p>
                      </div>

                      <div className="text-[11px] text-amber-300/90 bg-amber-950/20 border border-amber-800/30 p-2.5 rounded-lg flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                        <span><strong>Mnemonic Cepat:</strong> {currentCard.mnemonicTip}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Flip Hint */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-800/60 text-xs">
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      toggleMastered(currentCard.id);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                      masteredCards[currentCard.id]
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'border-slate-700 bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>
                      {masteredCards[currentCard.id] ? 'Telah Dikuasai' : 'Tandai Sudah Kuasai'}
                    </span>
                  </button>

                  <span className="text-slate-400 text-[11px]">
                    Tekan tombol untuk membalik kartu
                  </span>
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between gap-4 pt-2">
                <button
                  onClick={handlePrevCard}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Sebelumnya</span>
                </button>

                <div className="flex items-center gap-1">
                  {FLASHCARDS.map((_, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        setIsFlipped(false);
                        stopSpeech();
                        setCurrentCardIndex(i);
                      }}
                      className={`w-2 h-2 rounded-full cursor-pointer transition-all ${
                        i === currentCardIndex
                          ? 'w-6 bg-cyan-400'
                          : masteredCards[FLASHCARDS[i].id]
                          ? 'bg-emerald-500'
                          : 'bg-slate-700'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={handleNextCard}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
                >
                  <span>Selanjutnya</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: INTERACTIVE QUIZ & HOTS CHALLENGE */}
          {activeTab === 'quiz' && (
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Quiz Score Header */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Uji Pemahaman Konseptual & Analisis HOTS
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Jawab pertanyaan untuk menguji kedalaman pemahaman materi bab 1
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs text-slate-400 font-mono">Skor Anda:</span>
                    <div className="text-base font-bold text-cyan-400 font-mono">
                      {correctCount} / {QUIZ_QUESTIONS.length} Benar
                    </div>
                  </div>
                  <button
                    onClick={resetQuiz}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    title="Ulangi Kuis"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Questions List */}
              <div className="space-y-4">
                {QUIZ_QUESTIONS.map((q, qIndex) => {
                  const userAnswer = quizAnswers[q.id];
                  const hasAnswered = userAnswer !== undefined;
                  const isCorrect = userAnswer === q.correctIndex;

                  return (
                    <div
                      key={q.id}
                      className={`p-5 rounded-2xl border transition-all ${
                        hasAnswered
                          ? isCorrect
                            ? 'bg-emerald-950/20 border-emerald-500/40'
                            : 'bg-rose-950/20 border-rose-500/40'
                          : 'bg-slate-950/60 border-slate-800/80'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-800 text-xs font-bold text-cyan-400 font-mono">
                            {qIndex + 1}
                          </span>
                          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                            {q.level}
                          </span>
                        </div>

                        <button
                          onClick={() => {
                            onJumpToNode(q.nodeId);
                            onClose();
                          }}
                          className="flex items-center gap-1 text-[11px] font-medium text-cyan-400 hover:underline"
                        >
                          <Zap className="w-3 h-3 text-amber-400" />
                          <span>Simpul Terkait</span>
                        </button>
                      </div>

                      <h5 className="text-xs md:text-sm font-semibold text-slate-100 mb-4 leading-relaxed">
                        {q.question}
                      </h5>

                      {/* Options */}
                      <div className="space-y-2">
                        {q.options.map((opt, optIndex) => {
                          const isThisSelected = userAnswer === optIndex;
                          const isThisCorrect = q.correctIndex === optIndex;

                          let optionStyle =
                            'border-slate-800 bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-white';
                          if (hasAnswered) {
                            if (isThisCorrect) {
                              optionStyle = 'border-emerald-500 bg-emerald-950/40 text-emerald-200 font-semibold';
                            } else if (isThisSelected) {
                              optionStyle = 'border-rose-500 bg-rose-950/40 text-rose-200';
                            } else {
                              optionStyle = 'border-slate-800/40 bg-slate-950/40 text-slate-500 opacity-60';
                            }
                          }

                          return (
                            <button
                              key={optIndex}
                              disabled={hasAnswered}
                              onClick={() => handleSelectQuizOption(q.id, optIndex)}
                              className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${optionStyle}`}
                            >
                              <span>{opt}</span>
                              {hasAnswered && isThisCorrect && (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                              )}
                              {hasAnswered && isThisSelected && !isThisCorrect && (
                                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 ml-2" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Feedback Explanation */}
                      {hasAnswered && (
                        <div className="mt-4 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                          <strong className={isCorrect ? 'text-emerald-400' : 'text-rose-400'}>
                            {isCorrect ? '✓ Jawaban Tepat!' : '✗ Belum Tepat.'}
                          </strong>{' '}
                          {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: MNEMONIC CHEAT SHEETS (TABEL KOMPARASI) */}
          {activeTab === 'tables' && (
            <div className="max-w-3xl mx-auto space-y-6">
              {MNEMONIC_TABLES.map(tbl => (
                <div
                  key={tbl.id}
                  className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 shadow-md"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Table className="w-4 h-4 text-cyan-400" />
                    <h4 className="text-xs md:text-sm font-bold text-white">
                      {tbl.title}
                    </h4>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400">
                          {tbl.headers.map((h, i) => (
                            <th key={i} className="pb-2 font-semibold">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/50">
                        {tbl.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-slate-900/40 transition-colors">
                            {row.map((cell, cIdx) => (
                              <td
                                key={cIdx}
                                className={`py-2.5 pr-3 text-slate-300 leading-relaxed ${
                                  cIdx === 0 ? 'font-semibold text-cyan-300' : ''
                                }`}
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-inherit bg-slate-950/50 shrink-0 text-xs">
          <span className="text-slate-400">
            Metode Active Recall & Spaced Repetition terbukti meningkatkan retensi jangka panjang hingga 200%.
          </span>
          <button
            onClick={() => {
              stopSpeech();
              onClose();
            }}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
