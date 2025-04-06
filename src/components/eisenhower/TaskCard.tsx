
import React from 'react';
import { Trash2, Move } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Interface for a task in the matrix
export interface Task {
  id: string;
  title: string;
  description: string;
  quadrant: 1 | 2 | 3 | 4;
  createdAt: Date;
}

interface TaskCardProps { 
  task: Task; 
  quadrantData: { 
    title: string; 
    icon: React.ElementType; 
    color: string; 
    textColor: string; 
  }; 
  onRemove: (id: string) => void;
  onDragStart: (e: React.DragEvent, task: Task) => void;
  onDragEnd: (e: React.DragEvent) => void;
}

const TaskCard = ({ 
  task, 
  quadrantData, 
  onRemove,
  onDragStart,
  onDragEnd
}: TaskCardProps) => {
  const Icon = quadrantData.icon;
  
  return (
    <div
      className="border rounded-lg p-3 hover:shadow-sm transition-all group cursor-grab"
      draggable={true}
      onDragStart={(e) => onDragStart(e, task)}
      onDragEnd={onDragEnd}
    >
      <div className="flex items-start gap-2">
        <div className={`p-1.5 rounded-md ${quadrantData.color}/20 mt-0.5`}>
          <Icon className={`h-3.5 w-3.5 ${quadrantData.textColor}`} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center">
            <h4 className="font-medium text-sm truncate flex-1">{task.title}</h4>
            <Move className="h-3 w-3 text-muted-foreground opacity-40 group-hover:opacity-100 ml-1 drag-handle" />
          </div>
          {task.description && (
            <p className="text-muted-foreground text-xs mt-1 line-clamp-2">{task.description}</p>
          )}
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => onRemove(task.id)}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};

export default TaskCard;
