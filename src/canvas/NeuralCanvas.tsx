import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  NeuronNode,
  SynapseLink,
  ActionPotentialPulse,
  NEUROTRANSMITTERS,
  THEMES,
  ThemeMode,
  NeurotransmitterType,
} from '../types/neural';
import { stepSimulation } from '../physics/neuralPhysics';
import { neuroAudio } from '../audio/NeuroAudio';
import {
  Maximize2,
  Minimize2,
  RotateCcw,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';

interface StarParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  color: string;
  tier: 'micro' | 'stellar' | 'pulsar';
  neighborIndices: number[];
}

interface NeuralCanvasProps {
  nodes: NeuronNode[];
  links: SynapseLink[];
  selectedNodeId: string | null;
  themeMode: ThemeMode;
  physicsActive: boolean;
  onSelectNode: (nodeId: string | null) => void;
  onUpdateNode: (nodeId: string, updates: Partial<NeuronNode>) => void;
  onBatchUpdateNodes?: (updates: Map<string, { x: number; y: number }>) => void;
  onConnectNodes: (sourceId: string, targetId: string) => void;
  onTriggerActionPotential: (startNodeId: string) => void;
  pulses: ActionPotentialPulse[];
  setPulses: React.Dispatch<React.SetStateAction<ActionPotentialPulse[]>>;
  searchQuery?: string;
  activeFilterTransmitter?: NeurotransmitterType | null;
  activeCourseFilter?: string | null;
  isBlindMode?: boolean;
  onToggleBlindMode?: () => void;
}

export const NeuralCanvas: React.FC<NeuralCanvasProps> = ({
  nodes,
  links,
  selectedNodeId,
  themeMode,
  physicsActive,
  onSelectNode,
  onUpdateNode,
  onBatchUpdateNodes,
  onConnectNodes,
  onTriggerActionPotential,
  pulses,
  setPulses,
  searchQuery = '',
  activeFilterTransmitter = null,
  activeCourseFilter = null,
  isBlindMode = false,
  onToggleBlindMode,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Camera viewport transform
  const [camera, setCamera] = useState({ x: 0, y: 0, zoom: 0.88 });
  const cameraRef = useRef({ x: 0, y: 0, zoom: 0.88 });
  cameraRef.current = camera;

  // Interaction tracking
  const isDraggingCanvas = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const draggedNodeId = useRef<string | null>(null);
  // Subtree dragging tracking: stores relative offsets for all descendants (child, grandchild, etc. down to any depth)
  const draggedSubtreeOffsets = useRef<Map<string, { dx: number; dy: number }>>(new Map());
  const hoveredNodeId = useRef<string | null>(null);
  const [hoveredNodeState, setHoveredNodeState] = useState<string | null>(null);

  // Mouse coordinates for interactive Constellation (Rasi Bintang)
  const mouseWorldPos = useRef<{ x: number; y: number } | null>(null);

  // Star Constellation Particles (560 stars forming dense constellations and celestial sky)
  const starsRef = useRef<StarParticle[]>([]);

  // Initialize Constellation Stars with high density & astronomical neighbor connections
  useEffect(() => {
    const starCount = 560;
    const initialStars: StarParticle[] = [];
    const colors = [
      '#e0f2fe', // sky-100 (icy blue)
      '#bae6fd', // sky-200
      '#f8fafc', // slate-50 (pure white/silver)
      '#fed7aa', // orange-200 (warm yellow star)
      '#f3e8ff', // purple-100 (nebula violet)
      '#dcfce7', // emerald-100 (mint star)
      '#ffffff', // bright diamond white
      '#7dd3fc', // sky-300
      '#c4b5fd', // purple-300
    ];

    for (let i = 0; i < starCount; i++) {
      const tierRand = Math.random();
      let tier: 'micro' | 'stellar' | 'pulsar' = 'micro';
      let radius = 0.65 + Math.random() * 0.75;
      let baseAlpha = 0.22 + Math.random() * 0.35;

      if (tierRand > 0.9) {
        tier = 'pulsar';
        radius = 2.2 + Math.random() * 1.4;
        baseAlpha = 0.72 + Math.random() * 0.28;
      } else if (tierRand > 0.62) {
        tier = 'stellar';
        radius = 1.25 + Math.random() * 0.95;
        baseAlpha = 0.45 + Math.random() * 0.42;
      }

      initialStars.push({
        x: (Math.random() - 0.5) * 4800,
        y: (Math.random() - 0.5) * 3600,
        vx: (Math.random() - 0.5) * 0.08,
        vy: (Math.random() - 0.5) * 0.08,
        radius,
        baseAlpha,
        twinkleSpeed: 0.6 + Math.random() * 2.5,
        twinklePhase: Math.random() * Math.PI * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        tier,
        neighborIndices: [],
      });
    }

    // Precompute nearby constellation neighbor connections for natural astronomical sky lines
    const maxNeighborDistSq = 115 * 115;
    for (let i = 0; i < initialStars.length; i++) {
      if (initialStars[i].tier === 'micro') continue;
      const s1 = initialStars[i];
      let linksCount = 0;
      for (let j = i + 1; j < initialStars.length; j++) {
        if (initialStars[j].tier === 'micro') continue;
        const s2 = initialStars[j];
        const dx = s1.x - s2.x;
        const dy = s1.y - s2.y;
        if (dx * dx + dy * dy < maxNeighborDistSq) {
          s1.neighborIndices.push(j);
          linksCount++;
          if (linksCount >= 2) break; // Keep ambient constellations clean and uncluttered
        }
      }
    }

    starsRef.current = initialStars;
  }, []);

  // Center camera on initial mount or when requested
  const centerView = useCallback(() => {
    if (nodes.length === 0) {
      setCamera({ x: 0, y: 0, zoom: 1 });
      return;
    }
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    nodes.forEach(n => {
      minX = Math.min(minX, n.x);
      maxX = Math.max(maxX, n.x);
      minY = Math.min(minY, n.y);
      maxY = Math.max(maxY, n.y);
    });
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    const width = maxX - minX + 280;
    const height = maxY - minY + 280;
    const cWidth = canvasRef.current?.width ? canvasRef.current.width / (window.devicePixelRatio || 1) : window.innerWidth;
    const cHeight = canvasRef.current?.height ? canvasRef.current.height / (window.devicePixelRatio || 1) : window.innerHeight;
    const zoomX = cWidth / Math.max(width, 400);
    const zoomY = cHeight / Math.max(height, 400);
    const targetZoom = Math.min(1.1, Math.max(0.4, Math.min(zoomX, zoomY) * 0.88));

    setCamera({
      x: -centerX * targetZoom,
      y: -centerY * targetZoom,
      zoom: targetZoom,
    });
  }, [nodes]);

  useEffect(() => {
    centerView();
  }, []);

  // Smoothly center on active Mata Kuliah cluster when filter changes
  useEffect(() => {
    if (!activeCourseFilter) {
      centerView();
      return;
    }
    const matchingNodes = nodes.filter(
      n => n.courseId === activeCourseFilter || n.id === activeCourseFilter
    );
    if (matchingNodes.length === 0) return;

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    matchingNodes.forEach(n => {
      minX = Math.min(minX, n.x);
      maxX = Math.max(maxX, n.x);
      minY = Math.min(minY, n.y);
      maxY = Math.max(maxY, n.y);
    });
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    const width = maxX - minX + 260;
    const height = maxY - minY + 260;
    const cWidth = canvasRef.current?.width ? canvasRef.current.width / (window.devicePixelRatio || 1) : window.innerWidth;
    const cHeight = canvasRef.current?.height ? canvasRef.current.height / (window.devicePixelRatio || 1) : window.innerHeight;
    const zoomX = cWidth / Math.max(width, 360);
    const zoomY = cHeight / Math.max(height, 360);
    const targetZoom = Math.min(1.2, Math.max(0.55, Math.min(zoomX, zoomY) * 0.88));

    setCamera({
      x: -centerX * targetZoom,
      y: -centerY * targetZoom,
      zoom: targetZoom,
    });
  }, [activeCourseFilter, nodes, centerView]);

  // Screen coordinate <-> World coordinate transformations
  const screenToWorld = useCallback((screenX: number, screenY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const worldX = (screenX - rect.left - cx - cameraRef.current.x) / cameraRef.current.zoom;
    const worldY = (screenY - rect.top - cy - cameraRef.current.y) / cameraRef.current.zoom;
    return { x: worldX, y: worldY };
  }, []);

  const worldToScreen = useCallback((worldX: number, worldY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const screenX = worldX * cameraRef.current.zoom + cx + cameraRef.current.x;
    const screenY = worldY * cameraRef.current.zoom + cy + cameraRef.current.y;
    return { x: screenX, y: screenY };
  }, []);

  function getSomaRadius(node: NeuronNode): number {
    switch (node.level || (node.synapticWeight === 4 ? 'root' : node.synapticWeight === 3 ? 'mata_kuliah' : node.synapticWeight === 2 ? 'materi' : node.synapticWeight === 1 ? 'pembahasan' : 'sub_pembahasan')) {
      case 'root':
        return 30; // Root: Materi PPG Prajabatan
      case 'mata_kuliah':
        return 22; // Level 1: Mata Kuliah
      case 'materi':
        return 16; // Level 2: Isian Materi/Teori
      case 'pembahasan':
        return 13; // Level 3: Pembahasan Materi
      case 'sub_pembahasan':
      default:
        return 9.5; // Level 4: Penerapan Praktis & KKO
    }
  }

  // Find node at world coordinate
  const getNodeAt = useCallback(
    (worldX: number, worldY: number): NeuronNode | null => {
      for (let i = nodes.length - 1; i >= 0; i--) {
        const node = nodes[i];
        const radius = getSomaRadius(node) + 12;
        const dx = worldX - node.x;
        const dy = worldY - node.y;
        if (dx * dx + dy * dy <= radius * radius) {
          return node;
        }
      }
      return null;
    },
    [nodes]
  );

  // Recursively finds all descendant node IDs (child, grandchild, level 10+, etc.)
  const getAllDescendants = useCallback(
    (rootId: string): Set<string> => {
      const descendants = new Set<string>();
      const queue: string[] = [rootId];
      const visited = new Set<string>([rootId]);

      // Adjacency map: parentId -> array of child node IDs
      const childrenMap = new Map<string, string[]>();

      for (const node of nodes) {
        if (node.parentId) {
          const list = childrenMap.get(node.parentId) || [];
          list.push(node.id);
          childrenMap.set(node.parentId, list);
        }
      }

      // Also check directional links where source is parent and target is child
      for (const link of links) {
        const targetNode = nodes.find(n => n.id === link.targetId);
        if (targetNode && (targetNode.parentId === link.sourceId || !targetNode.parentId)) {
          const list = childrenMap.get(link.sourceId) || [];
          if (!list.includes(link.targetId)) {
            list.push(link.targetId);
            childrenMap.set(link.sourceId, list);
          }
        }
      }

      while (queue.length > 0) {
        const currentId = queue.shift()!;
        const children = childrenMap.get(currentId) || [];
        for (const childId of children) {
          if (!visited.has(childId)) {
            visited.add(childId);
            descendants.add(childId);
            queue.push(childId);
          }
        }
      }

      return descendants;
    },
    [nodes, links]
  );

  // Mouse Down: click to select and show explanation drawer, or drag parent + all descendants
  const handleMouseDown = (e: React.MouseEvent) => {
    const worldPos = screenToWorld(e.clientX, e.clientY);
    const hitNode = getNodeAt(worldPos.x, worldPos.y);

    if (e.button === 0) {
      if (hitNode) {
        draggedNodeId.current = hitNode.id;
        dragStart.current = { x: worldPos.x - hitNode.x, y: worldPos.y - hitNode.y };

        // Collect all descendants (child, grandchild, down to level 10+)
        const descendantIds = getAllDescendants(hitNode.id);
        const offsets = new Map<string, { dx: number; dy: number }>();
        descendantIds.forEach(descId => {
          const descNode = nodes.find(n => n.id === descId);
          if (descNode) {
            offsets.set(descId, {
              dx: descNode.x - hitNode.x,
              dy: descNode.y - hitNode.y,
            });
          }
        });
        draggedSubtreeOffsets.current = offsets;

        onSelectNode(hitNode.id);
        onTriggerActionPotential(hitNode.id);
      } else {
        isDraggingCanvas.current = true;
        dragStart.current = { x: e.clientX - camera.x, y: e.clientY - camera.y };
        onSelectNode(null);
      }
    } else if (e.button === 1 || e.button === 2) {
      isDraggingCanvas.current = true;
      dragStart.current = { x: e.clientX - camera.x, y: e.clientY - camera.y };
    }
  };

  // Mouse Move: tracks drag (translating parent and all descendants) and constellation rays
  const handleMouseMove = (e: React.MouseEvent) => {
    const worldPos = screenToWorld(e.clientX, e.clientY);
    mouseWorldPos.current = worldPos;

    if (draggedNodeId.current) {
      const parentNode = nodes.find(n => n.id === draggedNodeId.current);
      if (parentNode) {
        const newParentX = worldPos.x - dragStart.current.x;
        const newParentY = worldPos.y - dragStart.current.y;
        parentNode.x = newParentX;
        parentNode.y = newParentY;
        parentNode.vx = 0;
        parentNode.vy = 0;

        // Move all descendants (children, grandchildren, etc. to any level) synchronously!
        if (draggedSubtreeOffsets.current && draggedSubtreeOffsets.current.size > 0) {
          draggedSubtreeOffsets.current.forEach((offset, childId) => {
            const childNode = nodes.find(n => n.id === childId);
            if (childNode) {
              childNode.x = newParentX + offset.dx;
              childNode.y = newParentY + offset.dy;
              childNode.vx = 0;
              childNode.vy = 0;
            }
          });
        }
      }
      return;
    }

    if (isDraggingCanvas.current) {
      setCamera(prev => ({
        ...prev,
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y,
      }));
      return;
    }

    const hitNode = getNodeAt(worldPos.x, worldPos.y);
    const newHover = hitNode ? hitNode.id : null;
    if (newHover !== hoveredNodeId.current) {
      hoveredNodeId.current = newHover;
      setHoveredNodeState(newHover);
    }
  };

  // Helper to commit dragged positions for parent and all descendants
  const endDraggingNode = () => {
    if (draggedNodeId.current) {
      const updates = new Map<string, { x: number; y: number }>();
      const parentNode = nodes.find(n => n.id === draggedNodeId.current);
      if (parentNode) {
        updates.set(parentNode.id, { x: parentNode.x, y: parentNode.y });
      }
      if (draggedSubtreeOffsets.current && draggedSubtreeOffsets.current.size > 0) {
        draggedSubtreeOffsets.current.forEach((_, childId) => {
          const childNode = nodes.find(n => n.id === childId);
          if (childNode) {
            updates.set(childId, { x: childNode.x, y: childNode.y });
          }
        });
      }

      if (onBatchUpdateNodes && updates.size > 0) {
        onBatchUpdateNodes(updates);
      } else if (parentNode) {
        onUpdateNode(parentNode.id, { x: parentNode.x, y: parentNode.y });
      }

      draggedNodeId.current = null;
      draggedSubtreeOffsets.current.clear();
    }
  };

  const handleMouseLeave = () => {
    mouseWorldPos.current = null;
    isDraggingCanvas.current = false;
    endDraggingNode();
  };

  // Mouse Up
  const handleMouseUp = () => {
    isDraggingCanvas.current = false;
    endDraggingNode();
  };

  // Wheel Zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.09 : 0.91;
    const newZoom = Math.min(2.5, Math.max(0.3, camera.zoom * zoomFactor));

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left - rect.width / 2;
    const mouseY = e.clientY - rect.top - rect.height / 2;

    const newX = mouseX - (mouseX - camera.x) * (newZoom / camera.zoom);
    const newY = mouseY - (mouseY - camera.y) * (newZoom / camera.zoom);

    setCamera({
      x: newX,
      y: newY,
      zoom: newZoom,
    });
  };

  // -------------------------------------------------------------
  // ANIMATION LOOP (Constellation Background + Neural Graph)
  // -------------------------------------------------------------
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      if (physicsActive) {
        stepSimulation(nodes, links, undefined, time);
      }

      // If dragging, anchor parent and all descendants firmly to prevent physics jitter
      if (draggedNodeId.current) {
        const parentNode = nodes.find(n => n.id === draggedNodeId.current);
        if (parentNode) {
          parentNode.vx = 0;
          parentNode.vy = 0;
          if (draggedSubtreeOffsets.current && draggedSubtreeOffsets.current.size > 0) {
            draggedSubtreeOffsets.current.forEach((offset, childId) => {
              const childNode = nodes.find(n => n.id === childId);
              if (childNode) {
                childNode.x = parentNode.x + offset.dx;
                childNode.y = parentNode.y + offset.dy;
                childNode.vx = 0;
                childNode.vy = 0;
              }
            });
          }
        }
      }

      // Update action potential pulses
      setPulses(prevPulses => {
        if (prevPulses.length === 0) return prevPulses;
        const remaining: ActionPotentialPulse[] = [];

        prevPulses.forEach(pulse => {
          const nextProgress = pulse.progress + dt * pulse.speed;
          if (nextProgress < 1.0) {
            remaining.push({ ...pulse, progress: nextProgress });
          } else {
            const targetNode = nodes.find(n => n.id === pulse.targetId);
            if (targetNode) {
              targetNode.actionPotential = Math.min(1.0, targetNode.actionPotential + 0.6);
              targetNode.lastFired = time;
            }
          }
        });

        return remaining;
      });

      // Decay action potentials
      nodes.forEach(n => {
        if (n.actionPotential > 0) {
          n.actionPotential = Math.max(0, n.actionPotential - dt * 2.2);
        }
      });

      // RENDER CANVAS
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const dpr = window.devicePixelRatio || 1;
          const width = canvas.width / dpr;
          const height = canvas.height / dpr;
          const currentTheme = THEMES[themeMode];

          ctx.clearRect(0, 0, width, height);

          // Deep cosmic background
          ctx.fillStyle = currentTheme.isDark ? '#020617' : '#f8fafc';
          ctx.fillRect(0, 0, width, height);

          ctx.save();
          // Apply camera transform
          ctx.translate(width / 2 + cameraRef.current.x, height / 2 + cameraRef.current.y);
          ctx.scale(cameraRef.current.zoom, cameraRef.current.zoom);

          // 1. Interactive Star Constellation Background (Rasi Bintang Interaktif)
          drawInteractiveConstellation(
            ctx,
            starsRef.current,
            mouseWorldPos.current,
            currentTheme,
            time
          );

          // 2. Identify active focus cluster for hover path isolation
          const activeHoverId = hoveredNodeId.current || selectedNodeId;
          const connectedNodeIds = new Set<string>();
          if (activeHoverId) {
            connectedNodeIds.add(activeHoverId);
            links.forEach(l => {
              if (l.sourceId === activeHoverId) connectedNodeIds.add(l.targetId);
              if (l.targetId === activeHoverId) connectedNodeIds.add(l.sourceId);
            });
          }

          // 3. Render clean, sleek synaptic axons
          drawCleanSynapses(
            ctx,
            links,
            nodes,
            currentTheme,
            time,
            searchQuery,
            activeFilterTransmitter,
            activeCourseFilter,
            activeHoverId,
            connectedNodeIds
          );

          // 4. Render Action Potential pulses (Bioelectric sparks)
          drawCleanPulses(ctx, pulses, links, nodes);

          // 5. Render clean, recognizable circular neural nodes (Soma)
          drawCleanNeurons(
            ctx,
            nodes,
            selectedNodeId,
            hoveredNodeId.current,
            currentTheme,
            time,
            searchQuery,
            activeFilterTransmitter,
            activeCourseFilter,
            activeHoverId,
            connectedNodeIds,
            isBlindMode
          );

          // 6. Draw HUD badge when dragging parent node with active descendants
          if (draggedNodeId.current && draggedSubtreeOffsets.current.size > 0) {
            const draggedNode = nodes.find(n => n.id === draggedNodeId.current);
            if (draggedNode) {
              const count = draggedSubtreeOffsets.current.size;
              ctx.save();
              ctx.font = '600 11px system-ui, -apple-system, sans-serif';
              const text = `🔗 +${count} turunan (child & grandchild) ikut tertarik`;
              const textWidth = ctx.measureText(text).width;
              const padX = 9;
              const padY = 5;
              const badgeY = draggedNode.y - getSomaRadius(draggedNode) - 24;

              // Pill background with cyan neon glow
              ctx.shadowColor = 'rgba(56, 189, 248, 0.45)';
              ctx.shadowBlur = 8;
              ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
              ctx.strokeStyle = 'rgba(56, 189, 248, 0.85)';
              ctx.lineWidth = 1.2;
              ctx.beginPath();
              ctx.roundRect(
                draggedNode.x - textWidth / 2 - padX,
                badgeY - padY,
                textWidth + padX * 2,
                18 + padY,
                10
              );
              ctx.fill();
              ctx.stroke();

              // Badge text
              ctx.shadowBlur = 0;
              ctx.fillStyle = '#38bdf8';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(text, draggedNode.x, badgeY + 5);
              ctx.restore();
            }
          }

          ctx.restore();
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [nodes, links, themeMode, physicsActive, selectedNodeId, searchQuery, activeFilterTransmitter, activeCourseFilter, isBlindMode]);

  // Handle Resize for retina high-DPI
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // -------------------------------------------------------------
  // INTERACTIVE CONSTELLATION BACKGROUND (RASI BINTANG BERLIMPAH)
  // -------------------------------------------------------------
  function drawInteractiveConstellation(
    ctx: CanvasRenderingContext2D,
    stars: StarParticle[],
    mousePos: { x: number; y: number } | null,
    theme: typeof THEMES.fluorescence,
    time: number
  ) {
    const mouseRadius = 210; // Radius interaksi kursor dengan rasi bintang
    const mouseRadiusSq = mouseRadius * mouseRadius;
    const starConnectDist = 110; // Radius interkoneksi antar-bintang terdekat dekat mouse
    const starConnectDistSq = starConnectDist * starConnectDist;

    const nearStars: { star: StarParticle; dist: number; alpha: number }[] = [];

    // Step 1: Update positions & identify stars near the mouse
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      s.x += s.vx;
      s.y += s.vy;

      // Wrap around wide bounds
      if (s.x < -2400) s.x = 2400;
      if (s.x > 2400) s.x = -2400;
      if (s.y < -1800) s.y = 1800;
      if (s.y > 1800) s.y = -1800;

      if (mousePos) {
        const dx = mousePos.x - s.x;
        const dy = mousePos.y - s.y;
        const dSq = dx * dx + dy * dy;
        if (dSq < mouseRadiusSq) {
          const dist = Math.sqrt(dSq);
          const proximityAlpha = 1 - dist / mouseRadius;
          nearStars.push({ star: s, dist, alpha: proximityAlpha });
        }
      }
    }

    // Step 2: Draw Ambient Natural Constellation Lines between connected celestial stars
    for (let i = 0; i < stars.length; i++) {
      const s1 = stars[i];
      if (!s1.neighborIndices || s1.neighborIndices.length === 0) continue;
      for (const j of s1.neighborIndices) {
        const s2 = stars[j];
        if (!s2) continue;
        const dx = s1.x - s2.x;
        const dy = s1.y - s2.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < 135 * 135) {
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(s1.x, s1.y);
          ctx.lineTo(s2.x, s2.y);
          const ambientAlpha = theme.isDark ? 0.15 : 0.09;
          ctx.strokeStyle = theme.isDark
            ? `rgba(147, 197, 253, ${ambientAlpha})`
            : `rgba(100, 116, 139, ${ambientAlpha})`;
          ctx.lineWidth = 0.55;
          ctx.stroke();
          ctx.restore();
        }
      }
    }

    // Step 3: Draw Dynamic Constellation Edges connecting stars to the mouse cursor!
    if (mousePos && nearStars.length > 0) {
      // Draw luminous filaments from stars to mouse
      for (const item of nearStars) {
        const { star, alpha } = item;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(mousePos.x, mousePos.y);

        const edgeColor = theme.isDark
          ? `rgba(56, 189, 248, ${alpha * 0.8})`
          : `rgba(2, 132, 199, ${alpha * 0.65})`;
        ctx.strokeStyle = edgeColor;
        ctx.lineWidth = 0.9 + alpha * 1.5;
        ctx.stroke();

        // Glowing white core on mouse ray
        if (alpha > 0.35) {
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.45})`;
          ctx.lineWidth = 0.4;
          ctx.stroke();
        }
        ctx.restore();
      }

      // Draw constellation polygons between nearby stars within mouse aura
      for (let i = 0; i < nearStars.length; i++) {
        for (let j = i + 1; j < nearStars.length; j++) {
          const s1 = nearStars[i].star;
          const s2 = nearStars[j].star;
          const ddx = s1.x - s2.x;
          const ddy = s1.y - s2.y;
          const distSq = ddx * ddx + ddy * ddy;

          if (distSq < starConnectDistSq) {
            const dist = Math.sqrt(distSq);
            const lineAlpha = (1 - dist / starConnectDist) * Math.min(nearStars[i].alpha, nearStars[j].alpha) * 0.75;
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(s1.x, s1.y);
            ctx.lineTo(s2.x, s2.y);
            ctx.strokeStyle = theme.isDark
              ? `rgba(168, 85, 247, ${lineAlpha})`
              : `rgba(126, 34, 206, ${lineAlpha * 0.75})`;
            ctx.lineWidth = 0.85;
            ctx.stroke();
            ctx.restore();
          }
        }
      }
    }

    // Step 4: Draw star cores (twinkling starfield points + astronomical spikes)
    const nearSet = new Set(nearStars.map(n => n.star));

    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      const isNear = nearSet.has(s);
      const twinkle = Math.sin(time * 0.002 * s.twinkleSpeed + s.twinklePhase);
      const currentAlpha = isNear
        ? Math.min(1.0, s.baseAlpha + 0.5)
        : Math.max(0.12, s.baseAlpha * (0.65 + 0.35 * twinkle));

      ctx.save();

      // Outer soft aura when near mouse or for luminous pulsar stars
      if (isNear || s.tier === 'pulsar') {
        const glowRadius = isNear ? s.radius * 7 : s.radius * 4;
        const glow = ctx.createRadialGradient(s.x, s.y, 0.5, s.x, s.y, glowRadius);
        glow.addColorStop(0, isNear ? 'rgba(56, 189, 248, 0.65)' : 'rgba(168, 85, 247, 0.35)');
        glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(s.x, s.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 4-point telescope cross diffraction flare for bright pulsar stars
      if (s.tier === 'pulsar' && twinkle > 0.55) {
        const flareLength = s.radius * (2.8 + twinkle * 2.2);
        ctx.strokeStyle = theme.isDark ? 'rgba(255, 255, 255, 0.65)' : 'rgba(56, 189, 248, 0.5)';
        ctx.lineWidth = 0.65;
        ctx.beginPath();
        ctx.moveTo(s.x - flareLength, s.y);
        ctx.lineTo(s.x + flareLength, s.y);
        ctx.moveTo(s.x, s.y - flareLength);
        ctx.lineTo(s.x, s.y + flareLength);
        ctx.stroke();
      }

      // Star point core
      ctx.beginPath();
      ctx.arc(s.x, s.y, isNear ? s.radius * 1.5 : s.radius, 0, Math.PI * 2);
      ctx.fillStyle = isNear
        ? '#ffffff'
        : theme.isDark
        ? s.color
        : '#475569';
      ctx.globalAlpha = currentAlpha;
      ctx.fill();

      ctx.restore();
    }
  }

  // -------------------------------------------------------------
  // CLEAN RENDERING METHODS (TYPICAL NEURAL NETWORK GRAPH)
  // -------------------------------------------------------------
  function drawCleanSynapses(
    ctx: CanvasRenderingContext2D,
    links: SynapseLink[],
    nodes: NeuronNode[],
    theme: typeof THEMES.fluorescence,
    time: number,
    query: string,
    filterTransmitter: NeurotransmitterType | null,
    activeCourseFilter: string | null,
    activeHoverId: string | null,
    connectedNodeIds: Set<string>
  ) {
    const nodeMap = new Map<string, NeuronNode>();
    for (const n of nodes) nodeMap.set(n.id, n);

    for (const link of links) {
      const source = nodeMap.get(link.sourceId);
      const target = nodeMap.get(link.targetId);
      if (!source || !target) continue;

      const info = NEUROTRANSMITTERS[link.neurotransmitter] || NEUROTRANSMITTERS.Glutamat;
      const isAssociative = link.type === 'associative';

      const sourceMatches = !query || source.label.toLowerCase().includes(query.toLowerCase());
      const targetMatches = !query || target.label.toLowerCase().includes(query.toLowerCase());
      const transmitterMatches = !filterTransmitter || link.neurotransmitter === filterTransmitter;
      const courseMatches = !activeCourseFilter ||
        source.courseId === activeCourseFilter ||
        target.courseId === activeCourseFilter ||
        source.id === activeCourseFilter ||
        target.id === activeCourseFilter;

      const isDimmedByFilter = (query && !sourceMatches && !targetMatches) ||
        (filterTransmitter && !transmitterMatches) ||
        (!courseMatches);

      // Path focus highlight: if hovering a node, highlight only connected links!
      const isConnectedToHover = activeHoverId ? (link.sourceId === activeHoverId || link.targetId === activeHoverId) : true;

      // Smooth organic Bezier curve
      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const normalX = -dy / dist;
      const normalY = dx / dist;
      const curveAmount = isAssociative ? dist * 0.24 : Math.sin(source.x * 0.02 + target.y * 0.02) * 12;

      const cp1x = source.x + dx * 0.35 + normalX * curveAmount;
      const cp1y = source.y + dy * 0.35 + normalY * curveAmount;
      const cp2x = source.x + dx * 0.65 + normalX * (curveAmount * 0.85);
      const cp2y = source.y + dy * 0.65 + normalY * (curveAmount * 0.85);

      ctx.save();

      // Opacity calculation
      if (isDimmedByFilter) {
        ctx.globalAlpha = 0.12;
      } else if (activeHoverId && !isConnectedToHover) {
        ctx.globalAlpha = 0.2;
      } else {
        ctx.globalAlpha = isAssociative ? 0.7 : 0.85;
      }

      ctx.beginPath();
      ctx.moveTo(source.x, source.y);
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, target.x, target.y);

      if (isAssociative) {
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = info.primaryColor;
        ctx.lineWidth = isConnectedToHover ? 1.6 : 1.1;
      } else {
        ctx.setLineDash([]);
        const isCoreLink = source.synapticWeight >= 3 || target.synapticWeight >= 3;
        ctx.strokeStyle = isConnectedToHover ? info.primaryColor : theme.synapseDefault;
        ctx.lineWidth = isConnectedToHover ? (isCoreLink ? 2.8 : 2.0) : (isCoreLink ? 1.8 : 1.2);
      }

      ctx.stroke();
      ctx.restore();
    }
  }

  function drawCleanPulses(
    ctx: CanvasRenderingContext2D,
    pulses: ActionPotentialPulse[],
    links: SynapseLink[],
    nodes: NeuronNode[]
  ) {
    if (pulses.length === 0) return;

    const nodeMap = new Map<string, NeuronNode>();
    for (const n of nodes) nodeMap.set(n.id, n);

    for (const pulse of pulses) {
      const link = links.find(l => l.id === pulse.synapseId);
      if (!link) continue;
      const source = nodeMap.get(link.sourceId);
      const target = nodeMap.get(link.targetId);
      if (!source || !target) continue;

      const isAssociative = link.type === 'associative';
      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const normalX = -dy / dist;
      const normalY = dx / dist;
      const curveAmount = isAssociative ? dist * 0.24 : Math.sin(source.x * 0.02 + target.y * 0.02) * 12;

      const cp1x = source.x + dx * 0.35 + normalX * curveAmount;
      const cp1y = source.y + dy * 0.35 + normalY * curveAmount;
      const cp2x = source.x + dx * 0.65 + normalX * (curveAmount * 0.85);
      const cp2y = source.y + dy * 0.65 + normalY * (curveAmount * 0.85);

      const pos = getBezierPoint(source.x, source.y, cp1x, cp1y, cp2x, cp2y, target.x, target.y, pulse.progress);

      ctx.save();
      const grad = ctx.createRadialGradient(pos.x, pos.y, 1, pos.x, pos.y, 9);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.4, pulse.color);
      grad.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 9, 0, Math.PI * 2);
      ctx.fill();

      // Core photon
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 2.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }

  function drawCleanNeurons(
    ctx: CanvasRenderingContext2D,
    nodes: NeuronNode[],
    selectedId: string | null,
    hoveredId: string | null,
    theme: typeof THEMES.fluorescence,
    time: number,
    query: string,
    filterTransmitter: NeurotransmitterType | null,
    activeCourseFilter: string | null,
    activeHoverId: string | null,
    connectedNodeIds: Set<string>,
    isBlind: boolean = false
  ) {
    for (const node of nodes) {
      const isSelected = node.id === selectedId;
      const isHovered = node.id === hoveredId;
      const radius = getSomaRadius(node);
      const info = NEUROTRANSMITTERS[node.neurotransmitter] || NEUROTRANSMITTERS.Glutamat;

      // Filter & Focus Dimming
      const matchesSearch = !query ||
        node.label.toLowerCase().includes(query.toLowerCase()) ||
        Boolean(node.subLabel?.toLowerCase().includes(query.toLowerCase()));
      const matchesTransmitter = !filterTransmitter || node.neurotransmitter === filterTransmitter;
      const matchesCourse = !activeCourseFilter ||
        node.id === 'root_ppg' ||
        node.courseId === activeCourseFilter ||
        node.id === activeCourseFilter ||
        node.parentId === activeCourseFilter;

      const isDimmedByFilter = (query && !matchesSearch) ||
        (filterTransmitter && !matchesTransmitter) ||
        (!matchesCourse);
      const isHighlightedByHover = activeHoverId ? connectedNodeIds.has(node.id) : true;

      ctx.save();

      if (isDimmedByFilter) {
        ctx.globalAlpha = 0.06;
      } else if (activeHoverId && !isHighlightedByHover) {
        ctx.globalAlpha = 0.25;
      }

      // 1. Soft outer bioluminescent aura
      const auraRadius = radius + (isSelected ? 16 : isHovered ? 12 : node.actionPotential > 0.1 ? 14 : 7);
      const aura = ctx.createRadialGradient(node.x, node.y, radius * 0.6, node.x, node.y, auraRadius);
      aura.addColorStop(0, info.glowColor);
      aura.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.fillStyle = aura;
      ctx.beginPath();
      ctx.arc(node.x, node.y, auraRadius, 0, Math.PI * 2);
      ctx.fill();

      // 2. Double concentric ring for Root / Level 0
      if (node.level === 'root' || node.id === 'root_ppg') {
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius + 5, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
        ctx.lineWidth = 1.8;
        ctx.stroke();
      }

      // 3. Clean circular soma membrane
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);

      const nodeGrad = ctx.createRadialGradient(
        node.x - radius * 0.3,
        node.y - radius * 0.3,
        radius * 0.1,
        node.x,
        node.y,
        radius
      );
      if (theme.isDark) {
        nodeGrad.addColorStop(0, '#1e293b');
        nodeGrad.addColorStop(0.7, theme.somaFill);
        nodeGrad.addColorStop(1, '#020617');
      } else {
        nodeGrad.addColorStop(0, '#ffffff');
        nodeGrad.addColorStop(0.7, theme.somaFill);
        nodeGrad.addColorStop(1, '#e2e8f0');
      }
      ctx.fillStyle = nodeGrad;
      ctx.fill();

      // Border ring
      ctx.strokeStyle = isSelected ? '#ffffff' : isHovered ? info.primaryColor : info.primaryColor;
      ctx.lineWidth = isSelected ? 3 : isHovered ? 2.2 : (node.level === 'root' ? 2.4 : 1.5);
      ctx.stroke();

      // 4. Central nucleus (bioluminescent core)
      const nucleusRadius = radius * 0.38;
      ctx.beginPath();
      ctx.arc(node.x, node.y, nucleusRadius, 0, Math.PI * 2);
      ctx.fillStyle = info.primaryColor;
      ctx.fill();

      // 5. Clean, legible typography label (draw only when within active course or matching search)
      if (matchesCourse && (!query || matchesSearch)) {
        drawCleanNodeLabel(ctx, node, radius, theme, info, isSelected || isHovered || matchesSearch, isBlind);
      }

      ctx.restore();
    }
  }

  function drawCleanNodeLabel(
    ctx: CanvasRenderingContext2D,
    node: NeuronNode,
    radius: number,
    theme: typeof THEMES.fluorescence,
    info: typeof NEUROTRANSMITTERS.Glutamat,
    isHighlighted: boolean,
    isBlind: boolean = false
  ) {
    const isRoot = node.level === 'root' || node.id === 'root_ppg';
    const isMK = node.level === 'mata_kuliah' || node.synapticWeight === 3;

    // In blind recall mode, mask labels for testing memory unless hovered, selected, or root
    const text = (isBlind && !isHighlighted && !isRoot)
      ? '???'
      : node.label;

    ctx.font = isRoot
      ? '700 13px Plus Jakarta Sans, sans-serif'
      : isMK
      ? '600 12px Plus Jakarta Sans, sans-serif'
      : '500 11px Plus Jakarta Sans, sans-serif';

    const metrics = ctx.measureText(text);
    const textWidth = metrics.width;
    const paddingX = 8;
    const boxHeight = isRoot ? 22 : 18;
    const boxWidth = textWidth + paddingX * 2;
    const boxX = node.x - boxWidth / 2;
    const boxY = node.y + radius + 7;

    // Translucent dark pill badge
    ctx.fillStyle = theme.isDark ? 'rgba(8, 12, 22, 0.85)' : 'rgba(255, 255, 255, 0.92)';
    ctx.beginPath();
    roundRect(ctx, boxX, boxY, boxWidth, boxHeight, 5);
    ctx.fill();

    // Hairline stroke
    if (isHighlighted || isRoot) {
      ctx.strokeStyle = isRoot ? '#f59e0b' : info.primaryColor;
      ctx.lineWidth = isHighlighted ? 1.4 : 0.9;
      ctx.stroke();
    }

    // Text content
    ctx.fillStyle = isHighlighted
      ? '#ffffff'
      : (isBlind && text === '???')
      ? '#f59e0b'
      : isRoot
      ? '#fbbf24'
      : theme.isDark
      ? '#f1f5f9'
      : '#0f172a';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, node.x, boxY + boxHeight / 2);
  }

  function getBezierPoint(
    x0: number, y0: number,
    x1: number, y1: number,
    x2: number, y2: number,
    x3: number, y3: number,
    t: number
  ) {
    const mt = 1 - t;
    const mt2 = mt * mt;
    const mt3 = mt2 * mt;
    const t2 = t * t;
    const t3 = t2 * t;

    return {
      x: mt3 * x0 + 3 * mt2 * t * x1 + 3 * mt * t2 * x2 + t3 * x3,
      y: mt3 * y0 + 3 * mt2 * t * x1 + 3 * mt * t2 * x2 + t3 * x3,
    };
  }

  function roundRect(
    ctx: CanvasRenderingContext2D,
    x: number, y: number,
    w: number, h: number,
    r: number
  ) {
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
  }

  return (
    <div className="relative w-full h-full select-none overflow-hidden bg-slate-950">
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onWheel={handleWheel}
        className="w-full h-full block cursor-grab active:cursor-grabbing touch-none"
      />

      {/* Floating Canvas Camera & Hafalan Controls (Bottom Left) */}
      <div className="absolute bottom-5 left-5 z-10 flex items-center gap-1 p-1 bg-slate-900/85 border border-slate-800 rounded-lg backdrop-blur-md shadow-lg text-slate-300">
        <button
          onClick={() => setCamera(prev => ({ ...prev, zoom: Math.min(2.5, prev.zoom * 1.2) }))}
          className="p-1.5 hover:text-white hover:bg-slate-800 rounded transition-colors"
          title="Perbesar"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setCamera(prev => ({ ...prev, zoom: Math.max(0.3, prev.zoom * 0.82) }))}
          className="p-1.5 hover:text-white hover:bg-slate-800 rounded transition-colors"
          title="Perkecil"
        >
          <Minimize2 className="w-3.5 h-3.5" />
        </button>
        <div className="w-px h-3.5 bg-slate-700/60 mx-0.5" />
        <button
          onClick={centerView}
          className="p-1.5 hover:text-white hover:bg-slate-800 rounded transition-colors text-xs flex items-center gap-1 font-mono text-[11px]"
          title="Pusatkan Seluruh Jaringan Syaraf (Pintasan: F)"
        >
          <RotateCcw className="w-3 h-3" />
          <span>{Math.round(camera.zoom * 100)}%</span>
        </button>
        {onToggleBlindMode && (
          <>
            <div className="w-px h-3.5 bg-slate-700/60 mx-0.5" />
            <button
              onClick={onToggleBlindMode}
              className={`p-1.5 rounded transition-colors text-xs flex items-center gap-1.5 font-sans ${
                isBlindMode
                  ? 'bg-amber-500/25 text-amber-300 border border-amber-500/50'
                  : 'hover:text-white hover:bg-slate-800 text-slate-400'
              }`}
              title={
                isBlindMode
                  ? 'Matikan Uji Ingatan (Tampilkan kembali semua label)'
                  : 'Mode Uji Ingatan (Tutup label untuk menguji hafalan struktur otak)'
              }
            >
              {isBlindMode ? <EyeOff className="w-3.5 h-3.5 text-amber-400" /> : <Eye className="w-3.5 h-3.5" />}
              <span className="text-[11px] font-medium hidden sm:inline">
                {isBlindMode ? 'Hafalan Aktif' : 'Uji Ingatan'}
              </span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};
