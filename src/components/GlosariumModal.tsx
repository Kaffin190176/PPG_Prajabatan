import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  BookOpen,
  Filter,
  ExternalLink,
  Tag,
  GraduationCap,
  Sparkles,
  BookMarked,
} from 'lucide-react';
import { GLOSARIUM_DATA, GlosariumItem } from '../data/glosariumData';

interface GlosariumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJumpToNode?: (nodeId: string) => void;
  isDark?: boolean;
}

const CATEGORIES = [
  { id: 'all', label: 'Semua Bidang' },
  { id: 'PPP', label: 'PPDP (Peserta Didik)' },
  { id: 'FPPN', label: 'FPPN (Filosofi Pendidikan)' },
  { id: 'PMAD', label: 'PMA Dasar (Perencanaan & Asesmen)' },
  { id: 'PMAL', label: 'PMAL (Mendalam & Asesmen Lanjut)' },
  { id: 'PSE', label: 'PSE (Sosial Emosional)' },
  { id: 'INKLUSI', label: 'Pendidikan Inklusif' },
  { id: 'TEORI', label: 'Pedagogi & Teori Belajar' },
];

export const GlosariumModal: React.FC<GlosariumModalProps> = ({
  isOpen,
  onClose,
  onJumpToNode,
  isDark = true,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLetter, setSelectedLetter] = useState('ALL');

  // Compute available letters from data
  const availableLetters = useMemo(() => {
    const letters = new Set<string>();
    GLOSARIUM_DATA.forEach((item) => {
      const firstLetter = item.term.charAt(0).toUpperCase();
      if (/[A-Z]/.test(firstLetter)) {
        letters.add(firstLetter);
      }
    });
    return Array.from(letters).sort();
  }, []);

  const filteredItems = useMemo(() => {
    return GLOSARIUM_DATA.filter((item) => {
      // Category match
      if (selectedCategory !== 'all') {
        const itemCat = item.category.toUpperCase();
        if (selectedCategory === 'PPP' && !itemCat.includes('PPDP') && !itemCat.includes('PESERTA DIDIK')) return false;
        if (selectedCategory === 'FPPN' && !itemCat.includes('FILOSOFI') && !itemCat.includes('FPPN')) return false;
        if (selectedCategory === 'PMAD' && !itemCat.includes('DASAR') && !itemCat.includes('PMAD') && !itemCat.includes('PERENCANAAN')) return false;
        if (selectedCategory === 'PMAL' && !itemCat.includes('LANJUT') && !itemCat.includes('PMAL') && !itemCat.includes('MENDALAM')) return false;
        if (selectedCategory === 'PSE' && !itemCat.includes('PSE') && !itemCat.includes('SOSIAL EMOSIONAL')) return false;
        if (selectedCategory === 'INKLUSI' && !itemCat.includes('INKLUSIF') && !itemCat.includes('INKLUSI')) return false;
        if (selectedCategory === 'TEORI' && !itemCat.includes('TEORI') && !itemCat.includes('PEDAGOGI')) return false;
      }

      // Letter match
      if (selectedLetter !== 'ALL') {
        if (!item.term.toUpperCase().startsWith(selectedLetter)) {
          return false;
        }
      }

      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTerm = item.term.toLowerCase().includes(q);
        const matchesDef = item.definition.toLowerCase().includes(q);
        const matchesDetail = item.detail?.toLowerCase().includes(q) || false;
        const matchesTags = item.tags.some((t) => t.toLowerCase().includes(q));
        const matchesCategory = item.category.toLowerCase().includes(q);
        return matchesTerm || matchesDef || matchesDetail || matchesTags || matchesCategory;
      }

      return true;
    });
  }, [searchQuery, selectedCategory, selectedLetter]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`relative flex flex-col w-full max-w-5xl h-[90vh] rounded-2xl border shadow-2xl overflow-hidden transition-all ${
          isDark
            ? 'bg-slate-900/95 border-slate-800 text-slate-100 shadow-cyan-950/30'
            : 'bg-white border-slate-200 text-slate-900 shadow-slate-300/50'
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-b ${
            isDark ? 'border-slate-800 bg-slate-950/50' : 'border-slate-200 bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 text-cyan-400 border border-cyan-500/30">
              <BookMarked className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight text-white dark:text-white">
                  Glosarium A–Z PPG Prajabatan
                </h2>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {GLOSARIUM_DATA.length} Istilah Resmi
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Kamus lengkap konsep pedagogis, teori belajar, kerangka kerja CASEL/EMC², regulasi, dan terminologi ujian PPG
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Toolbar */}
        <div className={`p-4 border-b space-y-3 ${isDark ? 'border-slate-800/80 bg-slate-900/60' : 'border-slate-200 bg-white'}`}>
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari istilah, konsep, definisi, teori, atau singkatan (misal: TaRL, UDL, CASEL, Scaffolding, ZPD, Gilbert)..."
              className={`w-full pl-10 pr-10 py-2.5 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${
                isDark
                  ? 'bg-slate-950/80 border border-slate-700/80 text-white placeholder-slate-500'
                  : 'bg-slate-100 border border-slate-300 text-slate-900 placeholder-slate-400'
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-thin">
            <span className="text-slate-400 flex items-center gap-1 mr-1 shrink-0 font-medium text-[11px]">
              <Filter className="w-3 h-3" /> Filter Mata Kuliah:
            </span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm shadow-cyan-500/20'
                    : isDark
                    ? 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Alphabet Quick Jump Bar */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px] font-mono">
            <button
              onClick={() => setSelectedLetter('ALL')}
              className={`px-2 py-0.5 rounded transition-colors ${
                selectedLetter === 'ALL'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : isDark
                  ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              SEMUA A-Z
            </button>
            {availableLetters.map((letter) => (
              <button
                key={letter}
                onClick={() => setSelectedLetter(letter)}
                className={`w-6 h-6 flex items-center justify-center rounded transition-colors ${
                  selectedLetter === letter
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : isDark
                    ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>
              Menampilkan <span className="text-cyan-400 font-semibold">{filteredItems.length}</span> dari {GLOSARIUM_DATA.length} istilah
            </span>
            {(selectedCategory !== 'all' || selectedLetter !== 'ALL' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedLetter('ALL');
                  setSearchQuery('');
                }}
                className="text-amber-400 hover:underline"
              >
                Reset Filter
              </button>
            )}
          </div>

          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-slate-500">
              <BookOpen className="w-12 h-12 mb-3 stroke-[1.5] text-slate-600" />
              <p className="text-base font-semibold text-slate-300">Tidak ada istilah yang cocok</p>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Coba gunakan kata kunci lain, atau periksa filter kategori dan huruf abjad yang sedang aktif.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredItems.map((item, idx) => (
                <div
                  key={`${item.term}-${idx}`}
                  className={`flex flex-col justify-between p-4 rounded-xl border transition-all hover:border-cyan-500/50 hover:shadow-lg ${
                    isDark
                      ? 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-950/80'
                      : 'bg-white border-slate-200 hover:bg-slate-50 shadow-xs'
                  }`}
                >
                  <div>
                    {/* Card Top: Term & Category */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-base font-bold text-cyan-300 tracking-tight leading-snug">
                        {item.term}
                      </h3>
                      <span className="shrink-0 px-2 py-0.5 text-[10px] font-semibold rounded-md bg-slate-800 text-slate-300 border border-slate-700/60">
                        {item.category}
                      </span>
                    </div>

                    {/* Definition */}
                    <p className={`text-xs leading-relaxed mb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {item.definition}
                    </p>

                    {/* Practical Detail / Classroom Implementation if available */}
                    {item.detail && (
                      <div
                        className={`p-2.5 rounded-lg text-xs mb-3 border ${
                          isDark
                            ? 'bg-slate-900/80 border-slate-800 text-slate-300'
                            : 'bg-slate-100 border-slate-200 text-slate-800'
                        }`}
                      >
                        <span className="font-semibold text-amber-400 block mb-0.5">
                          Penerapan Praktik di Kelas:
                        </span>
                        {item.detail}
                      </div>
                    )}
                  </div>

                  {/* Card Bottom: Tags & Jump Button */}
                  <div className="pt-2 border-t border-slate-800/40 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {item.tags.slice(0, 3).map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] rounded bg-slate-800/60 text-slate-400 border border-slate-700/40"
                        >
                          <Tag className="w-2.5 h-2.5 text-cyan-400" />
                          {tag}
                        </span>
                      ))}
                    </div>

                    {item.relatedNodeId && onJumpToNode && (
                      <button
                        onClick={() => {
                          onJumpToNode(item.relatedNodeId!);
                          onClose();
                        }}
                        className="flex items-center gap-1 text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 hover:underline shrink-0"
                        title="Arahkan dan perbesar simpul ini di peta syaraf"
                      >
                        <span>Fokus di Peta</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div
          className={`flex items-center justify-between px-6 py-3 border-t text-xs ${
            isDark ? 'border-slate-800 bg-slate-950/70 text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-600'
          }`}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Semua istilah disusun berdasarkan Kurikulum Resmi PPG Prajabatan Kemendikdasmen</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
