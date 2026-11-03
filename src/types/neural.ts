export type NeurotransmitterType =
  | 'Dopamin'
  | 'Serotonin'
  | 'Asetilkolin'
  | 'Norepinefrin'
  | 'GABA'
  | 'Glutamat';

export interface NeurotransmitterInfo {
  name: NeurotransmitterType;
  primaryColor: string;
  glowColor: string;
  secondaryColor: string;
  role: string;
  cognitiveFunction: string;
  iconName: string;
}

export const NEUROTRANSMITTERS: Record<NeurotransmitterType, NeurotransmitterInfo> = {
  Dopamin: {
    name: 'Dopamin',
    primaryColor: '#f59e0b', // amber-500
    glowColor: 'rgba(245, 158, 11, 0.45)',
    secondaryColor: '#fef3c7',
    role: 'Motivasi & Target',
    cognitiveFunction: 'Mendorong pencapaian sasaran, imbalan (reward), gairah ide, dan orientasi masa depan.',
    iconName: 'Zap',
  },
  Serotonin: {
    name: 'Serotonin',
    primaryColor: '#06b6d4', // cyan-500
    glowColor: 'rgba(6, 182, 212, 0.45)',
    secondaryColor: '#cffafe',
    role: 'Fondasi & Harmoni',
    cognitiveFunction: 'Menjaga kestabilan emosi, kepuasan kognitif, nilai-nilai dasar, dan ketahanan ide.',
    iconName: 'Shield',
  },
  Asetilkolin: {
    name: 'Asetilkolin',
    primaryColor: '#a855f7', // purple-500
    glowColor: 'rgba(168, 85, 247, 0.45)',
    secondaryColor: '#f3e8ff',
    role: 'Memori & Logika',
    cognitiveFunction: 'Meningkatkan plastisitas sinaptik, retensi memori jangka panjang, dan analisis analitik.',
    iconName: 'Brain',
  },
  Norepinefrin: {
    name: 'Norepinefrin',
    primaryColor: '#f43f5e', // rose-500
    glowColor: 'rgba(244, 63, 94, 0.45)',
    secondaryColor: '#ffe4e6',
    role: 'Urgensi & Aksi',
    cognitiveFunction: 'Memicu kewaspadaan tinggi, keputusan tanggap darurat, dan prioritas kritis mendesak.',
    iconName: 'Flame',
  },
  GABA: {
    name: 'GABA',
    primaryColor: '#10b981', // emerald-500
    glowColor: 'rgba(16, 185, 129, 0.45)',
    secondaryColor: '#d1fae5',
    role: 'Inhibisi & Filter',
    cognitiveFunction: 'Menahan rangsangan impulsif, mereduksi kebingungan, dan memfilter kesalahan logis.',
    iconName: 'Filter',
  },
  Glutamat: {
    name: 'Glutamat',
    primaryColor: '#38bdf8', // sky-400
    glowColor: 'rgba(56, 189, 248, 0.45)',
    secondaryColor: '#e0f2fe',
    role: 'Eksitasi & Kreativitas',
    cognitiveFunction: 'Memfasilitasi transmisi sinaptik cepat, loncatan asosiasi divergen, dan ide spontan.',
    iconName: 'Sparkles',
  },
};

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface CourseFilter {
  id: string; // 'mk_inklusi' | 'mk_pmal' | 'mk_pse' | 'mk_fppn' | 'mk_ppdp' | 'mk_pmad' | 'mk_growth_mindset'
  shortName: string; // 'Inklusi', 'PMA Lanjut', 'PSE', 'FPPN', 'PPDP', 'PMA Dasar', 'Growth Mindset'
  fullName: string;
  semester?: string;
  color: string;
  glowColor: string;
}

export const PPG_COURSES: CourseFilter[] = [
  {
    id: 'mk_inklusi',
    shortName: 'Inklusi',
    fullName: 'Pendidikan Inklusi',
    semester: 'Semester 2',
    color: '#06b6d4', // cyan-500
    glowColor: 'rgba(6, 182, 212, 0.45)',
  },
  {
    id: 'mk_pmal',
    shortName: 'PMA Lanjut',
    fullName: 'Pembelajaran Mendalam & Asesmen Lanjut',
    semester: 'Semester 2',
    color: '#f59e0b', // amber-500
    glowColor: 'rgba(245, 158, 11, 0.45)',
  },
  {
    id: 'mk_pse',
    shortName: 'PSE',
    fullName: 'Pembelajaran Sosial Emosional',
    semester: 'Semester 2',
    color: '#a855f7', // purple-500
    glowColor: 'rgba(168, 85, 247, 0.45)',
  },
  {
    id: 'mk_fppn',
    shortName: 'FPPN',
    fullName: 'Filosofi Pendidikan dan Pendidikan Nilai',
    color: '#ec4899', // pink-500
    glowColor: 'rgba(236, 72, 153, 0.45)',
  },
  {
    id: 'mk_ppdp',
    shortName: 'PPDP',
    fullName: 'Pemahaman tentang Peserta Didik dan Pembelajaran',
    color: '#38bdf8', // sky-400
    glowColor: 'rgba(56, 189, 248, 0.45)',
  },
  {
    id: 'mk_pmad',
    shortName: 'PMA Dasar',
    fullName: 'Pembelajaran Mendalam dan Asesmen Dasar',
    color: '#f97316', // orange-500
    glowColor: 'rgba(249, 115, 22, 0.45)',
  },
  {
    id: 'mk_growth_mindset',
    shortName: 'Growth Mindset',
    fullName: 'Pola Pikir Bertumbuh dlm Pembelajaran',
    color: '#10b981', // emerald-500
    glowColor: 'rgba(168, 85, 129, 0.45)',
  },
];

export interface NeuronNode {
  id: string;
  label: string;
  subLabel?: string;
  level?: 'root' | 'mata_kuliah' | 'materi' | 'pembahasan' | 'sub_pembahasan';
  courseId?: string; // id of the root mata kuliah (e.g. 'mk_fppn', 'mk_inklusi', etc.)
  category?: string;
  note?: string;
  neurotransmitter: NeurotransmitterType;
  x: number;
  y: number;
  vx: number;
  vy: number;
  isPinned?: boolean;
  synapticWeight: number; // 1 = pembahasan, 2 = materi, 3 = mata kuliah, 4 = root materi PPG
  parentId?: string | null;
  isCollapsed?: boolean;
  checklist?: ChecklistItem[];
  tags?: string[];
  actionPotential: number; // 0 to 1 for visual firing excitation
  lastFired?: number;
  dendriteCount?: number; // visual morphological tentacles
}

export interface SynapseLink {
  id: string;
  sourceId: string;
  targetId: string;
  type: 'axon' | 'associative'; // axon = hierarchical branch, associative = cross-synaptic connection
  weight: number;
  neurotransmitter: NeurotransmitterType;
  myelinated?: boolean;
}

export interface ActionPotentialPulse {
  id: string;
  synapseId: string;
  sourceId: string;
  targetId: string;
  progress: number; // 0 to 1
  speed: number;
  color: string;
}

export interface AstrocyteGlialParticle {
  x: number;
  y: number;
  size: number;
  alpha: number;
  vx: number;
  vy: number;
  branches: { angle: number; length: number }[];
}

export interface MindmapData {
  id: string;
  title: string;
  description: string;
  nodes: NeuronNode[];
  links: SynapseLink[];
}

export type ThemeMode = 'fluorescence' | 'darkfield' | 'golgi';

export interface ThemeConfig {
  id: ThemeMode;
  name: string;
  background: string;
  canvasBg: string;
  gridColor: string;
  somaFill: string;
  somaStroke: string;
  textColor: string;
  textSubColor: string;
  synapseDefault: string;
  isDark: boolean;
}

export const THEMES: Record<ThemeMode, ThemeConfig> = {
  fluorescence: {
    id: 'fluorescence',
    name: 'Mikroskop Fluoresensi',
    background: '#030712',
    canvasBg: '#050b1a',
    gridColor: 'rgba(56, 189, 248, 0.04)',
    somaFill: '#0b162c',
    somaStroke: '#1e293b',
    textColor: '#f8fafc',
    textSubColor: '#94a3b8',
    synapseDefault: 'rgba(56, 189, 248, 0.25)',
    isDark: true,
  },
  darkfield: {
    id: 'darkfield',
    name: 'Darkfield Obsidian',
    background: '#020202',
    canvasBg: '#050505',
    gridColor: 'rgba(255, 255, 255, 0.03)',
    somaFill: '#111115',
    somaStroke: '#27272a',
    textColor: '#fafafa',
    textSubColor: '#a1a1aa',
    synapseDefault: 'rgba(161, 161, 170, 0.3)',
    isDark: true,
  },
  golgi: {
    id: 'golgi',
    name: 'Histologi Golgi (Terang)',
    background: '#f8fafc',
    canvasBg: '#f1f5f9',
    gridColor: 'rgba(15, 23, 42, 0.05)',
    somaFill: '#ffffff',
    somaStroke: '#cbd5e1',
    textColor: '#0f172a',
    textSubColor: '#475569',
    synapseDefault: 'rgba(71, 85, 105, 0.35)',
    isDark: false,
  },
};
