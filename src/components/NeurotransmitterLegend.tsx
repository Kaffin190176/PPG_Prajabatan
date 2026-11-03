import React from 'react';
import { NeuronNode, PPG_COURSES } from '../types/neural';
import { Search, X, BookOpen } from 'lucide-react';

interface NeurotransmitterLegendProps {
  nodes: NeuronNode[];
  activeCourseFilter: string | null;
  onSelectCourseFilter: (courseId: string | null) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isDark: boolean;
}

export const NeurotransmitterLegend: React.FC<NeurotransmitterLegendProps> = ({
  nodes,
  activeCourseFilter,
  onSelectCourseFilter,
  searchQuery,
  onSearchChange,
  isDark,
}) => {
  // Compute node count per Mata Kuliah
  const counts: Record<string, number> = {};
  for (const n of nodes) {
    if (n.courseId) {
      counts[n.courseId] = (counts[n.courseId] || 0) + 1;
    }
  }

  return (
    <div
      className={`absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-2xl backdrop-blur-md max-w-[96vw] overflow-x-auto scrollbar-none transition-all ${
        isDark
          ? 'bg-slate-950/90 border-slate-800 text-slate-200'
          : 'bg-white/95 border-slate-200 text-slate-800 shadow-slate-200/50'
      }`}
    >
      {/* Compact Search Input */}
      <div className="relative flex items-center shrink-0">
        <Search className="w-3.5 h-3.5 absolute left-2 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Cari materi..."
          className={`pl-7 pr-6 py-1 text-xs rounded-full border focus:outline-none w-28 sm:w-32 md:w-36 transition-all ${
            isDark
              ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-500 focus:border-cyan-500'
              : 'bg-slate-100 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-cyan-500'
          }`}
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-2 text-slate-400 hover:text-white"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      <div className="w-px h-4 bg-slate-700/50 mx-0.5 shrink-0" />

      {/* Course Filter Pills (Mata Kuliah) */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={() => onSelectCourseFilter(null)}
          title="Tampilkan Seluruh Mata Kuliah (Semua Simpul)"
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
            activeCourseFilter === null
              ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/50 shadow-sm'
              : isDark
              ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-3 h-3 text-cyan-400" />
          <span>Semua MK</span>
        </button>

        {PPG_COURSES.map(course => {
          const count = counts[course.id] || 0;
          const isActive = activeCourseFilter === course.id;

          return (
            <button
              key={course.id}
              onClick={() => onSelectCourseFilter(isActive ? null : course.id)}
              title={`${course.fullName} ${course.semester ? `(${course.semester})` : ''} - ${count} simpul materi`}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-slate-900 text-white font-semibold shadow-md border'
                  : isDark
                  ? 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              style={{
                borderColor: isActive ? course.color : 'transparent',
              }}
            >
              <div
                className="w-2 h-2 rounded-full shrink-0 transition-transform"
                style={{
                  backgroundColor: course.color,
                  boxShadow: isActive ? `0 0 8px ${course.color}` : 'none',
                  transform: isActive ? 'scale(1.25)' : 'scale(1)',
                }}
              />
              <span>{course.shortName}</span>
              {count > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive
                      ? 'bg-slate-800 text-slate-200 font-bold'
                      : 'bg-slate-800/50 text-slate-400'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
