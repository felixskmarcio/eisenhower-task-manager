import React from 'react';
import { X } from 'lucide-react';
import TagSelector from './TagSelector';
interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  newTask: {
    title: string;
    description?: string;
    urgency: number;
    importance: number;
    tags?: string[];
  };
  setNewTask: React.Dispatch<React.SetStateAction<{
    title: string;
    description?: string;
    urgency: number;
    importance: number;
    tags?: string[];
  }>>;
  onAddTask: () => void;
  isDarkMode: boolean;
}
const AddTaskModal = ({
  isOpen,
  onClose,
  newTask,
  setNewTask,
  onAddTask,
  isDarkMode
}: AddTaskModalProps) => {
  if (!isOpen) return null;
  return <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-all duration-300 backdrop-blur-sm" onClick={e => {
    if (e.target === e.currentTarget) onClose();
  }}>
      <div className={`p-8 rounded-xl shadow-2xl max-w-md w-full transform transition-all duration-300
        border backdrop-filter backdrop-blur-md
        ${isDarkMode 
          ? 'bg-gray-900 bg-opacity-95 text-gray-100 border-gray-700' 
          : 'bg-white bg-opacity-95 text-black border-gray-200'}`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-600">
            Nova Tarefa
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-700">
            <X size={24} />
          </button>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-100">Título da Tarefa</label>
            <input type="text" placeholder="Digite o título da tarefa" value={newTask.title} onChange={e => setNewTask({
            ...newTask,
            title: e.target.value
          })} className={`w-full p-3 rounded-lg border focus:ring-2 focus:outline-none transition-all
              ${isDarkMode 
                ? 'bg-gray-800 border-gray-600 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400' 
                : 'bg-gray-50 border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-black'}`} />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-100">Descrição (Opcional)</label>
            <textarea placeholder="Detalhes da tarefa..." value={newTask.description || ''} onChange={e => setNewTask({
            ...newTask,
            description: e.target.value
          })} className={`w-full p-3 rounded-lg border focus:ring-2 focus:outline-none transition-all h-24 resize-none
              ${isDarkMode 
                ? 'bg-gray-800 border-gray-600 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400' 
                : 'bg-gray-50 border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-black'}`} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-100">Tags</label>
            <TagSelector selectedTags={newTask.tags || []} onTagsChange={tags => setNewTask({
            ...newTask,
            tags
          })} isDarkMode={isDarkMode} />
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-gray-100">Urgência</label>
              <span className={`px-3 py-1 rounded-full text-xs font-medium
                ${newTask.urgency > 7 ? 'bg-gradient-to-r from-red-500 to-red-600 text-white' : newTask.urgency > 4 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black' : 'bg-gradient-to-r from-green-500 to-green-600 text-white'}`}>
                {newTask.urgency}/10
              </span>
            </div>
            <input type="range" min="1" max="10" value={newTask.urgency} onChange={e => setNewTask({
            ...newTask,
            urgency: Number(e.target.value)
          })} className={`w-full h-2 rounded-lg appearance-none cursor-pointer accent-blue-500 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`} />
            <div className={`flex justify-between text-xs mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <span>Baixa</span>
              <span>Média</span>
              <span>Alta</span>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-gray-100">Importância</label>
              <span className={`px-3 py-1 rounded-full text-xs font-medium
                ${newTask.importance > 7 ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' : newTask.importance > 4 ? 'bg-gradient-to-r from-indigo-400 to-indigo-500 text-white' : 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'}`}>
                {newTask.importance}/10
              </span>
            </div>
            <input type="range" min="1" max="10" value={newTask.importance} onChange={e => setNewTask({
            ...newTask,
            importance: Number(e.target.value)
          })} className={`w-full h-2 rounded-lg appearance-none cursor-pointer accent-blue-500 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`} />
            <div className={`flex justify-between text-xs mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <span>Baixa</span>
              <span>Média</span>
              <span>Alta</span>
            </div>
          </div>
          
          <div className={`pt-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}>
            <div className="flex gap-3 justify-end">
              <button onClick={onClose} className="px-5 py-2.5 rounded-lg font-medium transition-colors
                bg-gray-700 hover:bg-gray-600 text-gray-200">
                Cancelar
              </button>
              <button onClick={onAddTask} disabled={!newTask.title.trim()} className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
                Adicionar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default AddTaskModal;