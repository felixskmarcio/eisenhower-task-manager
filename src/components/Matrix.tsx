import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Clock, CheckCircle, Plus, Trash2, BarChart2, Activity, ChevronLeft, ChevronRight, Volume2, Headphones, X } from 'lucide-react';
import AddTaskModal from './AddTaskModal';
import EditTaskModal from './EditTaskModal';
import { formatDate } from '@/utils/dateUtils';
import TagFilterSelect from './TagFilterSelect';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
  timeSpent?: number;
  isTimerActive?: boolean;
  tags?: string[]; // Array of tag IDs for categorization
}

export const Matrix = () => {
  const [activeTimer, setActiveTimer] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60); // 25 minutes in seconds
  const [isBreak, setIsBreak] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const startTimer = (taskId: string) => {
    if (activeTimer && activeTimer !== taskId) {
      stopTimer();
    }

    setActiveTimer(taskId);
    setIsBreak(false);
    setTimeLeft(25 * 60);

    const newInterval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          if (!isBreak) {
            setIsBreak(true);
            return 5 * 60; // 5 minutes break
          } else {
            stopTimer();
            return 25 * 60;
          }
        }
        return prevTime - 1;
      });

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId
            ? { ...task, timeSpent: (task.timeSpent || 0) + 1, isTimerActive: true }
            : task
        )
      );
    }, 1000);

    setIntervalId(newInterval);
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, isTimerActive: true } : task
      )
    );
    toast({
      title: 'Timer iniciado',
      description: `Timer iniciado para a tarefa: ${tasks.find(t => t.id === taskId)?.title}`,
    });
  };

  const stopTimer = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setActiveTimer(null);
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.isTimerActive ? { ...task, isTimerActive: false } : task
      )
    );
    toast({
      title: 'Timer parado',
      description: 'Tempo registrado com sucesso!',
    });
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

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
      completedAt: null,
      tags: ['1', '4'] // Work, Office
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
      completedAt: null,
      tags: ['1'] // Work
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
      completedAt: null,
      tags: ['1', '4'] // Work, Office
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
      completedAt: null,
      tags: ['2'] // Personal
    }
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [activeView, setActiveView] = useState<'matrix' | 'tasks' | 'completed'>('matrix');
  const [newTask, setNewTask] = useState<Omit<Task, 'id' | 'quadrant' | 'completed' | 'createdAt' | 'completedAt'>>({    
    title: '',
    description: undefined,
    urgency: 5,
    importance: 5,
    tags: [],
  });
  
  const [tagFilters, setTagFilters] = useState<{
    project: string | null;
    context: string | null;
    lifearea: string | null;
  }>({
    project: null,
    context: null,
    lifearea: null,
  });

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  const handleSaveTask = (editedTask: Task) => {
    setTasks(tasks.map(task => task.id === editedTask.id ? editedTask : task));
    toast({
      title: 'Tarefa atualizada',
      description: 'As alterações foram salvas com sucesso!',
    });
  };

  const [selectedDate, setSelectedDate] = useState<number>(14); // Default to day 14
  const [salesData, setSalesData] = useState<number[]>([4, 6, 8, 10, 5, 7, 9, 12, 14, 16, 13, 15, 18, 20, 17, 19]);
  const [pageScore, setPageScore] = useState<number>(91);
  const [recentOrders, setRecentOrders] = useState([
    { name: 'Charlie Chapman', status: 'send' },
    { name: 'Howard Hudson', status: 'failed' },
    { name: 'Fiona Fisher', status: 'in progress' },
    { name: 'Nick Nelson', status: 'completed' },
    { name: 'Amanda Anderson', status: 'completed' },
  ]);
  
  const quadrants = [
    { 
      title: 'Fazer', 
      description: 'Importante e Urgente',
      color: 'bg-gradient-to-br from-[#44253b]/95 to-[#2a1423]/98 backdrop-blur-md',
      borderColor: 'border-[#ff79c6]',
      textColor: 'text-[#ff79c6]'
    },
    { 
      title: 'Agendar', 
      description: 'Importante, mas Não Urgente',
      color: 'bg-gradient-to-br from-[#253844]/95 to-[#142a2a]/98 backdrop-blur-md',
      borderColor: 'border-[#8be9fd]',
      textColor: 'text-[#8be9fd]'
    },
    { 
      title: 'Delegar', 
      description: 'Não Importante, mas Urgente',
      color: 'bg-gradient-to-br from-[#443825]/95 to-[#2a2314]/98 backdrop-blur-md',
      borderColor: 'border-[#f1fa8c]',
      textColor: 'text-[#f1fa8c]'
    },
    { 
      title: 'Eliminar', 
      description: 'Não Importante e Não Urgente',
      color: 'bg-gradient-to-br from-[#252844]/95 to-[#14142a]/98 backdrop-blur-md',
      borderColor: 'border-[#bd93f9]',
      textColor: 'text-[#bd93f9]'
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
    const newTaskQuadrant = calculateQuadrant(newTask.urgency, newTask.importance);
    const createdTask: Task = {
      ...newTask,
      id: Date.now().toString(),
      quadrant: newTaskQuadrant,
      completed: false,
      createdAt: new Date(),
      completedAt: null
    };
    setTasks([...tasks, createdTask]);
    setIsAddModalOpen(false);
    setNewTask({
      title: '',
      description: undefined,
      urgency: 5,
      importance: 5,
      tags: []
    });
    toast({
      title: 'Tarefa adicionada',
      description: 'Nova tarefa criada com sucesso!'
    });
  };

  const calculateQuadrant = (urgency: number, importance: number): number => {
    if (urgency > 5 && importance > 5) return 0;
    if (urgency <= 5 && importance > 5) return 1;
    if (urgency > 5 && importance <= 5) return 2;
    return 3;
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const completedAt = !task.completed ? new Date() : null;
        const newTask = { ...task, completed: !task.completed, completedAt };
        if (newTask.completed) {
          setActiveView('completed');
        }
        return newTask;
      }
      return task;
    }));
  };
  
  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const TaskCard = ({ task }: { task: Task }) => (
    <div 
      draggable 
      onDragStart={(e) => handleDragStart(e, task)}
      onDoubleClick={() => handleEditTask(task)}
      className={`p-4 rounded-xl border matrix-card transition-all duration-300 shadow-md hover:shadow-lg 
        ${task.quadrant === 0 ? 'border-[#ff79c6]/50 bg-[#282a36]/90 hover:border-[#ff79c6]' : 
              task.quadrant === 1 ? 'border-[#8be9fd]/50 bg-[#282a36]/90 hover:border-[#8be9fd]' : 
              task.quadrant === 2 ? 'border-[#f1fa8c]/50 bg-[#282a36]/90 hover:border-[#f1fa8c]' : 
              'border-[#bd93f9]/50 bg-[#282a36]/90 hover:border-[#bd93f9]'}
        ${task.completed ? 'opacity-75' : 'hover:scale-[1.02]'} backdrop-blur-sm`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className={`font-bold text-lg ${task.completed ? 'line-through opacity-75' : task.quadrant === 0 ? 'text-[#ff79c6]' : 
              task.quadrant === 1 ? 'text-[#8be9fd]' : 
              task.quadrant === 2 ? 'text-[#f1fa8c]' : 
              'text-[#bd93f9]'}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className={`text-sm text-white/85 mt-1 ${task.completed ? 'line-through' : ''}`}>
              {task.description}
            </p>
          )}
          <p className={`text-xs mt-2 text-white/70`}>
            Criada em: {formatDate(task.createdAt)}
          </p>
          {task.completed && task.completedAt && (
            <p className={`text-xs text-white/70`}>
              Concluída em: {formatDate(task.completedAt)}
            </p>
          )}
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => toggleTaskCompletion(task.id)}
            className={`flex-shrink-0 p-2 rounded-full transition-all duration-300 shadow-sm hover:shadow-md
            ${task.completed 
              ? 'bg-[#50fa7b] text-[#282a36]' 
              : 'bg-[#44475a]/90 text-white hover:bg-[#6272a4] hover:text-white'}`}
            title={task.completed ? "Desmarcar tarefa" : "Concluir tarefa"}
          >
            <CheckCircle size={16} className={task.completed ? 'opacity-100' : 'opacity-85'} />
          </button>
          <button 
            onClick={() => deleteTask(task.id)}
            className={`flex-shrink-0 p-2 rounded-full transition-all duration-300 shadow-sm hover:shadow-md
            bg-[#44475a]/90 text-[#ff5555] hover:bg-[#ff5555] hover:text-white`}
            title="Excluir tarefa"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  const BarChart = () => {
    const maxValue = Math.max(...salesData);
    
    return (
      <div className="flex items-end h-24 gap-1">
        {salesData.map((value, index) => (
          <div 
            key={index} 
            className="bg-white w-3 rounded-t-sm" 
            style={{ height: `${(value / maxValue) * 100}%` }}
          />
        ))}
      </div>
    );
  };

  const Calendar = () => {
    const days = [12, 13, 14, 15, 16, 17, 18];
    const weekdays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    
    return (
      <div className="flex justify-between">
        {days.map((day, index) => (
          <div 
            key={index} 
            onClick={() => setSelectedDate(day)}
            className={`flex flex-col items-center cursor-pointer ${selectedDate === day ? 'bg-[#bd93f9] text-white rounded-md' : ''} p-2`}
          >
            <span className="text-xs">{weekdays[index]}</span>
            <span className="font-medium">{day}</span>
          </div>
        ))}
      </div>
    );
  };

  const OrderStatus = ({ status }: { status: string }) => {
    const getStatusStyles = () => {
      switch (status) {
        case 'send':
          return 'bg-blue-500 text-white';
        case 'failed':
          return 'bg-red-500 text-white';
        case 'in progress':
          return 'bg-yellow-500 text-black';
        case 'completed':
          return 'bg-green-500 text-white';
        default:
          return 'bg-gray-500 text-white';
      }
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs ${getStatusStyles()}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="container mx-auto p-6 mt-20 bg-[#1e1f29]/60 min-h-fit rounded-xl backdrop-blur-sm">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#ff79c6] to-[#bd93f9] bg-clip-text text-transparent drop-shadow-sm">
          Matriz de Eisenhower
        </h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-gradient-to-r from-[#ff79c6] to-[#bd93f9] text-white px-4 py-2 flex items-center gap-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
        >
          <Plus size={20} />
          Nova Tarefa
        </button>
      </div>

      <Tabs defaultValue="matrix" className="w-full">
        <TabsList className="bg-[#282a36]/90 mb-4 shadow-md">
          <TabsTrigger value="matrix" className="data-[state=active]:bg-[#44475a] data-[state=active]:text-white">Matriz</TabsTrigger>
          <TabsTrigger value="completed" className="data-[state=active]:bg-[#44475a] data-[state=active]:text-white">Concluídas</TabsTrigger>
          <TabsTrigger value="all" className="data-[state=active]:bg-[#44475a] data-[state=active]:text-white">Todas</TabsTrigger>
        </TabsList>

        <TabsContent value="matrix">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quadrants.map((quadrant, index) => (
              <div
                key={index}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                className={`p-6 rounded-xl ${quadrant.color} min-h-[10vh] shadow-xl border ${quadrant.borderColor}/40 backdrop-filter hover:shadow-2xl transition-all duration-300`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className={`text-2xl font-bold ${quadrant.textColor} drop-shadow-sm`}>{quadrant.title}</h2>
                    <p className={`text-sm ${quadrant.textColor} opacity-90 mt-1`}>{quadrant.description}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {tasks
                    .filter(task => task.quadrant === index && !task.completed)
                    .map(task => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#50fa7b] drop-shadow-sm">Tarefas Concluídas</h2>
            <div className="grid gap-3">
              {tasks
                .filter(task => task.completed)
                .sort((a, b) => (b.completedAt?.getTime() || 0) - (a.completedAt?.getTime() || 0))
                .map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="all">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#50fa7b] drop-shadow-sm">Todas as Tarefas</h2>
            <div className="grid gap-3">
              {tasks
                .sort((a, b) => (b.createdAt.getTime() || 0) - (a.createdAt.getTime() || 0))
                .map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        newTask={newTask}
        setNewTask={setNewTask}
        onAddTask={handleAddTask}
        isDarkMode={true}
      />

      {selectedTask && (
        <EditTaskModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          task={selectedTask}
          onSave={handleSaveTask}
          isDarkMode={true}
        />
      )}
    </div>
  );
};

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <button onClick={() => startTimer(task.id)}>
        <Clock className="h-4 w-4" />
      </button>
    </TooltipTrigger>
    <TooltipContent>
      <p>Iniciar timer para esta tarefa</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>

// Aplicar tooltips similares para outros botões de ação
