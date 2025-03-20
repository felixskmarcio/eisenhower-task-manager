
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertCircle, Edit2, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Card 
        className={`p-4 mb-2 ${completed ? 'opacity-80' : ''} transition-all duration-300 hover:shadow-xl cursor-pointer backdrop-blur-sm bg-white/90 border border-gray-200/50 rounded-xl ${important && urgent ? 'bg-gradient-to-r from-red-50 to-orange-50' : important ? 'bg-gradient-to-r from-blue-50 to-purple-50' : urgent ? 'bg-gradient-to-r from-yellow-50 to-orange-50' : 'bg-gradient-to-r from-green-50 to-teal-50'}`}
        onClick={() => onComplete?.()}
        onDoubleClick={() => onEdit?.()}
        role="button"
        tabIndex={0}
        aria-label={`${title} - ${completed ? 'Completed' : 'Incomplete'} task`}
      >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className={`font-medium text-lg ${completed ? 'line-through text-gray-400' : ''}`}>
            {title}
          </h4>
          <p className="text-sm text-gray-600 mt-2 leading-relaxed">{description}</p>
          <div className="flex gap-2 mt-3">
            {important && (
              <Badge className="bg-primary/90 hover:bg-primary backdrop-blur-sm transition-colors">
                <AlertCircle className="w-3 h-3 mr-1" />
                Important
              </Badge>
            )}
            {urgent && (
              <Badge className="bg-urgent/90 hover:bg-urgent backdrop-blur-sm transition-colors">
                <Clock className="w-3 h-3 mr-1" />
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
                className="p-2 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-300"
                aria-label="Edit task"
              >
                <Edit2 className="w-4 h-4 text-gray-500" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit task (double-click)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      {completed && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 right-2 text-success"
        >
          <CheckCircle className="w-5 h-5" />
        </motion.div>
      )}
    </Card>
  </motion.div>
  );
};

export default TaskCard;
