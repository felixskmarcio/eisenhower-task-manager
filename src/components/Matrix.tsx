import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Clock, CheckCircle, Plus, Trash2, BarChart2, Activity, ChevronLeft, ChevronRight, Volume2, Headphones } from 'lucide-react';
import AddTaskModal from './AddTaskModal';
import { formatDate } from '@/utils/dateUtils';

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
  const [newTask, setNewTask] = useState<Omit<Task, 'id' | 'quadrant' | 'completed' | 'createdAt' | 'completedAt'>>({    title: '',
    description: '',
    urgency: 5,
    importance: 5,
  });
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
  
  // Definição dos quadrantes usando as variáveis de cor do tema atual
  const quadrants = [
    { 
      title: 'Fazer', 
      description: 'Importante e Urgente',
      color: 'bg-gradient-to-br from-[#44253b]/90 to-[#2a1423]/95 backdrop-blur-md',
      borderColor: 'border-[#ff79c6]',
      textColor: 'text-[#ff79c6]'
    },
    { 
      title: 'Agendar', 
      description: 'Importante, mas Não Urgente',
      color: 'bg-gradient-to-br from-[#253844]/90 to-[#142a2a]/95 backdrop-blur-md',
      borderColor: 'border-[#8be9fd]',
      textColor: 'text-[#8be9fd]'
    },
    { 
      title: 'Delegar', 
      description: 'Não Importante, mas Urgente',
      color: 'bg-gradient-to-br from-[#443825]/90 to-[#2a2314]/95 backdrop-blur-md',
      borderColor: 'border-[#f1fa8c]',
      textColor: 'text-[#f1fa8c]'
    },
    { 
      title: 'Eliminar', 
      description: 'Não Importante e Não Urgente',
      color: 'bg-gradient-to-br from-[#252844]/90 to-[#14142a]/95 backdrop-blur-md',
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

  // Componente TaskCard
  const TaskCard = ({ task }: { task: Task }) => (
    <div 
      draggable 
      onDragStart={(e) => handleDragStart(e, task)}
      className={`p-4 rounded-xl border matrix-card transition-all duration-300 shadow-md hover:shadow-lg 
        ${task.quadrant === 0 ? 'border-[#ff79c6]/30 bg-[#282a36]/70 hover:border-[#ff79c6]/80' : 
              task.quadrant === 1 ? 'border-[#8be9fd]/30 bg-[#282a36]/70 hover:border-[#8be9fd]/80' : 
              task.quadrant === 2 ? 'border-[#f1fa8c]/30 bg-[#282a36]/70 hover:border-[#f1fa8c]/80' : 
              'border-[#bd93f9]/30 bg-[#282a36]/70 hover:border-[#bd93f9]/80'}
        ${task.completed ? 'opacity-60' : 'hover:scale-[1.02]'} backdrop-blur-sm`}
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
            <p className={`text-sm text-gray-300 mt-1 ${task.completed ? 'line-through' : ''}`}>
              {task.description}
            </p>
          )}
          <p className={`text-xs mt-2 text-gray-400`}>
            Criada em: {formatDate(task.createdAt)}
          </p>
          {task.completed && task.completedAt && (
            <p className={`text-xs text-gray-400`}>
              Concluída em: {formatDate(task.completedAt)}
            </p>
          )}
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => toggleTaskCompletion(task.id)}
            className={`flex-shrink-0 p-2 rounded-full transition-all duration-300 shadow-sm hover:shadow-md
            ${task.completed 
              ? 'bg-[#50fa7b]/90 text-[#282a36]' 
              : 'bg-[#44475a] text-gray-300 hover:bg-[#6272a4] hover:text-white'}`}
          >
            <CheckCircle size={16} className={task.completed ? 'opacity-100' : 'opacity-70'} />
          </button>
          <button 
            onClick={() => deleteTask(task.id)}
            className={`flex-shrink-0 p-2 rounded-full transition-all duration-300 shadow-sm hover:shadow-md
            bg-[#44475a] text-[#ff5555] hover:bg-[#ff5555] hover:text-white`}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  // Componente para renderizar o gráfico de barras
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

  // Componente para renderizar o calendário
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

  // Componente para renderizar o status de um pedido
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
    <div className="container mx-auto p-6 mt-20 bg-[#1e1f29]/50 min-h-fit rounded-xl backdrop-blur-sm">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#ff79c6] to-[#bd93f9] bg-clip-text text-transparent">
          Matriz de Eisenhower
        </h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-gradient-to-r from-[#ff79c6] to-[#bd93f9] text-white px-4 py-2 flex items-center gap-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:opacity-90"
        >
          <Plus size={20} />
          Nova Tarefa
        </button>
      </div>

      <Tabs defaultValue="matrix" className="w-full">
        <TabsList className="bg-[#282a36] mb-4">
          <TabsTrigger value="matrix">Matriz</TabsTrigger>
          <TabsTrigger value="completed">Concluídas</TabsTrigger>
          <TabsTrigger value="all">Todas</TabsTrigger>
        </TabsList>

        <TabsContent value="matrix">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quadrants.map((quadrant, index) => (
              <div
                key={index}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                className={`p-6 rounded-xl ${quadrant.color} min-h-[10vh] shadow-xl border ${quadrant.borderColor}/30 backdrop-filter hover:shadow-2xl transition-all duration-300`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className={`text-2xl font-bold ${quadrant.textColor}`}>{quadrant.title}</h2>
                    <p className={`text-sm ${quadrant.textColor} opacity-80 mt-1`}>{quadrant.description}</p>
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
            <h2 className="text-2xl font-bold text-[#50fa7b]">Tarefas Concluídas</h2>
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
            <h2 className="text-2xl font-bold text-[#50fa7b]">Todas as Tarefas</h2>
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
    </div>
  );
};