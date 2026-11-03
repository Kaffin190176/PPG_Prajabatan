import React, { useRef, useEffect, useState } from 'react';
import { NeuronNode, NEUROTRANSMITTERS } from '../types/neural';
import { Compass, ChevronDown, ChevronUp } from 'lucide-react';

interface MinimapProps {
  nodes: NeuronNode[];
  isDark: boolean;
}

export const Minimap: React.FC<MinimapProps> = ({ nodes, isDark }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas || nodes.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    nodes.forEach(n => {
      minX = Math.min(minX, n.x);
      maxX = Math.max(maxX, n.x);
      minY = Math.min(minY, n.y);
      maxY = Math.max(maxY, n.y);
    });

    const spanX = Math.max(maxX - minX, 400);
    const spanY = Math.max(maxY - minY, 400);
    const pad = 20;

    const scaleX = (width - pad * 2) / spanX;
    const scaleY = (height - pad * 2) / spanY;
    const scale = Math.min(scaleX, scaleY);

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    nodes.forEach(node => {
      const x = width / 2 + (node.x - centerX) * scale;
      const y = height / 2 + (node.y - centerY) * scale;
      const info = NEUROTRANSMITTERS[node.neurotransmitter] || NEUROTRANSMITTERS.Glutamat;

      ctx.beginPath();
      ctx.arc(x, y, node.synapticWeight >= 3 ? 3 : 2, 0, Math.PI * 2);
      ctx.fillStyle = info.primaryColor;
      ctx.fill();
    });
  }, [nodes, isOpen]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        title="Tampilkan Radar Jaringan"
        className={`absolute bottom-5 right-5 z-10 p-2 rounded-full border shadow-lg backdrop-blur-md transition-all ${
          isDark
            ? 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
            : 'bg-white/85 border-slate-200 text-slate-600 hover:text-slate-900'
        }`}
      >
        <Compass className="w-4 h-4 text-cyan-400" />
      </button>
    );
  }

  return (
    <div
      className={`absolute bottom-5 right-5 z-10 p-1.5 rounded-xl border shadow-xl backdrop-blur-md hidden sm:block ${
        isDark
          ? 'bg-slate-900/80 border-slate-800'
          : 'bg-white/85 border-slate-200'
      }`}
    >
      <div className="flex items-center justify-between px-1.5 pb-1">
        <span className="text-[9px] font-mono font-semibold tracking-wider text-slate-400 uppercase">
          Radar Jaringan
        </span>
        <button
          onClick={() => setIsOpen(false)}
          className="text-slate-500 hover:text-slate-300"
          title="Sembunyikan radar"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>
      <canvas
        ref={canvasRef}
        width={130}
        height={80}
        className="rounded-lg bg-slate-950/60 block"
      />
    </div>
  );
};
