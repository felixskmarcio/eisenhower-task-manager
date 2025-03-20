import React from 'react';
import { X } from 'lucide-react';
import TagSelector from './TagSelector';

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: {
    id: string;
    title: string;
    description: string;
    urgency: number;
    importance: number;
    completed: boolean;
    tags?: string[];
  };
  onSave: (task: {
    id: string;
    title: string;
    description: string;
    urgency: number;
    importance: number;
    completed: boolean;
    tags?: string[];
  }) => void;
  isDarkMode: boolean;
}

const EditTaskModal = ({ 
  isOpen, 
  onClose, 
  task,
  onSave, 
  isDarkMode 
}: EditTaskModalProps) => {
  const [editedTask, setEditedTask] = React.useState(task);

  if (!isOpen) return null;
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-all duration-300 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className={`p-8 rounded-xl shadow-2xl max-w-md w-full transform transition-all duration-300
        border backdrop-filter backdrop-blur-md
        ${isDarkMode 
          ? 'bg-gray-900 bg-opacity-95 text-white border-gray-700' 
          : 'bg-white bg-opacity-95 text-black border-gray-200'}`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-600">
            Editar Tarefa
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Título da Tarefa</label>
            <input 
              type="text"
              placeholder="Digite o título da tarefa"
              value={editedTask.title}
              onChange={(e) => setEditedTask({...editedTask, title: e.target.value})}
              className={`w-full p-3 rounded-lg border focus:ring-2 focus:outline-none transition-all
              ${isDarkMode 
                ? 'bg-gray-800 border-gray-700 focus:ring-blue-500 focus:border-blue-500 text-white' 
                : 'bg-gray-50 border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-black'}`}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Descrição (Opcional)</label>
            <textarea 
              placeholder="Detalhes da tarefa..."
              value={editedTask.description}
              onChange={(e) => setEditedTask({...editedTask, description: e.target.value})}
              className={`w-full p-3 rounded-lg border focus:ring-2 focus:outline-none transition-all h-24 resize-none
              ${isDarkMode 
                ? 'bg-gray-800 border-gray-700 focus:ring-blue-500 focus:border-blue-500 text-white' 
                : 'bg-gray-50 border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-black'}`}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Tags</label>
            <TagSelector
              selectedTags={editedTask.tags || []}
              onTagsChange={(tags) => setEditedTask({...editedTask, tags})}
              isDarkMode={isDarkMode}
            />
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium">Urgência</label>
              <span className={`px-3 py-1 rounded-full text-xs font-medium
                ${editedTask.urgency > 7 
                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white' 
                  : editedTask.urgency > 4 
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black' 
                    : 'bg-gradient-to-r from-green-500 to-green-600 text-white'}`}>
                {editedTask.urgency}/10
              </span>
            </div>
            <input 
              type="range"
              min="1"
              max="10"
              value={editedTask.urgency}
              onChange={(e) => setEditedTask({...editedTask, urgency: parseInt(e.target.value)})}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium">Importância</label>
              <span className={`px-3 py-1 rounded-full text-xs font-medium
                ${editedTask.importance > 7 
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white' 
                  : editedTask.importance > 4 
                    ? 'bg-gradient-to-r from-blue-400 to-blue-500 text-white' 
                    : 'bg-gradient-to-r from-green-500 to-green-600 text-white'}`}>
                {editedTask.importance}/10
              </span>
            </div>
            <input 
              type="range"
              min="1"
              max="10"
              value={editedTask.importance}
              onChange={(e) => setEditedTask({...editedTask, importance: parseInt(e.target.value)})}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="flex justify-end space-x-4 mt-8">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-lg transition-colors
              ${isDarkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-black'}`}
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                onSave(editedTask);
                onClose();
              }}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTaskModal;