/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  NeuronNode,
  SynapseLink,
  ActionPotentialPulse,
  MindmapData,
  ThemeMode,
  THEMES,
  NeurotransmitterType,
  NEUROTRANSMITTERS,
} from './types/neural';
import { BAB_1_MINDMAP } from './data/bab1Data';
import { autoArborize } from './physics/neuralPhysics';
import { neuroAudio } from './audio/NeuroAudio';
import { NeuralCanvas } from './canvas/NeuralCanvas';
import { TopNav } from './components/TopNav';
import { NeuronDetailDrawer } from './components/NeuronDetailDrawer';
import { NeuralOutlineDrawer } from './components/NeuralOutlineDrawer';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { ChapterReaderModal } from './components/ChapterReaderModal';
import { StudyHubModal } from './components/StudyHubModal';
import { GlosariumModal } from './components/GlosariumModal';
import { Minimap } from './components/Minimap';
import { NeurotransmitterLegend } from './components/NeurotransmitterLegend';

export default function App() {
  // Always load fresh structured 7-course PPG Prajabatan dataset with TaRL, Bloom & Glosarium (v7)
  const [currentMindmap, setCurrentMindmap] = useState<MindmapData>(() => {
    try {
      const saved = localStorage.getItem('ppg_prajabatan_mindmap_v7');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.nodes && parsed.links && parsed.nodes.length > 0) {
          return parsed;
        }
      }
    } catch {}
    return BAB_1_MINDMAP;
  });

  const [nodes, setNodes] = useState<NeuronNode[]>(currentMindmap.nodes);
  const [links, setLinks] = useState<SynapseLink[]>(currentMindmap.links);

  // Active selections and pulses
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [pulses, setPulses] = useState<ActionPotentialPulse[]>([]);

  // Theme settings (Default to dark microscopy aesthetic)
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    try {
      const savedTheme = localStorage.getItem('synapse_theme_mode');
      if (savedTheme && (savedTheme === 'fluorescence' || savedTheme === 'darkfield' || savedTheme === 'golgi')) {
        return savedTheme as ThemeMode;
      }
    } catch {}
    return 'fluorescence';
  });

  // Physics: subtle stabilization
  const [physicsActive, setPhysicsActive] = useState(false);
  const [isMuted, setIsMuted] = useState(() => neuroAudio.getIsMuted());

  // Search & Filter (Mata Kuliah)
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilterTransmitter, setActiveFilterTransmitter] = useState<NeurotransmitterType | null>(null);
  const [activeCourseFilter, setActiveCourseFilter] = useState<string | null>(null);

  // Modals & Drawers
  const [isOutlineOpen, setIsOutlineOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isReaderOpen, setIsReaderOpen] = useState(false);
  const [isGlosariumOpen, setIsGlosariumOpen] = useState(false);
  const [isStudyHubOpen, setIsStudyHubOpen] = useState(false);
  const [isBlindMode, setIsBlindMode] = useState(false);

  // Sync theme with HTML class
  useEffect(() => {
    const isDark = THEMES[themeMode].isDark;
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem('synapse_theme_mode', themeMode);
    } catch {}
  }, [themeMode]);

  // Auto-save to localStorage
  useEffect(() => {
    try {
      const dataToSave: MindmapData = {
        id: 'ppg_prajabatan_mastery',
        title: 'Materi PPG Prajabatan',
        description: 'Peta pikiran komprehensif 7 Mata Kuliah PPG Prajabatan',
        nodes,
        links,
      };
      localStorage.setItem('ppg_prajabatan_mindmap_v7', JSON.stringify(dataToSave));
    } catch {}
  }, [nodes, links]);

  // Selected Node Object
  const selectedNode = nodes.find(n => n.id === selectedNodeId) || null;

  // -------------------------------------------------------------
  // NEURON MANIPULATION HANDLERS
  // -------------------------------------------------------------
  const handleUpdateNode = useCallback((nodeId: string, updates: Partial<NeuronNode>) => {
    setNodes(prev => prev.map(n => (n.id === nodeId ? { ...n, ...updates } : n)));
  }, []);

  const handleBatchUpdateNodes = useCallback((updates: Map<string, { x: number; y: number }>) => {
    setNodes(prev =>
      prev.map(n => {
        const u = updates.get(n.id);
        return u ? { ...n, x: u.x, y: u.y, vx: 0, vy: 0 } : n;
      })
    );
  }, []);

  const handleConnectNodes = useCallback((sourceId: string, targetId: string) => {
    if (sourceId === targetId) return;

    // Check if link already exists
    const exists = links.some(
      l =>
        (l.sourceId === sourceId && l.targetId === targetId) ||
        (l.sourceId === targetId && l.targetId === sourceId)
    );
    if (exists) return;

    const source = nodes.find(n => n.id === sourceId);
    const newLink: SynapseLink = {
      id: 'assoc_' + Date.now().toString(36),
      sourceId,
      targetId,
      type: 'associative',
      weight: 1,
      neurotransmitter: source?.neurotransmitter || 'Glutamat',
    };

    setLinks(prev => [...prev, newLink]);
    neuroAudio.playSprout();
  }, [links, nodes]);

  // -------------------------------------------------------------
  // ACTION POTENTIAL CASCADE SIMULATION
  // -------------------------------------------------------------
  const handleTriggerActionPotential = useCallback(
    (startNodeId: string) => {
      const startNode = nodes.find(n => n.id === startNodeId);
      if (!startNode) return;

      startNode.actionPotential = 1.0;
      neuroAudio.playActionPotential(1.1);

      // Find all outgoing synapses from this node
      const connectedLinks = links.filter(
        l => l.sourceId === startNodeId || (l.type === 'associative' && l.targetId === startNodeId)
      );

      const newPulses: ActionPotentialPulse[] = connectedLinks.map(l => {
        const isForward = l.sourceId === startNodeId;
        const targetId = isForward ? l.targetId : l.sourceId;
        const info = NEUROTRANSMITTERS[l.neurotransmitter] || NEUROTRANSMITTERS.Glutamat;

        return {
          id: 'pulse_' + Math.random().toString(36).substring(2, 7),
          synapseId: l.id,
          sourceId: startNodeId,
          targetId: targetId,
          progress: 0,
          speed: 1.8 + Math.random() * 0.4,
          color: info.primaryColor,
        };
      });

      setPulses(prev => [...prev, ...newPulses]);
    },
    [nodes, links]
  );

  const handleTriggerGlobalPulse = useCallback(() => {
    // Find cerebral core / root or initiate from central soma
    const root = nodes.find(n => n.id === 'root_ppg' || n.level === 'root' || n.synapticWeight === 4) || nodes[0];
    if (root) {
      handleTriggerActionPotential(root.id);
    }
  }, [nodes, handleTriggerActionPotential]);

  const handleJumpToNode = useCallback(
    (nodeId: string) => {
      setSelectedNodeId(nodeId);
      setTimeout(() => {
        handleTriggerActionPotential(nodeId);
      }, 50);
    },
    [handleTriggerActionPotential]
  );

  // -------------------------------------------------------------
  // KEYBOARD SHORTCUTS LISTENER
  // -------------------------------------------------------------
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if currently typing in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'z' || e.key === 'Z') {
        if (selectedNodeId) {
          handleTriggerActionPotential(selectedNodeId);
        } else {
          handleTriggerGlobalPulse();
        }
      } else if (e.key === 'h' || e.key === 'H') {
        setIsStudyHubOpen(prev => !prev);
      } else if (e.key === 'g' || e.key === 'G') {
        setIsGlosariumOpen(prev => !prev);
      } else if (e.key === 'b' || e.key === 'B') {
        setIsBlindMode(prev => !prev);
      } else if (e.key === 'f' || e.key === 'F') {
        autoArborize(nodes, links);
        neuroAudio.playSprout();
      } else if (e.key === 'Escape') {
        setSelectedNodeId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    selectedNodeId,
    nodes,
    links,
    handleTriggerActionPotential,
    handleTriggerGlobalPulse,
  ]);

  // Export Canvas as PNG Image
  const handleExportPng = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    try {
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `materi_ppg_prajabatan_${Date.now()}.png`;
      a.click();
    } catch (err) {
      console.error('Failed to export PNG', err);
    }
  };

  const toggleMute = () => {
    const next = !isMuted;
    neuroAudio.setMuted(next);
    setIsMuted(next);
  };

  const isDark = THEMES[themeMode].isDark;

  return (
    <div
      className={`relative w-screen h-screen flex flex-col overflow-hidden select-none ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Top Bar Navigation */}
      <TopNav
        currentTheme={themeMode}
        onSelectTheme={setThemeMode}
        isMuted={isMuted}
        onToggleMute={toggleMute}
        onTriggerGlobalPulse={handleTriggerGlobalPulse}
        onOpenOutline={() => setIsOutlineOpen(true)}
        onOpenReader={() => setIsReaderOpen(true)}
        onOpenGlosarium={() => setIsGlosariumOpen(true)}
        onOpenStudyHub={() => setIsStudyHubOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onExportPng={handleExportPng}
        nodeCount={nodes.length}
        linkCount={links.length}
      />

      {/* Main Interactive Neural Canvas with Star Constellation Background */}
      <main className="relative flex-1 w-full h-full overflow-hidden">
        <NeuralCanvas
          nodes={nodes}
          links={links}
          selectedNodeId={selectedNodeId}
          themeMode={themeMode}
          physicsActive={physicsActive}
          onSelectNode={setSelectedNodeId}
          onUpdateNode={handleUpdateNode}
          onBatchUpdateNodes={handleBatchUpdateNodes}
          onConnectNodes={handleConnectNodes}
          onTriggerActionPotential={handleTriggerActionPotential}
          pulses={pulses}
          setPulses={setPulses}
          searchQuery={searchQuery}
          activeFilterTransmitter={activeFilterTransmitter}
          activeCourseFilter={activeCourseFilter}
          isBlindMode={isBlindMode}
          onToggleBlindMode={() => setIsBlindMode(prev => !prev)}
        />

        {/* Floating Minimap Radar */}
        <Minimap nodes={nodes} isDark={isDark} />

        {/* Floating Mata Kuliah Filter Legend */}
        <NeurotransmitterLegend
          nodes={nodes}
          activeCourseFilter={activeCourseFilter}
          onSelectCourseFilter={courseId => {
            setActiveCourseFilter(courseId);
            if (courseId) {
              setSelectedNodeId(courseId);
              neuroAudio.playActionPotential();
            }
          }}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isDark={isDark}
        />
      </main>

      {/* Slide-out Focused Material Explanation Drawer */}
      {selectedNode && (
        <NeuronDetailDrawer
          node={selectedNode}
          onClose={() => setSelectedNodeId(null)}
          onUpdate={updates => handleUpdateNode(selectedNode.id, updates)}
          onTriggerPulse={() => handleTriggerActionPotential(selectedNode.id)}
          isDark={isDark}
        />
      )}

      {/* Slide-out Neural Outline Tree Drawer */}
      {isOutlineOpen && (
        <NeuralOutlineDrawer
          nodes={nodes}
          links={links}
          selectedNodeId={selectedNodeId}
          onSelectNode={id => {
            setSelectedNodeId(id);
            handleTriggerActionPotential(id);
          }}
          onAddChild={() => {}}
          onClose={() => setIsOutlineOpen(false)}
          isDark={isDark}
        />
      )}

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
        isDark={isDark}
      />

      {/* Interactive Textbook Chapter Reader Modal */}
      <ChapterReaderModal
        isOpen={isReaderOpen}
        onClose={() => setIsReaderOpen(false)}
        onJumpToNode={handleJumpToNode}
        isDark={isDark}
      />

      {/* Dedicated Memorization, Active Recall & HOTS Quiz Hub */}
      <StudyHubModal
        isOpen={isStudyHubOpen}
        onClose={() => setIsStudyHubOpen(false)}
        onJumpToNode={handleJumpToNode}
        isDark={isDark}
      />

      {/* Comprehensive Glosarium A-Z Modal */}
      <GlosariumModal
        isOpen={isGlosariumOpen}
        onClose={() => setIsGlosariumOpen(false)}
        onJumpToNode={handleJumpToNode}
        isDark={isDark}
      />
    </div>
  );
}
