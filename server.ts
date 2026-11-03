import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// API route for neural synaptic expansion (AI-powered brainstorming)
app.post('/api/gemini/sprout', async (req, res) => {
  try {
    const { parentThought, contextPath, depth, neurotransmitter } = req.body;

    if (!parentThought || typeof parentThought !== 'string') {
      return res.status(400).json({ error: 'parentThought is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Fallback to intelligent biological heuristics
      const fallbackNodes = generateHeuristicBranches(parentThought, neurotransmitter);
      return res.json({ branches: fallbackNodes, source: 'heuristic' });
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `Anda adalah sistem kognitif saraf biologis (biological neural cognition engine).
Pengguna memiliki simpul/neuron pikiran: "${parentThought}".
Jalur konteks sebelumnya: "${Array.isArray(contextPath) ? contextPath.join(' -> ') : ''}".
Neurotransmiter aktif saat ini: "${neurotransmitter || 'Glutamat'}".

Hasilkan 3 sampai 4 neuron cabang (dendritik/sinaptik) yang merupakan asosiasi pikiran logis, kreatif, dan mendalam.
Untuk setiap cabang baru, tentukan:
1. "label": teks singkat neuron (3-6 kata, ringkas dan berbobot).
2. "note": penjelasan kognitif atau elaborasi ide (1-2 kalimat).
3. "neurotransmitter": pilih salah satu yang paling cocok:
   - "Dopamin" (untuk motivasi, reward, pencapaian target, hasrat)
   - "Serotonin" (untuk fondasi, ketenangan, kepuasan, kestabilan)
   - "Asetilkolin" (untuk memori, pemahaman, logika, analisis mendalam)
   - "Norepinefrin" (untuk aksi segera, peringatan resiko, prioritas tinggi)
   - "GABA" (untuk filter kritis, batasan, inhibisi, restriksi)
   - "Glutamat" (untuk ide kreatif baru, eksitasi spontan, hipotesis)
4. "weight": angka 1 sampai 3 (bobot sinaptik: 1=halus, 2=sedang, 3=krusial/utama).

Kembalikan HANYA format JSON valid tanpa tanda markdown tambahan:
{
  "branches": [
    {
      "label": "string",
      "note": "string",
      "neurotransmitter": "Dopamin" | "Serotonin" | "Asetilkolin" | "Norepinefrin" | "GABA" | "Glutamat",
      "weight": 1 | 2 | 3
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text || '{}';
    let parsedData;
    try {
      parsedData = JSON.parse(responseText);
    } catch {
      // Clean potential formatting wrappers
      const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedData = JSON.parse(cleanJson);
    }

    if (parsedData && Array.isArray(parsedData.branches) && parsedData.branches.length > 0) {
      return res.json({ branches: parsedData.branches, source: 'gemini' });
    } else {
      const fallbackNodes = generateHeuristicBranches(parentThought, neurotransmitter);
      return res.json({ branches: fallbackNodes, source: 'heuristic-fallback' });
    }
  } catch (err: any) {
    console.error('Error generating synaptic branches:', err?.message || err);
    // Graceful fallback to rich heuristic generator so the user experience never breaks
    const fallbackNodes = generateHeuristicBranches(req.body?.parentThought || 'Ide Utama', req.body?.neurotransmitter);
    return res.json({ branches: fallbackNodes, source: 'heuristic-error-recovered' });
  }
});

function generateHeuristicBranches(parent: string, transmitter?: string) {
  const p = parent.toLowerCase();
  
  if (p.includes('belajar') || p.includes('studi') || p.includes('otak') || p.includes('baca')) {
    return [
      {
        label: 'Prinsip Active Recall & Spacing',
        note: 'Memperkuat konsolidasi sinaptik jangka panjang melalui pengujian ingatan mandiri berkala.',
        neurotransmitter: 'Asetilkolin',
        weight: 3,
      },
      {
        label: 'Dopaminergic Habit Loop',
        note: 'Membangun umpan balik keberhasilan instan agar fokus belajar terpicu terus-menerus.',
        neurotransmitter: 'Dopamin',
        weight: 2,
      },
      {
        label: 'Eliminasi Distraksi Eksternal',
        note: 'Inhibisi rangsangan yang memecah atensi korteks prefrontal selama fase fokus mendalam.',
        neurotransmitter: 'GABA',
        weight: 2,
      },
      {
        label: 'Eksperimen Aplikasi Nyata',
        note: 'Menyalurkan impuls ide ke dalam proyek eksperimental untuk memperluas koneksi asosiasi.',
        neurotransmitter: 'Glutamat',
        weight: 1,
      },
    ];
  }

  if (p.includes('bisnis') || p.includes('proyek') || p.includes('kerja') || p.includes('aplikasi') || p.includes('produk')) {
    return [
      {
        label: 'Validasi Masalah Pengguna Nyata',
        note: 'Menemukan titik friksi riil yang mendesak sebelum mengalokasikan sumber daya besar.',
        neurotransmitter: 'Asetilkolin',
        weight: 3,
      },
      {
        label: 'Arsitektur Inti & Prototipe Cepat',
        note: 'Membangun MVP fungsional untuk menguji hipotesis langsung di pasar.',
        neurotransmitter: 'Glutamat',
        weight: 3,
      },
      {
        label: 'Jalur Metrik Traksi & Monetisasi',
        note: 'Target pencapaian terukur yang memicu pertumbuhan berkelanjutan.',
        neurotransmitter: 'Dopamin',
        weight: 2,
      },
      {
        label: 'Mitigasi Risiko & Hambatan Hukum',
        note: 'Menyaring titik kegagalan kritis dan kepatuhan sebelum ekspansi.',
        neurotransmitter: 'GABA',
        weight: 2,
      },
    ];
  }

  // Default rich associative branches
  return [
    {
      label: `Eksplorasi Dimensi Inti: ${parent}`,
      note: 'Dekomposisi konsep menjadi elemen-elemen fundamental yang dapat dianalisis.',
      neurotransmitter: 'Asetilkolin',
      weight: 3,
    },
    {
      label: `Aplikasi Praktis & Sasaran Nyata`,
      note: 'Tindakan konkrit yang menghasilkan dampak terukur dan memuaskan.',
      neurotransmitter: 'Dopamin',
      weight: 2,
    },
    {
      label: `Sintesis Kreatif & Asosiasi Baru`,
      note: 'Menghubungkan gagasan ini dengan bidang lain yang tampaknya tidak berhubungan.',
      neurotransmitter: 'Glutamat',
      weight: 2,
    },
    {
      label: `Evaluasi Kritis & Batasan Realistis`,
      note: 'Meninjau kelemahan, asumsi terselubung, dan variabel penahan.',
      neurotransmitter: 'GABA',
      weight: 1,
    },
  ];
}

async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`SynapseMind server running on http://localhost:${PORT}`);
  });
}

startServer();
