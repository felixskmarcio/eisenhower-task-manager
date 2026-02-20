import React, { useState, useMemo } from 'react';
import { useTags } from '@/contexts/TagContext';
import { Badge } from '@/components/ui/badge';
import { Edit2, Trash2, Plus, X, Check, Search, Tag, Palette, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Paleta de cores predefinidas vibrantes
const COLOR_PRESETS = [
  { hex: '#ccff00', name: 'Verde neon' },
  { hex: '#ff5555', name: 'Vermelho' },
  { hex: '#8be9fd', name: 'Ciano' },
  { hex: '#f1fa8c', name: 'Amarelo' },
  { hex: '#bd93f9', name: 'Lavanda' },
  { hex: '#ff79c6', name: 'Rosa' },
  { hex: '#50fa7b', name: 'Esmeralda' },
  { hex: '#ffb86c', name: 'Pêssego' },
  { hex: '#0EA5E9', name: 'Oceano' },
  { hex: '#D946EF', name: 'Magenta' },
  { hex: '#F97316', name: 'Laranja' },
  { hex: '#6366F1', name: 'Índigo' },
];

// Tipos e labels
type TagType = 'project' | 'context' | 'lifearea';
const TAG_TYPES: TagType[] = ['project', 'context', 'lifearea'];

const TYPE_CONFIG: Record<TagType, { label: string; labelSingular: string; icon: string; accentColor: string; bgGlow: string }> = {
  project: {
    label: 'Projetos',
    labelSingular: 'Projeto',
    icon: '📁',
    accentColor: '#ccff00',
    bgGlow: 'rgba(204, 255, 0, 0.04)',
  },
  context: {
    label: 'Contextos',
    labelSingular: 'Contexto',
    icon: '📍',
    accentColor: '#22d3ee',
    bgGlow: 'rgba(34, 211, 238, 0.04)',
  },
  lifearea: {
    label: 'Áreas de Vida',
    labelSingular: 'Área de Vida',
    icon: '🎯',
    accentColor: '#fbbf24',
    bgGlow: 'rgba(251, 191, 36, 0.04)',
  },
};

// Função para calcular cor de contraste
function getContrastColor(hexColor: string): string {
  const color = hexColor.charAt(0) === '#' ? hexColor.substring(1) : hexColor;
  const r = parseInt(color.substr(0, 2), 16);
  const g = parseInt(color.substr(2, 2), 16);
  const b = parseInt(color.substr(4, 2), 16);
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return yiq >= 150 ? '#000' : '#fff';
}

// Variantes de animação
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 25 },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: -4,
    transition: { duration: 0.2 },
  },
};

const TagManager: React.FC = () => {
  const { tags, addTag, updateTag, deleteTag } = useTags();

  // Estado de busca
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Estado de adição — por seção
  const [addingInType, setAddingInType] = useState<TagType | null>(null);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#ccff00');

  // Estado de edição
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [editTagName, setEditTagName] = useState('');
  const [editTagColor, setEditTagColor] = useState('');
  const [editTagType, setEditTagType] = useState<TagType>('project');

  // Tags filtradas por busca
  const filteredTagsByType = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    const result: Record<TagType, typeof tags> = {
      project: [],
      context: [],
      lifearea: [],
    };
    tags.forEach(tag => {
      if (!query || tag.name.toLowerCase().includes(query)) {
        result[tag.type].push(tag);
      }
    });
    return result;
  }, [tags, searchQuery]);

  // Handlers
  const handleStartAdd = (type: TagType) => {
    setAddingInType(type);
    setNewTagName('');
    setNewTagColor(COLOR_PRESETS[Math.floor(Math.random() * COLOR_PRESETS.length)].hex);
  };

  const handleCancelAdd = () => {
    setAddingInType(null);
    setNewTagName('');
  };

  const handleAddTag = (type: TagType) => {
    if (newTagName.trim()) {
      addTag({ name: newTagName.trim(), color: newTagColor, type });
      setNewTagName('');
      setAddingInType(null);
    }
  };

  const handleEditClick = (tag: any) => {
    setEditingTagId(tag.id);
    setEditTagName(tag.name);
    setEditTagColor(tag.color);
    setEditTagType(tag.type);
  };

  const handleSaveEdit = () => {
    if (editingTagId && editTagName.trim()) {
      updateTag({
        id: editingTagId,
        name: editTagName.trim(),
        color: editTagColor,
        type: editTagType,
      });
      setEditingTagId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingTagId(null);
  };

  const handleDeleteTag = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta tag?')) {
      deleteTag(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Barra de Busca Global — Glassmorphism */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative group"
      >
        <motion.div
          animate={{ scale: isSearchFocused ? 1.1 : 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className="absolute left-4 top-1/2 -translate-y-1/2"
        >
          <Search className={`w-4 h-4 transition-colors duration-300 ${isSearchFocused ? 'text-[#ccff00]' : 'text-zinc-500'}`} />
        </motion.div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
          placeholder="Buscar tags em todas as categorias..."
          className="w-full border text-zinc-200 pl-11 pr-4 py-3 font-mono text-sm focus:outline-none placeholder:text-zinc-600 transition-all duration-300"
          style={{
            backgroundColor: 'rgba(20, 20, 24, 0.8)',
            backdropFilter: 'blur(12px)',
            borderColor: isSearchFocused ? 'rgba(204, 255, 0, 0.3)' : 'rgba(63, 63, 70, 0.5)',
            boxShadow: isSearchFocused ? '0 0 20px rgba(204, 255, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.03)' : 'inset 0 1px 0 rgba(255, 255, 255, 0.02)',
          }}
        />
        {/* Underline animada */}
        <motion.div
          className="absolute bottom-0 left-0 h-[2px]"
          style={{ backgroundColor: '#ccff00' }}
          initial={{ width: '0%' }}
          animate={{ width: isSearchFocused ? '100%' : '0%' }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-500 hover:text-white transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </motion.div>

      {/* Seções de Tags */}
      {TAG_TYPES.map((type, sectionIdx) => {
        const config = TYPE_CONFIG[type];
        const typeTags = filteredTagsByType[type];
        const totalCount = tags.filter(t => t.type === type).length;
        const isAdding = addingInType === type;

        return (
          <motion.div
            key={type}
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIdx * 0.1, duration: 0.4, ease: 'easeOut' }}
            className="border relative overflow-hidden group/section"
            style={{
              backgroundColor: 'rgba(20, 20, 24, 0.5)',
              backdropFilter: 'blur(8px)',
              borderColor: 'rgba(63, 63, 70, 0.4)',
            }}
          >
            {/* Barra lateral colorida com gradiente */}
            <div
              className="absolute top-0 left-0 w-1.5 h-full"
              style={{
                background: `linear-gradient(180deg, ${config.accentColor} 0%, ${config.accentColor}80 60%, transparent 100%)`,
              }}
            />

            {/* Corner Accents aprimorados */}
            <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 transition-opacity duration-300 opacity-60 group-hover/section:opacity-100" style={{ borderColor: config.accentColor }} />
            <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 transition-opacity duration-300 opacity-60 group-hover/section:opacity-100" style={{ borderColor: config.accentColor }} />
            <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 transition-opacity duration-300 opacity-60 group-hover/section:opacity-100" style={{ borderColor: config.accentColor }} />
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 transition-opacity duration-300 opacity-60 group-hover/section:opacity-100" style={{ borderColor: config.accentColor }} />

            {/* Header da Seção */}
            <div
              className="px-5 py-4 flex justify-between items-center border-b transition-colors duration-300"
              style={{
                background: `linear-gradient(135deg, ${config.bgGlow} 0%, transparent 60%)`,
                borderColor: 'rgba(63, 63, 70, 0.3)',
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg" style={{ filter: `drop-shadow(0 0 6px ${config.accentColor}40)` }}>{config.icon}</span>
                <h2
                  className="text-sm font-mono uppercase tracking-wider font-semibold"
                  style={{ color: config.accentColor, textShadow: `0 0 10px ${config.accentColor}30` }}
                >
                  {config.label}
                </h2>
                <Badge
                  variant="outline"
                  className="text-[10px] rounded-none font-mono font-bold"
                  style={{
                    borderColor: `${config.accentColor}30`,
                    backgroundColor: `${config.accentColor}10`,
                    color: config.accentColor,
                  }}
                >
                  {totalCount}
                </Badge>
                {searchQuery && typeTags.length !== totalCount && (
                  <span className="text-[10px] text-zinc-600 font-mono">
                    ({typeTags.length} encontrado{typeTags.length !== 1 ? 's' : ''})
                  </span>
                )}
              </div>

              {/* Botão Adicionar no header */}
              {!isAdding && (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleStartAdd(type)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase tracking-wide border border-dashed transition-all duration-200"
                  style={{
                    borderColor: `${config.accentColor}35`,
                    color: `${config.accentColor}bb`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = config.accentColor;
                    e.currentTarget.style.color = config.accentColor;
                    e.currentTarget.style.backgroundColor = `${config.accentColor}10`;
                    e.currentTarget.style.boxShadow = `0 0 14px ${config.accentColor}15`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = `${config.accentColor}35`;
                    e.currentTarget.style.color = `${config.accentColor}bb`;
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <Plus size={12} />
                  Adicionar
                </motion.button>
              )}
            </div>

            {/* Conteúdo da Seção */}
            <div className="p-4">
              {/* Lista de Tags — Staggered */}
              {typeTags.length > 0 ? (
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  key={`${type}-${searchQuery}`}
                >
                  <AnimatePresence mode="popLayout">
                    {typeTags.map((tag) => (
                      <motion.div
                        key={tag.id}
                        layout
                        variants={itemVariants}
                        exit="exit"
                        className="group/item flex items-center justify-between p-3 border relative overflow-hidden transition-all duration-200"
                        style={{
                          backgroundColor: 'rgba(24, 24, 27, 0.7)',
                          borderColor: editingTagId === tag.id ? `${tag.color}50` : 'rgba(63, 63, 70, 0.4)',
                          borderLeft: `3px solid ${tag.color}`,
                        }}
                        whileHover={{
                          y: -1,
                          boxShadow: `0 4px 16px rgba(0,0,0,0.3), 0 0 12px ${tag.color}18`,
                          borderColor: `${tag.color}40`,
                        }}
                      >
                        {editingTagId === tag.id ? (
                          /* ─── Modo Edição ─── */
                          <motion.div
                            className="flex flex-col w-full space-y-3"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="relative">
                              <input
                                type="text"
                                value={editTagName}
                                onChange={(e) => setEditTagName(e.target.value)}
                                className="w-full bg-black/60 border border-zinc-700 text-zinc-200 text-sm p-2 focus:outline-none transition-colors font-mono"
                                style={{
                                  borderColor: `${editTagColor}40`,
                                }}
                                placeholder="Nome da tag"
                                autoFocus
                                onFocus={(e) => {
                                  e.currentTarget.style.borderColor = `${editTagColor}80`;
                                }}
                                onBlur={(e) => {
                                  e.currentTarget.style.borderColor = `${editTagColor}40`;
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleSaveEdit();
                                  if (e.key === 'Escape') handleCancelEdit();
                                }}
                              />
                              {/* Underline animada na edição */}
                              <div
                                className="absolute bottom-0 left-0 h-[2px] w-full transition-opacity duration-300"
                                style={{ backgroundColor: editTagColor, opacity: 0.6 }}
                              />
                            </div>

                            {/* Paleta de cores */}
                            <div className="flex flex-wrap gap-1.5">
                              {COLOR_PRESETS.map((preset) => (
                                <button
                                  key={preset.hex}
                                  onClick={() => setEditTagColor(preset.hex)}
                                  className="w-5 h-5 rounded-sm transition-all duration-150 hover:scale-125"
                                  style={{
                                    backgroundColor: preset.hex,
                                    outline: editTagColor === preset.hex ? `2px solid ${preset.hex}` : 'none',
                                    outlineOffset: '2px',
                                    boxShadow: editTagColor === preset.hex ? `0 0 8px ${preset.hex}50` : 'none',
                                  }}
                                  title={preset.name}
                                />
                              ))}
                              <div className="relative w-5 h-5 flex-shrink-0">
                                <input
                                  type="color"
                                  value={editTagColor}
                                  onChange={(e) => setEditTagColor(e.target.value)}
                                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                />
                                <div className="w-full h-full rounded-sm border border-zinc-600 flex items-center justify-center bg-zinc-800 hover:border-zinc-500 transition-colors">
                                  <Palette size={10} className="text-zinc-400" />
                                </div>
                              </div>
                            </div>

                            {/* Seletor de tipo */}
                            <select
                              value={editTagType}
                              onChange={(e) => setEditTagType(e.target.value as TagType)}
                              className="bg-black/60 border text-zinc-400 text-xs p-1.5 focus:outline-none font-mono transition-colors"
                              style={{ borderColor: `${editTagColor}30` }}
                            >
                              <option value="project">📁 Projeto</option>
                              <option value="context">📍 Contexto</option>
                              <option value="lifearea">🎯 Área de Vida</option>
                            </select>

                            {/* Preview + Ações */}
                            <div className="flex items-center justify-between pt-1">
                              <motion.div
                                key={`${editTagName}-${editTagColor}`}
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                                className="px-2.5 py-1 text-xs font-medium rounded-sm flex items-center gap-1.5"
                                style={{
                                  backgroundColor: editTagColor,
                                  color: getContrastColor(editTagColor),
                                  boxShadow: `0 2px 8px ${editTagColor}30`,
                                }}
                              >
                                <Tag size={10} />
                                {editTagName || 'Preview'}
                              </motion.div>
                              <div className="flex gap-1.5">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={handleCancelEdit}
                                  className="p-1.5 hover:bg-red-900/30 text-zinc-500 hover:text-red-400 transition-colors border border-transparent hover:border-red-900/50"
                                  title="Cancelar"
                                >
                                  <X size={14} />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={handleSaveEdit}
                                  className="p-1.5 hover:bg-[#ccff00]/10 text-zinc-500 hover:text-[#ccff00] transition-colors border border-transparent hover:border-[#ccff00]/30"
                                  title="Salvar"
                                >
                                  <Check size={14} />
                                </motion.button>
                              </div>
                            </div>
                          </motion.div>
                        ) : (
                          /* ─── Modo Visualização ─── */
                          <>
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <div
                                className="w-3 h-3 rounded-sm flex-shrink-0"
                                style={{
                                  backgroundColor: tag.color,
                                  boxShadow: `0 0 10px ${tag.color}45, 0 0 4px ${tag.color}30`,
                                  animation: 'tag-dot-pulse 3s ease-in-out infinite',
                                }}
                              />
                              <span className="text-zinc-200 font-mono text-sm truncate">
                                {tag.name}
                              </span>
                            </div>
                            <div className="flex gap-1 ml-2 flex-shrink-0 opacity-0 group-hover/item:opacity-100 transition-all duration-200">
                              <motion.button
                                whileHover={{ scale: 1.15 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleEditClick(tag)}
                                className="p-1.5 hover:bg-zinc-700/80 text-zinc-500 hover:text-white transition-colors rounded-sm"
                                title="Editar tag"
                              >
                                <Edit2 size={13} />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.15 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleDeleteTag(tag.id)}
                                className="p-1.5 hover:bg-red-900/30 text-zinc-500 hover:text-red-400 transition-colors rounded-sm"
                                title="Excluir tag"
                              >
                                <Trash2 size={13} />
                              </motion.button>
                            </div>
                          </>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              ) : (
                /* ─── Estado Vazio ─── */
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8 font-mono text-xs border border-dashed rounded-sm relative"
                  style={{
                    borderColor: `${config.accentColor}25`,
                    color: `${config.accentColor}60`,
                    animation: 'empty-breathe 4s ease-in-out infinite',
                  }}
                >
                  <span className="text-2xl block mb-2">{config.icon}</span>
                  {searchQuery
                    ? <span className="text-zinc-600">Nenhuma tag "<span style={{ color: config.accentColor }}>{searchQuery}</span>" encontrada nesta categoria</span>
                    : <span>Nenhum {config.labelSingular.toLowerCase()} cadastrado ainda</span>
                  }
                </motion.div>
              )}

              {/* Formulário Inline de Adição */}
              <AnimatePresence>
                {isAdding && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 border p-4 space-y-4 relative" style={{
                      borderColor: `${config.accentColor}20`,
                      backgroundColor: 'rgba(10, 10, 14, 0.6)',
                      backdropFilter: 'blur(8px)',
                    }}>
                      {/* Corner accents do form */}
                      <div className="absolute top-0 left-0 w-3 h-3 border-t border-l" style={{ borderColor: `${config.accentColor}50` }} />
                      <div className="absolute top-0 right-0 w-3 h-3 border-t border-r" style={{ borderColor: `${config.accentColor}50` }} />
                      <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l" style={{ borderColor: `${config.accentColor}50` }} />
                      <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r" style={{ borderColor: `${config.accentColor}50` }} />

                      {/* Label flutuante */}
                      <div
                        className="absolute -top-2.5 left-3 px-2 text-[10px] font-mono uppercase tracking-widest flex items-center gap-1"
                        style={{
                          color: config.accentColor,
                          backgroundColor: '#0a0a0e',
                          textShadow: `0 0 8px ${config.accentColor}40`,
                        }}
                      >
                        <Sparkles size={10} style={{ verticalAlign: '-1px' }} />
                        Novo {config.labelSingular}
                      </div>

                      {/* Nome */}
                      <div>
                        <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-1.5 tracking-wider">
                          Nome
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={newTagName}
                            onChange={(e) => setNewTagName(e.target.value)}
                            className="w-full border text-zinc-200 p-2.5 font-mono text-sm focus:outline-none placeholder:text-zinc-700 transition-all duration-300"
                            style={{
                              backgroundColor: 'rgba(10, 10, 14, 0.8)',
                              borderColor: `${config.accentColor}20`,
                            }}
                            placeholder={`Nome do ${config.labelSingular.toLowerCase()}...`}
                            autoFocus
                            onFocus={(e) => {
                              e.currentTarget.style.borderColor = `${config.accentColor}50`;
                            }}
                            onBlur={(e) => {
                              e.currentTarget.style.borderColor = `${config.accentColor}20`;
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && newTagName.trim()) handleAddTag(type);
                              if (e.key === 'Escape') handleCancelAdd();
                            }}
                          />
                          {/* Underline animada no input */}
                          <motion.div
                            className="absolute bottom-0 left-0 h-[2px]"
                            style={{ backgroundColor: config.accentColor }}
                            initial={{ width: '0%' }}
                            animate={{ width: newTagName ? '100%' : '0%' }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      </div>

                      {/* Cor */}
                      <div>
                        <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-1.5 tracking-wider">
                          Cor
                        </label>
                        <div className="flex flex-wrap gap-2 items-center">
                          {COLOR_PRESETS.map((preset) => (
                            <button
                              key={preset.hex}
                              onClick={() => setNewTagColor(preset.hex)}
                              className="w-7 h-7 rounded-sm transition-all duration-150 hover:scale-110 focus:outline-none relative group/color"
                              style={{
                                backgroundColor: preset.hex,
                                outline: newTagColor === preset.hex ? `2px solid ${preset.hex}` : 'none',
                                outlineOffset: '2px',
                                boxShadow: newTagColor === preset.hex ? `0 0 12px ${preset.hex}40` : 'none',
                              }}
                              title={preset.name}
                            >
                              {/* Tooltip */}
                              <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[9px] font-mono bg-zinc-800 text-zinc-300 px-1.5 py-0.5 whitespace-nowrap rounded-sm opacity-0 group-hover/color:opacity-100 transition-opacity pointer-events-none border border-zinc-700">
                                {preset.name}
                              </span>
                            </button>
                          ))}
                          {/* Color picker customizado */}
                          <div className="relative w-7 h-7 flex-shrink-0 group/picker">
                            <input
                              type="color"
                              value={newTagColor}
                              onChange={(e) => setNewTagColor(e.target.value)}
                              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                            />
                            <div className="w-full h-full rounded-sm border border-zinc-700 flex items-center justify-center bg-zinc-900 group-hover/picker:border-zinc-500 transition-colors">
                              <Palette size={13} className="text-zinc-400" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Preview em Tempo Real */}
                      <AnimatePresence>
                        {newTagName.trim() && (
                          <motion.div
                            initial={{ opacity: 0, y: -5, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                            className="flex items-center gap-2"
                          >
                            <span className="text-[10px] font-mono text-zinc-600 uppercase">Preview:</span>
                            <div
                              className="px-3 py-1.5 text-xs font-medium rounded-sm flex items-center gap-1.5"
                              style={{
                                backgroundColor: newTagColor,
                                color: getContrastColor(newTagColor),
                                boxShadow: `0 2px 10px ${newTagColor}35`,
                              }}
                            >
                              <Tag size={11} />
                              {newTagName}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Ações */}
                      <div className="flex justify-end gap-2 pt-2 border-t" style={{ borderColor: 'rgba(63, 63, 70, 0.3)' }}>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleCancelAdd}
                          className="px-4 py-2 border text-zinc-500 hover:text-white hover:bg-zinc-800/50 transition-all duration-200 font-mono text-xs uppercase"
                          style={{ borderColor: 'rgba(63, 63, 70, 0.5)' }}
                        >
                          Cancelar
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleAddTag(type)}
                          disabled={!newTagName.trim()}
                          className="px-5 py-2 font-bold font-mono text-xs uppercase tracking-wider relative overflow-hidden transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                          style={{
                            backgroundColor: newTagName.trim() ? config.accentColor : undefined,
                            color: newTagName.trim() ? getContrastColor(config.accentColor) : undefined,
                            boxShadow: newTagName.trim() ? `0 2px 12px ${config.accentColor}30` : undefined,
                          }}
                        >
                          {/* Shimmer effect */}
                          {newTagName.trim() && (
                            <span
                              className="absolute inset-0 pointer-events-none"
                              style={{
                                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
                                animation: 'shimmer 2.5s ease-in-out infinite',
                              }}
                            />
                          )}
                          <span className="relative z-10">Criar Tag</span>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        );
      })}

      {/* Keyframes globais */}
      <style>{`
        @keyframes tag-dot-pulse {
          0%, 100% { box-shadow: 0 0 10px var(--dot-glow, rgba(204, 255, 0, 0.3)), 0 0 4px var(--dot-glow, rgba(204, 255, 0, 0.2)); }
          50% { box-shadow: 0 0 6px var(--dot-glow, rgba(204, 255, 0, 0.15)), 0 0 2px var(--dot-glow, rgba(204, 255, 0, 0.1)); }
        }
        @keyframes empty-breathe {
          0%, 100% { border-color: rgba(204, 255, 0, 0.15); }
          50% { border-color: rgba(204, 255, 0, 0.08); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default TagManager;
