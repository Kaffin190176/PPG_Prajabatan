import React from 'react';
import { DEFAULT_TEMPLATES } from '../data/defaultTemplates';
import { MindmapData } from '../types/neural';
import { X, FolderOpen, ArrowRight, Brain, Lightbulb, CheckCircle2 } from 'lucide-react';

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: MindmapData) => void;
  isDark: boolean;
}

export const TemplatesModal: React.FC<TemplatesModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
  isDark,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className={`w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden transition-all ${
          isDark
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-inherit bg-gradient-to-r from-blue-950/30 to-cyan-950/30">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Koleksi Template Jaringan Syaraf</h3>
              <p className="text-[11px] text-slate-400">
                Pilih arsitektur pemikiran awal yang sudah distrukturisasi secara biologis
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

        {/* Content */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[70vh] overflow-y-auto">
          {Object.values(DEFAULT_TEMPLATES).map(tmpl => (
            <div
              key={tmpl.id}
              onClick={() => {
                onSelectTemplate(tmpl);
                onClose();
              }}
              className={`p-4 rounded-xl border flex flex-col justify-between cursor-pointer transition-all hover:scale-[1.02] ${
                isDark
                  ? 'bg-slate-950/60 border-slate-800 hover:border-cyan-500/70 hover:bg-slate-950'
                  : 'bg-slate-50 border-slate-200 hover:border-cyan-500 hover:bg-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                    {tmpl.id === 'bab1_peserta_didik' ? (
                      <Brain className="w-4 h-4 text-cyan-400" />
                    ) : tmpl.id === 'learning_brain' ? (
                      <Brain className="w-4 h-4" />
                    ) : tmpl.id === 'startup_project' ? (
                      <Lightbulb className="w-4 h-4" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    {tmpl.nodes.length} Simpul · {tmpl.links.length} Sinapsis
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-100 mb-1 leading-snug">
                  {tmpl.title}
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                  {tmpl.description}
                </p>
              </div>

              <div className="flex items-center justify-end text-[11px] font-semibold text-cyan-400 gap-1 pt-2 border-t border-slate-800/60">
                <span>Gunakan Pola</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-3.5 border-t border-inherit bg-slate-950/40">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
};
