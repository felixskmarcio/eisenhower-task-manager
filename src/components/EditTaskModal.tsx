import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, Save } from 'lucide-react';
import TagSelector from './TagSelector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

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
  const [editedTask, setEditedTask] = useState(task);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Atualizar o estado local quando a task de props mudar
  useEffect(() => {
    setEditedTask(task);
  }, [task]);

  if (!isOpen) return null;
  
  const handleSubmit = () => {
    if (!editedTask.title.trim()) return;
    
    setIsSubmitting(true);
    
    // Simulando um pequeno atraso para feedback visual
    setTimeout(() => {
      onSave(editedTask);
      setIsSubmitting(false);
      onClose();
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
      onClick={(e) => {
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
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-600 opacity-90 h-16"></div>
          <div className="relative px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">
              Editar Tarefa
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
            <Label htmlFor="edit-title" className="text-sm font-medium mb-1.5 block">
              Título da Tarefa
            </Label>
            <Input
              id="edit-title"
              type="text"
              placeholder="Digite o título da tarefa"
              value={editedTask.title}
              onChange={(e) => setEditedTask({...editedTask, title: e.target.value})}
              className={`w-full transition-all
                ${isDarkMode 
                  ? 'bg-gray-800/70 border-gray-600 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400' 
                  : 'bg-gray-50 border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-black'}`}
            />
            {!editedTask.title.trim() && (
              <p className="text-amber-500 text-xs flex items-center gap-1 mt-1.5">
                <AlertTriangle size={12} />
                Título é obrigatório
              </p>
            )}
          </div>
          
          <div>
            <Label htmlFor="edit-description" className="text-sm font-medium mb-1.5 block">
              Descrição (Opcional)
            </Label>
            <Textarea
              id="edit-description"
              placeholder="Detalhes da tarefa..."
              value={editedTask.description}
              onChange={(e) => setEditedTask({...editedTask, description: e.target.value})}
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
              selectedTags={editedTask.tags || []}
              onTagsChange={(tags) => setEditedTask({...editedTask, tags})}
              isDarkMode={isDarkMode}
            />
          </div>

          <div className="flex items-center space-x-2 mt-2 mb-4">
            <Switch
              id="task-completed"
              checked={editedTask.completed}
              onCheckedChange={(checked) => setEditedTask({...editedTask, completed: checked})}
            />
            <Label htmlFor="task-completed" className="text-sm font-medium cursor-pointer">
              Marcar como concluída
            </Label>
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <Label className="text-sm font-medium">
                Urgência
              </Label>
              <span 
                className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm bg-gradient-to-r ${getUrgencyColor(editedTask.urgency)} ${editedTask.urgency > 4 ? 'text-white' : 'text-black'}`}
              >
                {editedTask.urgency}/10
              </span>
            </div>
            <input 
              type="range"
              min="1"
              max="10"
              value={editedTask.urgency}
              onChange={(e) => setEditedTask({...editedTask, urgency: parseInt(e.target.value)})}
              className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${isDarkMode ? 'accent-blue-500 bg-gray-700' : 'accent-blue-600 bg-gray-300'}`}
              title="Nível de urgência da tarefa"
              aria-label="Urgência"
              id="urgency-slider-edit"
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
                className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm bg-gradient-to-r ${getImportanceColor(editedTask.importance)} text-white`}
              >
                {editedTask.importance}/10
              </span>
            </div>
            <input 
              type="range"
              min="1"
              max="10"
              value={editedTask.importance}
              onChange={(e) => setEditedTask({...editedTask, importance: parseInt(e.target.value)})}
              className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${isDarkMode ? 'accent-blue-500 bg-gray-700' : 'accent-blue-600 bg-gray-300'}`}
              title="Nível de importância da tarefa"
              aria-label="Importância"  
              id="importance-slider-edit"
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
              disabled={!editedTask.title.trim() || isSubmitting}
              className={`bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white ${isSubmitting ? 'opacity-80' : ''}`}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Salvando...
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Save className="h-4 w-4" />
                  Salvar
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTaskModal;