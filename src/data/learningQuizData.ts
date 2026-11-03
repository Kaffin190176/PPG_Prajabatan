export interface FlashcardItem {
  id: string;
  nodeId: string;
  category: string;
  question: string;
  keyAnswer: string;
  explanation: string;
  inforExample: string;
  mnemonicTip: string;
}

export interface QuizQuestion {
  id: string;
  nodeId: string;
  level: 'Konseptual' | 'C4 Analisis' | 'C5 Evaluasi' | 'C6 Kreasi';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const FLASHCARDS: FlashcardItem[] = [
  // MK 1: Pendidikan Inklusi
  {
    id: 'fc_ink_1',
    nodeId: 'n_ink_udl',
    category: '1. Pendidikan Inklusi',
    question: 'Apa 3 Prinsip Utama Universal Design for Learning (UDL) menurut Rose & Meyer (CAST)?',
    keyAnswer: '1) Multiple Means of Engagement (keterlibatan), 2) Multiple Means of Representation (penyajian), 3) Multiple Means of Action & Expression (ekspresi hasil).',
    explanation: 'UDL merancang pembelajaran ramah untuk semua sejak awal, bukan perbaikan tambal sulam di akhir bagi siswa berkebutuhan khusus.',
    inforExample: 'Guru menyediakan materi teks, audio reader, dan video bersubtitle, serta mengizinkan siswa menyajikan tugas berupa program kode, infografis, atau rekaman suara.',
    mnemonicTip: 'E-R-A: Engagement (Minat), Representation (Media), Action (Karya).',
  },
  {
    id: 'fc_ink_2',
    nodeId: 'n_ink_ppi',
    category: '1. Pendidikan Inklusi',
    question: 'Apa itu Program Pembelajaran Individual (PPI / IEP) dan siapa saja yang menyusunnya?',
    keyAnswer: 'Rencana kurikulum tertulis yang dimodifikasi khusus untuk satu anak berkebutuhan khusus (tujuan, materi, waktu, asesmen). Disusun bersama Guru Kelas, GPK, Orang Tua, dan Terapis/Psikolog.',
    explanation: 'PPI menjamin anak dengan hambatan belajar menerima target kompetensi realistis yang sesuai kapasitas dirinya (asesmen ipsatif).',
    inforExample: 'Siswa disleksia diberikan waktu tambahan 50% dan format soal berbasis visual ikonik dengan pengurangan teks bertele-tele.',
    mnemonicTip: 'PPI = Pakaian yang dijahit pas khusus untuk ukuran satu anak.',
  },

  // MK 2: Pembelajaran Mendalam (PMA Lanjut)
  {
    id: 'fc_pmal_1',
    nodeId: 'n_pmal_triad_mmj',
    category: '2. PMA Lanjut',
    question: 'Jelaskan Triad Pengalaman Pembelajaran Mendalam: Mindful, Meaningful, dan Joyful!',
    keyAnswer: 'Mindful (hadir utuh & sadar cara berpikir), Meaningful (relevan dengan kehidupan nyata siswa), Joyful (antusias, memicu rasa ingin tahu alami & perasaan senang flow).',
    explanation: 'Deep learning melampaui sekadar menghafal rumus (surface learning) menjadi penguasaan konsep yang melekat dan mampu ditransfer ke masalah baru.',
    inforExample: 'Siswa antusias dan fokus penuh (joyful & mindful) membuat website simulasi UMKM desa yang nyata berguna bagi pedagang lokal (meaningful).',
    mnemonicTip: 'M-M-J: Pikiran Sadar (Mindful), Bermanfaat Riil (Meaningful), Hati Gembira (Joyful).',
  },
  {
    id: 'fc_pmal_2',
    nodeId: 'n_pmal_asesmen_kinerja',
    category: '2. PMA Lanjut',
    question: 'Mengapa asesmen kinerja autentik lebih efektif mengukur pembelajaran mendalam dibanding tes pilihan ganda biasa?',
    keyAnswer: 'Asesmen kinerja menuntut demonstrasi keterampilan nyata terintegrasi dalam situasi otentik dunia kerja, bukan sekadar mengenali kunci jawaban.',
    explanation: 'Menilai kemampuan berpikir analitis, pemecahan masalah, dan pertanggungjawaban solusi melalui rubrik performa yang transparan.',
    inforExample: 'Siswa mempresentasikan demo aplikasi buatan sendiri, menjelaskan arsitektur logika sistem, dan mempertahankan keputusan kodenya.',
    mnemonicTip: 'Unjuk Kerja Nyata > Memilih Huruf A/B/C/D.',
  },

  // MK 3: Pembelajaran Sosial Emosional (PSE)
  {
    id: 'fc_pse_1',
    nodeId: 'n_pse_5pilar',
    category: '3. Pembelajaran Sosial Emosional',
    question: 'Sebutkan 5 Kompetensi Sosial-Emosional menurut kerangka CASEL!',
    keyAnswer: '1) Self-awareness, 2) Self-management, 3) Social awareness, 4) Relationship skills, 5) Responsible decision-making.',
    explanation: 'PSE membekali siswa dengan kecerdasan emosional yang melandasi keberhasilan akademis dan ketahanan mental menghadapi kesulitan.',
    inforExample: 'Saat kode program error berkali-kali, siswa mengenali rasa frustrasinya (self-awareness) dan mengatur nafas tanpa melempar keyboard (self-management).',
    mnemonicTip: 'Sadar Diri -> Kelola Diri -> Peka Sosial -> Rukun Berelasi -> Putusan Bijak.',
  },
  {
    id: 'fc_pse_2',
    nodeId: 'n_pse_emosi_stres',
    category: '3. Pembelajaran Sosial Emosional',
    question: 'Bagaimana sintaks teknik STOP Mindfulness untuk mengelola kepanikan atau stres belajar?',
    keyAnswer: 'S (Stop: berhenti sejenak), T (Take a breath: tarik nafas sadar), O (Observe: amati sensasi tubuh dan pikiran), P (Proceed: lanjutkan dengan jernih).',
    explanation: 'Membantu menurunkan respon amigdala (fight-or-flight) dan mengembalikan kontrol kognitif prefrontal cortex otak.',
    inforExample: 'Guru mengajak kelas melakukan jeda STOP 2 menit sebelum memulai ujian praktik coding yang menegangkan.',
    mnemonicTip: 'STOP: Berhenti, Bernafas, Amati, Lanjutkan.',
  },

  // MK 4: Filosofi Pendidikan dan Nilai (FPPN)
  {
    id: 'fc_fppn_1',
    nodeId: 'n_fppn_sistem_among',
    category: '4. Filosofi Pendidikan (FPPN)',
    question: 'Apa makna Filosofi Sistem Among Ki Hadjar Dewantara dan analogi Guru sebagai Petani?',
    keyAnswer: 'Sistem Among mendidik dengan menuntun kodrat alami anak tanpa paksaan. Petani tidak bisa mengubah padi jadi jagung, melainkan merawat benih padi agar menghasilkan bulir terbaik.',
    explanation: 'Anak bukan kertas putih kosong (tabula rasa), melainkan telah memiliki garis-garis samar kodrat yang ditebalkan oleh bimbingan guru.',
    inforExample: 'Guru memfasilitasi minat bakat alami siswa yang condong ke logika analitik atau desain visual dengan bimbingan terbaik.',
    mnemonicTip: 'Among = Menuntun, bukan Menuntut; Petani Menumbuhkan Benih.',
  },
  {
    id: 'fc_fppn_2',
    nodeId: 'n_fppn_trilogi',
    category: '4. Filosofi Pendidikan (FPPN)',
    question: 'Jelaskan 3 Semboyan Trilogi Kepemimpinan Ki Hadjar Dewantara!',
    keyAnswer: '1) Ing Ngarsa Sung Tuladha (di depan memberi teladan), 2) Ing Madya Mangun Karsa (di tengah membangun semangat prakarsa), 3) Tut Wuri Handayani (di belakang memberi dorongan kemandirian).',
    explanation: 'Pedoman posisi peran guru yang dinamis sesuai kebutuhan situasi perkembangan anak didik.',
    inforExample: 'Di depan mencontohkan etika integritas anti-plagiarisme, di tengah berdiskusi ide setara, di belakang mempercayakan proyek mandiri.',
    mnemonicTip: 'Depan = Teladan; Tengah = Semangat; Belakang = Dorongan.',
  },

  // MK 5: Peserta Didik dan Pembelajaran (PPDP)
  {
    id: 'fc_ppdp_1',
    nodeId: 'n_ppdp_piaget',
    category: '5. Peserta Didik (PPDP)',
    question: 'Apa perbedaan Skema, Asimilasi, Akomodasi, dan Ekuilibrasi menurut Jean Piaget?',
    keyAnswer: 'Skema = wadah kerangka mental; Asimilasi = memasukkan info cocok; Akomodasi = merombak wadah karena info beda; Ekuilibrasi = penyeimbangan kognitif.',
    explanation: 'Konflik kognitif (disequilibrium) memicu otak untuk memperluas skema pemahaman baru.',
    inforExample: 'Siswa tahu for loop (skema). Mengetahui while loop kondisional tanpa batas tetap membuat skema perulangannya dirombak (akomodasi).',
    mnemonicTip: 'Asimilasi = Tambah isi; Akomodasi = Beli wadah baru.',
  },
  {
    id: 'fc_ppdp_2',
    nodeId: 'n_ppdp_vygotsky_zpd',
    category: '5. Peserta Didik (PPDP)',
    question: 'Apa itu Zone of Proximal Development (ZPD) dan Scaffolding?',
    keyAnswer: 'ZPD: Jarak kemampuan mandiri dengan kemampuan potensial bila dibantu MKO. Scaffolding: Bantuan terarah bertingkat yang perlahan dilepas (fading).',
    explanation: 'Mengajar terlalu mudah membuat bosan, terlalu jauh di luar ZPD membuat frustrasi. Mengajarlah tepat di dalam rentang ZPD.',
    inforExample: 'Guru memberikan template kode parsial berlubang, membimbing pengisian logika, lalu melepas siswa membuat kode mandiri.',
    mnemonicTip: 'ZPD = Zona Berkembang; Scaffolding = Perancah bangunan.',
  },
  {
    id: 'fc_ppdp_tarl',
    nodeId: 'n_tarl_konsep',
    category: '5. Peserta Didik (PPDP)',
    question: 'Apa esensi utama Teaching at the Right Level (TaRL) dan 4 langkah sintaksnya di kelas?',
    keyAnswer: 'TaRL memprioritaskan kemampuan riil siswa saat ini (tingkat capaian aktual), bukan batasan usia biologis atau kelas administratif. 4 Langkah: 1) Asesmen Diagnostik Awal, 2) Pengelompokan Fleksibel, 3) Pembelajaran Berdiferensiasi Terarah, 4) Asesmen Berkala.',
    explanation: 'TaRL memastikan siswa menguasai kemampuan literasi/numerasi fondasional sebelum dipaksa mempelajari materi lanjutan, mencegah kesenjangan belajar (learning loss).',
    inforExample: 'Siswa kelas 7 yang belum lancar operasi dasar matematika dikelompokkan bersama untuk penguatan fondasi aljabar, bukan dipaksa langsung masuk kalkulus.',
    mnemonicTip: 'TaRL = Ajar Sesuai Capaian Riil, Bukan Usia/Tingkat Kelas.',
  },
  {
    id: 'fc_ppdp_crt',
    nodeId: 'n_crt_konsep',
    category: '5. Peserta Didik (PPDP)',
    question: 'Apa konsep dasar Culturally Responsive Teaching (CRT) menurut Geneva Gay & Ladson-Billings?',
    keyAnswer: 'Pembelajaran tanggap budaya yang memanfaatkan latar belakang kultural, identitas, kearifan lokal, dan pengalaman hidup siswa sebagai jembatan efektif memahami materi akademis.',
    explanation: 'CRT menghubungkan materi dengan budaya asal siswa sekaligus menumbuhkan kesadaran kritis sosial dan kompetensi lintas budaya.',
    inforExample: 'Mengajarkan simetri koordinat dan algoritma perulangan menggunakan motif batik tradisional Nusantara atau kain tenun daerah.',
    mnemonicTip: 'CRT = Budaya Siswa adalah Modal Utama Belajar Bermakna.',
  },

  // MK 6: PMA Dasar
  {
    id: 'fc_pmad_bloom',
    nodeId: 'n_bloom_c4',
    category: '6. PMA Dasar',
    question: 'Sebutkan 6 Tingkat Kognitif Taksonomi Bloom Revisi (C1 hingga C6) beserta contoh KKO-nya!',
    keyAnswer: 'C1 Mengingat (Menyebutkan), C2 Memahami (Menjelaskan/Membandingkan), C3 Menerapkan (Menggunakan/Menghitung), C4 Menganalisis (Menguraikan/Troubleshooting - HOTS), C5 Mengevaluasi (Menilai kriteria/Mengkritik - HOTS), C6 Mencipta (Merancang/Membangun produk baru - HOTS).',
    explanation: 'C1-C3 tergolong LOTS/MOTS, sedangkan C4-C6 adalah Higher Order Thinking Skills (HOTS) yang menuntut penalaran kritis dan transfer pengetahuan.',
    inforExample: 'C1: Sebutkan jenis topologi. C4: Analisis penyebab lambatnya data jaringan. C6: Rancang topologi baru yang aman dan hemat biaya.',
    mnemonicTip: 'M-M-M-A-E-C: Mengingat, Memahami, Menerapkan, Menganalisis, Mengevaluasi, Mencipta.',
  },
  {
    id: 'fc_pmad_ubd',
    nodeId: 'n_ubd_tahap1',
    category: '6. PMA Dasar',
    question: 'Apa 3 Tahap Desain Mundur dalam Understanding by Design (UbD) menurut Wiggins & McTighe?',
    keyAnswer: 'Tahap 1: Identifikasi Hasil yang Diinginkan (Big Ideas, CP/TP, Pertanyaan Esensial) -> Tahap 2: Tentukan Bukti Asesmen (Tugas Kinerja Otentik GRASPS, Rubrik) -> Tahap 3: Rencanakan Pengalaman Belajar (Prinsip WHERETO).',
    explanation: 'UbD membalik pola lama: guru menetapkan bukti penilaian sebelum merancang aktivitas modul ajar harian agar pembelajaran fokus pada pemahaman mendalam.',
    inforExample: 'Guru merancang rubrik penilaian pembuatan database perpustakaan sebelum menulis modul langkah pertemuan 1-4.',
    mnemonicTip: 'UbD: Tentukan Garis Finis -> Tentukan Bukti Tuntas -> Rancang Rute Latihan.',
  },
  {
    id: 'fc_pmad_1',
    nodeId: 'n_pmad_cp_tp_atp',
    category: '6. PMA Dasar',
    question: 'Bagaimana hierarki penurunan Capaian Pembelajaran (CP) menjadi Tujuan Pembelajaran (TP) dan Alur Tujuan Pembelajaran (ATP)?',
    keyAnswer: 'CP (standar fase pemerintah) -> dianalisis Kompetensi & Kontennya menjadi TP -> TP diurutkan secara logis berkesinambungan menjadi ATP.',
    explanation: 'ATP berfungsi seperti silabus yang memandu urutan pembelajaran dari konsep prasyarat ke konsep yang lebih kompleks.',
    inforExample: 'CP Berpikir Komputasional diturunkan ke TP Mengenal Logika Percabangan, lalu TP Mengimplementasikan If-Else dalam Python.',
    mnemonicTip: 'CP (Payung Fase) -> TP (Sasaran Konkret) -> ATP (Jalan Tangga Berurutan).',
  },
  {
    id: 'fc_pmad_2',
    nodeId: 'n_pmad_triad_asesmen',
    category: '6. PMA Dasar',
    question: 'Apa perbedaan mendasar antara Asesmen Diagnostik, Asesmen Formatif, dan Asesmen Sumatif?',
    keyAnswer: 'Diagnostik = di awal untuk petakan kesiapan; Formatif = selama proses untuk perbaikan belajar (bukan nilai raport); Sumatif = di akhir untuk penentuan capaian resmi.',
    explanation: 'Asesmen formatif mencakup Assessment FOR Learning (umpan balik guru) dan Assessment AS Learning (refleksi diri siswa).',
    inforExample: 'Kuis Quizizz cepat di tengah kelas adalah formatif; Ujian Akhir Semester adalah sumatif.',
    mnemonicTip: 'Awal (Diagnosa), Tengah (Formatif Perbaikan), Akhir (Sumatif Laporan).',
  },

  // MK 7: Growth Mindset
  {
    id: 'fc_gm_1',
    nodeId: 'n_gm_dweck_mindset',
    category: '7. Growth Mindset',
    question: 'Apa perbedaan mendasar antara Fixed Mindset dan Growth Mindset menurut Carol S. Dweck?',
    keyAnswer: 'Fixed Mindset meyakini kecerdasan/bakat bersifat statis bawaan. Growth Mindset meyakini kecerdasan dapat terus bertumbuh melalui usaha, latihan, dan belajar dari kesalahan.',
    explanation: 'Orang ber-growth mindset memandang tantangan dan kegagalan bukan sebagai vonis ketidakmampuan, melainkan sebagai jalan bertumbuh.',
    inforExample: '"Saya memang tidak berbakat koding" (Fixed) vs "Saya belum menguasai algoritma ini, saya butuh mencoba strategi lain" (Growth).',
    mnemonicTip: 'Fixed = Terpaku Statis; Growth = Mekar Berkembang.',
  },
  {
    id: 'fc_gm_2',
    nodeId: 'n_gm_process_praise',
    category: '7. Growth Mindset',
    question: 'Apa itu Process Praise dan mengapa lebih dianjurkan daripada Person Praise?',
    keyAnswer: 'Process Praise memuji usaha, strategi, dan kegigihan siswa ("Caramu mencoba metode lain sangat tekun!"), bukan memuji kepintaran bawaan ("Kamu pintar sekali").',
    explanation: 'Memuji kepintaran membuat anak takut gagal dan menghindari tantangan sulit. Memuji proses membuat anak menghargai ketekunan dan pantang menyerah.',
    inforExample: 'Mengubah kata "Saya tidak bisa" menjadi "Saya BELUM bisa saat ini" (The Power of Yet).',
    mnemonicTip: 'Puji Usaha & Strategi, Bukan Bakat Bawaan.',
  },

  // Materi Tambahan Dokumen Resmi PPG: EMC², Kolb, KEGI, SOLO & Gagné
  {
    id: 'fc_emc2_1',
    nodeId: 'n_pse_emc2_pilar',
    category: '3. PSE (EMC² UNESCO)',
    question: 'Apa 4 pilar kerangka kerja EMC² (UNESCO MGIEP) dan apa 6 atribut welas asih menurut Paul Gilbert?',
    keyAnswer: '4 Pilar: Empathy, Mindfulness, Compassion, Critical Inquiry. 6 Atribut Welas Asih: Sensitivity, Care for well-being, Sympathy, Distress tolerance, Empathy, Non-judgement.',
    explanation: 'EMC² mengintegrasikan neurosains sosial-afektif ke pendidikan untuk melahirkan empati yang bermuara pada aksi nyata (actionable empathy).',
    inforExample: 'Siswa dilatih menyadari bias stereotip sosial dan merancang aksi nyata membantu teman yang mengalami isolasi sosial di sekolah.',
    mnemonicTip: 'E-M-C²: Empathy, Mindfulness, Compassion, Critical inquiry.',
  },
  {
    id: 'fc_kolb_1',
    nodeId: 'n_pse_kolb_siklus',
    category: '3. PSE & Teori Belajar (Kolb)',
    question: 'Sebutkan 4 tahapan siklus Experiential Learning David Kolb dan 4 gaya belajarnya!',
    keyAnswer: '4 Tahap: 1) Concrete Experience (CE), 2) Reflective Observation (RO), 3) Abstract Conceptualization (AC), 4) Active Experimentation (AE). 4 Gaya: Diverging, Assimilating, Converging, Accommodating.',
    explanation: 'Belajar adalah proses di mana pengetahuan diciptakan melalui transformasi pengalaman langsung.',
    inforExample: 'Siswa mengamati ekosistem sungai (CE), mencatat data & refleksi (RO), membuat teori rantai makanan (AC), lalu menguji filter air buatan (AE).',
    mnemonicTip: 'C-R-A-A: Concrete, Reflective, Abstract, Active.',
  },
  {
    id: 'fc_kegi_1',
    nodeId: 'n_fppn_kegi_9butir',
    category: '4. FPPN (Kode Etik Guru)',
    question: 'Apa makna kejujuran profesional dan komitmen kerahasiaan dalam Kode Etik Guru Indonesia (KEGI)?',
    keyAnswer: 'Guru wajib jujur dalam mengevaluasi capaian peserta didik tanpa manipulasi atau komersialisasi, serta melindungi privasi dan latar belakang keluarga siswa dari konsumsi publik.',
    explanation: 'Kode Etik Guru menjaga kemuliaan martabat pendidik sebagai teladan moral (Ing Ngarsa Sung Tuladha).',
    inforExample: 'Guru menolak memberikan bocoran soal ujian kepada siswa yang mengikuti les privat berbayar di rumahnya.',
    mnemonicTip: 'KEGI = Kompas Moral, Integritas, & Pelindung Hak Anak.',
  },
  {
    id: 'fc_solo_1',
    nodeId: 'n_pmad_solo_5level',
    category: '6. PMA Dasar (Taksonomi SOLO)',
    question: 'Jelaskan 5 tingkatan pemahaman siswa dalam Taksonomi SOLO (Biggs & Collis)!',
    keyAnswer: '1) Prestructural (tidak paham), 2) Unistructural (satu aspek terisolasi), 3) Multistructural (beberapa aspek lepas), 4) Relational (mengaitkan aspek jadi satu struktur padu), 5) Extended Abstract (generalisasi ke domain baru).',
    explanation: 'Taksonomi SOLO menilai kedalaman kualitas struktur kognitif respon siswa terhadap suatu tugas pembelajaran.',
    inforExample: 'Siswa tidak hanya menjelaskan dampak deforestasi (Relational), tapi juga merumuskan kebijakan mitigasi iklim terpadu lintas-sektor (Extended Abstract).',
    mnemonicTip: 'P-U-M-R-E: Pre, Uni, Multi, Relational, Extended.',
  },
  {
    id: 'fc_gagne_1',
    nodeId: 'n_pmad_gagne_9events',
    category: '6. PMA Dasar (Gagné & Ausubel)',
    question: 'Apa fungsi "Advance Organizer" David Ausubel dalam 9 Peristiwa Pembelajaran Robert Gagné?',
    keyAnswer: 'Advance Organizer berfungsi sebagai jembatan kognitif pembuka (apersepsi) yang menautkan pengetahuan awal (prior knowledge) dengan materi baru agar pembelajaran bermakna (meaningful learning).',
    explanation: 'Mencegah hafalan mekanistik tanpa makna (rote learning) dengan menyajikan analogi atau bagan konsep payung sebelum rincian teknis diajarkan.',
    inforExample: 'Guru menganalogikan sistem peredaran darah manusia dengan sistem distribusi pipa air PDAM sebelum mengajar arteri dan vena.',
    mnemonicTip: 'Advance Organizer = Jangkar Pengetahuan Awal.',
  },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q_ink_1',
    nodeId: 'n_ink_udl',
    level: 'Konseptual',
    question: 'Dalam kelas inklusif, guru menyediakan materi bacaan teks, rekaman suara audio naratif, dan simulasi grafis interaktif. Tindakan ini mencerminkan prinsip Universal Design for Learning (UDL) pilar...',
    options: [
      'Multiple Means of Action & Expression',
      'Multiple Means of Representation',
      'Multiple Means of Engagement',
      'Individualized Segregation Plan',
    ],
    correctIndex: 1,
    explanation: 'Multiple Means of Representation menyajikan informasi dan konten materi dalam berbagai format sensorik untuk menjangkau keragaman modalitas siswa.',
  },
  {
    id: 'q_pmal_1',
    nodeId: 'n_pmal_triad_mmj',
    level: 'C4 Analisis',
    question: 'Pembelajaran yang mengajak siswa hadir secara sadar penuh, memahami proses berpikirnya sendiri (metakognisi), dan merefleksikan perasaannya saat menyelesaikan tugas menonjolkan karakteristik...',
    options: [
      'Surface memorization',
      'Mindful learning (Pembelajaran berkesadaran)',
      'Behavioristic drill-and-practice',
      'Rote learning',
    ],
    correctIndex: 1,
    explanation: 'Mindful learning adalah pembelajaran berkesadaran di mana siswa hadir utuh pikiran dan perasaannya, serta menyadari bagaimana cara ia berpikir.',
  },
  {
    id: 'q_pse_1',
    nodeId: 'n_pse_5pilar',
    level: 'C4 Analisis',
    question: 'Ketika menghadapi error program yang sulit ditemukan, siswa mampu mengendalikan frustrasinya, mengambil jeda pernapasan, dan mencoba kembali dengan tekun. Kompetensi CASEL apa yang ditunjukkan?',
    options: [
      'Social Awareness',
      'Self-Management (Manajemen Diri)',
      'Relationship Skills',
      'Authority Obedience',
    ],
    correctIndex: 1,
    explanation: 'Self-management mencakup kemampuan mengatur emosi, mengelola stres, dan mempertahankan motivasi serta ketekunan saat menghadapi tantangan sulit.',
  },
  {
    id: 'q_fppn_1',
    nodeId: 'n_fppn_sistem_among',
    level: 'Konseptual',
    question: 'Menurut Ki Hadjar Dewantara, peran guru dianalogikan sebagai seorang petani. Makna filosofis dari analogi ini adalah...',
    options: [
      'Guru berhak memaksakan tanaman padi berubah menjadi jagung sesuai kurikulum',
      'Guru bertugas menuntun dan merawat tumbuhnya benih sesuai kodrat alamnya tanpa mengubah fitrah tanaman',
      'Siswa diwajibkan bekerja di ladang pertanian sebagai syarat kelulusan',
      'Pendidikan sepenuhnya ditentukan oleh kehendak bebas murid tanpa arahan norma',
    ],
    correctIndex: 1,
    explanation: 'Sistem Among menuntun anak sesuai kodrat alamiahnya: guru merawat dan memberi nutrisi terbaik agar benih tumbuh maksimal sesuai fitrah aslinya.',
  },
  {
    id: 'q_fppn_2',
    nodeId: 'n_fppn_trilogi',
    level: 'Konseptual',
    question: 'Semboyan Ki Hadjar Dewantara "Ing Madya Mangun Karsa" mengandung arti bahwa guru saat berada di tengah-tengah murid hendaknya...',
    options: [
      'Memberikan contoh keteladanan moral dan kedisiplinan',
      'Membangun kehendak, memprakarsai semangat, dan berkolaborasi sejajar',
      'Memberikan dorongan dan kepercayaan penuh dari belakang',
      'Menghukum siswa yang melanggar aturan secara militeristik',
    ],
    correctIndex: 1,
    explanation: 'Ing Madya Mangun Karsa bermakna di tengah-tengah peserta didik guru membangkitkan prakarsa dan semangat berkarya bersama.',
  },
  {
    id: 'q_ppdp_1',
    nodeId: 'n_ppdp_piaget',
    level: 'C4 Analisis',
    question: 'Siswa menganggap bahwa setiap percabangan program hanya bisa memilih 2 kondisi benar/salah. Ketika mempelajari "if - elif - else" multi-kondisi, ia memperluas struktur berpikirnya. Proses mental ini adalah...',
    options: [
      'Asimilasi murni',
      'Akomodasi kognitif (Piaget)',
      'Operant punishment',
      'Extraneous cognitive load',
    ],
    correctIndex: 1,
    explanation: 'Akomodasi terjadi saat skema mental lama dirombak atau diperluas karena adanya informasi baru yang tidak cocok dengan skema sebelumnya.',
  },
  {
    id: 'q_pmad_1',
    nodeId: 'n_pmad_triad_asesmen',
    level: 'C5 Evaluasi',
    question: 'Guru memberikan kuis singkat dan tanya jawab lisan di tengah jam pelajaran untuk memeriksa konsep mana yang belum dipahami siswa, lalu seketika mengulang penjelasan bagian tersebut. Asesmen ini tergolong...',
    options: [
      'Assessment OF Learning (Sumatif akhir)',
      'Assessment FOR Learning (Formatif perbaikan)',
      'Penilaian Akhir Semester (PAS)',
      'Asesmen Sertifikasi Kelulusan',
    ],
    correctIndex: 1,
    explanation: 'Assessment FOR Learning dilakukan selama proses belajar untuk memberi umpan balik langsung dan memperbaiki strategi mengajar guru.',
  },
  {
    id: 'q_gm_1',
    nodeId: 'n_gm_dweck_mindset',
    level: 'C4 Analisis',
    question: 'Seorang siswa berkata: "Saya memang dari dulu tidak punya bakat di bidang matematika dan koding, jadi percuma belajar keras." Pola pikir siswa tersebut mencerminkan...',
    options: [
      'Growth Mindset (Pola pikir bertumbuh)',
      'Fixed Mindset (Pola pikir tetap/statis)',
      'Mindful awareness',
      'Metakognitif adaptif',
    ],
    correctIndex: 1,
    explanation: 'Fixed Mindset memandang kecerdasan dan bakat sebagai atribut bawaan yang statis dan tidak dapat diubah oleh usaha.',
  },
  {
    id: 'q_gm_2',
    nodeId: 'n_gm_process_praise',
    level: 'C5 Evaluasi',
    question: 'Manakah bentuk apresiasi guru yang paling efektif menumbuhkan Growth Mindset menurut Carol Dweck?',
    options: [
      '"Nilaimu 100, kamu memang anak paling jenius di kelas ini!"',
      '"Bapak sangat menghargai usahamu mencoba strategi alternatif berulang kali hingga berhasil memecahkan soal ini!"',
      '"Soal ini sangat mudah, anak bodoh pun bisa mengerjakannya."',
      '"Kamu tidak perlu belajar keras karena kamu sudah punya bakat alami."',
    ],
    correctIndex: 1,
    explanation: 'Pujian pada proses (process praise) memvalidasi usaha, strategi, dan ketekunan, sehingga melatih anak tangguh menghadapi tantangan masa depan.',
  },
];

export const MNEMONIC_TABLES = [
  {
    id: 'tbl_khd_trilogi',
    title: 'Trilogi Kepemimpinan Ki Hadjar Dewantara (KHD)',
    headers: ['Semboyan Filosofis', 'Posisi Guru', 'Makna & Implementasi di Kelas'],
    rows: [
      ['Ing Ngarsa Sung Tuladha', 'Di Garis Depan', 'Memberikan keteladanan moral, tutur kata santun, kejujuran akademik, dan disiplin'],
      ['Ing Madya Mangun Karsa', 'Di Tengah Murid', 'Membangkitkan ide prakarsa, memupuk percaya diri, dan berkolaborasi sebagai mitra belajar'],
      ['Tut Wuri Handayani', 'Di Garis Belakang', 'Memberikan kepercayaan kemandirian belajar dan dorongan motivasi saat anak memerlukan arahan'],
    ],
  },
  {
    id: 'tbl_dweck_matrix',
    title: 'Matriks Pola Pikir: Fixed vs Growth Mindset (Carol S. Dweck)',
    headers: ['Dimensi Tantangan', 'Fixed Mindset (Statis)', 'Growth Mindset (Bertumbuh)'],
    rows: [
      ['Pandangan terhadap Kecerdasan', 'Bakat statis bawaan lahir sejak lahir', 'Kapasitas dapat dikembangkan melalui latihan dan usaha'],
      ['Menghadapi Rintangan & Kesulitan', 'Menghindari tantangan karena takut gagal', 'Merangkul tantangan sebagai peluang otak bertumbuh'],
      ['Menyikapi Usaha & Kerja Keras', 'Memandang usaha sia-sia jika tidak berbakat', 'Memandang usaha keras sebagai jalan menuju kemahiran'],
      ['Menyikapi Kesalahan / Error', 'Merasa malu dan menganggap diri bodoh', 'Memandang kesalahan sebagai data untuk perbaikan (The Power of Yet)'],
      ['Menerima Kritik & Masukan', 'Defensif dan menganggap kritik sebagai serangan', 'Belajar dari umpan balik konstruktif untuk menyempurnakan strategi'],
    ],
  },
  {
    id: 'tbl_udl_casel',
    title: 'Sinergi UDL (Inklusi) & CASEL (Sosial-Emosional)',
    headers: ['Domain', 'Pilar Inklusi UDL (Rose & Meyer)', 'Pilar CASEL (Sosial-Emosional)'],
    rows: [
      ['Keterlibatan Diri', 'Multiple Means of Engagement: ragam pilihan tantangan', 'Self-Awareness & Self-Management: regulasi emosi & motivasi'],
      ['Pemrosesan Informasi', 'Multiple Means of Representation: teks, visual, audio multimodal', 'Social Awareness: empati & menghargai keberagaman perspektif'],
      ['Ekspresi & Aksi', 'Multiple Means of Action & Expression: ragam bentuk unjuk karya', 'Relationship Skills & Responsible Decision: kolaborasi tim & putusan etis'],
    ],
  },
  {
    id: 'tbl_siklus_kurikulum',
    title: 'Alur Kurikulum Berpusat Siswa: CP -> TP -> ATP -> Modul Ajar',
    headers: ['Tahapan', 'Fungsi Utama', 'Dokumen / Produk Konkret'],
    rows: [
      ['Capaian Pembelajaran (CP)', 'Standar kompetensi akhir fase dari pemerintah', 'Naskah CP mata pelajaran per fase perkembangan'],
      ['Tujuan Pembelajaran (TP)', 'Menurunkan CP menjadi target kompetensi & konten esensial', 'Rumusan TP terukur dengan KKO yang jelas'],
      ['Alur Tujuan (ATP)', 'Mengurutkan rangkaian TP secara logis dan bertahap', 'Dokumen ATP yang memandu pembelajaran sepanjang tahun'],
      ['Modul Ajar & KKTP', 'Rencana pelaksanaan harian & kriteria ketercapaian', 'Modul ajar lengkap dengan LKPD, rubrik KKTP, dan asesmen'],
    ],
  },
  {
    id: 'tbl_solo_taxonomy',
    title: '5 Tingkat Kualitas Pemahaman: Taksonomi SOLO (Biggs & Collis)',
    headers: ['Tingkatan SOLO', 'Karakteristik Jawaban Siswa', 'Indikator Kognitif'],
    rows: [
      ['1. Prestructural', 'Meleset total dari topik, tidak memahami konsep dasar', 'Menolak menjawab atau memberikan respon yang tidak relevan'],
      ['2. Unistructural', 'Menyebutkan satu fakta sederhana secara terisolasi', 'Mengetahui satu istilah kunci tanpa penjelasan hubungan'],
      ['3. Multistructural', 'Menyebutkan beberapa fakta terpisah tanpa korelasi', 'Menuliskan daftar fakta namun belum mampu menghubungkan'],
      ['4. Relational', 'Mengaitkan fakta-fakta menjadi penjelasan terintegrasi padu', 'Menjelaskan hubungan sebab-akibat dan struktur konseptual'],
      ['5. Extended Abstract', 'Mentransfer konsep ke situasi baru atau konteks abstrak', 'Melakukan generalisasi lintas disiplin dan hipotesis orisinal'],
    ],
  },
  {
    id: 'tbl_kolb_styles',
    title: '4 Gaya Belajar & Siklus Experiential Learning (David Kolb)',
    headers: ['Gaya Belajar Kolb', 'Kombinasi Tahapan', 'Ciri Dominan Siswa di Kelas'],
    rows: [
      ['Diverging (Penyelam)', 'Concrete Experience (CE) + Reflective Observation (RO)', 'Imajinatif, peka emosi, gemar brainstorming, mengamati dari multi-sudut pandang'],
      ['Assimilating (Pemikir)', 'Reflective Observation (RO) + Abstract Conceptualization (AC)', 'Tertarik pada model teoritis, logika abstrak, dan analisis konseptual runtut'],
      ['Converging (Praktisi)', 'Abstract Conceptualization (AC) + Active Experimentation (AE)', 'Berorientasi pada pemecahan masalah teknis nyata dan implementasi praktis ide'],
      ['Accommodating (Aktor)', 'Active Experimentation (AE) + Concrete Experience (CE)', 'Suka aksi langsung, adaptif terhadap perubahan cepat, mengandalkan intuisi'],
    ],
  },
];
