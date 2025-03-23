import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Check, Plus, X, Tag, ChevronDown } from 'lucide-react';
import { useTags } from '@/contexts/TagContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TagSelectorProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  filterType?: 'project' | 'context' | 'lifearea' | 'all';
  isDarkMode?: boolean;
}

const TagSelector: React.FC<TagSelectorProps> = ({
  selectedTags,
  onTagsChange,
  filterType = 'all',
  isDarkMode = false,
}) => {
  const { tags, addTag } = useTags();
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#ff79c6');
  const [newTagType, setNewTagType] = useState<'project' | 'context' | 'lifearea'>('project');

  // Filter tags based on the filterType prop
  const filteredTags = filterType === 'all' 
    ? tags 
    : tags.filter(tag => tag.type === filterType);

  const handleTagToggle = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      onTagsChange(selectedTags.filter(id => id !== tagId));
    } else {
      onTagsChange([...selectedTags, tagId]);
    }
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

  const getTagTypeLabel = (type: string) => {
    switch (type) {
      case 'project': return 'Projeto';
      case 'context': return 'Contexto';
      case 'lifearea': return 'Área de Vida';
      default: return type;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {filteredTags.map(tag => (
          <Badge
            key={tag.id}
            className={`cursor-pointer flex items-center gap-1.5 px-3 py-1.5 transition-all hover:shadow-sm ${
              selectedTags.includes(tag.id) 
                ? 'opacity-100 ring-1 ring-offset-2 ring-offset-background' 
                : 'opacity-70 hover:opacity-90'
            }`}
            style={{ 
              backgroundColor: selectedTags.includes(tag.id) ? tag.color : `${tag.color}20`,
              color: selectedTags.includes(tag.id) ? '#fff' : tag.color,
              borderColor: tag.color,
              borderWidth: '1px',
              boxShadow: selectedTags.includes(tag.id) ? `0 0 0 1px ${tag.color}80` : 'none'
            }}
            onClick={() => handleTagToggle(tag.id)}
          >
            {selectedTags.includes(tag.id) && (
              <Check className="w-3 h-3" />
            )}
            <span>{tag.name}</span>
            <span 
              className="text-[10px] ml-0.5 px-1 rounded bg-black/20 backdrop-blur-sm" 
              title={getTagTypeLabel(tag.type)}
            >
              {tag.type.charAt(0).toUpperCase()}
            </span>
          </Badge>
        ))}
        <Button
          variant="outline" 
          size="sm"
          className={`flex items-center gap-1 h-8 ${
            isDarkMode 
              ? 'bg-gray-800/70 hover:bg-gray-700 border-gray-700' 
              : 'bg-gray-100/80 hover:bg-gray-200 border-gray-200'
          }`}
          onClick={() => setIsAddingTag(true)}
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="text-xs">Adicionar Tag</span>
        </Button>
      </div>

      {isAddingTag && (
        <div 
          className={`p-4 rounded-lg border shadow-sm animate-in slide-in-from-top-2 fade-in-50 ${
            isDarkMode 
              ? 'bg-gray-800/80 border-gray-700' 
              : 'bg-gray-50/90 border-gray-200'
          }`}
        >
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium text-sm flex items-center gap-1.5">
              <Tag className="w-4 h-4" />
              Nova Tag
            </h4>
            <button 
              onClick={() => setIsAddingTag(false)}
              className={`text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
              }`}
              aria-label="Fechar"
            >
              <X size={16} />
            </button>
          </div>
          <div className="space-y-3">
            <div>
              <Label htmlFor="tag-name" className="text-xs font-medium mb-1.5 block">
                Nome
              </Label>
              <Input
                id="tag-name"
                type="text"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                className={`w-full py-1.5 text-sm ${
                  isDarkMode 
                    ? 'bg-gray-700/80 border-gray-600' 
                    : 'bg-white border-gray-300'
                }`}
                placeholder="Nome da tag"
              />
            </div>
            <div>
              <Label htmlFor="tag-color" className="text-xs font-medium mb-1.5 block">
                Cor
              </Label>
              <div className="flex gap-2">
                <Input
                  id="tag-color"
                  type="color"
                  value={newTagColor}
                  onChange={(e) => setNewTagColor(e.target.value)}
                  className="w-20 h-8 p-0.5 rounded cursor-pointer border"
                />
                <div 
                  className="flex-1 rounded flex items-center justify-center text-xs font-medium"
                  style={{ 
                    backgroundColor: newTagColor,
                    color: '#fff'
                  }}
                >
                  Pré-visualização
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="tag-type" className="text-xs font-medium mb-1.5 block">
                Tipo
              </Label>
              <div className="relative">
                <select
                  id="tag-type"
                  value={newTagType}
                  onChange={(e) => setNewTagType(e.target.value as 'project' | 'context' | 'lifearea')}
                  className={`w-full py-1.5 px-3 appearance-none rounded-md border text-sm ${
                    isDarkMode 
                      ? 'bg-gray-700/80 border-gray-600' 
                      : 'bg-white border-gray-300'
                  }`}
                  style={{ paddingRight: '2.5rem' }}
                  aria-label="Tipo de tag"
                  title="Selecione o tipo da tag"
                >
                  <option value="project">Projeto</option>
                  <option value="context">Contexto</option>
                  <option value="lifearea">Área de Vida</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none text-gray-400" />
              </div>
            </div>
            <Button
              onClick={handleAddTag}
              className={`w-full py-1.5 mt-1 text-sm font-medium ${
                newTagName.trim() 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white' 
                  : 'bg-gray-500 text-gray-300 cursor-not-allowed opacity-50'
              }`}
              disabled={!newTagName.trim()}
            >
              Adicionar Tag
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TagSelector;