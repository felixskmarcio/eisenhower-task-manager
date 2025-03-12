
import React from 'react';
import { useTags } from '@/contexts/TagContext';

interface TagFilterSelectProps {
  type: 'project' | 'context' | 'lifearea';
  value: string | null;
  onChange: (value: string | null) => void;
}

const TagFilterSelect: React.FC<TagFilterSelectProps> = ({ type, value, onChange }) => {
  const { tags, getTagsByType } = useTags();
  
  // Get tags of the specified type
  const filteredTags = getTagsByType(type);
  
  // Generate a human-readable label for the filter type
  const getTypeLabel = () => {
    switch (type) {
      case 'project': return 'Projeto';
      case 'context': return 'Contexto';
      case 'lifearea': return 'Área de Vida';
      default: return type;
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">{getTypeLabel()}</label>
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value || null)}
        className="w-full p-2 rounded-lg bg-gray-800/50 border border-gray-700 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">Todos os {getTypeLabel()}s</option>
        {filteredTags.map(tag => (
          <option key={tag.id} value={tag.id}>
            {tag.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TagFilterSelect;
