import React, { useState } from 'react';
import { useTags } from '@/contexts/TagContext';
import { Badge } from '@/components/ui/badge';
import { Edit2, Trash2, Plus, X, Check, ChevronDown } from 'lucide-react';

interface TagManagerProps {}

const TagManager: React.FC<TagManagerProps> = () => {
  const { tags, addTag, updateTag, deleteTag } = useTags();
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#50fa7b');
  const [newTagType, setNewTagType] = useState<'project' | 'context' | 'lifearea'>('project');
  const [editTagName, setEditTagName] = useState('');
  const [editTagColor, setEditTagColor] = useState('');
  const [editTagType, setEditTagType] = useState<'project' | 'context' | 'lifearea'>('project');
  // Inicializar com 'project' expandido por padrão para que as tags sejam visíveis imediatamente
  const [expandedType, setExpandedType] = useState<'project' | 'context' | 'lifearea' | null>('project');

  // Group tags by type
  const tagsByType = {
    project: tags.filter(tag => tag.type === 'project'),
    context: tags.filter(tag => tag.type === 'context'),
    lifearea: tags.filter(tag => tag.type === 'lifearea')
  };

  const handleAddTag = () => {
    if (newTagName.trim()) {
      addTag({
        name: newTagName.trim(),
        color: newTagColor,
        type: newTagType,
      });
      setNewTagName('');
      setIsAddingTag(false);
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

  const toggleTypeExpansion = (type: 'project' | 'context' | 'lifearea') => {
    setExpandedType(expandedType === type ? null : type);
  };

  const getTypeLabel = (type: 'project' | 'context' | 'lifearea') => {
    switch (type) {
      case 'project': return 'Projetos';
      case 'context': return 'Contextos';
      case 'lifearea': return 'Áreas de Vida';
    }
  };

  // Function to get gradient colors based on tag type
  const getTypeGradient = (type: 'project' | 'context' | 'lifearea') => {
    switch (type) {
      case 'project': return 'from-emerald-100 to-blue-100';
      case 'context': return 'from-sky-100 to-indigo-100';
      case 'lifearea': return 'from-amber-100 to-emerald-100';
    }
  };

  // Function to get accent color based on tag type
  const getTypeAccentColor = (type: 'project' | 'context' | 'lifearea') => {
    switch (type) {
      case 'project': return 'text-emerald-600 border-emerald-300';
      case 'context': return 'text-sky-600 border-sky-300';
      case 'lifearea': return 'text-amber-600 border-amber-300';
    }
  };

  // Pode ser que exista uma função que renderiza o título com contador
  const renderCategoryTitle = (name, count) => {
    return (
      <h2 className="text-lg font-semibold text-emerald-600 border-emerald-300">
        {name}
      </h2>
    );
  };

  return (
    <div className="space-y-6">
      {/* Tag Type Sections */}
      {(['project', 'context', 'lifearea'] as const).map((type) => (
        <div key={type} className="rounded-lg overflow-hidden shadow-md bg-white/90 backdrop-blur-sm border border-base-300">
          {/* Section Header */}
          <div 
            className={`p-4 cursor-pointer flex justify-between items-center bg-gradient-to-r ${getTypeGradient(type)}`}
            onClick={() => toggleTypeExpansion(type)}
          >
            <h2 className={`text-lg font-semibold ${getTypeAccentColor(type)}`}>
              {getTypeLabel(type)}
            </h2>
            <ChevronDown 
              className={`transition-transform duration-300 ${expandedType === type ? 'rotate-180' : ''}`} 
              size={20} 
            />
          </div>
          
          {/* Section Content */}
          {expandedType === type && (
            <div className="p-4">
              {tagsByType[type].length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {tagsByType[type].map((tag) => (
                    <div 
                      key={tag.id} 
                      className="flex items-center justify-between p-3 rounded-md bg-white border border-base-300/50 hover:border-base-300 transition-all"
                    >
                      {editingTagId === tag.id ? (
                        <div className="flex flex-col w-full space-y-2">
                          <input
                            type="text"
                            value={editTagName}
                            onChange={(e) => setEditTagName(e.target.value)}
                            className="input input-sm w-full bg-white border-base-300 text-base-content"
                            placeholder="Nome da tag"
                          />
                          <div className="flex space-x-2">
                            <input
                              type="color"
                              value={editTagColor}
                              onChange={(e) => setEditTagColor(e.target.value)}
                              className="w-8 h-8 rounded cursor-pointer"
                            />
                            <select
                              value={editTagType}
                              onChange={(e) => setEditTagType(e.target.value as any)}
                              className="select select-sm bg-white border-base-300 text-base-content flex-1"
                            >
                              <option value="project">Projeto</option>
                              <option value="context">Contexto</option>
                              <option value="lifearea">Área de Vida</option>
                            </select>
                          </div>
                          <div className="flex justify-end space-x-2 mt-2">
                            <button
                              onClick={handleCancelEdit}
                              className="btn btn-sm btn-ghost text-base-content"
                            >
                              <X size={16} />
                            </button>
                            <button
                              onClick={handleSaveEdit}
                              className="btn btn-sm btn-primary text-white hover:bg-primary/90"
                            >
                              <Check size={16} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center space-x-2">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: tag.color }}
                            />
                            <span className="text-base-content">{tag.name}</span>
                          </div>
                          <div className="flex space-x-1">
                            <button
                              onClick={() => handleEditClick(tag)}
                              className="btn btn-xs btn-ghost text-base-content/70 hover:text-primary"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteTag(tag.id)}
                              className="btn btn-xs btn-ghost text-base-content/70 hover:text-error"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-base-content/60 italic">
                  Nenhuma tag deste tipo foi criada ainda.
                </div>
              )}
              
              {/* Add Tag Button */}
              {!isAddingTag && (
                <button
                  onClick={() => {
                    setIsAddingTag(true);
                    setNewTagType(type);
                  }}
                  className="btn btn-sm mt-4 bg-white border-base-300 text-base-content hover:bg-base-200 w-full"
                >
                  <Plus size={16} />
                  Adicionar {type === 'project' ? 'Projeto' : type === 'context' ? 'Contexto' : 'Área de Vida'}
                </button>
              )}
            </div>
          )}
        </div>
      ))}
      
      {/* Add Tag Form */}
      {isAddingTag && (
        <div className="mt-6 p-4 rounded-lg bg-white border border-base-300 shadow-md">
          <h3 className="text-lg font-medium mb-4 text-primary">Nova Tag</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-base-content mb-1">Nome</label>
              <input
                type="text"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                className="input w-full bg-white border-base-300 text-base-content"
                placeholder="Nome da tag"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-base-content mb-1">Cor</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={newTagColor}
                    onChange={(e) => setNewTagColor(e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={newTagColor}
                    onChange={(e) => setNewTagColor(e.target.value)}
                    className="input flex-1 bg-white border-base-300 text-base-content"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-base-content mb-1">Tipo</label>
                <select
                  value={newTagType}
                  onChange={(e) => setNewTagType(e.target.value as any)}
                  className="select w-full bg-white border-base-300 text-base-content"
                >
                  <option value="project">Projeto</option>
                  <option value="context">Contexto</option>
                  <option value="lifearea">Área de Vida</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-2">
              <button
                onClick={() => setIsAddingTag(false)}
                className="btn btn-outline border-base-300 text-base-content hover:bg-base-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddTag}
                className="btn btn-primary text-white hover:bg-primary/90"
                disabled={!newTagName.trim()}
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TagManager;
