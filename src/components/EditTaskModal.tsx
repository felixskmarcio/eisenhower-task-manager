import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trash2, X, Save, AlertTriangle, Calendar as CalendarIcon,
  Zap, Star, Target, Clock, FileText, Tag as TagIcon,
  CheckCircle2, AlertCircle, Loader2, ChevronDown, Info
} from 'lucide-react';
import TagSelector from './TagSelector';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
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
  onDelete?: (taskId: string) => void;
  isDarkMode: boolean;
}

const EditTaskModal = ({
  isOpen,
  onClose,
  task,
  onSave,
  onDelete,
  isDarkMode
}: EditTaskModalProps) => {
  const [editedTask, setEditedTask] = useState(task);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [errors, setErrors] = useState<{ title?: string }>({});
  const [touched, setTouched] = useState<{ title?: boolean; description?: boolean }>({});
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditedTask(task);
    setErrors({});
    setTouched({});
    setShowDeleteConfirm(false);
  }, [task, isOpen]);

  useEffect(() => {
    if (isOpen && titleInputRef.current) {
      setTimeout(() => titleInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const validateTitle = useCallback((value: string): string | undefined => {
    if (!value.trim()) return 'O título é obrigatório';
    if (value.trim().length < 3) return 'O título deve ter pelo menos 3 caracteres';
    if (value.trim().length > 100) return 'O título deve ter no máximo 100 caracteres';
    return undefined;
  }, []);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEditedTask(prev => ({ ...prev, title: value }));
    if (touched.title) {
      setErrors(prev => ({ ...prev, title: validateTitle(value) }));
    }
  };

  const handleTitleBlur = () => {
    setTouched(prev => ({ ...prev, title: true }));
    setErrors(prev => ({ ...prev, title: validateTitle(editedTask.title) }));
  };

  const handleSubmit = () => {
    const titleError = validateTitle(editedTask.title);
    if (titleError) {
      setErrors({ title: titleError });
      setTouched({ title: true });
      titleInputRef.current?.focus();
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      onSave(editedTask);
      setIsSubmitting(false);
      onClose();
    }, 300);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(task.id);
    }
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit();
    }
    if (e.key === 'Escape') {
      if (showDeleteConfirm) {
        setShowDeleteConfirm(false);
      } else {
        onClose();
      }
    }
  };

  const getQuadrantInfo = () => {
    const isUrgent = editedTask.urgency > 5;
    const isImportant = editedTask.importance > 5;

    if (isUrgent && isImportant) return {
      name: 'Fazer Agora',
      description: 'Urgente e importante - prioridade máxima',
      color: 'text-red-400',
      bg: 'bg-red-500/10 border-red-500/30',
      icon: Zap
    };
    if (!isUrgent && isImportant) return {
      name: 'Agendar',
      description: 'Importante mas não urgente - planeje',
      color: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/30',
      icon: Clock
    };
    if (isUrgent && !isImportant) return {
      name: 'Delegar',
      description: 'Urgente mas não importante - delegue',
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/30',
      icon: Target
    };
    return {
      name: 'Eliminar',
      description: 'Nem urgente nem importante - elimine',
      color: 'text-gray-400',
      bg: 'bg-gray-500/10 border-gray-500/30',
      icon: X
    };
  };

  const quadrant = getQuadrantInfo();
  const QuadrantIcon = quadrant.icon;

  const getUrgencyColor = (value: number) => {
    if (value > 7) return { text: 'text-red-400', bg: 'bg-red-500/20', bar: '#ef4444' };
    if (value > 4) return { text: 'text-amber-400', bg: 'bg-amber-500/20', bar: '#f59e0b' };
    return { text: 'text-emerald-400', bg: 'bg-emerald-500/20', bar: '#10b981' };
  };

  const getImportanceColor = (value: number) => {
    if (value > 7) return { text: 'text-violet-400', bg: 'bg-violet-500/20', bar: '#8b5cf6' };
    if (value > 4) return { text: 'text-blue-400', bg: 'bg-blue-500/20', bar: '#3b82f6' };
    return { text: 'text-indigo-400', bg: 'bg-indigo-500/20', bar: '#6366f1' };
  };

  const urgencyColors = getUrgencyColor(editedTask.urgency);
  const importanceColors = getImportanceColor(editedTask.importance);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className={cn(
          "sm:max-w-[540px] max-h-[90vh] overflow-y-auto p-0 gap-0 border-[1px] rounded-none shadow-2xl",
          isDarkMode
            ? "bg-[#09090b] text-[#f4f4f5] border-[#27272a]"
            : "bg-[#f4f4f5] text-[#09090b] border-[#e4e4e7]"
        )}
        onKeyDown={handleKeyDown}
        aria-labelledby="edit-task-title"
        aria-describedby="edit-task-description"
      >
        <div className={cn(
          "sticky top-0 z-10 px-6 py-4 border-b flex items-center justify-between",
          isDarkMode ? "bg-[#18181b] border-[#27272a]" : "bg-white border-gray-200"
        )}>
          <div className="space-y-1">
            <DialogTitle
              id="edit-task-title"
              className="text-xl font-display font-bold uppercase tracking-wider flex items-center gap-2"
            >
              <span className="text-[#ccff00]">EDITAR TAREFA</span>
            </DialogTitle>
            <DialogDescription
              id="edit-task-description"
              className="text-xs font-mono text-[#a1a1aa] uppercase tracking-wide"
            >
              MODIFICANDO PARÂMETROS...
            </DialogDescription>
          </div>
        </div>

        <div className="px-6 py-5 space-y-6 bg-[#09090b]">
          <section aria-labelledby="basic-info-heading">
            <h3 id="basic-info-heading" className="sr-only">Informações básicas</h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="edit-title"
                  className="text-xs font-mono uppercase text-[#a1a1aa] flex items-center gap-1"
                >
                  Identificador (Título) <span className="text-[#ef4444]">*</span>
                </Label>
                <div className="relative">
                  <Input
                    ref={titleInputRef}
                    id="edit-title"
                    type="text"
                    placeholder="Ex: Revisar relatório trimestral"
                    value={editedTask.title}
                    onChange={handleTitleChange}
                    onBlur={handleTitleBlur}
                    maxLength={100}
                    aria-invalid={!!errors.title}
                    aria-describedby={errors.title ? "title-error" : "title-hint"}
                    className={cn(
                      "w-full h-12 bg-transparent border rounded-none font-mono text-sm transition-all pr-12",
                      isDarkMode
                        ? "border-[#27272a] text-[#d4d4d8] focus:border-[#ccff00] focus:ring-0 focus:shadow-[0_0_10px_rgba(204,255,0,0.1)]"
                        : "bg-gray-50 border-gray-300 focus:border-violet-500 focus:ring-violet-500/20",
                      errors.title && touched.title && "border-[#ef4444] focus:border-[#ef4444] focus:shadow-[0_0_10px_rgba(239,68,68,0.1)]"
                    )}
                  />
                  <span className={cn(
                    "absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono",
                    editedTask.title.length > 90 ? "text-[#eab308]" : "text-[#52525b]"
                  )}>
                    {editedTask.title.length}/100
                  </span>
                </div>
                {errors.title && touched.title ? (
                  <motion.p
                    id="title-error"
                    role="alert"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[#ef4444] text-[10px] font-mono flex items-center gap-1 uppercase"
                  >
                    <AlertCircle className="h-3 w-3" />
                    {errors.title}
                  </motion.p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description" className="text-xs font-mono uppercase text-[#a1a1aa]">
                  Parâmetros (Descrição)
                </Label>
                <Textarea
                  id="edit-description"
                  placeholder="Adicione detalhes, notas ou contexto adicional..."
                  value={editedTask.description}
                  onChange={(e) => setEditedTask(prev => ({ ...prev, description: e.target.value }))}
                  maxLength={500}
                  aria-describedby="description-hint"
                  className={cn(
                    "w-full resize-none min-h-[100px] transition-all bg-transparent border rounded-none font-mono text-sm",
                    isDarkMode
                      ? "border-[#27272a] text-[#d4d4d8] focus:border-[#ccff00] focus:ring-0 placeholder:text-[#52525b]"
                      : "bg-gray-50 border-gray-300 focus:border-violet-500"
                  )}
                />
                <div className="flex justify-between items-center">
                  <span className={cn(
                    "text-[10px] font-mono",
                    (editedTask.description?.length || 0) > 450 ? "text-[#eab308]" : "text-[#52525b]"
                  )}>
                    {editedTask.description?.length || 0}/500
                  </span>
                </div>
              </div>
            </div>
          </section>

          <div className={cn(
            "grid grid-cols-2 gap-4",
            "sm:grid-cols-2"
          )}>
            <section
              aria-labelledby="date-heading"
              className={cn(
                "p-4 border",
                isDarkMode ? "bg-[#18181b]/50 border-[#27272a]" : "bg-gray-50 border-gray-200"
              )}
            >
              <h3 id="date-heading" className="text-xs font-mono uppercase text-[#a1a1aa] mb-3 flex items-center gap-2">
                <CalendarIcon className="h-3 w-3" />
                Data de Início
              </h3>
              <div className="flex flex-col gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      aria-label={editedTask.start_date ? `Data selecionada: ${format(new Date(editedTask.start_date), "PPP", { locale: ptBR })}` : "Selecionar data"}
                      className={cn(
                        "w-full justify-start text-left font-mono h-9 text-xs rounded-none border",
                        !editedTask.start_date && "text-[#52525b]",
                        isDarkMode
                          ? "bg-transparent border-[#27272a] hover:bg-[#27272a] hover:text-[#ccff00]"
                          : "bg-white border-gray-300 hover:bg-gray-100"
                      )}
                    >
                      <span className="truncate">
                        {editedTask.start_date
                          ? format(new Date(editedTask.start_date), "dd/MM/yyyy", { locale: ptBR })
                          : "DEFINIR DATA"
                        }
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 border-[#27272a] bg-[#09090b] rounded-none" align="start">
                    <Calendar
                      mode="single"
                      selected={editedTask.start_date ? new Date(editedTask.start_date) : undefined}
                      onSelect={(date) => setEditedTask(prev => ({ ...prev, start_date: date?.toISOString() || null }))}
                      initialFocus
                      className="p-3 bg-[#09090b] text-[#d4d4d8] border-[#27272a] font-mono"
                    />
                  </PopoverContent>
                </Popover>
                {editedTask.start_date && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[10px] h-6 px-2 text-[#ef4444] hover:text-[#ef4444] hover:bg-[#ef4444]/10 border border-[#27272a] rounded-none uppercase font-mono w-full"
                    onClick={() => setEditedTask(prev => ({ ...prev, start_date: null }))}
                  >
                    Limpar
                  </Button>
                )}
              </div>
            </section>

            <section
              aria-labelledby="status-heading"
              className={cn(
                "p-4 border",
                isDarkMode ? "bg-[#18181b]/50 border-[#27272a]" : "bg-gray-50 border-gray-200"
              )}
            >
              <h3 id="status-heading" className="text-xs font-mono uppercase text-[#a1a1aa] mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-3 w-3" />
                Status
              </h3>
              <div className={cn(
                "flex items-center justify-between p-2 border",
                isDarkMode ? "bg-[#09090b] border-[#27272a]" : "bg-white border-gray-200"
              )}>
                <div className="flex flex-col">
                  <span className={cn(
                    "text-xs font-mono uppercase",
                    editedTask.completed ? "text-[#22c55e]" : "text-[#52525b]"
                  )}>
                    {editedTask.completed ? "CONCLUÍDO" : "PENDENTE"}
                  </span>
                </div>
                <Switch
                  id="edit-completed"
                  checked={editedTask.completed}
                  onCheckedChange={(checked) => setEditedTask(prev => ({ ...prev, completed: checked }))}
                  aria-label={editedTask.completed ? "Marcar como pendente" : "Marcar como concluída"}
                  className="data-[state=checked]:bg-[#ccff00] data-[state=unchecked]:bg-[#27272a]"
                />
              </div>
            </section>
          </div>

          <section
            aria-labelledby="priority-heading"
            className={cn(
              "p-4 border",
              isDarkMode ? "bg-[#18181b]/50 border-[#27272a]" : "bg-gray-50 border-gray-200"
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 id="priority-heading" className="text-xs font-mono uppercase text-[#a1a1aa] flex items-center gap-2">
                <Target className="h-3 w-3" />
                Prioridade
              </h3>
              <motion.div
                key={quadrant.name}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={cn(
                  "px-2 py-1 text-[10px] font-mono font-bold uppercase border flex items-center gap-1.5",
                  // Override standard colors for industrial theme
                  quadrant.name === 'Fazer Agora' ? 'text-[#ef4444] border-[#ef4444] bg-[#ef4444]/10' :
                    quadrant.name === 'Agendar' ? 'text-[#3b82f6] border-[#3b82f6] bg-[#3b82f6]/10' :
                      quadrant.name === 'Delegar' ? 'text-[#eab308] border-[#eab308] bg-[#eab308]/10' :
                        'text-[#52525b] border-[#52525b] bg-[#52525b]/10'
                )}
              >
                {quadrant.name}
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div role="group" aria-labelledby="urgency-label">
                <div className="flex items-center justify-between mb-2">
                  <label id="urgency-label" className="flex items-center gap-2 text-xs font-mono uppercase text-[#a1a1aa]">
                    Urgência
                  </label>
                  <span className={cn(
                    "px-2 py-0.5 text-[10px] font-mono font-bold border",
                    editedTask.urgency > 7 ? 'text-[#ef4444] border-[#ef4444] bg-[#ef4444]/10' :
                      editedTask.urgency > 4 ? 'text-[#eab308] border-[#eab308] bg-[#eab308]/10' :
                        'text-[#22c55e] border-[#22c55e] bg-[#22c55e]/10'
                  )}>
                    VAL: {editedTask.urgency}
                  </span>
                </div>
                <div className="relative pt-1">
                  <Slider
                    min={1}
                    max={10}
                    step={1}
                    value={[editedTask.urgency]}
                    onValueChange={(value) => setEditedTask(prev => ({ ...prev, urgency: value[0] }))}
                    className="relative z-10 cursor-pointer"
                  />
                </div>
              </div>

              <div role="group" aria-labelledby="importance-label">
                <div className="flex items-center justify-between mb-2">
                  <label id="importance-label" className="flex items-center gap-2 text-xs font-mono uppercase text-[#a1a1aa]">
                    Importância
                  </label>
                  <span className={cn(
                    "px-2 py-0.5 text-[10px] font-mono font-bold border",
                    editedTask.importance > 7 ? 'text-[#3b82f6] border-[#3b82f6] bg-[#3b82f6]/10' :
                      editedTask.importance > 4 ? 'text-[#6366f1] border-[#6366f1] bg-[#6366f1]/10' :
                        'text-[#a855f7] border-[#a855f7] bg-[#a855f7]/10'
                  )}>
                    VAL: {editedTask.importance}
                  </span>
                </div>
                <div className="relative pt-1">
                  <Slider
                    min={1}
                    max={10}
                    step={1}
                    value={[editedTask.importance]}
                    onValueChange={(value) => setEditedTask(prev => ({ ...prev, importance: value[0] }))}
                    className="relative z-10 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className={cn(
              "mt-4 flex items-start gap-2 p-2 border text-[10px] font-mono",
              isDarkMode ? "bg-[#09090b] border-[#27272a] text-[#52525b]" : "bg-gray-100"
            )}>
              <Info className="h-3 w-3 flex-shrink-0 mt-0.5" />
              <p>
                STATUS: {quadrant.description.toUpperCase()}
              </p>
            </div>
          </section>

          <section
            aria-labelledby="tags-heading"
            className={cn(
              "p-4 border",
              isDarkMode ? "bg-[#18181b]/50 border-[#27272a]" : "bg-gray-50 border-gray-200"
            )}
          >
            <h3 id="tags-heading" className="text-xs font-mono uppercase text-[#a1a1aa] mb-3 flex items-center gap-2">
              <TagIcon className="h-3 w-3" />
              Categorização (Tags)
            </h3>
            <TagSelector
              selectedTags={editedTask.tags || []}
              onTagsChange={(tags) => setEditedTask(prev => ({ ...prev, tags }))}
              isDarkMode={true}
            />
          </section>
        </div>

        <div className={cn(
          "sticky bottom-0 px-6 py-4 border-t",
          isDarkMode ? "bg-[#18181b] border-[#27272a]" : "bg-white border-gray-200"
        )}>
          <AnimatePresence mode="wait">
            {showDeleteConfirm ? (
              <motion.div
                key="delete-confirm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-3"
              >
                <div className={cn(
                  "flex items-center gap-2 p-3 border",
                  "bg-[#ef4444]/10 border-[#ef4444]"
                )}>
                  <AlertTriangle className="h-4 w-4 text-[#ef4444] flex-shrink-0" />
                  <p className="text-xs font-mono text-[#ef4444] uppercase">
                    Confirmar protocolo de exclusão? Irreversível.
                  </p>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteConfirm(false)}
                    className={isDarkMode ? "rounded-none border-[#27272a] text-[#a1a1aa] hover:bg-[#27272a] hover:text-white font-mono uppercase text-xs" : ""}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    className="rounded-none bg-[#ef4444] hover:bg-[#dc2626] font-mono text-xs uppercase"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    DELETAR
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="actions"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex justify-between items-center gap-3"
              >
                <Button
                  variant="ghost"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="rounded-none text-[#ef4444] hover:text-[#ef4444] hover:bg-[#ef4444]/10 font-mono text-xs uppercase"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Excluir
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className={cn(
                      "rounded-none border-[#27272a] text-[#a1a1aa] hover:bg-[#27272a] hover:text-white font-mono uppercase text-xs px-4"
                    )}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={!!errors.title || isSubmitting}
                    className={cn(
                      "min-w-[100px] rounded-none bg-[#ccff00] text-black hover:bg-[#bbe600] font-mono font-bold uppercase text-xs px-6",
                      "disabled:opacity-50 disabled:cursor-not-allowed",
                      "transition-all duration-200"
                    )}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                        SALVANDO...
                      </>
                    ) : (
                      <>
                        <Save className="h-3 w-3 mr-2" />
                        SALVAR
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditTaskModal;
