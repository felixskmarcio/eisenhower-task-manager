import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Tag, AlertTriangle, Calendar as CalendarIcon } from 'lucide-react';
import { TaskIcon } from '@/components/ui/task-icon';
import TagSelector from './TagSelector';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  newTask: {
    title: string;
    description?: string;
    urgency: number;
    importance: number;
    tags?: string[];
    start_date?: string | Date | null;
  };
  setNewTask: React.Dispatch<React.SetStateAction<{
    title: string;
    description?: string;
    urgency: number;
    importance: number;
    tags?: string[];
    start_date?: string | Date | null;
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
  const [isTitleFocused, setIsTitleFocused] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!newTask.title.trim()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      onAddTask();
      setIsSubmitting(false);
    }, 300);
  };

  const handleDateSelect = (date: Date | undefined) => {
    setNewTask({
      ...newTask,
      start_date: date ? date.toISOString() : null
    });
    setTimeout(() => setCalendarOpen(false), 100);
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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={`sm:max-w-[95%] md:max-w-[600px] lg:max-w-[700px] h-auto max-h-[90vh] overflow-y-auto p-0 gap-0 border-[1px] ${isDarkMode
          ? 'bg-[#09090b] text-[#f4f4f5] border-[#27272a]'
          : 'bg-[#f4f4f5] text-[#09090b] border-[#e4e4e7]' // Fallback not really used if always dark mode preferred
        } rounded-none shadow-2xl`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col h-full"
        >
          <div className="p-6 border-b border-[#27272a] bg-[#18181b] flex items-center justify-between">
            <div className="space-y-1">
              <DialogTitle className="text-xl font-display font-bold uppercase tracking-wider flex items-center gap-2">
                <span className="text-[#ccff00]">Nova Tarefa</span>
              </DialogTitle>
              <DialogDescription className="text-xs font-mono text-[#a1a1aa] uppercase tracking-wide">
                INITIALIZING NEW TASK SEQUENCE...
              </DialogDescription>
            </div>
          </div>

          <div className="p-6 space-y-6 bg-[#09090b]">
            {/* Title Input */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="title" className="text-xs font-mono uppercase text-[#a1a1aa]">
                  Identificador da Tarefa (Título) <span className="text-[#ccff00]">*</span>
                </Label>
              </div>
              <div className="relative group">
                <Input
                  id="title"
                  type="text"
                  placeholder="EX: IMPLEMENTAR PROTOCOLO DE SEGURANÇA..."
                  value={newTask.title}
                  onChange={e => setNewTask({
                    ...newTask,
                    title: e.target.value
                  })}
                  onFocus={() => setIsTitleFocused(true)}
                  onBlur={() => setIsTitleFocused(false)}
                  className={`
                    w-full h-12 bg-transparent border rounded-none font-mono text-sm transition-all
                    ${isTitleFocused
                      ? 'border-[#ccff00] text-white shadow-[0_0_10px_rgba(204,255,0,0.1)]'
                      : 'border-[#27272a] text-[#d4d4d8] hover:border-[#3f3f46]'
                    } focus:ring-0 focus:ring-offset-0 placeholder:text-[#52525b]
                  `}
                />
              </div>
              {!newTask.title.trim() && (
                <p className="text-[#ef4444] text-[10px] font-mono flex items-center gap-1 uppercase">
                  <AlertTriangle size={10} />
                  Input Requerido
                </p>
              )}
            </div>

            {/* Description Input */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-xs font-mono uppercase text-[#a1a1aa]">
                Parâmetros (Descrição)
              </Label>
              <Textarea
                id="description"
                placeholder="Detalhes operacionais..."
                value={newTask.description || ''}
                onChange={e => setNewTask({
                  ...newTask,
                  description: e.target.value
                })}
                className="w-full min-h-[100px] bg-transparent border border-[#27272a] rounded-none font-mono text-sm text-[#d4d4d8] placeholder:text-[#52525b] focus:border-[#ccff00] focus:ring-0 resize-none rounded-none"
              />
            </div>

            {/* Date Input */}
            <div className="space-y-2">
              <Label htmlFor="start-date" className="text-xs font-mono uppercase text-[#a1a1aa]">
                Data de Início
              </Label>
              <div className="flex gap-2">
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      id="start-date"
                      variant="outline"
                      className={`
                        w-full justify-start text-left font-mono text-sm h-10 rounded-none border-[#27272a] bg-transparent hover:bg-[#27272a] hover:text-[#ccff00]
                        ${!newTask.start_date && "text-[#52525b]"}
                        `}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newTask.start_date ? (
                        format(new Date(newTask.start_date), "PPP", { locale: ptBR })
                      ) : (
                        <span>SELECIONAR DATA</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 border-[#27272a] bg-[#09090b] rounded-none" align="start">
                    <Calendar
                      mode="single"
                      selected={newTask.start_date ? new Date(newTask.start_date) : undefined}
                      onSelect={handleDateSelect}
                      initialFocus
                      className="p-3 bg-[#09090b] text-[#d4d4d8] border-[#27272a] font-mono"
                    />
                  </PopoverContent>
                </Popover>
                {newTask.start_date && (
                  <Button
                    variant="ghost"
                    className="h-10 px-3 rounded-none text-[#ef4444] hover:bg-[#ef4444]/10 hover:text-[#ef4444] font-mono text-xs uppercase border border-[#27272a]"
                    onClick={() => setNewTask({ ...newTask, start_date: null })}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Sliders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border border-[#27272a] bg-[#18181b]/50">
              {/* Urgency */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="urgency" className="text-xs font-mono uppercase text-[#a1a1aa]">
                    Nível de Urgência
                  </Label>
                  <span className={`px-2 py-0.5 text-[10px] font-mono font-bold border ${newTask.urgency > 7 ? 'text-[#ef4444] border-[#ef4444] bg-[#ef4444]/10' :
                      newTask.urgency > 4 ? 'text-[#eab308] border-[#eab308] bg-[#eab308]/10' :
                        'text-[#22c55e] border-[#22c55e] bg-[#22c55e]/10'
                    }`}>
                    VAL: {newTask.urgency}
                  </span>
                </div>
                <Slider
                  id="urgency"
                  min={1}
                  max={10}
                  step={1}
                  value={[newTask.urgency]}
                  onValueChange={(value) => setNewTask({ ...newTask, urgency: value[0] })}
                  className="py-1 cursor-pointer"
                />
              </div>

              {/* Importance */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="importance" className="text-xs font-mono uppercase text-[#a1a1aa]">
                    Nível de Importância
                  </Label>
                  <span className={`px-2 py-0.5 text-[10px] font-mono font-bold border ${newTask.importance > 7 ? 'text-[#3b82f6] border-[#3b82f6] bg-[#3b82f6]/10' :
                      newTask.importance > 4 ? 'text-[#6366f1] border-[#6366f1] bg-[#6366f1]/10' :
                        'text-[#a855f7] border-[#a855f7] bg-[#a855f7]/10'
                    }`}>
                    VAL: {newTask.importance}
                  </span>
                </div>
                <Slider
                  id="importance"
                  min={1}
                  max={10}
                  step={1}
                  value={[newTask.importance]}
                  onValueChange={(value) => setNewTask({ ...newTask, importance: value[0] })}
                  className="py-1 cursor-pointer"
                />
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label className="text-xs font-mono uppercase text-[#a1a1aa] flex items-center gap-2">
                <Tag size={12} />
                Tags de Classificação
              </Label>
              <TagSelector
                selectedTags={newTask.tags || []}
                onTagsChange={(tags) => setNewTask({ ...newTask, tags })}
                isDarkMode={true} // Force dark mode for consistency
              />
            </div>
          </div>

          <div className="p-4 border-t border-[#27272a] bg-[#18181b] flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="rounded-none border-[#27272a] text-[#a1a1aa] hover:bg-[#27272a] hover:text-white font-mono uppercase tracking-wider text-xs h-10 px-6"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!newTask.title.trim() || isSubmitting}
              className={`
                rounded-none bg-[#ccff00] text-black hover:bg-[#bbe600] font-mono font-bold uppercase tracking-wider text-xs h-10 px-6
                ${isSubmitting ? 'opacity-50 cursor-wait' : ''}
              `}
            >
              {isSubmitting ? 'PROCESSANDO...' : 'ADICIONAR TAREFA'}
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskModal;
