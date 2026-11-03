import React from 'react';
import { X, Command, Keyboard } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
  isDark,
}) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Klik Node', desc: 'Buka panel penjelasan materi & teori lengkap' },
    { key: 'H', desc: 'Buka / tutup Pusat Belajar, Flashcard & Kuis HOTS' },
    { key: 'G', desc: 'Buka / tutup Glosarium A–Z Istilah & Konsep PPG' },
    { key: 'B', desc: 'Toggle Mode Uji Ingatan (Tutup label untuk menguji hafalan)' },
    { key: 'Z', desc: 'Tembakkan impuls bioelektrik (potensial aksi)' },
    { key: 'F', desc: 'Pusatkan seluruh jaringan syaraf ke tengah layar' },
    { key: 'Esc', desc: 'Tutup panel penjelasan materi' },
    { key: 'Geser Mouse', desc: 'Geser kanvas (Panning) atau pindahkan simpul' },
    { key: 'Roda Mouse', desc: 'Perbesar / perkecil tampilan (Zooming)' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className={`w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden transition-all ${
          isDark
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-inherit bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <Keyboard className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Pintasan Papan Ketik & Navigasi</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          {shortcuts.map((sc, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-4 py-2 border-b border-slate-800/40 last:border-0"
            >
              <span className="text-xs text-slate-300">{sc.desc}</span>
              <kbd className="px-2.5 py-1 text-[11px] font-mono font-semibold text-cyan-300 bg-slate-950 border border-slate-800 rounded-md shrink-0 shadow-xs">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end px-6 py-3.5 border-t border-inherit bg-slate-950/40">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            Mengerti
          </button>
        </div>
      </div>
    </div>
  );
};
