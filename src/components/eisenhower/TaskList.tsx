
import React from 'react';
import TaskCard, { Task } from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  quadrantData: {
    [key: string]: {
      title: string;
      icon: React.ElementType;
      color: string;
      textColor: string;
    };
  };
  onRemoveTask: (id: string) => void;
  onDragStart: (e: React.DragEvent, task: Task) => void;
  onDragEnd: (e: React.DragEvent) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  quadrantData,
  onRemoveTask,
  onDragStart,
  onDragEnd
}) => {
  return (
    <div className="space-y-4">
      {tasks.length === 0 ? (
        <p className="text-center py-8 text-muted-foreground">
          Sem tarefas para mostrar neste quadrante
        </p>
      ) : (
        tasks.map(task => (
          <TaskCard 
            key={task.id} 
            task={task} 
            quadrantData={quadrantData[task.quadrant]} 
            onRemove={onRemoveTask}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          />
        ))
      )}
    </div>
  );
};

export default TaskList;
