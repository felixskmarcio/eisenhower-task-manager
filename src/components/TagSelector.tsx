import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Check, Plus, X } from 'lucide-react';
import { useTags } from '@/contexts/TagContext';

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
  const [isAddingTag, setIsAddingTag] = React.useState(false);
  const [newTagName, setNewTagName] = React.useState('');
  const [newTagColor, setNewTagColor] = React.useState('#ff79c6');
  const [newTagType, setNewTagType] = React.useState<'project' | 'context' | 'lifearea'>('project');

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

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {filteredTags.map(tag => (
          <Badge
            key={tag.id}
            className={`cursor-pointer flex items-center gap-1 px-3 py-1 ${selectedTags.includes(tag.id) ? 'opacity-100' : 'opacity-70'}`}
            style={{ 
              backgroundColor: selectedTags.includes(tag.id) ? tag.color : 'transparent',
              color: selectedTags.includes(tag.id) ? '#fff' : tag.color,
              borderColor: tag.color,
              borderWidth: '1px'
            }}
            onClick={() => handleTagToggle(tag.id)}
          >
            {selectedTags.includes(tag.id) && <Check className="w-3 h-3" />}
            {tag.name}
            <span className="text-xs ml-1">({tag.type.charAt(0).toUpperCase()})</span>
          </Badge>
        ))}
        <Badge
          className={`cursor-pointer flex items-center gap-1 px-3 py-1 ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'}`}
          onClick={() => setIsAddingTag(true)}
        >
          <Plus className="w-3 h-3" />
          Adicionar Tag
        </Badge>
      </div>

      {isAddingTag && (
        <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium">Adicionar Nova Tag</h4>
            <button 
              onClick={() => setIsAddingTag(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Nome</label>
              <input 
                type="text"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                className={`w-full p-2 rounded-md border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                placeholder="Nome da tag"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Cor</label>
              <input 
                type="color"
                value={newTagColor}
                onChange={(e) => setNewTagColor(e.target.value)}
                className="w-full p-1 rounded-md border h-10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tipo</label>
              <select
                value={newTagType}
                onChange={(e) => setNewTagType(e.target.value as 'project' | 'context' | 'lifearea')}
                className={`w-full p-2 rounded-md border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
              >
                <option value="project">Projeto</option>
                <option value="context">Contexto</option>
                <option value="lifearea">Área de Vida</option>
              </select>
            </div>
            <button
              onClick={handleAddTag}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              disabled={!newTagName.trim()}
            >
              Adicionar Tag
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TagSelector;