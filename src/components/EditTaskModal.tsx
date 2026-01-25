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
          "sm:max-w-[540px] max-h-[90vh] overflow-y-auto p-0",
          isDarkMode 
            ? "bg-gray-900 text-gray-100 border-gray-700" 
            : "bg-white text-gray-900 border-gray-200"
        )}
        onKeyDown={handleKeyDown}
        aria-labelledby="edit-task-title"
        aria-describedby="edit-task-description"
      >
        <div className={cn(
          "sticky top-0 z-10 px-6 py-4 border-b",
          isDarkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
        )}>
          <DialogHeader>
            <DialogTitle 
              id="edit-task-title"
              className="text-xl font-semibold flex items-center gap-2"
            >
              <FileText className="h-5 w-5 text-violet-500" />
              Editar Tarefa
            </DialogTitle>
            <DialogDescription 
              id="edit-task-description"
              className={isDarkMode ? "text-gray-400" : "text-gray-500"}
            >
              Atualize os detalhes da sua tarefa. Pressione Ctrl+Enter para salvar.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-6 py-5 space-y-6">
          <section aria-labelledby="basic-info-heading">
            <h3 id="basic-info-heading" className="sr-only">Informações básicas</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label 
                  htmlFor="edit-title" 
                  className="text-sm font-medium flex items-center gap-1"
                >
                  Título <span className="text-red-400">*</span>
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
                      "w-full h-11 pr-12 text-base transition-all",
                      isDarkMode 
                        ? "bg-gray-800 border-gray-600 focus:border-violet-500 focus:ring-violet-500/20" 
                        : "bg-gray-50 border-gray-300 focus:border-violet-500 focus:ring-violet-500/20",
                      errors.title && touched.title && "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    )}
                  />
                  <span className={cn(
                    "absolute right-3 top-1/2 -translate-y-1/2 text-xs",
                    editedTask.title.length > 90 ? "text-amber-400" : "text-gray-400"
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
                    className="text-red-400 text-xs flex items-center gap-1"
                  >
                    <AlertCircle className="h-3 w-3" />
                    {errors.title}
                  </motion.p>
                ) : (
                  <p id="title-hint" className="text-xs text-gray-500">
                    Um título claro e objetivo para sua tarefa
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description" className="text-sm font-medium">
                  Descrição
                </Label>
                <Textarea
                  id="edit-description"
                  placeholder="Adicione detalhes, notas ou contexto adicional..."
                  value={editedTask.description}
                  onChange={(e) => setEditedTask(prev => ({ ...prev, description: e.target.value }))}
                  maxLength={500}
                  aria-describedby="description-hint"
                  className={cn(
                    "w-full resize-none min-h-[100px] transition-all",
                    isDarkMode 
                      ? "bg-gray-800 border-gray-600 focus:border-violet-500 focus:ring-violet-500/20" 
                      : "bg-gray-50 border-gray-300 focus:border-violet-500 focus:ring-violet-500/20"
                  )}
                />
                <div className="flex justify-between items-center">
                  <p id="description-hint" className="text-xs text-gray-500">
                    Opcional - adicione contexto ou detalhes
                  </p>
                  <span className={cn(
                    "text-xs",
                    (editedTask.description?.length || 0) > 450 ? "text-amber-400" : "text-gray-400"
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
                "rounded-lg p-4 border",
                isDarkMode ? "bg-gray-800/50 border-gray-700" : "bg-gray-50 border-gray-200"
              )}
            >
              <h3 id="date-heading" className="text-sm font-medium mb-3 flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-blue-400" />
                Data de Início
              </h3>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    aria-label={editedTask.start_date ? `Data selecionada: ${format(new Date(editedTask.start_date), "PPP", { locale: ptBR })}` : "Selecionar data"}
                    className={cn(
                      "w-full justify-start text-left font-normal h-10",
                      !editedTask.start_date && "text-gray-500",
                      isDarkMode 
                        ? "bg-gray-900 border-gray-600 hover:bg-gray-800" 
                        : "bg-white border-gray-300 hover:bg-gray-100"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-blue-400 flex-shrink-0" />
                    <span className="truncate">
                      {editedTask.start_date 
                        ? format(new Date(editedTask.start_date), "dd/MM/yyyy", { locale: ptBR })
                        : "Selecionar"
                      }
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={editedTask.start_date ? new Date(editedTask.start_date) : undefined}
                    onSelect={(date) => setEditedTask(prev => ({ ...prev, start_date: date?.toISOString() || null }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {editedTask.start_date && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs h-6 px-2 mt-2 text-gray-400 hover:text-gray-300"
                  onClick={() => setEditedTask(prev => ({ ...prev, start_date: null }))}
                >
                  Limpar data
                </Button>
              )}
            </section>

            <section 
              aria-labelledby="status-heading"
              className={cn(
                "rounded-lg p-4 border",
                isDarkMode ? "bg-gray-800/50 border-gray-700" : "bg-gray-50 border-gray-200"
              )}
            >
              <h3 id="status-heading" className="text-sm font-medium mb-3 flex items-center gap-2">
                <CheckCircle2 className={cn(
                  "h-4 w-4",
                  editedTask.completed ? "text-emerald-400" : "text-gray-400"
                )} />
                Status
              </h3>
              <div className={cn(
                "flex items-center justify-between p-3 rounded-lg",
                isDarkMode ? "bg-gray-900" : "bg-white border border-gray-200"
              )}>
                <div className="flex flex-col">
                  <span className={cn(
                    "text-sm font-medium",
                    editedTask.completed ? "text-emerald-400" : (isDarkMode ? "text-gray-300" : "text-gray-700")
                  )}>
                    {editedTask.completed ? "Concluída" : "Pendente"}
                  </span>
                </div>
                <Switch
                  id="edit-completed"
                  checked={editedTask.completed}
                  onCheckedChange={(checked) => setEditedTask(prev => ({ ...prev, completed: checked }))}
                  aria-label={editedTask.completed ? "Marcar como pendente" : "Marcar como concluída"}
                  className="data-[state=checked]:bg-emerald-500"
                />
              </div>
            </section>
          </div>

          <section 
            aria-labelledby="priority-heading"
            className={cn(
              "rounded-lg p-4 border",
              isDarkMode ? "bg-gray-800/50 border-gray-700" : "bg-gray-50 border-gray-200"
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 id="priority-heading" className="text-sm font-medium flex items-center gap-2">
                <Target className="h-4 w-4 text-orange-400" />
                Prioridade
              </h3>
              <motion.div 
                key={quadrant.name}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 border",
                  quadrant.bg
                )}
              >
                <QuadrantIcon className={cn("h-3.5 w-3.5", quadrant.color)} />
                <span className={quadrant.color}>{quadrant.name}</span>
              </motion.div>
            </div>

            <div className="space-y-5">
              <div role="group" aria-labelledby="urgency-label">
                <div className="flex items-center justify-between mb-2">
                  <label id="urgency-label" className="flex items-center gap-2">
                    <Zap className={cn("h-4 w-4", urgencyColors.text)} />
                    <span className="text-sm font-medium">Urgência</span>
                  </label>
                  <span className={cn(
                    "px-2.5 py-1 rounded-full text-xs font-bold tabular-nums",
                    urgencyColors.bg, urgencyColors.text
                  )}>
                    {editedTask.urgency}/10
                  </span>
                </div>
                <div className="relative pt-1">
                  <div className={cn(
                    "absolute inset-x-0 h-2 rounded-full",
                    isDarkMode ? "bg-gray-700" : "bg-gray-200"
                  )} />
                  <motion.div 
                    className="absolute h-2 rounded-full"
                    initial={false}
                    animate={{ 
                      width: `${editedTask.urgency * 10}%`,
                      backgroundColor: urgencyColors.bar
                    }}
                    transition={{ duration: 0.2 }}
                  />
                  <Slider
                    min={1}
                    max={10}
                    step={1}
                    value={[editedTask.urgency]}
                    onValueChange={(value) => setEditedTask(prev => ({ ...prev, urgency: value[0] }))}
                    aria-label="Nível de urgência"
                    aria-valuemin={1}
                    aria-valuemax={10}
                    aria-valuenow={editedTask.urgency}
                    aria-valuetext={`Urgência ${editedTask.urgency} de 10`}
                    className="relative z-10 [&_[role=slider]]:h-5 [&_[role=slider]]:w-5 [&_[role=slider]]:border-2 [&_[role=slider]]:border-white [&_[role=slider]]:shadow-md [&_[role=slider]]:transition-transform [&_[role=slider]:focus]:scale-110"
                  />
                </div>
                <div className="flex justify-between mt-1.5 text-[10px] text-gray-500">
                  <span>Baixa</span>
                  <span>Média</span>
                  <span>Alta</span>
                </div>
              </div>

              <div role="group" aria-labelledby="importance-label">
                <div className="flex items-center justify-between mb-2">
                  <label id="importance-label" className="flex items-center gap-2">
                    <Star className={cn("h-4 w-4", importanceColors.text)} />
                    <span className="text-sm font-medium">Importância</span>
                  </label>
                  <span className={cn(
                    "px-2.5 py-1 rounded-full text-xs font-bold tabular-nums",
                    importanceColors.bg, importanceColors.text
                  )}>
                    {editedTask.importance}/10
                  </span>
                </div>
                <div className="relative pt-1">
                  <div className={cn(
                    "absolute inset-x-0 h-2 rounded-full",
                    isDarkMode ? "bg-gray-700" : "bg-gray-200"
                  )} />
                  <motion.div 
                    className="absolute h-2 rounded-full"
                    initial={false}
                    animate={{ 
                      width: `${editedTask.importance * 10}%`,
                      backgroundColor: importanceColors.bar
                    }}
                    transition={{ duration: 0.2 }}
                  />
                  <Slider
                    min={1}
                    max={10}
                    step={1}
                    value={[editedTask.importance]}
                    onValueChange={(value) => setEditedTask(prev => ({ ...prev, importance: value[0] }))}
                    aria-label="Nível de importância"
                    aria-valuemin={1}
                    aria-valuemax={10}
                    aria-valuenow={editedTask.importance}
                    aria-valuetext={`Importância ${editedTask.importance} de 10`}
                    className="relative z-10 [&_[role=slider]]:h-5 [&_[role=slider]]:w-5 [&_[role=slider]]:border-2 [&_[role=slider]]:border-white [&_[role=slider]]:shadow-md [&_[role=slider]]:transition-transform [&_[role=slider]:focus]:scale-110"
                  />
                </div>
                <div className="flex justify-between mt-1.5 text-[10px] text-gray-500">
                  <span>Baixa</span>
                  <span>Média</span>
                  <span>Alta</span>
                </div>
              </div>

              <div className={cn(
                "flex items-start gap-2 p-3 rounded-lg text-xs",
                isDarkMode ? "bg-gray-900/50" : "bg-gray-100"
              )}>
                <Info className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-gray-400">
                  {quadrant.description}
                </p>
              </div>
            </div>
          </section>

          <section 
            aria-labelledby="tags-heading"
            className={cn(
              "rounded-lg p-4 border",
              isDarkMode ? "bg-gray-800/50 border-gray-700" : "bg-gray-50 border-gray-200"
            )}
          >
            <h3 id="tags-heading" className="text-sm font-medium mb-3 flex items-center gap-2">
              <TagIcon className="h-4 w-4 text-pink-400" />
              Tags
            </h3>
            <TagSelector 
              selectedTags={editedTask.tags || []} 
              onTagsChange={(tags) => setEditedTask(prev => ({ ...prev, tags }))}
              isDarkMode={isDarkMode}
            />
          </section>
        </div>

        <div className={cn(
          "sticky bottom-0 px-6 py-4 border-t",
          isDarkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
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
                  "flex items-center gap-2 p-3 rounded-lg",
                  "bg-red-500/10 border border-red-500/30"
                )}>
                  <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0" />
                  <p className="text-sm text-red-400">
                    Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita.
                  </p>
                </div>
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowDeleteConfirm(false)}
                    className={isDarkMode ? "border-gray-600 text-gray-300 hover:bg-gray-800" : ""}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    variant="destructive"
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Confirmar Exclusão
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
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Excluir
                </Button>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={onClose}
                    className={cn(
                      isDarkMode 
                        ? "border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white" 
                        : "border-gray-300 text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleSubmit}
                    disabled={!!errors.title || isSubmitting}
                    className={cn(
                      "min-w-[100px] bg-violet-600 hover:bg-violet-700 text-white",
                      "disabled:opacity-50 disabled:cursor-not-allowed",
                      "transition-all duration-200"
                    )}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Salvar
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
