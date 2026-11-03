import React, { useState } from 'react';
import { X, BookOpen, ExternalLink, Search } from 'lucide-react';
import { NeurotransmitterType, NEUROTRANSMITTERS } from '../types/neural';

interface ChapterReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJumpToNode: (nodeId: string) => void;
  isDark: boolean;
}

export const ChapterReaderModal: React.FC<ChapterReaderModalProps> = ({
  isOpen,
  onClose,
  onJumpToNode,
  isDark,
}) => {
  if (!isOpen) return null;

  const [activeSectionId, setActiveSectionId] = useState('sec_fppn');
  const [searchTerm, setSearchTerm] = useState('');

  const sections = [
    {
      id: 'sec_ink',
      title: '1. Pendidikan Inklusi (Semester 2)',
      nodeId: 'mk_inklusi',
      neurotransmitter: 'Serotonin' as NeurotransmitterType,
      summary: 'Layanan ramah keberagaman, ABK, UDL (Universal Design for Learning), Program Pembelajaran Individual (PPI), dan kolaborasi ahli.',
      content: (
        <div className="space-y-3">
          <p>
            Pendidikan inklusif adalah sistem penyelenggaraan pendidikan yang memberikan kesempatan kepada semua peserta didik yang memiliki kelainan dan memiliki potensi kecerdasan atau bakat istimewa untuk mengikuti pendidikan dalam satu lingkungan pendidikan secara bersama-sama dengan peserta didik pada umumnya.
          </p>
          <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-800/40 text-xs">
            <strong>Prinsip Universal Design for Learning (UDL):</strong>
            <ul className="list-disc list-inside mt-1 space-y-0.5">
              <li><strong>Engagement:</strong> Memberikan beragam pilihan tantangan dan memicu motivasi intrinsik.</li>
              <li><strong>Representation:</strong> Menyajikan materi dalam format multimodal (teks, audio reader, grafik visual, peraga konkret).</li>
              <li><strong>Action & Expression:</strong> Memberikan opsi beragam bagi siswa dalam mendemonstrasikan bukti pemahamannya.</li>
            </ul>
          </div>
          <h4 className="text-xs font-bold text-slate-200 mt-2">Program Pembelajaran Individual (PPI / IEP):</h4>
          <p className="text-xs">
            Rencana kurikulum tertulis yang dirancang khusus untuk satu peserta didik berkebutuhan khusus dengan modifikasi tujuan, materi esensial, alokasi waktu, serta bentuk asesmen ipsatif (membandingkan kemajuan anak dengan dirinya sendiri di masa lalu).
          </p>
        </div>
      ),
    },
    {
      id: 'sec_pmal',
      title: '2. Pembelajaran Mendalam & Asesmen Lanjut (Semester 2)',
      nodeId: 'mk_pmal',
      neurotransmitter: 'Dopamin' as NeurotransmitterType,
      summary: 'Konsep Deep Learning, Triad Mindful-Meaningful-Joyful, PBL & PjBL Lanjut, integrasi EdTech, serta asesmen kinerja autentik.',
      content: (
        <div className="space-y-3">
          <p>
            Pembelajaran mendalam (Deep Learning) mendorong peserta didik tidak hanya menghafal fakta di permukaan (surface learning), melainkan mampu menghubungkan konsep baru dengan pemahaman lama, berpikir kritis, dan mentransfer pengetahuan ke konteks dunia nyata.
          </p>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="font-semibold text-amber-400">1. Mindful</span>: Hadir utuh pikiran dan perasaannya, menyadari cara berpikirnya (metakognisi).
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="font-semibold text-amber-400">2. Meaningful</span>: Konsep memiliki keterkaitan relevan dengan kehidupan riil siswa.
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="font-semibold text-amber-400">3. Joyful</span>: Memicu antusiasme, rasa ingin tahu alami, dan flow experience.
            </div>
          </div>
          <p className="text-xs">
            <strong>Asesmen Kinerja Autentik:</strong> Mengukur unjuk kerja siswa melalui proyek dunia nyata, simulasi industri, dan portofolio digital yang dinilai menggunakan rubrik analitik berdeskriptor jelas.
          </p>
        </div>
      ),
    },
    {
      id: 'sec_pse',
      title: '3. Pembelajaran Sosial Emosional (PSE) (Semester 2)',
      nodeId: 'mk_pse',
      neurotransmitter: 'Asetilkolin' as NeurotransmitterType,
      summary: 'Kerangka CASEL 5 pilar, EMC² (UNESCO MGIEP), Experiential Learning Kolb, School Well-Being (Konu & Rimpelä), serta teknik STOP.',
      content: (
        <div className="space-y-3">
          <p>
            Social Emotional Learning (SEL) adalah proses di mana anak dan pendidik memperoleh dan menerapkan pengetahuan, keterampilan, dan sikap untuk mengembangkan identitas sehat, mengelola emosi, mencapai tujuan pribadi dan kolektif, merasakan empati, dan membangun relasi positif.
          </p>
          <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-800/40 text-xs">
            <strong>5 Pilar Kompetensi Inti CASEL:</strong>
            <ol className="list-decimal list-inside mt-1 space-y-0.5">
              <li><strong>Self-Awareness:</strong> Mengenali emosi, kekuatan, dan nilai diri.</li>
              <li><strong>Self-Management:</strong> Mengelola stres, regulasi impuls, ketekunan.</li>
              <li><strong>Social Awareness:</strong> Menghargai sudut pandang orang lain dan empati sosial.</li>
              <li><strong>Relationship Skills:</strong> Komunikasi efektif, kerja sama tim kooperatif.</li>
              <li><strong>Responsible Decision-Making:</strong> Mengambil keputusan etis dan konstruktif.</li>
            </ol>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
            <strong className="text-purple-400">Kerangka Kerja EMC² (UNESCO MGIEP):</strong>
            <p>
              Mengintegrasikan neurosains sosial dan afektif: <strong>Empathy</strong> (kognitif, emosional, actionable), <strong>Mindfulness</strong> (perhatian sadar tanpa penghakiman), <strong>Compassion</strong> (welas asih Paul Gilbert: 6 atribut & 6 keterampilan), dan <strong>Critical Inquiry</strong> (penyelidikan kritis terhadap bias dan ketidakadilan sosial).
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="font-semibold text-purple-400">Siklus Kolb (Experiential Learning):</span>
              <p className="mt-0.5">Concrete Experience &rarr; Reflective Observation &rarr; Abstract Conceptualization &rarr; Active Experimentation. 4 Gaya: Diverging, Assimilating, Converging, Accommodating.</p>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="font-semibold text-purple-400">School Well-Being (Konu & Rimpelä):</span>
              <p className="mt-0.5">4 Dimensi: Having (kondisi fisik sekolah), Loving (iklim sosial ramah), Being (pemenuhan diri & dihargai), Health Status (kesehatan fisik dan mental siswa).</p>
            </div>
          </div>
          <p className="text-xs">
            <strong>Teknik STOP:</strong> Stop (berhenti sejenak), Take a breath (tarik napas sadar), Observe (amati sensasi tubuh dan emosi), Proceed (lanjutkan aktivitas dengan pikiran jernih).
          </p>
        </div>
      ),
    },
    {
      id: 'sec_fppn',
      title: '4. Filosofi Pendidikan & Nilai (FPPN)',
      nodeId: 'mk_fppn',
      neurotransmitter: 'Serotonin' as NeurotransmitterType,
      summary: 'Pemikiran Ki Hadjar Dewantara, Sistem Among, Kode Etik Guru Indonesia (KEGI 9 Butir), dan 6 Realms of Meaning (Philip Phenix).',
      content: (
        <div className="space-y-3">
          <p>
            Ki Hadjar Dewantara menegaskan bahwa pendidikan adalah menuntun segala kekuatan kodrat yang ada pada anak-anak agar mereka dapat mencapai keselamatan dan kebahagiaan yang setinggi-tingginya baik sebagai manusia maupun sebagai anggota masyarakat.
          </p>
          <div className="p-3 rounded-xl bg-pink-950/20 border border-pink-800/40 text-xs">
            <strong>Sistem Among & Analogi Guru sebagai Petani:</strong>
            <p className="mt-1">
              Petani tidak dapat mengubah kodrat padi menjadi jagung. Guru berperan merawat, menyiangi gulma pengganggu, memberi air dan pupuk terbaik agar benih padi menghasilkan panen bulir yang bernas dan unggul.
            </p>
          </div>
          <h4 className="text-xs font-bold text-slate-200 mt-2">Trilogi Kepemimpinan Pendidikan:</h4>
          <ul className="list-disc list-inside text-xs space-y-0.5 text-slate-300">
            <li><strong>Ing Ngarsa Sung Tuladha:</strong> Di depan memberi teladan moral, tutur kata santun, dan integritas.</li>
            <li><strong>Ing Madya Mangun Karsa:</strong> Di tengah membangun prakarsa, ide inovatif, dan kemitraan belajar.</li>
            <li><strong>Tut Wuri Handayani:</strong> Di belakang memberikan dorongan moril dan kepercayaan kemandirian.</li>
          </ul>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
            <strong className="text-pink-400">Kode Etik Guru Indonesia (KEGI 9 Butir) & Ranah Makna Phenix:</strong>
            <p>
              Guru memegang teguh kejujuran profesional, membina suasana sekolah kondusif, dan merahasiakan latar belakang pribadi siswa. Philip Phenix merumuskan 6 Ranah Makna (Realms of Meaning): Simbolik (bahasa/angka), Empirik (sains), Estetik (seni), Sinoetik (relasi I-Thou antarpribadi), Etik (kewajiban moral), dan Sinoptik (sejarah, filsafat, agama).
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'sec_ppdp',
      title: '5. Peserta Didik & Pembelajarannya (PPDP)',
      nodeId: 'mk_ppdp',
      neurotransmitter: 'Glutamat' as NeurotransmitterType,
      summary: 'Perkembangan kognitif Piaget, ZPD Vygotsky, Etika Kepedulian Gilligan, TaRL (Teaching at the Right Level), CRT, dan Diferensiasi Tomlinson.',
      content: (
        <div className="space-y-3">
          <p>
            Mempelajari bagaimana struktur berpikir, pemrosesan mental, kepribadian, latar belakang budaya, dan pertimbangan moral peserta didik berkembang seiring usia dan interaksi sosial.
          </p>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="font-semibold text-sky-400">Jean Piaget</span>: 4 Tahap Kognitif. Asimilasi, Akomodasi, dan Ekuilibrasi.
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="font-semibold text-sky-400">Lev Vygotsky</span>: ZPD dan Scaffolding bertahap dengan konsep pemudaran (fading).
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="font-semibold text-sky-400">Carol Gilligan</span>: Ethics of Care (etika kepedulian & relasi empati vs aturan abstrak Kohlberg).
            </div>
          </div>
          <div className="p-3 rounded-xl bg-sky-950/20 border border-sky-800/40 text-xs space-y-1">
            <strong className="text-sky-300">Teaching at the Right Level (TaRL):</strong>
            <p>
              Pembelajaran dipusatkan pada tingkat kemampuan/capaian aktual siswa saat ini, bukan berdasarkan usia biologis atau kelas administratif. Menjalankan 4 langkah: 1) Asesmen Awal, 2) Flexible Grouping, 3) Intervensi Terarah, 4) Asesmen Berkala untuk mencegah learning loss.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
            <strong className="text-emerald-400">Culturally Responsive Teaching (CRT) & Funds of Knowledge:</strong>
            <p>
              Mengintegrasikan pengetahuan budaya rumah tangga dan kearifan lokal nusantara (arsitektur adat, tradisi maritim, motif tenun, falsafah gotong royong) untuk membuat pelajaran sains dan sosial bermakna mendalam.
            </p>
          </div>
          <p className="text-xs">
            <strong>Diferensiasi Carol Ann Tomlinson:</strong> Menyesuaikan Konten (apa yang dipelajari), Proses (bagaimana belajar), dan Produk (bukti unjuk kerja) berdasarkan pemetaan kesiapan (readiness), minat, dan profil belajar.
          </p>
        </div>
      ),
    },
    {
      id: 'sec_pmad',
      title: '6. Pembelajaran Mendalam & Asesmen Dasar (PMA Dasar)',
      nodeId: 'mk_pmad',
      neurotransmitter: 'Dopamin' as NeurotransmitterType,
      summary: 'Perumusan CP-TP-ATP, Taksonomi Bloom Revisi (C1-C6), Taksonomi SOLO Biggs, Gagné 9 Events of Instruction, UbD, dan instrumen KKTP.',
      content: (
        <div className="space-y-3">
          <p>
            Perancangan kurikulum operasional yang berpusat pada siswa dengan kerangka backward design: menentukan hasil akhir yang diinginkan, bukti asesmen yang diterima, lalu merencanakan pengalaman belajar.
          </p>
          <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-800/40 text-xs">
            <strong className="text-amber-300">Taksonomi Bloom Revisi (C1 - C6) & KKO Operasional:</strong>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5 mt-1.5 font-mono text-[11px]">
              <div className="p-1.5 bg-slate-950/80 rounded border border-slate-800">
                <span className="text-amber-400 font-bold">C1 Mengingat:</span> Menyebutkan, Mengidentifikasi, Menamai.
              </div>
              <div className="p-1.5 bg-slate-950/80 rounded border border-slate-800">
                <span className="text-amber-400 font-bold">C2 Memahami:</span> Menjelaskan, Mengklasifikasi, Membandingkan.
              </div>
              <div className="p-1.5 bg-slate-950/80 rounded border border-slate-800">
                <span className="text-amber-400 font-bold">C3 Menerapkan:</span> Menggunakan, Menghitung, Menjalankan.
              </div>
              <div className="p-1.5 bg-slate-950/80 rounded border border-rose-900/50">
                <span className="text-rose-400 font-bold">C4 Analisis (HOTS):</span> Menguraikan, Debugging, Menemukan Pola.
              </div>
              <div className="p-1.5 bg-slate-950/80 rounded border border-rose-900/50">
                <span className="text-rose-400 font-bold">C5 Evaluasi (HOTS):</span> Mengevaluasi, Mengkritik, Memvalidasi.
              </div>
              <div className="p-1.5 bg-slate-950/80 rounded border border-rose-900/50">
                <span className="text-rose-400 font-bold">C6 Mencipta (HOTS):</span> Merancang, Membangun Solusi/Produk.
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <strong className="text-orange-400 block mb-0.5">Taksonomi SOLO (Biggs & Collis):</strong>
              <p>5 Level Kualitas Respon: Prestructural &rarr; Unistructural &rarr; Multistructural &rarr; Relational &rarr; Extended Abstract.</p>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <strong className="text-orange-400 block mb-0.5">9 Peristiwa Belajar Gagné:</strong>
              <p>Gain attention, Objectives, Prior learning, Present content, Guidance, Performance, Feedback, Assess, Transfer.</p>
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1">
            <strong className="text-orange-400">Understanding by Design (UbD - Desain Mundur):</strong>
            <p>
              Tahap 1: Identifikasi Hasil yang Diinginkan (Big Ideas & Pertanyaan Esensial) &rarr; Tahap 2: Tentukan Bukti Asesmen (Tugas Kinerja Otentik GRASPS & Rubrik) &rarr; Tahap 3: Rencanakan Pengalaman Belajar (WHERETO).
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'sec_gm',
      title: '7. Growth Mindset dalam Pembelajaran',
      nodeId: 'mk_growth_mindset',
      neurotransmitter: 'GABA' as NeurotransmitterType,
      summary: 'Teori Carol Dweck, neuroplastisitas otak, de-stigmatisasi kesalahan, ketekunan (Grit), dan Process Praise (The Power of Yet).',
      content: (
        <div className="space-y-3">
          <p>
            Pola pikir bertumbuh (Growth Mindset) adalah keyakinan bahwa kapasitas intelektual, kecakapan logika, dan bakat dapat terus dikembangkan melalui kerja keras, latihan terstruktur, dan strategi yang tepat.
          </p>
          <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-800/40 text-xs">
            <strong>Bukti Ilmiah Neuroplastisitas:</strong>
            <p className="mt-1">
              Otak memiliki plastisitas syaraf: sinapsis dendrit bertumbuh semakin lebat saat seseorang berjuang memecahkan tantangan baru dan belajar membetulkan kesalahannya. Otak bertindak layaknya otot yang menguat bila terus dilatih.
            </p>
          </div>
          <p className="text-xs">
            <strong>Process Praise vs Person Praise:</strong> Guru memuji proses, usaha keras, strategi alternatif, dan ketekunan (grit), alih-alih memuji kepintaran bawaan lahir.
          </p>
        </div>
      ),
    },
    {
      id: 'sec_kasus',
      title: '8. Studi Kasus Riil & Dilema Praktik Pedagogis PPG',
      nodeId: 'root_ppg',
      neurotransmitter: 'Serotonin' as NeurotransmitterType,
      summary: '10 Studi Kasus Nyata di Ruang Kelas: Pak Toni, Pak Anto, Bu Sinta, Butet Manurung Sokola Rimba, Pak Rendi, Guru AZ & Kasus Dilema Etis.',
      content: (
        <div className="space-y-3">
          <p>
            Kumpulan kasus autentik yang kerap dihadapi mahasiswa PPG Prajabatan saat Praktik Pengalaman Lapangan (PPL) dan ujian studi kasus pedagogis:
          </p>
          <div className="space-y-2.5 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="font-bold text-amber-400">Kasus 1: Pak Toni (Dilema Asesmen Formatif vs Kecepatan Kurikulum)</span>
              <p className="mt-0.5 text-slate-300">
                Pak Toni merasa tertekan mengejar ketuntasan bab buku teks menjelang ujian tengah semester, sehingga melewatkan asesmen diagnostik dan formatif. Akibatnya 60% murid gagal memahami materi prasyarat. <em>Solusi:</em> Terapkan UbD dan pemadatan materi esensial dengan asesmen formatif berkala.
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="font-bold text-cyan-400">Kasus 2: Pak Anto (Keberagaman Ekstrem & TaRL)</span>
              <p className="mt-0.5 text-slate-300">
                Di kelas 7 SMP, sebagian siswa masih kesulitan membaca lancar sementara sebagian lain sudah mampu menganalisis novel. <em>Solusi:</em> Pengelompokan fleksibel (flexible grouping) berbasis Teaching at the Right Level (TaRL) dengan intervensi bergradasi.
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="font-bold text-purple-400">Kasus 3: Bu Sinta & Ali (Penanganan Emosi & Pengunduran Diri Murid)</span>
              <p className="mt-0.5 text-slate-300">
                Ali menarik diri, pasif, dan menolak berinteraksi karena merasa diejek atas kegagalannya di tugas presentasi. <em>Solusi:</em> Bu Sinta menerapkan PSE (Teknik STOP, percakapan empatik empat mata, pemulihan rasa aman psikologis / psychological safety).
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="font-bold text-emerald-400">Kasus 4: Butet Manurung / Sokola Rimba (Kearifan Kontekstual & CRT)</span>
              <p className="mt-0.5 text-slate-300">
                Membelajarkan literasi dan numerasi kepada masyarakat Orang Rimba dengan mengintegrasikan konteks kehidupan hutan: membaca peta batas wilayah adat dan menghitung timbangan getah jernang, bukan teks kota yang asing.
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="font-bold text-rose-400">Kasus 5: Guru AZ & Kasus Kode Etik (Dilema Integritas Penilaian)</span>
              <p className="mt-0.5 text-slate-300">
                Guru ditawari imbalan hadiah oleh orang tua murid agar memberikan nilai tuntas di raport. <em>Solusi Etis:</em> Menolak dengan santun berlandaskan KEGI Butir 2 (kejujuran profesional) dan memberikan pendampingan remedial resmi berbasis kriteria KKTP.
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const filteredSections = searchTerm
    ? sections.filter(
        s =>
          s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.summary.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : sections;

  const currentSection = sections.find(s => s.id === activeSectionId) || sections[0];
  const info = NEUROTRANSMITTERS[currentSection.neurotransmitter] || NEUROTRANSMITTERS.Glutamat;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/75 backdrop-blur-md">
      <div
        className={`w-full max-w-5xl h-[88vh] rounded-2xl border shadow-2xl overflow-hidden flex flex-col ${
          isDark
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-inherit bg-slate-950/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 text-white shadow-md">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Modul Bacaan Lengkap: 7 Mata Kuliah PPG Prajabatan
              </h3>
              <p className="text-[11px] text-slate-400">
                Ringkasan komprehensif konsep, landasan teori, dan penerapan pedagogis di sekolah
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Navigation */}
          <div className="w-72 sm:w-80 border-r border-inherit flex flex-col bg-slate-950/20 shrink-0">
            <div className="p-3 border-b border-inherit">
              <div className="relative flex items-center">
                <Search className="w-3.5 h-3.5 absolute left-3 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Cari bab atau materi..."
                  className={`w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border focus:outline-none transition-all ${
                    isDark
                      ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-500 focus:border-cyan-500'
                      : 'bg-slate-100 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-cyan-500'
                  }`}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {filteredSections.map(sec => {
                const isActive = sec.id === currentSection.id;
                const secInfo = NEUROTRANSMITTERS[sec.neurotransmitter] || NEUROTRANSMITTERS.Glutamat;
                return (
                  <button
                    key={sec.id}
                    onClick={() => setActiveSectionId(sec.id)}
                    className={`w-full text-left p-2.5 rounded-xl transition-all ${
                      isActive
                        ? 'bg-slate-800 text-white font-medium shadow-xs border border-slate-700/60'
                        : isDark
                        ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: secInfo.primaryColor }}
                      />
                      <span className="text-xs font-semibold line-clamp-1">{sec.title}</span>
                    </div>
                    <p className="text-[11px] line-clamp-2 opacity-70 ml-4">{sec.summary}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Reading Content */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-inherit">
              <div>
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold mb-2"
                  style={{
                    backgroundColor: `${info.primaryColor}20`,
                    color: info.primaryColor,
                  }}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: info.primaryColor }}
                  />
                  Mata Kuliah Inti
                </span>
                <h2 className="text-lg md:text-xl font-bold tracking-tight text-white">
                  {currentSection.title}
                </h2>
              </div>

              <button
                onClick={() => {
                  onJumpToNode(currentSection.nodeId);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-cyan-500/15 text-cyan-300 hover:bg-cyan-500/25 border border-cyan-500/30 transition-all shrink-0 shadow-xs"
              >
                <span>Lihat di Peta Syaraf</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed">
              {currentSection.content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
