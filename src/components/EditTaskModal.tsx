import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, X, Save, AlertTriangle, Calendar as CalendarIcon } from 'lucide-react';
import { TaskIcon } from '@/components/ui/task-icon';
import TagSelector from './TagSelector';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

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
    start_date?: Date | string | null;
    tags?: string[];
  };
  onSave: (task: {
    id: string;
    title: string;
    description: string;
    urgency: number;
    importance: number;
    completed: boolean;
    start_date?: Date | string | null;
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
  const [isTitleFocused, setIsTitleFocused] = useState(false);

  // Atualizar o estado local quando a task de props mudar
  useEffect(() => {
    // Garantir que a data de início seja um objeto Date se existir
    const updatedTask = { ...task };
    if (task.start_date && typeof task.start_date === 'string') {
      updatedTask.start_date = new Date(task.start_date);
    }
    setEditedTask(updatedTask);
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={`sm:max-w-[500px] ${isDarkMode ? 'bg-gray-900 text-gray-100 border-gray-700' : 'bg-white text-black border-gray-200'}`}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              Editar Tarefa
            </DialogTitle>
            <DialogDescription className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
              Modifique os detalhes da sua tarefa.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="edit-title" className="text-sm font-medium">
                  Título da Tarefa
                </Label>
                <TaskIcon name="sparkle" size={16} className="text-amber-400" />
              </div>
              <div className={`relative group ${isTitleFocused ? 'z-10' : ''}`}>
                <motion.div
                  className={`absolute -inset-0.5 rounded-lg blur opacity-80 group-hover:opacity-100 transition duration-500 ${
                    isTitleFocused 
                      ? 'bg-gradient-to-r from-purple-600 via-blue-500 to-amber-400' 
                      : 'bg-gradient-to-r from-transparent to-transparent'
                  }`}
                  animate={{
                    background: isTitleFocused 
                      ? 'linear-gradient(90deg, rgb(147, 51, 234) 0%, rgb(59, 130, 246) 50%, rgb(251, 191, 36) 100%)' 
                      : 'linear-gradient(90deg, transparent, transparent)'
                  }}
                  transition={{ duration: 0.3 }}
                ></motion.div>
                <Input
                  id="edit-title"
                  type="text"
                  placeholder="Edite seu título envolvente..."
                  value={editedTask.title}
                  onChange={(e) => setEditedTask({...editedTask, title: e.target.value})}
                  onFocus={() => setIsTitleFocused(true)}
                  onBlur={() => setIsTitleFocused(false)}
                  className={`w-full transition-all relative ${
                    isDarkMode 
                      ? 'bg-gray-800/70 border-gray-600 focus:ring-transparent focus:border-transparent text-white placeholder-gray-400' 
                      : 'bg-gray-50 border-gray-300 focus:ring-transparent focus:border-transparent text-black'
                  } z-10 backdrop-blur-sm`}
                />
              </div>
              {!editedTask.title.trim() && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-amber-500 text-xs flex items-center gap-1 mt-1.5"
                >
                  <AlertTriangle size={12} />
                  Título é obrigatório
                </motion.p>
              )}
              {editedTask.title.trim() && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`mt-2 px-2 py-1 rounded-md ${
                    isDarkMode 
                      ? 'bg-gradient-to-r from-indigo-900/20 to-blue-900/20 border-blue-800/30' 
                      : 'bg-gradient-to-r from-indigo-50 to-blue-50 border border-blue-100'
                  }`}
                >
                  <p className={`text-xs task-title-gradient ${
                    editedTask.urgency > 7 
                      ? 'task-title-high-priority' 
                      : editedTask.urgency > 4 
                      ? 'task-title-medium-priority' 
                      : 'task-title-low-priority'
                    } font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Preview: {editedTask.title}
                  </p>
                </motion.div>
              )}
            </div>
          
            <div className="grid gap-2">
              <Label htmlFor="edit-description" className="text-sm font-medium">
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

            <div className="flex items-center justify-between">
              <Label htmlFor="edit-completed" className="text-sm font-medium flex items-center gap-2">
                <TaskIcon name="complete" size={16} className={editedTask.completed ? "text-green-500" : "text-gray-400"} />
                Concluída
              </Label>
              <Switch
                id="edit-completed"
                checked={editedTask.completed}
                onCheckedChange={(checked) => setEditedTask({...editedTask, completed: checked})}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-start-date" className="text-sm font-medium">
                Data de Início (Opcional)
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="edit-start-date"
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${
                      !editedTask.start_date && "text-muted-foreground"
                    } ${isDarkMode 
                      ? 'bg-gray-800/70 border-gray-600 focus:ring-blue-500 focus:border-blue-500 hover:bg-gray-700' 
                      : 'bg-gray-50 border-gray-300 focus:ring-blue-500 focus:border-blue-500 hover:bg-gray-100'}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {editedTask.start_date ? (
                      format(new Date(editedTask.start_date), "PPP", { locale: ptBR })
                    ) : (
                      <span>Selecione uma data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={editedTask.start_date ? new Date(editedTask.start_date) : undefined}
                    onSelect={(date) => setEditedTask({...editedTask, start_date: date})}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {editedTask.start_date && (
                <div className="flex justify-end mt-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs h-7 px-2"
                    onClick={() => setEditedTask({...editedTask, start_date: null})}
                  >
                    Limpar data
                  </Button>
                </div>
              )}
            </div>

            <motion.div 
              className="grid gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center justify-between">
                <Label htmlFor="edit-urgency" className="text-sm font-medium">
                  Urgência
                </Label>
                <div className="flex items-center gap-1">
                  <TaskIcon name="urgent" size={14} className={
                    editedTask.urgency > 7 
                      ? 'text-red-500' 
                      : editedTask.urgency > 4 
                      ? 'text-yellow-500' 
                      : 'text-green-500'
                  } />
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold 
                    ${editedTask.urgency > 7 
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' 
                      : editedTask.urgency > 4 
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' 
                      : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'}`}
                  >
                    {editedTask.urgency}/10
                  </span>
                </div>
              </div>
              <div className="px-1 pt-2">
                <Slider
                  id="edit-urgency"
                  min={1}
                  max={10}
                  step={1}
                  value={[editedTask.urgency]}
                  onValueChange={(value) => setEditedTask({...editedTask, urgency: value[0]})}
                  className="py-1"
                />
                <div className="w-full flex justify-between mt-1 text-xs text-muted-foreground">
                  <span>Baixa</span>
                  <span>Média</span>
                  <span>Alta</span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="grid gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between">
                <Label htmlFor="edit-importance" className="text-sm font-medium">
                  Importância
                </Label>
                <div className="flex items-center gap-1">
                  <TaskIcon name="important" size={14} className={
                    editedTask.importance > 7 
                      ? 'text-blue-500' 
                      : editedTask.importance > 4 
                      ? 'text-indigo-500' 
                      : 'text-purple-500'
                  } />
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold 
                    ${editedTask.importance > 7 
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' 
                      : editedTask.importance > 4 
                      ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300' 
                      : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'}`}
                  >
                    {editedTask.importance}/10
                  </span>
                </div>
              </div>
              <div className="px-1 pt-2">
                <Slider
                  id="edit-importance"
                  min={1}
                  max={10}
                  step={1}
                  value={[editedTask.importance]}
                  onValueChange={(value) => setEditedTask({...editedTask, importance: value[0]})}
                  className="py-1"
                />
                <div className="w-full flex justify-between mt-1 text-xs text-muted-foreground">
                  <span>Baixa</span>
                  <span>Média</span>
                  <span>Alta</span>
                </div>
              </div>
            </motion.div>

            <div className="grid gap-2">
              <Label className="text-sm font-medium">Tags</Label>
              <div className="flex items-center gap-2 mb-2">
                <TaskIcon name="tag" size={14} className="text-gray-500" />
                <span className="text-xs text-muted-foreground">Selecione as tags para categorizar sua tarefa</span>
              </div>
              <TagSelector 
                selectedTags={editedTask.tags || []} 
                onTagsChange={(tags) => setEditedTask({...editedTask, tags})}
                isDarkMode={isDarkMode}
              />
            </div>
          </div>

          <DialogFooter className="flex justify-between sm:justify-between pt-2">
            <Button 
              variant="destructive" 
              onClick={() => {
                const confirmDelete = window.confirm('Tem certeza que deseja excluir esta tarefa?');
                if (confirmDelete) onClose();
              }}
              className="flex items-center gap-1"
            >
              <Trash2 className="h-4 w-4" />
              <span>Excluir</span>
            </Button>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={onClose}
                className={isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={!editedTask.title.trim() || isSubmitting}
                className={`${isSubmitting ? 'opacity-70' : ''} bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700`}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-1">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span>Salvando...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <Save className="h-4 w-4" />
                    <span>Salvar</span>
                  </div>
                )}
              </Button>
            </div>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default EditTaskModal;