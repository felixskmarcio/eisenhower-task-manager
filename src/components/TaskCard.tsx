
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertCircle, Edit2 } from 'lucide-react';

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
    <Card 
      className={`p-4 mb-2 ${completed ? 'opacity-50' : ''} transition-all duration-300 hover:shadow-xl hover:scale-[1.02] cursor-pointer backdrop-blur-sm bg-white/90 border border-gray-200/50 rounded-xl ${important && urgent ? 'bg-gradient-to-r from-red-50 to-orange-50' : important ? 'bg-gradient-to-r from-blue-50 to-purple-50' : urgent ? 'bg-gradient-to-r from-yellow-50 to-orange-50' : 'bg-gradient-to-r from-green-50 to-teal-50'}`}
      onDoubleClick={() => onEdit?.()}
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
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit?.();
          }}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          title="Edit task"
        >
          <Edit2 className="w-4 h-4 text-gray-500" />
        </button>
      </div>
    </Card>
  );
};

export default TaskCard;
