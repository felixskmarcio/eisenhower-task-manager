
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Check, Plus, X, Tag, ChevronDown } from 'lucide-react';
import { useTags } from '@/contexts/TagContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/utils/classNames';

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
  const [newTagColor, setNewTagColor] = useState('#8B5CF6'); // Cor inicial melhorada para roxo vibrante
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

  // Array de cores vibrantes para pré-seleção ao criar tags
  const colorPresets = [
    '#8B5CF6', // Roxo vibrante
    '#D946EF', // Rosa magenta
    '#F97316', // Laranja vivo
    '#0EA5E9', // Azul oceano
    '#10B981', // Verde esmeralda
    '#EAB308', // Amarelo âmbar
    '#EC4899', // Rosa forte
    '#6366F1', // Índigo
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {filteredTags.map(tag => (
          <Badge
            key={tag.id}
            className={cn(
              "cursor-pointer flex items-center gap-1.5 px-3 py-1.5 transition-all hover:shadow-md",
              selectedTags.includes(tag.id) 
                ? "opacity-100 ring-2 ring-offset-1" 
                : "opacity-80 hover:opacity-100"
            )}
            style={{ 
              backgroundColor: selectedTags.includes(tag.id) ? tag.color : `${tag.color}15`,
              color: selectedTags.includes(tag.id) ? isDarkMode ? '#fff' : getContrastColor(tag.color) : tag.color,
              borderColor: tag.color,
              borderWidth: '1px',
              boxShadow: selectedTags.includes(tag.id) ? `0 0 0 1px ${tag.color}40` : 'none'
            }}
            onClick={() => handleTagToggle(tag.id)}
          >
            {selectedTags.includes(tag.id) && (
              <Check className="w-3 h-3" />
            )}
            <span className="font-medium">{tag.name}</span>
            <span 
              className="text-[10px] ml-0.5 px-1.5 py-0.5 rounded-full bg-black/20 backdrop-blur-sm" 
              title={getTagTypeLabel(tag.type)}
              style={{
                backgroundColor: selectedTags.includes(tag.id) ? 'rgba(0,0,0,0.2)' : `${tag.color}20`,
                color: selectedTags.includes(tag.id) ? '#fff' : tag.color
              }}
            >
              {tag.type.charAt(0).toUpperCase()}
            </span>
          </Badge>
        ))}
        <Button
          variant="outline" 
          size="sm"
          className={cn(
            "flex items-center gap-1 h-8 transition-all duration-200 hover:shadow-sm",
            isDarkMode 
              ? "bg-gray-800/70 hover:bg-gray-700 border-gray-700" 
              : "bg-gray-100/80 hover:bg-gray-200 border-gray-200"
          )}
          onClick={() => setIsAddingTag(true)}
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="text-xs font-medium">Adicionar Tag</span>
        </Button>
      </div>

      {isAddingTag && (
        <div 
          className={cn(
            "p-4 rounded-lg border shadow-md animate-in slide-in-from-top-2 fade-in-50",
            isDarkMode 
              ? "bg-gray-800/90 border-gray-700" 
              : "bg-gray-50/95 border-gray-200"
          )}
        >
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium text-sm flex items-center gap-1.5">
              <Tag className="w-4 h-4" />
              Nova Tag
            </h4>
            <button 
              onClick={() => setIsAddingTag(false)}
              className={cn(
                "text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full",
                isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
              )}
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
                className={cn(
                  "w-full py-1.5 text-sm",
                  isDarkMode 
                    ? "bg-gray-700/80 border-gray-600" 
                    : "bg-white border-gray-300"
                )}
                placeholder="Nome da tag"
              />
            </div>
            <div>
              <Label htmlFor="tag-color" className="text-xs font-medium mb-1.5 block">
                Cor
              </Label>
              <div className="space-y-2">
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
                      color: getContrastColor(newTagColor)
                    }}
                  >
                    Pré-visualização
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {colorPresets.map(color => (
                    <button 
                      key={color} 
                      type="button"
                      onClick={() => setNewTagColor(color)}
                      className={cn(
                        "w-6 h-6 rounded-full transition-all",
                        newTagColor === color ? "ring-2 ring-offset-1 scale-110" : ""
                      )}
                      style={{ backgroundColor: color }}
                      title={`Selecionar cor ${color}`}
                    />
                  ))}
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
                  className={cn(
                    "w-full py-1.5 px-3 appearance-none rounded-md border text-sm",
                    isDarkMode 
                      ? "bg-gray-700/80 border-gray-600" 
                      : "bg-white border-gray-300"
                  )}
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
              className={cn(
                "w-full py-1.5 mt-1 text-sm font-medium",
                newTagName.trim() 
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-sm hover:shadow" 
                  : "bg-gray-500 text-gray-300 cursor-not-allowed opacity-50"
              )}
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

// Função para calcular se o texto deve ser branco ou preto com base na cor de fundo
// para garantir melhor legibilidade (contraste)
function getContrastColor(hexColor: string): string {
  // Remove o caractere # se estiver presente
  const color = hexColor.charAt(0) === '#' ? hexColor.substring(1) : hexColor;
  
  // Converte para RGB
  const r = parseInt(color.substr(0, 2), 16);
  const g = parseInt(color.substr(2, 2), 16);
  const b = parseInt(color.substr(4, 2), 16);
  
  // Calcula a luminosidade (fórmula YIQ)
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  
  // Retorna branco ou preto dependendo da luminosidade
  return yiq >= 150 ? '#000' : '#fff';
}

export default TagSelector;
