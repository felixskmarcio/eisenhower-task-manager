import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertCircle, Edit2, CheckCircle, Calendar as CalendarIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TaskCardProps {
  title: string;
  description: string;
  important: boolean;
  urgent: boolean;
  completed: boolean;
  onComplete?: () => void;
  onEdit?: () => void;
  task: {
    id: string;
    title: string;
    description: string;
    urgency: number;
    importance: number;
    completed: boolean;
    start_date?: string | Date | null;
  };
}

export const TaskCard = ({
  title,
  description,
  important,
  urgent,
  completed,
  onComplete,
  onEdit,
  task,
}: TaskCardProps) => {
  // Determinando a cor de fundo com base na importância/urgência
  const getCardBackground = () => {
    if (important && urgent) return 'from-red-50 to-orange-50 border-red-200/30';
    if (important) return 'from-blue-50 to-purple-50 border-blue-200/30';
    if (urgent) return 'from-yellow-50 to-orange-50 border-yellow-200/30';
    return 'from-green-50 to-teal-50 border-green-200/30';
  };
  
  // Formatar a data de início, se disponível
  const formattedStartDate = task.start_date 
    ? format(new Date(task.start_date), "d 'de' MMMM, yyyy", { locale: ptBR }) 
    : null;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className="w-full"
    >
      <Card 
        className={`p-5 mb-3 ${completed ? 'opacity-80' : ''} transition-all duration-300 hover:shadow-xl cursor-pointer backdrop-blur-sm bg-white/90 border rounded-xl bg-gradient-to-r ${getCardBackground()}`}
        onClick={() => onComplete?.()}
        onDoubleClick={() => onEdit?.()}
        role="button"
        tabIndex={0}
        aria-label={`${title} - ${completed ? 'Completed' : 'Incomplete'} task`}
      >
      <div className="flex items-start justify-between">
        <div className="flex-1 pr-4">
          <motion.h4 
            className={`${completed ? 'line-through text-gray-400' : 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600'} font-bold text-lg tracking-tight`}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {title}
          </motion.h4>
          <p className={`text-sm mt-2.5 leading-relaxed ${completed ? 'text-gray-400' : 'text-gray-600'} line-clamp-3`}>
            {description}
          </p>
          
          {formattedStartDate && (
            <div className="flex items-center mt-3 text-xs text-gray-500">
              <CalendarIcon className="w-3.5 h-3.5 mr-1.5 inline" />
              <span>Início: {formattedStartDate}</span>
            </div>
          )}
          
          <div className="flex flex-wrap gap-2 mt-4">
            {important && (
              <Badge className="bg-primary/80 hover:bg-primary text-white backdrop-blur-sm transition-colors py-1 px-2.5 font-medium text-xs">
                <AlertCircle className="w-3 h-3 mr-1.5" />
                Important
              </Badge>
            )}
            {urgent && (
              <Badge className="bg-amber-500/80 hover:bg-amber-500 text-white backdrop-blur-sm transition-colors py-1 px-2.5 font-medium text-xs">
                <Clock className="w-3 h-3 mr-1.5" />
                Urgent
              </Badge>
            )}
          </div>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.();
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40"
                aria-label="Edit task"
              >
                <Edit2 className="w-4 h-4 text-gray-500" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p className="text-xs font-medium">Editar tarefa (clique duplo)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      {completed && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-3 right-3 text-green-500"
        >
          <CheckCircle className="w-6 h-6" />
        </motion.div>
      )}
    </Card>
  </motion.div>
  );
};

export default TaskCard;
