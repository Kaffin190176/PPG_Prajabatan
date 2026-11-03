import React, { useState } from 'react';
import { NeuronNode, SynapseLink, NEUROTRANSMITTERS } from '../types/neural';
import { X, Search, ChevronRight, ChevronDown, Plus, Brain } from 'lucide-react';

interface NeuralOutlineDrawerProps {
  nodes: NeuronNode[];
  links: SynapseLink[];
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
  onAddChild: (parentId: string) => void;
  onClose: () => void;
  isDark: boolean;
}

export const NeuralOutlineDrawer: React.FC<NeuralOutlineDrawerProps> = ({
  nodes,
  links,
  selectedNodeId,
  onSelectNode,
  onAddChild,
  onClose,
  isDark,
}) => {
  const [search, setSearch] = useState('');
  const [collapsedNodes, setCollapsedNodes] = useState<Record<string, boolean>>({});

  const toggleCollapse = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCollapsedNodes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Build tree
  const childrenMap = new Map<string, NeuronNode[]>();
  const rootNodes: NeuronNode[] = [];

  for (const node of nodes) {
    if (!node.parentId || !nodes.some(n => n.id === node.parentId)) {
      rootNodes.push(node);
    } else {
      if (!childrenMap.has(node.parentId)) {
        childrenMap.set(node.parentId, []);
      }
      childrenMap.get(node.parentId)!.push(node);
    }
  }

  const renderTreeItem = (node: NeuronNode, level: number = 0) => {
    const children = childrenMap.get(node.id) || [];
    const hasChildren = children.length > 0;
    const isCollapsed = !!collapsedNodes[node.id];
    const isSelected = node.id === selectedNodeId;
    const info = NEUROTRANSMITTERS[node.neurotransmitter] || NEUROTRANSMITTERS.Glutamat;

    if (search && !node.label.toLowerCase().includes(search.toLowerCase())) {
      // If none of children match either, skip
      const anyChildMatches = children.some(c =>
        c.label.toLowerCase().includes(search.toLowerCase())
      );
      if (!anyChildMatches) return null;
    }

    return (
      <div key={node.id} className="select-none">
        <div
          onClick={() => onSelectNode(node.id)}
          className={`group flex items-center justify-between gap-1.5 py-1.5 px-2 rounded-lg cursor-pointer text-xs transition-colors ${
            isSelected
              ? 'bg-cyan-500/20 text-cyan-200 font-semibold'
              : isDark
              ? 'hover:bg-slate-800/60 text-slate-300'
              : 'hover:bg-slate-100 text-slate-700'
          }`}
          style={{ paddingLeft: `${Math.max(8, level * 16 + 8)}px` }}
        >
          <div className="flex items-center gap-2 min-w-0">
            {hasChildren ? (
              <button
                onClick={e => toggleCollapse(node.id, e)}
                className="p-0.5 rounded hover:bg-slate-700/50 text-slate-400"
              >
                {isCollapsed ? (
                  <ChevronRight className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
            ) : (
              <div className="w-3.5 h-3.5 flex items-center justify-center">
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: info.primaryColor }}
                />
              </div>
            )}

            <div
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: info.primaryColor }}
            />

            <span className="truncate">{node.label}</span>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={e => {
                e.stopPropagation();
                onAddChild(node.id);
              }}
              title="Tambah sinapsis anak"
              className="p-1 text-slate-400 hover:text-cyan-400 rounded"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>

        {hasChildren && !isCollapsed && (
          <div>
            {children.map(child => renderTreeItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`fixed top-[57px] left-0 bottom-0 w-80 md:w-96 z-40 border-r shadow-2xl flex flex-col transition-all duration-300 ${
        isDark
          ? 'bg-slate-900/95 border-slate-800 text-slate-100'
          : 'bg-white/95 border-slate-200 text-slate-900'
      } backdrop-blur-md`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-inherit">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold tracking-wider uppercase text-slate-400">
            Hierarki Sinapsis (Pohon Ide)
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Search Input */}
      <div className="p-3 border-b border-inherit">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari ide dalam jaringan syaraf..."
            className={`w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border focus:outline-none focus:ring-1 focus:ring-cyan-500 ${
              isDark
                ? 'bg-slate-950 border-slate-800 text-white'
                : 'bg-slate-50 border-slate-300 text-slate-900'
            }`}
          />
        </div>
      </div>

      {/* Tree Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {rootNodes.map(root => renderTreeItem(root, 0))}
      </div>
    </div>
  );
};
