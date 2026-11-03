import React, { useState } from 'react';
import {
  NeuronNode,
  NEUROTRANSMITTERS,
  ChecklistItem,
} from '../types/neural';
import {
  X,
  Zap,
  Volume2,
  VolumeX,
  CheckSquare,
  Square,
  BookOpen,
  Tag,
  CheckCircle2,
  Share2,
  Layers,
  Sparkles,
} from 'lucide-react';

interface NeuronDetailDrawerProps {
  node: NeuronNode | null;
  onClose: () => void;
  onUpdate: (updates: Partial<NeuronNode>) => void;
  onTriggerPulse: () => void;
  isDark: boolean;
}

export const NeuronDetailDrawer: React.FC<NeuronDetailDrawerProps> = ({
  node,
  onClose,
  onUpdate,
  onTriggerPulse,
  isDark,
}) => {
  if (!node) return null;

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [personalNote, setPersonalNote] = useState(node.note || '');
  const [isEditingNote, setIsEditingNote] = useState(false);

  const toggleSpeech = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    window.speechSynthesis.cancel();
    const textToSpeak = `${node.label}. ${node.subLabel ? node.subLabel + '. ' : ''}${node.note || ''}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'id-ID';
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const info = NEUROTRANSMITTERS[node.neurotransmitter] || NEUROTRANSMITTERS.Glutamat;

  const handleToggleChecklist = (id: string) => {
    const updated = (node.checklist || []).map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    onUpdate({ checklist: updated });
  };

  // Determine hierarchical badge level
  const getLevelBadge = () => {
    switch (node.level || (node.synapticWeight === 4 ? 'root' : node.synapticWeight === 3 ? 'mata_kuliah' : node.synapticWeight === 2 ? 'materi' : 'pembahasan')) {
      case 'root':
        return {
          label: 'Root: Program PPG',
          color: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
        };
      case 'mata_kuliah':
        return {
          label: 'Level 1: Mata Kuliah',
          color: 'bg-purple-500/15 text-purple-300 border-purple-500/40',
        };
      case 'materi':
        return {
          label: 'Level 2: Materi & Teori',
          color: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40',
        };
      case 'pembahasan':
        return {
          label: 'Level 3: Pembahasan Materi',
          color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
        };
      case 'sub_pembahasan':
      default:
        return {
          label: 'Level 4: Penerapan & KKO',
          color: 'bg-rose-500/15 text-rose-300 border-rose-500/40',
        };
    }
  };

  const badge = getLevelBadge();

  return (
    <div
      className={`fixed top-[57px] right-0 bottom-0 w-84 sm:w-96 md:w-[420px] z-40 border-l shadow-2xl flex flex-col transition-all duration-300 ${
        isDark
          ? 'bg-slate-950/95 border-slate-800 text-slate-100'
          : 'bg-white/95 border-slate-200 text-slate-900'
      } backdrop-blur-md`}
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-inherit bg-slate-900/40">
        <div className="flex items-center gap-2">
          <span
            className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-full border ${badge.color}`}
          >
            {badge.label}
          </span>
          {node.category && (
            <span className="text-[10px] text-slate-400 font-medium truncate max-w-[120px]">
              {node.category}
            </span>
          )}
        </div>
        <button
          onClick={() => {
            if (isSpeaking) window.speechSynthesis.cancel();
            onClose();
          }}
          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Tutup Panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Reading & Learning Content */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {/* Title & SubLabel */}
        <div>
          <div className="flex items-start gap-2.5">
            <div
              className="w-3.5 h-3.5 rounded-full shrink-0 mt-1"
              style={{ backgroundColor: info.primaryColor, boxShadow: `0 0 10px ${info.primaryColor}` }}
              title={`Modalitas Neurotransmiter: ${info.name}`}
            />
            <div className="flex-1">
              <h2 className="text-lg font-bold tracking-tight text-white dark:text-white leading-snug">
                {node.label}
              </h2>
              {node.subLabel && (
                <p className="text-xs text-cyan-400 font-medium mt-0.5">
                  {node.subLabel}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Primary Audio & Pulse Action Bar */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={toggleSpeech}
            className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
              isSpeaking
                ? 'bg-cyan-500/25 border-cyan-400 text-cyan-200 animate-pulse'
                : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200'
            }`}
            title="Dengarkan pembacaan narasi materi ini"
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-cyan-400" />
                <span>Hentikan Suara</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Dengarkan Materi</span>
              </>
            )}
          </button>

          <button
            onClick={onTriggerPulse}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all hover:scale-[1.02]"
            title="Tembakkan sinyal listrik potensial aksi ke cabang sinapsis terhubung"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Picu Impuls Aksi</span>
          </button>
        </div>

        {/* Pembahasan & Penjelasan Materi Lengkap */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wide">
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              Penjelasan & Kajian Materi
            </span>
            <button
              onClick={() => setIsEditingNote(!isEditingNote)}
              className="text-[10px] text-cyan-400 hover:text-cyan-300 underline font-medium"
            >
              {isEditingNote ? 'Selesai Edit' : 'Edit Catatan'}
            </button>
          </div>

          {isEditingNote ? (
            <textarea
              rows={6}
              value={personalNote}
              onChange={e => {
                setPersonalNote(e.target.value);
                onUpdate({ note: e.target.value });
              }}
              className="w-full p-2.5 text-xs text-slate-200 bg-slate-950 border border-cyan-500/50 rounded-lg focus:outline-none leading-relaxed"
              placeholder="Tulis catatan penjelasan materi..."
            />
          ) : (
            <div className="text-xs text-slate-300 leading-relaxed space-y-2 whitespace-pre-line font-normal">
              {node.note || 'Belum ada penjelasan materi untuk simpul ini.'}
            </div>
          )}
        </div>

        {/* Biological Neurotransmitter Context */}
        <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800/80 text-xs flex items-start gap-2.5">
          <div
            className="w-2.5 h-2.5 rounded-full mt-1 shrink-0"
            style={{ backgroundColor: info.primaryColor }}
          />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-200">
                Sistem Syaraf: {info.name}
              </span>
              <span className="text-[10px] font-mono text-cyan-400">
                {info.role}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
              {info.cognitiveFunction}
            </p>
          </div>
        </div>

        {/* Concept Tags / Keywords */}
        {node.tags && node.tags.length > 0 && (
          <div>
            <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400 mb-2">
              <Tag className="w-3 h-3 text-cyan-400" />
              <span>Kata Kunci Pemahaman:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {node.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 text-[10px] font-medium bg-slate-900 border border-slate-800 text-cyan-300 rounded-md"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Checklist Pemahaman Mandiri */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Indikator Penguasaan Materi
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              {node.checklist?.filter(c => c.completed).length || 0}/
              {node.checklist?.length || 0}
            </span>
          </div>

          <div className="space-y-1.5">
            {(node.checklist || [
              { id: 'c_default_1', text: 'Paham definisi dan konsep kunci materi ini', completed: false },
              { id: 'c_default_2', text: 'Mampu menjelaskan penerapan nyata di kelas', completed: false },
            ]).map(item => (
              <button
                key={item.id}
                onClick={() => handleToggleChecklist(item.id)}
                className="w-full flex items-center gap-2.5 p-2 rounded-lg bg-slate-900/50 border border-slate-800 hover:border-slate-700 text-left text-xs transition-colors"
              >
                {item.completed ? (
                  <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-slate-500 shrink-0" />
                )}
                <span
                  className={
                    item.completed ? 'line-through text-slate-500' : 'text-slate-200'
                  }
                >
                  {item.text}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
