import React, { useState } from 'react';
import { X, Plus, AlertTriangle } from 'lucide-react';
import TagSelector from './TagSelector';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!newTask.title.trim()) return;
    
    setIsSubmitting(true);
    
    // Simulando um pequeno atraso para feedback visual
    setTimeout(() => {
      onAddTask();
      setIsSubmitting(false);
    }, 300);
  };

  const getUrgencyColor = (value: number) => {
    if (value > 7) return 'from-red-500 to-red-600';
    if (value > 4) return 'from-yellow-400 to-yellow-500';
    return 'from-green-500 to-green-600';
  };

  const getImportanceColor = (value: number) => {
    if (value > 7) return 'from-blue-500 to-blue-600';
    if (value > 4) return 'from-indigo-400 to-indigo-500';
    return 'from-purple-500 to-purple-600';
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 transition-all duration-300 backdrop-blur-sm animate-in fade-in"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className={`max-w-md w-full transform transition-all duration-300 animate-in slide-in-from-bottom-5 zoom-in-95
          rounded-xl shadow-2xl border backdrop-filter backdrop-blur-md overflow-hidden
          ${isDarkMode 
            ? 'bg-gray-900/95 text-gray-100 border-gray-700' 
            : 'bg-white/95 text-black border-gray-200'}`}
      >
        {/* Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-90 h-16"></div>
          <div className="relative px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">
              Nova Tarefa
            </h2>
            <button 
              onClick={onClose} 
              className="text-white/80 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/10"
              aria-label="Fechar"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-5">
          <div>
            <Label htmlFor="title" className="text-sm font-medium mb-1.5 block">
              Título da Tarefa
            </Label>
            <Input
              id="title"
              type="text" 
              placeholder="Digite o título da tarefa" 
              value={newTask.title} 
              onChange={e => setNewTask({
                ...newTask,
                title: e.target.value
              })}
              className={`w-full transition-all
                ${isDarkMode 
                  ? 'bg-gray-800/70 border-gray-600 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400' 
                  : 'bg-gray-50 border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-black'}`} 
            />
            {!newTask.title.trim() && (
              <p className="text-amber-500 text-xs flex items-center gap-1 mt-1.5">
                <AlertTriangle size={12} />
                Título é obrigatório
              </p>
            )}
          </div>
          
          <div>
            <Label htmlFor="description" className="text-sm font-medium mb-1.5 block">
              Descrição (Opcional)
            </Label>
            <Textarea
              id="description"
              placeholder="Detalhes da tarefa..." 
              value={newTask.description || ''} 
              onChange={e => setNewTask({
                ...newTask,
                description: e.target.value
              })}
              className={`w-full resize-none min-h-[100px] transition-all
                ${isDarkMode 
                  ? 'bg-gray-800/70 border-gray-600 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400' 
                  : 'bg-gray-50 border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-black'}`} 
            />
          </div>

          <div>
            <Label className="text-sm font-medium mb-1.5 block">
              Tags
            </Label>
            <TagSelector 
              selectedTags={newTask.tags || []} 
              onTagsChange={tags => setNewTask({
                ...newTask,
                tags
              })} 
              isDarkMode={isDarkMode} 
            />
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <Label className="text-sm font-medium">
                Urgência
              </Label>
              <span 
                className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm bg-gradient-to-r ${getUrgencyColor(newTask.urgency)} ${newTask.urgency > 4 ? 'text-white' : 'text-black'}`}
              >
                {newTask.urgency}/10
              </span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="10" 
              value={newTask.urgency} 
              onChange={e => setNewTask({
                ...newTask,
                urgency: Number(e.target.value)
              })}
              className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${isDarkMode ? 'accent-blue-500 bg-gray-700' : 'accent-blue-600 bg-gray-300'}`}
              title="Nível de urgência da tarefa" 
              aria-label="Urgência"
              id="urgency-slider"
            />
            <div className={`flex justify-between text-xs mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <span>Baixa</span>
              <span>Média</span>
              <span>Alta</span>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <Label className="text-sm font-medium">
                Importância
              </Label>
              <span 
                className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm bg-gradient-to-r ${getImportanceColor(newTask.importance)} text-white`}
              >
                {newTask.importance}/10
              </span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="10" 
              value={newTask.importance} 
              onChange={e => setNewTask({
                ...newTask,
                importance: Number(e.target.value)
              })}
              className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${isDarkMode ? 'accent-blue-500 bg-gray-700' : 'accent-blue-600 bg-gray-300'}`}
              title="Nível de importância da tarefa"
              aria-label="Importância"
              id="importance-slider"
            />
            <div className={`flex justify-between text-xs mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <span>Baixa</span>
              <span>Média</span>
              <span>Alta</span>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className={`p-6 ${isDarkMode ? 'border-t border-gray-800' : 'border-t border-gray-200'}`}>
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={onClose}
              className={isDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-200' : ''}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!newTask.title.trim() || isSubmitting}
              className={`bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white ${isSubmitting ? 'opacity-80' : ''}`}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adicionando...
                </div>
              ) : 'Adicionar'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTaskModal;