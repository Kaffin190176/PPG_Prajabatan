import { NeuronNode, SynapseLink } from '../types/neural';

export interface PhysicsConfig {
  springLength: number;
  springStrength: number;
  repulsion: number;
  damping: number;
  maxVelocity: number;
  naturalBreath: boolean;
}

export const DEFAULT_PHYSICS_CONFIG: PhysicsConfig = {
  springLength: 170,
  springStrength: 0.045,
  repulsion: 18000,
  damping: 0.82,
  maxVelocity: 8,
  naturalBreath: true,
};

export function stepSimulation(
  nodes: NeuronNode[],
  links: SynapseLink[],
  config: PhysicsConfig = DEFAULT_PHYSICS_CONFIG,
  time: number = 0
): boolean {
  const nodeMap = new Map<string, NeuronNode>();
  for (const n of nodes) {
    nodeMap.set(n.id, n);
  }

  let totalMovement = 0;

  // 1. Repulsion between all pairs of soma
  for (let i = 0; i < nodes.length; i++) {
    const n1 = nodes[i];
    for (let j = i + 1; j < nodes.length; j++) {
      const n2 = nodes[j];
      const dx = n2.x - n1.x;
      const dy = n2.y - n1.y;
      const distSq = dx * dx + dy * dy;
      const minDist = 80;
      const effectiveDistSq = Math.max(distSq, minDist * minDist);
      const dist = Math.sqrt(effectiveDistSq);

      if (dist < 500) {
        const force = config.repulsion / effectiveDistSq;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;

        if (!n1.isPinned) {
          n1.vx -= fx;
          n1.vy -= fy;
        }
        if (!n2.isPinned) {
          n2.vx += fx;
          n2.vy += fy;
        }
      }
    }
  }

  // 2. Spring tension along synapses
  for (const link of links) {
    const source = nodeMap.get(link.sourceId);
    const target = nodeMap.get(link.targetId);
    if (!source || !target) continue;

    const dx = target.x - source.x;
    const dy = target.y - source.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;

    // Ideal length depends on synaptic weight and connection type
    const targetLength = link.type === 'associative' ? config.springLength * 1.4 : config.springLength;
    const displacement = dist - targetLength;
    const springForce = displacement * config.springStrength;

    const fx = (dx / dist) * springForce;
    const fy = (dy / dist) * springForce;

    if (!source.isPinned) {
      source.vx += fx;
      source.vy += fy;
    }
    if (!target.isPinned) {
      target.vx -= fx;
      target.vy -= fy;
    }
  }

  // 3. Gentle fluid thermal drift / rhythmic respiration
  const breathFactor = config.naturalBreath ? Math.sin(time * 0.0015) * 0.08 : 0;

  // 4. Update velocities and positions
  for (const node of nodes) {
    if (node.isPinned) {
      node.vx = 0;
      node.vy = 0;
      continue;
    }

    // Microscopic organic undulating current
    if (config.naturalBreath) {
      const driftX = Math.sin(time * 0.001 + node.y * 0.01) * breathFactor;
      const driftY = Math.cos(time * 0.001 + node.x * 0.01) * breathFactor;
      node.vx += driftX;
      node.vy += driftY;
    }

    // Cap velocity
    const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
    if (speed > config.maxVelocity) {
      node.vx = (node.vx / speed) * config.maxVelocity;
      node.vy = (node.vy / speed) * config.maxVelocity;
    }

    node.x += node.vx;
    node.y += node.vy;

    totalMovement += speed;

    // Apply fluid viscosity damping
    node.vx *= config.damping;
    node.vy *= config.damping;

    // Decay action potential excitation
    if (node.actionPotential > 0.005) {
      node.actionPotential *= 0.93;
    } else {
      node.actionPotential = 0;
    }
  }

  return totalMovement > 0.15;
}

/**
 * Organizes nodes in a clean radial biological dendritic arborization pattern
 */
export function autoArborize(nodes: NeuronNode[], links: SynapseLink[]) {
  if (nodes.length === 0) return;

  // Find root node (node with no parent or synapticWeight == 4)
  const root = nodes.find(n => !n.parentId || n.synapticWeight === 4) || nodes[0];
  const childrenMap = new Map<string, string[]>();

  for (const link of links) {
    if (link.type === 'axon') {
      if (!childrenMap.has(link.sourceId)) {
        childrenMap.set(link.sourceId, []);
      }
      childrenMap.get(link.sourceId)!.push(link.targetId);
    }
  }

  // Recursive radial placement
  function layoutBranch(
    nodeId: string,
    centerAngle: number,
    angleSpan: number,
    radius: number
  ) {
    const children = childrenMap.get(nodeId) || [];
    if (children.length === 0) return;

    const angleStep = angleSpan / (children.length + 1);
    const startAngle = centerAngle - angleSpan / 2;

    children.forEach((childId, index) => {
      const child = nodes.find(n => n.id === childId);
      if (!child) return;

      const angle = startAngle + (index + 1) * angleStep;
      // Slight organic radius modulation
      const organicRadius = radius + (Math.sin(index * 2) * 15);
      const parent = nodes.find(n => n.id === nodeId);
      const px = parent ? parent.x : 0;
      const py = parent ? parent.y : 0;

      child.x = px + Math.cos(angle) * organicRadius;
      child.y = py + Math.sin(angle) * organicRadius;
      child.vx = 0;
      child.vy = 0;

      // Sub-branches occupy narrower sectors
      const subSpan = Math.min(Math.PI * 0.8, angleStep * 1.5);
      layoutBranch(childId, angle, subSpan, 180);
    });
  }

  root.x = 0;
  root.y = 0;
  root.vx = 0;
  root.vy = 0;
  layoutBranch(root.id, 0, Math.PI * 2, 220);
}
