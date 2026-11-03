import React from 'react';
import {
  Brain,
  Zap,
  Volume2,
  VolumeX,
  Layers,
  Download,
  HelpCircle,
  BookOpen,
  BookMarked,
  GraduationCap,
} from 'lucide-react';
import { ThemeMode, THEMES } from '../types/neural';

interface TopNavProps {
  currentTheme: ThemeMode;
  onSelectTheme: (theme: ThemeMode) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onTriggerGlobalPulse: () => void;
  onOpenOutline: () => void;
  onOpenReader: () => void;
  onOpenGlosarium: () => void;
  onOpenStudyHub: () => void;
  onOpenShortcuts: () => void;
  onExportPng: () => void;
  nodeCount: number;
  linkCount: number;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentTheme,
  onSelectTheme,
  isMuted,
  onToggleMute,
  onTriggerGlobalPulse,
  onOpenOutline,
  onOpenReader,
  onOpenGlosarium,
  onOpenStudyHub,
  onOpenShortcuts,
  onExportPng,
  nodeCount,
  linkCount,
}) => {
  const isDark = THEMES[currentTheme].isDark;

  return (
    <header
      className={`relative z-30 flex items-center justify-between gap-4 px-5 py-3 border-b transition-colors select-none ${
        isDark
          ? 'bg-slate-950/90 border-slate-800/80 text-slate-100'
          : 'bg-white/95 border-slate-200 text-slate-900 shadow-xs'
      } backdrop-blur-md`}
    >
      {/* Zone 1: Brand & PPG Prajabatan Info */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 via-cyan-500 to-purple-600 text-white shadow-md shadow-cyan-500/20">
          <Brain className="w-4 h-4" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold tracking-tight text-white dark:text-white whitespace-nowrap">
              Materi <span className="text-amber-400">PPG Prajabatan</span>
            </span>
            <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 rounded-full">
              Peta Syaraf
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono tracking-wider">
            {nodeCount} Simpul Materi · {linkCount} Jalur Sinapsis
          </span>
        </div>
      </div>

      {/* Zone 2: Focused Learning & Pedagogical Actions */}
      <nav className="hidden md:flex items-center gap-2 text-xs font-medium">
        {/* Pusat Belajar & Hafalan */}
        <button
          onClick={onOpenStudyHub}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-amber-200 bg-gradient-to-r from-amber-600/30 to-orange-600/30 hover:from-amber-600/40 hover:to-orange-600/40 border border-amber-500/50 transition-all hover:scale-[1.02] shadow-sm font-semibold"
          title="Buka Pusat Hafalan: Flashcard Active Recall, Kuis HOTS & Tabel Mnemonik (Pintasan: H)"
        >
          <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
          <span className="whitespace-nowrap">Mode Belajar & Hafalan</span>
        </button>

        {/* Modul Bacaan Lengkap */}
        <button
          onClick={onOpenReader}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-cyan-200 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 transition-all hover:scale-[1.02] shadow-sm font-semibold"
          title="Buka modul bacaan lengkap dan pelajari materi secara komprehensif"
        >
          <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
          <span className="whitespace-nowrap">Modul Bacaan</span>
        </button>

        {/* Glosarium A-Z Terpadu */}
        <button
          onClick={onOpenGlosarium}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-emerald-200 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 transition-all hover:scale-[1.02] shadow-sm font-semibold"
          title="Buka Glosarium A-Z PPG: Kamus lengkap istilah, konsep, dan teori (Pintasan: G)"
        >
          <BookMarked className="w-3.5 h-3.5 text-emerald-400" />
          <span className="whitespace-nowrap">Glosarium A–Z</span>
        </button>

        <button
          onClick={onTriggerGlobalPulse}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition-all hover:scale-[1.02]"
          title="Tembakkan impuls bioelektrik ke seluruh cabang syaraf materi (Pintasan: Z)"
        >
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span className="whitespace-nowrap">Picu Impuls Aksi</span>
        </button>

        <button
          onClick={onOpenOutline}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors border ${
            isDark
              ? 'border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800/70'
              : 'border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title="Tampilkan daftar struktur hierarki pohon materi PPG"
        >
          <Layers className="w-3.5 h-3.5 text-slate-400" />
          <span className="whitespace-nowrap">Struktur Hierarki</span>
        </button>

        <div className={`w-px h-4 mx-1 ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />

        {/* Audio Mute Toggle */}
        <button
          onClick={onToggleMute}
          className={`p-1.5 rounded-lg transition-colors border ${
            isDark
              ? 'border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/70'
              : 'border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title={isMuted ? 'Suara Dinonaktifkan' : 'Suara Bioakustik Aktif'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-slate-300" />}
        </button>
      </nav>

      {/* Zone 3: Help & Export Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onOpenShortcuts}
          className={`p-1.5 rounded-lg transition-colors border ${
            isDark ? 'border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800' : 'border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title="Daftar Pintasan Papan Ketik"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        <button
          onClick={onExportPng}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-lg shadow-sm transition-all whitespace-nowrap"
          title="Simpan gambar bagan peta syaraf materi (PNG)"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Unduh Gambar</span>
        </button>
      </div>
    </header>
  );
};
