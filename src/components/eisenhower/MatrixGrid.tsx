
import React from 'react';
import QuadrantCard from './QuadrantCard';
import { Task } from './TaskCard';

interface MatrixGridProps {
  tasks: Task[];
  quadrantData: {
    [key: string]: {
      title: string;
      icon: React.ElementType;
      color: string;
      textColor: string;
    };
  };
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, quadrant: number) => void;
  onRemoveTask: (id: string) => void;
  onDragStart: (e: React.DragEvent, task: Task) => void;
  onDragEnd: (e: React.DragEvent) => void;
}

const MatrixGrid: React.FC<MatrixGridProps> = ({
  tasks,
  quadrantData,
  onDragOver,
  onDragLeave,
  onDrop,
  onRemoveTask,
  onDragStart,
  onDragEnd
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[1, 2, 3, 4].map(quadrant => {
        const quadTasks = tasks.filter(task => task.quadrant === quadrant);
        
        return (
          <QuadrantCard
            key={quadrant}
            quadrant={quadrant}
            tasks={quadTasks}
            quadrantData={quadrantData[quadrant as 1 | 2 | 3 | 4]}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onRemoveTask={onRemoveTask}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          />
        );
      })}
    </div>
  );
};

export default MatrixGrid;
