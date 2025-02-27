
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertCircle } from 'lucide-react';

interface TaskCardProps {
  title: string;
  description: string;
  important: boolean;
  urgent: boolean;
  completed: boolean;
  onComplete?: () => void;
}

export const TaskCard = ({
  title,
  description,
  important,
  urgent,
  completed,
  onComplete,
}: TaskCardProps) => {
  return (
    <Card className={`p-4 mb-2 ${completed ? 'opacity-50' : ''} transition-all duration-300 hover:shadow-md cursor-pointer bg-white`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className={`font-medium ${completed ? 'line-through text-gray-400' : ''}`}>
            {title}
          </h4>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
          <div className="flex gap-2 mt-2">
            {important && (
              <Badge className="bg-primary hover:bg-primary-hover">
                <AlertCircle className="w-3 h-3 mr-1" />
                Important
              </Badge>
            )}
            {urgent && (
              <Badge className="bg-urgent hover:bg-urgent-hover">
                <Clock className="w-3 h-3 mr-1" />
                Urgent
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TaskCard;
