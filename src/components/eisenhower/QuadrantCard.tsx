
import React from 'react';
import { Badge } from '@/components/ui/badge';
import TaskCard, { Task } from './TaskCard';

interface QuadrantCardProps {
  quadrant: number;
  tasks: Task[];
  quadrantData: {
    title: string;
    icon: React.ElementType;
    color: string;
    textColor: string;
  };
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, quadrant: number) => void;
  onRemoveTask: (id: string) => void;
  onDragStart: (e: React.DragEvent, task: Task) => void;
  onDragEnd: (e: React.DragEvent) => void;
}

const QuadrantCard: React.FC<QuadrantCardProps> = ({
  quadrant,
  tasks,
  quadrantData,
  onDragOver,
  onDragLeave,
  onDrop,
  onRemoveTask,
  onDragStart,
  onDragEnd
}) => {
  const { title, icon: Icon, color } = quadrantData;
  
  return (
    <div 
      className="border rounded-lg p-4 quadrant-drop-zone transition-all duration-300"
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, quadrant)}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className={`p-1.5 rounded-md ${color}/20`}>
          <Icon className={`h-4 w-4 ${quadrantData.textColor}`} />
        </div>
        <h3 className="font-medium">{title}</h3>
        <Badge variant="outline" className="ml-auto">
          {tasks.length}
        </Badge>
      </div>
      
      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
        {tasks.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Sem tarefas neste quadrante
          </p>
        ) : (
          tasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              quadrantData={quadrantData} 
              onRemove={onRemoveTask}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default QuadrantCard;
