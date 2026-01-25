import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, X, Save, AlertTriangle, Calendar as CalendarIcon, Zap, Star, Target, Clock, FileText, Tag as TagIcon, CheckCircle2 } from 'lucide-react';
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
    start_date?: string | Date | null;
    tags?: string[];
  };
  onSave: (task: {
    id: string;
    title: string;
    description: string;
    urgency: number;
    importance: number;
    completed: boolean;
    start_date?: string | Date | null;
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

  useEffect(() => {
    setEditedTask(task);
  }, [task]);

  if (!isOpen) return null;
  
  const handleSubmit = () => {
    if (!editedTask.title.trim()) return;
    
    setIsSubmitting(true);
    
    setTimeout(() => {
      onSave(editedTask);
      setIsSubmitting(false);
      onClose();
    }, 300);
  };

  const getQuadrantInfo = () => {
    const isUrgent = editedTask.urgency > 5;
    const isImportant = editedTask.importance > 5;
    
    if (isUrgent && isImportant) return { name: 'Fazer Agora', color: 'from-red-500 to-rose-600', icon: Zap, bg: 'bg-red-500/10' };
    if (!isUrgent && isImportant) return { name: 'Agendar', color: 'from-blue-500 to-indigo-600', icon: Clock, bg: 'bg-blue-500/10' };
    if (isUrgent && !isImportant) return { name: 'Delegar', color: 'from-amber-500 to-orange-600', icon: Target, bg: 'bg-amber-500/10' };
    return { name: 'Eliminar', color: 'from-gray-400 to-gray-600', icon: X, bg: 'bg-gray-500/10' };
  };

  const quadrant = getQuadrantInfo();
  const QuadrantIcon = quadrant.icon;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={`sm:max-w-[520px] max-h-[90vh] overflow-y-auto ${isDarkMode ? 'bg-gray-900/95 text-gray-100 border-gray-700/50 backdrop-blur-xl' : 'bg-white/95 text-gray-900 border-gray-200/50 backdrop-blur-xl'}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <DialogHeader className="pb-4 border-b border-gray-700/30">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                  Editar Tarefa
                </DialogTitle>
                <DialogDescription className={`mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Atualize os detalhes da sua tarefa
                </DialogDescription>
              </div>
              <motion.div 
                className={`px-3 py-1.5 rounded-full flex items-center gap-2 ${quadrant.bg}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring' }}
              >
                <QuadrantIcon className={`h-4 w-4 bg-gradient-to-r ${quadrant.color} bg-clip-text`} style={{ color: quadrant.color.includes('red') ? '#ef4444' : quadrant.color.includes('blue') ? '#3b82f6' : quadrant.color.includes('amber') ? '#f59e0b' : '#9ca3af' }} />
                <span className={`text-xs font-semibold bg-gradient-to-r ${quadrant.color} bg-clip-text text-transparent`}>
                  {quadrant.name}
                </span>
              </motion.div>
            </div>
          </DialogHeader>

          <div className="space-y-5 py-5">
            <motion.div 
              className={`rounded-xl p-4 ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-4 w-4 text-violet-400" />
                <Label className="text-sm font-semibold text-violet-400">Informações Básicas</Label>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-title" className="text-xs text-gray-400 mb-1.5 block">
                    Título da Tarefa *
                  </Label>
                  <Input
                    id="edit-title"
                    type="text"
                    placeholder="Digite o título da tarefa..."
                    value={editedTask.title}
                    onChange={(e) => setEditedTask({...editedTask, title: e.target.value})}
                    className={`w-full h-11 text-base font-medium transition-all ${
                      isDarkMode 
                        ? 'bg-gray-900/70 border-gray-600/50 focus:ring-violet-500/50 focus:border-violet-500/50 text-white placeholder-gray-500' 
                        : 'bg-white border-gray-200 focus:ring-violet-500/50 focus:border-violet-500/50'
                    }`}
                  />
                  {!editedTask.title.trim() && (
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-400 text-xs flex items-center gap-1 mt-1.5"
                    >
                      <AlertTriangle size={12} />
                      O título é obrigatório
                    </motion.p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="edit-description" className="text-xs text-gray-400 mb-1.5 block">
                    Descrição
                  </Label>
                  <Textarea
                    id="edit-description"
                    placeholder="Adicione detalhes sobre a tarefa..."
                    value={editedTask.description}
                    onChange={(e) => setEditedTask({...editedTask, description: e.target.value})}
                    className={`w-full resize-none min-h-[80px] transition-all ${
                      isDarkMode 
                        ? 'bg-gray-900/70 border-gray-600/50 focus:ring-violet-500/50 focus:border-violet-500/50 text-white placeholder-gray-500' 
                        : 'bg-white border-gray-200 focus:ring-violet-500/50 focus:border-violet-500/50'
                    }`}
                  />
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
              <motion.div 
                className={`rounded-xl p-4 ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <CalendarIcon className="h-4 w-4 text-blue-400" />
                  <Label className="text-sm font-semibold text-blue-400">Data</Label>
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal h-10 ${
                        !editedTask.start_date && "text-gray-500"
                      } ${isDarkMode 
                        ? 'bg-gray-900/70 border-gray-600/50 hover:bg-gray-800' 
                        : 'bg-white border-gray-200 hover:bg-gray-100'}`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-blue-400" />
                      {editedTask.start_date ? (
                        <span className="truncate">{format(new Date(editedTask.start_date), "dd MMM yyyy", { locale: ptBR })}</span>
                      ) : (
                        <span>Selecionar</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={editedTask.start_date ? new Date(editedTask.start_date) : undefined}
                      onSelect={(date) => setEditedTask({...editedTask, start_date: date ? date.toISOString() : null})}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {editedTask.start_date && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs h-6 px-2 mt-2 text-gray-400 hover:text-gray-300"
                    onClick={() => setEditedTask({...editedTask, start_date: null})}
                  >
                    Limpar
                  </Button>
                )}
              </motion.div>

              <motion.div 
                className={`rounded-xl p-4 ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <Label className="text-sm font-semibold text-emerald-400">Status</Label>
                </div>
                <div className={`flex items-center justify-between p-3 rounded-lg ${isDarkMode ? 'bg-gray-900/70' : 'bg-white'}`}>
                  <span className={`text-sm ${editedTask.completed ? 'text-emerald-400' : 'text-gray-400'}`}>
                    {editedTask.completed ? 'Concluída' : 'Pendente'}
                  </span>
                  <Switch
                    checked={editedTask.completed}
                    onCheckedChange={(checked) => setEditedTask({...editedTask, completed: checked})}
                    className="data-[state=checked]:bg-emerald-500"
                  />
                </div>
              </motion.div>
            </div>

            <motion.div 
              className={`rounded-xl p-4 ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Target className="h-4 w-4 text-orange-400" />
                <Label className="text-sm font-semibold text-orange-400">Prioridade</Label>
              </div>
              
              <div className="space-y-5">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Zap className={`h-4 w-4 ${
                        editedTask.urgency > 7 ? 'text-red-400' : 
                        editedTask.urgency > 4 ? 'text-amber-400' : 'text-green-400'
                      }`} />
                      <span className="text-sm font-medium">Urgência</span>
                    </div>
                    <div className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      editedTask.urgency > 7 
                        ? 'bg-red-500/20 text-red-400' 
                        : editedTask.urgency > 4 
                        ? 'bg-amber-500/20 text-amber-400' 
                        : 'bg-green-500/20 text-green-400'
                    }`}>
                      {editedTask.urgency}/10
                    </div>
                  </div>
                  <div className="relative">
                    <div className={`absolute inset-0 rounded-full h-2 top-1/2 -translate-y-1/2 ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                    }`} />
                    <div 
                      className="absolute h-2 rounded-full top-1/2 -translate-y-1/2 transition-all duration-300"
                      style={{ 
                        width: `${editedTask.urgency * 10}%`,
                        background: editedTask.urgency > 7 
                          ? 'linear-gradient(90deg, #f87171, #ef4444)' 
                          : editedTask.urgency > 4 
                          ? 'linear-gradient(90deg, #fbbf24, #f59e0b)' 
                          : 'linear-gradient(90deg, #4ade80, #22c55e)'
                      }}
                    />
                    <Slider
                      min={1}
                      max={10}
                      step={1}
                      value={[editedTask.urgency]}
                      onValueChange={(value) => setEditedTask({...editedTask, urgency: value[0]})}
                      className="relative z-10 [&_[role=slider]]:h-5 [&_[role=slider]]:w-5 [&_[role=slider]]:border-2 [&_[role=slider]]:border-white [&_[role=slider]]:shadow-lg"
                    />
                  </div>
                  <div className="flex justify-between mt-1 text-[10px] text-gray-500">
                    <span>Baixa</span>
                    <span>Alta</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Star className={`h-4 w-4 ${
                        editedTask.importance > 7 ? 'text-violet-400' : 
                        editedTask.importance > 4 ? 'text-blue-400' : 'text-indigo-400'
                      }`} />
                      <span className="text-sm font-medium">Importância</span>
                    </div>
                    <div className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      editedTask.importance > 7 
                        ? 'bg-violet-500/20 text-violet-400' 
                        : editedTask.importance > 4 
                        ? 'bg-blue-500/20 text-blue-400' 
                        : 'bg-indigo-500/20 text-indigo-400'
                    }`}>
                      {editedTask.importance}/10
                    </div>
                  </div>
                  <div className="relative">
                    <div className={`absolute inset-0 rounded-full h-2 top-1/2 -translate-y-1/2 ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                    }`} />
                    <div 
                      className="absolute h-2 rounded-full top-1/2 -translate-y-1/2 transition-all duration-300"
                      style={{ 
                        width: `${editedTask.importance * 10}%`,
                        background: editedTask.importance > 7 
                          ? 'linear-gradient(90deg, #a78bfa, #8b5cf6)' 
                          : editedTask.importance > 4 
                          ? 'linear-gradient(90deg, #60a5fa, #3b82f6)' 
                          : 'linear-gradient(90deg, #818cf8, #6366f1)'
                      }}
                    />
                    <Slider
                      min={1}
                      max={10}
                      step={1}
                      value={[editedTask.importance]}
                      onValueChange={(value) => setEditedTask({...editedTask, importance: value[0]})}
                      className="relative z-10 [&_[role=slider]]:h-5 [&_[role=slider]]:w-5 [&_[role=slider]]:border-2 [&_[role=slider]]:border-white [&_[role=slider]]:shadow-lg"
                    />
                  </div>
                  <div className="flex justify-between mt-1 text-[10px] text-gray-500">
                    <span>Baixa</span>
                    <span>Alta</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className={`rounded-xl p-4 ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <TagIcon className="h-4 w-4 text-pink-400" />
                <Label className="text-sm font-semibold text-pink-400">Tags</Label>
              </div>
              <TagSelector 
                selectedTags={editedTask.tags || []} 
                onTagsChange={(tags) => setEditedTask({...editedTask, tags})}
                isDarkMode={isDarkMode}
              />
            </motion.div>
          </div>

          <DialogFooter className="flex justify-between sm:justify-between pt-4 border-t border-gray-700/30 gap-3">
            <Button 
              variant="ghost" 
              onClick={() => {
                const confirmDelete = window.confirm('Tem certeza que deseja excluir esta tarefa?');
                if (confirmDelete) onClose();
              }}
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Excluir
            </Button>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={onClose}
                className={`${isDarkMode ? 'border-gray-500 text-gray-200 hover:bg-gray-800 hover:text-white' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={!editedTask.title.trim() || isSubmitting}
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg shadow-violet-500/25"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Salvando...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Salvar
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
