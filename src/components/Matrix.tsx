import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Clock, Star, CheckCircle, Share2, Settings, Plus, Trash2 } from 'lucide-react';
import AddTaskModal from './AddTaskModal';
import { formatDate } from '@/utils/dateUtils';
import { useTheme } from '../contexts/ThemeContext';

interface Task {
  id: string;
  title: string;
  description?: string;
  urgency: number;
  importance: number;
  quadrant: number;
  completed: boolean;
  createdAt: Date;
  completedAt: Date | null;
}

export const Matrix = () => {
  const { currentTheme } = useTheme();
  
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Reunião de Equipe',
      description: 'Alinhamento do projeto',
      urgency: 8,
      importance: 9,
      quadrant: 0,
      completed: false,
      createdAt: new Date(Date.now() - 86400000), // 1 dia atrás
      completedAt: null
    },
    {
      id: '2',
      title: 'Planejamento Estratégico',
      description: 'Definir metas para o próximo trimestre',
      urgency: 6,
      importance: 9,
      quadrant: 1,
      completed: false,
      createdAt: new Date(Date.now() - 172800000), // 2 dias atrás
      completedAt: null
    },
    {
      id: '3',
      title: 'Responder E-mails',
      description: 'Caixa de entrada',
      urgency: 7,
      importance: 4,
      quadrant: 2,
      completed: false,
      createdAt: new Date(Date.now() - 43200000), // 12 horas atrás
      completedAt: null
    },
    {
      id: '4',
      title: 'Assistir Netflix',
      description: 'Série favorita',
      urgency: 2,
      importance: 2,
      quadrant: 3,
      completed: false,
      createdAt: new Date(Date.now() - 21600000), // 6 horas atrás
      completedAt: null
    }
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeView, setActiveView] = useState<'matrix' | 'tasks' | 'completed'>('matrix');
  const [newTask, setNewTask] = useState<Omit<Task, 'id' | 'quadrant' | 'completed' | 'createdAt' | 'completedAt'>>({
    title: '',
    description: '',
    urgency: 5,
    importance: 5,
  });

  // Definição dos quadrantes usando as variáveis de cor do tema atual
  const quadrants = [
    { 
      title: 'Fazer', 
      description: 'Importante e Urgente',
      color: 'bg-error/80',
      borderColor: 'border-error',
      textColor: 'text-error-content'
    },
    { 
      title: 'Agendar', 
      description: 'Importante, mas Não Urgente',
      color: 'bg-success/80',
      borderColor: 'border-success',
      textColor: 'text-success-content'
    },
    { 
      title: 'Delegar', 
      description: 'Não Importante, mas Urgente',
      color: 'bg-warning/80',
      borderColor: 'border-warning',
      textColor: 'text-warning-content'
    },
    { 
      title: 'Eliminar', 
      description: 'Não Importante e Não Urgente',
      color: 'bg-secondary/80',
      borderColor: 'border-secondary',
      textColor: 'text-secondary-content'
    }
  ];

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(task));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, quadrantIndex: number) => {
    e.preventDefault();
    const taskData = e.dataTransfer.getData('text/plain');
    if (taskData) {
      const droppedTask = JSON.parse(taskData);
      
      const updatedTasks = tasks.map(task => 
        task.id === droppedTask.id 
          ? { ...task, quadrant: quadrantIndex } 
          : task
      );
      
      setTasks(updatedTasks);
    }
  };

  const handleAddTask = () => {
    const quadrant = 
      newTask.importance > 6 && newTask.urgency > 6 ? 0 :
      newTask.importance > 6 ? 1 :
      newTask.urgency > 6 ? 2 : 3;

    const newTaskItem: Task = {
      id: `task-${Date.now()}`,
      title: newTask.title,
      description: newTask.description,
      urgency: newTask.urgency,
      importance: newTask.importance,
      quadrant,
      completed: false,
      createdAt: new Date(),
      completedAt: null
    };

    setTasks([...tasks, newTaskItem]);
    setIsAddModalOpen(false);
    setNewTask({
      title: '',
      description: '',
      urgency: 5,
      importance: 5,
    });
  };
  
  const toggleTaskCompletion = (taskId: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const completedAt = !task.completed ? new Date() : null;
        return { ...task, completed: !task.completed, completedAt };
      }
      return task;
    }));
  };
  
  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  // Componente TaskCard
  const TaskCard = ({ task }: { task: Task }) => (
    <div 
      draggable 
      onDragStart={(e) => handleDragStart(e, task)}
      className={`p-3 rounded-lg border matrix-card transition-all duration-200 
        ${task.quadrant === 0 ? 'border-error bg-base-100' : 
              task.quadrant === 1 ? 'border-success bg-base-100' : 
              task.quadrant === 2 ? 'border-warning bg-base-100' : 
              'border-secondary bg-base-100'}
        ${task.completed ? 'opacity-60' : 'hover:scale-102'}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className={`font-bold text-lg ${task.completed ? 'line-through opacity-75' : ''}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className={`text-sm opacity-80 ${task.completed ? 'line-through' : ''}`}>
              {task.description}
            </p>
          )}
          <p className={`text-xs mt-1 opacity-60`}>
            Criada em: {formatDate(task.createdAt)}
          </p>
          {task.completed && task.completedAt && (
            <p className={`text-xs opacity-60`}>
              Concluída em: {formatDate(task.completedAt)}
            </p>
          )}
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => toggleTaskCompletion(task.id)}
            className={`flex-shrink-0 p-2 rounded-full transition-colors shadow-sm hover:shadow-md
            ${task.completed 
              ? 'bg-success text-success-content' 
              : 'bg-base-200 text-base-content hover:bg-base-300'}`}
          >
            <CheckCircle size={16} className={task.completed ? 'opacity-100' : 'opacity-50'} />
          </button>
          <button 
            onClick={() => deleteTask(task.id)}
            className={`flex-shrink-0 p-2 rounded-full transition-colors shadow-sm hover:shadow-md
            bg-base-200 text-error hover:bg-error hover:text-error-content`}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="theme-bg min-h-screen p-4 transition-colors duration-300">
      <Card className="max-w-7xl mx-auto rounded-xl overflow-hidden shadow-xl bg-base-100">
        <div className="flex justify-between items-center p-6 border-b border-base-300">
          <div>
            <h1 className="text-2xl font-bold text-base-content">Matriz de Eisenhower</h1>
            <p className="text-sm opacity-70 text-base-content">Organize suas tarefas por importância e urgência</p>
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={() => setActiveView('matrix')}
              className={`px-3 py-2 rounded-md transition-colors 
                ${activeView === 'matrix' 
                  ? 'bg-primary text-primary-content' 
                  : 'hover:bg-base-200 text-base-content'}`}
            >
              Matriz
            </button>
            <button 
              onClick={() => setActiveView('tasks')}
              className={`px-3 py-2 rounded-md transition-colors 
                ${activeView === 'tasks' 
                  ? 'bg-primary text-primary-content' 
                  : 'hover:bg-base-200 text-base-content'}`}
            >
              Tarefas
            </button>
            <button 
              onClick={() => setActiveView('completed')}
              className={`px-3 py-2 rounded-md transition-colors 
                ${activeView === 'completed' 
                  ? 'bg-primary text-primary-content' 
                  : 'hover:bg-base-200 text-base-content'}`}
            >
              Concluídas
            </button>
          </div>
          
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="btn btn-primary"
          >
            <Plus size={18} className="mr-1" />
            Nova Tarefa
          </button>
        </div>

        {activeView === 'matrix' && (
          <div className="grid grid-cols-2 gap-4 p-6">
            {quadrants.map((quadrant, index) => (
              <div 
                key={index} 
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                className={`p-4 rounded-lg ${quadrant.color} min-h-[400px] border-2 border-dashed 
                shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300
                ${quadrant.borderColor} hover:border-opacity-90 border-opacity-50 matrix-card`}
              >
                <div className="mb-4">
                  <h2 className={`text-xl font-bold ${quadrant.textColor}`}>
                    {quadrant.title}
                  </h2>
                  <p className={`text-sm ${quadrant.textColor} opacity-70`}>
                    {quadrant.description}
                  </p>
                </div>
                
                <div className="space-y-3 overflow-y-auto max-h-[320px] pr-1">
                  {tasks
                    .filter(task => task.quadrant === index && !task.completed)
                    .map(task => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeView === 'tasks' && (
          <div className="mb-6 p-6">
            <div className="mb-4">
              <h2 className="text-2xl font-bold mb-2 text-base-content">Todas as Tarefas</h2>
              <p className="text-sm opacity-70 text-base-content">Visualize e gerencie todas as suas tarefas em um só lugar</p>
            </div>
            
            <div className="p-4 rounded-lg dashboard-card bg-base-200">
              {tasks.length > 0 ? (
                <div className="space-y-3">
                  {tasks
                    .filter(task => !task.completed)
                    .sort((a, b) => {
                      if (a.quadrant !== b.quadrant) return a.quadrant - b.quadrant;
                      const aScore = a.importance * a.urgency;
                      const bScore = b.importance * b.urgency;
                      return bScore - aScore;
                    })
                    .map(task => (
                      <div 
                        key={task.id} 
                        className={`p-4 rounded-lg ${task.quadrant === 0 ? 'bg-error/20' : 
                                          task.quadrant === 1 ? 'bg-success/20' : 
                                          task.quadrant === 2 ? 'bg-warning/20' : 
                                          'bg-secondary/20'}`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center mb-1">
                              <span 
                                className={`inline-block w-3 h-3 rounded-full mr-2 ${
                                  task.quadrant === 0 ? 'bg-error' : 
                                  task.quadrant === 1 ? 'bg-success' : 
                                  task.quadrant === 2 ? 'bg-warning' : 
                                  'bg-secondary'}`}
                              />
                              <h3 className="font-bold text-lg text-base-content">{task.title}</h3>
                            </div>
                            {task.description && (
                              <p className="text-sm opacity-80 mb-2 text-base-content">{task.description}</p>
                            )}
                            <div className="flex flex-col space-y-1 text-xs opacity-70 mb-2 text-base-content">
                              <div className="flex space-x-4">
                                <span>Quadrante: {quadrants[task.quadrant].title}</span>
                                <span>Urgência: {task.urgency}/10</span>
                                <span>Importância: {task.importance}/10</span>
                              </div>
                              <span>Criada em: {formatDate(task.createdAt)}</span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => toggleTaskCompletion(task.id)}
                              className={`flex-shrink-0 p-2 rounded-full transition-colors
                              ${task.completed 
                                ? 'bg-success text-success-content' 
                                : 'bg-base-300 text-base-content hover:bg-base-300'}`}
                            >
                              <CheckCircle size={16} />
                            </button>
                            <button 
                              onClick={() => deleteTask(task.id)}
                              className="flex-shrink-0 p-2 rounded-full transition-colors bg-base-300 text-error hover:bg-error hover:text-error-content"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-lg mb-4 text-base-content">Nenhuma tarefa pendente</p>
                  <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="btn btn-primary"
                  >
                    Adicionar Tarefa
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeView === 'completed' && (
          <div className="mb-6 p-6">
            <div className="mb-4">
              <h2 className="text-2xl font-bold mb-2 text-base-content">Tarefas Concluídas</h2>
              <p className="text-sm opacity-70 text-base-content">Histórico de tarefas que você já finalizou</p>
            </div>
            
            <div className="p-4 rounded-lg dashboard-card bg-base-200">
              {tasks.filter(task => task.completed).length > 0 ? (
                <div className="space-y-3">
                  {tasks
                    .filter(task => task.completed)
                    .map(task => (
                      <div 
                        key={task.id} 
                        className={`p-4 rounded-lg shadow-md opacity-80 
                        ${task.quadrant === 0 ? 'bg-error/20' : 
                              task.quadrant === 1 ? 'bg-success/20' : 
                              task.quadrant === 2 ? 'bg-warning/20' : 
                              'bg-secondary/20'}`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center mb-1">
                              <span 
                                className={`inline-block w-3 h-3 rounded-full mr-2 ${
                                  task.quadrant === 0 ? 'bg-error' : 
                                  task.quadrant === 1 ? 'bg-success' : 
                                  task.quadrant === 2 ? 'bg-warning' : 
                                  'bg-secondary'}`}
                              />
                              <h3 className="font-bold text-lg line-through text-base-content">{task.title}</h3>
                              <span className="ml-2 text-xs px-2 py-1 bg-success text-success-content rounded-full">
                                Concluída
                              </span>
                            </div>
                            {task.description && (
                              <p className="text-sm opacity-80 mb-2 line-through text-base-content">{task.description}</p>
                            )}
                            <div className="flex flex-col space-y-1 text-xs opacity-70 text-base-content">
                              <span>Quadrante: {quadrants[task.quadrant].title}</span>
                              <span>Criada em: {formatDate(task.createdAt)}</span>
                              <span>Concluída em: {formatDate(task.completedAt)}</span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => toggleTaskCompletion(task.id)}
                              className="flex-shrink-0 p-2 rounded-full bg-success text-success-content"
                            >
                              <CheckCircle size={16} />
                            </button>
                            <button 
                              onClick={() => deleteTask(task.id)}
                              className="flex-shrink-0 p-2 rounded-full transition-colors bg-base-300 text-error hover:bg-error hover:text-error-content"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8 text-base-content">
                  <p className="text-lg">Nenhuma tarefa concluída ainda</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        <AddTaskModal 
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          newTask={newTask}
          setNewTask={setNewTask}
          onAddTask={handleAddTask}
        />
      </Card>
    </div>
  );
};

export default Matrix;
