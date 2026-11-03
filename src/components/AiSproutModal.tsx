import React, { useState } from 'react';
import { NeuronNode, NeurotransmitterType, NEUROTRANSMITTERS } from '../types/neural';
import { X, Sparkles, Plus, Check, Loader2, Brain } from 'lucide-react';
import { neuroAudio } from '../audio/NeuroAudio';

interface AiBranchResult {
  label: string;
  note: string;
  neurotransmitter: NeurotransmitterType;
  weight: number;
  selected?: boolean;
}

interface AiSproutModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetNode: NeuronNode | null;
  onAddBranches: (
    parentId: string,
    branches: { label: string; note: string; neurotransmitter: NeurotransmitterType; weight: number }[]
  ) => void;
  isDark: boolean;
}

export const AiSproutModal: React.FC<AiSproutModalProps> = ({
  isOpen,
  onClose,
  targetNode,
  onAddBranches,
  isDark,
}) => {
  if (!isOpen || !targetNode) return null;

  const [loading, setLoading] = useState(false);
  const [branches, setBranches] = useState<AiBranchResult[]>([]);
  const [customFocus, setCustomFocus] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const generateAssociations = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const response = await fetch('/api/gemini/sprout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parentThought: customFocus.trim() || targetNode.label,
          contextPath: [targetNode.label],
          neurotransmitter: targetNode.neurotransmitter,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();
      if (data && Array.isArray(data.branches)) {
        setBranches(
          data.branches.map((b: any) => ({
            ...b,
            selected: true,
          }))
        );
        neuroAudio.playActionPotential(1.3);
      } else {
        throw new Error('Data format error');
      }
    } catch (err: any) {
      console.warn('API error, using local cognitive generator:', err);
      // Local fallback
      setBranches([
        {
          label: `Dimensi Kritis: ${targetNode.label}`,
          note: 'Analisis faktor penentu keberhasilan dan resiko terselubung.',
          neurotransmitter: 'Asetilkolin',
          weight: 2,
          selected: true,
        },
        {
          label: `Langkah Terobosan Nyata`,
          note: 'Tindakan berdampak tinggi yang dapat dieksekusi dalam 48 jam.',
          neurotransmitter: 'Dopamin',
          weight: 2,
          selected: true,
        },
        {
          label: `Eksplorasi Alternatif Kreatif`,
          note: 'Menghubungkan pola dari industri berbeda untuk menghasilkan kebaruan.',
          neurotransmitter: 'Glutamat',
          weight: 2,
          selected: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelectBranch = (index: number) => {
    setBranches(prev =>
      prev.map((b, i) => (i === index ? { ...b, selected: !b.selected } : b))
    );
  };

  const handleApply = () => {
    const selectedBranches = branches.filter(b => b.selected);
    if (selectedBranches.length > 0) {
      onAddBranches(targetNode.id, selectedBranches);
      neuroAudio.playSprout();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className={`w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden transition-all ${
          isDark
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-inherit bg-gradient-to-r from-cyan-950/30 to-purple-950/30">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Stimulasi Asosiasi Sinaptik AI</h3>
              <p className="text-[11px] text-slate-400">
                Menumbuhkan percabangan ide biologis dari soma:{' '}
                <span className="font-semibold text-cyan-300">"{targetNode.label}"</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Fokus Spesifik Stimulasi (Opsional)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customFocus}
                onChange={e => setCustomFocus(e.target.value)}
                placeholder={`Contoh: "aspek teknis", "peluang pasar", dll...`}
                className={`flex-1 px-3 py-2 text-xs rounded-lg border focus:outline-none focus:ring-1 focus:ring-cyan-500 ${
                  isDark
                    ? 'bg-slate-950 border-slate-800 text-white'
                    : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
              <button
                onClick={generateAssociations}
                disabled={loading}
                className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 rounded-lg flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer shadow-md shadow-cyan-500/10"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
                <span>{branches.length > 0 ? 'Stimulasi Ulang' : 'Picu Asosiasi'}</span>
              </button>
            </div>
          </div>

          {branches.length > 0 && (
            <div className="space-y-2 mt-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">
                  Hasil Cabang Dendritik ({branches.filter(b => b.selected).length} dipilih):
                </span>
                <span className="text-[11px] text-cyan-400 font-mono">
                  Pilih cabang yang ingin dicangkok
                </span>
              </div>

              <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                {branches.map((b, idx) => {
                  const info = NEUROTRANSMITTERS[b.neurotransmitter] || NEUROTRANSMITTERS.Glutamat;
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleSelectBranch(idx)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        b.selected
                          ? 'border-cyan-500/70 bg-cyan-950/20 shadow-sm'
                          : isDark
                          ? 'border-slate-800 bg-slate-950/40 opacity-60'
                          : 'border-slate-200 bg-slate-50 opacity-60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-4 h-4 rounded flex items-center justify-center border text-[10px] ${
                              b.selected
                                ? 'bg-cyan-500 border-cyan-400 text-white'
                                : 'border-slate-600 text-transparent'
                            }`}
                          >
                            <Check className="w-3 h-3" />
                          </div>
                          <span className="text-xs font-semibold text-slate-100">{b.label}</span>
                        </div>
                        <span
                          className="text-[10px] px-2 py-0.5 rounded font-mono font-medium border"
                          style={{
                            color: info.primaryColor,
                            borderColor: `${info.primaryColor}40`,
                            backgroundColor: `${info.primaryColor}15`,
                          }}
                        >
                          {b.neurotransmitter}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1.5 ml-6 leading-relaxed">
                        {b.note}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-inherit bg-slate-950/40">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            Tutup
          </button>
          {branches.length > 0 && (
            <button
              onClick={handleApply}
              className="px-4 py-2 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg shadow-md transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tumbuhkan ke Kanvas</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
