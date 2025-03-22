import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Clock, CheckCircle, Plus, Trash2, BarChart2, Activity, ChevronLeft, ChevronRight, Volume2, Headphones, X, LayoutGrid } from 'lucide-react';
import AddTaskModal from './AddTaskModal';
import EditTaskModal from './EditTaskModal';
import { formatDate } from '@/utils/dateUtils';
import TagFilterSelect from './TagFilterSelect';
import { useToast } from '@/components/ui/use-toast';
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
  const { toast } = useToast();
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

  // Determinar modo escuro (para os modais)
  const [isDarkMode] = useState(true); // Fixado como dark mode

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  const handleSaveTask = (editedTask: {
    id: string;
    title: string;
    description: string;
    urgency: number;
    importance: number;
    completed: boolean;
    tags?: string[];
  }) => {
    // Converter para o tipo Task
    const updatedTask: Task = {
      ...editedTask,
      quadrant: calculateQuadrant(editedTask.urgency, editedTask.importance),
      createdAt: tasks.find(t => t.id === editedTask.id)?.createdAt || new Date(),
      completedAt: editedTask.completed ? (tasks.find(t => t.id === editedTask.id)?.completedAt || new Date()) : null
    };
    
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
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

  // Componente de quadrante responsivo
  const QuadrantContainer = ({ title, description, children, urgentLabel, importantLabel, colorClass }: {
    title: string;
    description: string;
    children: React.ReactNode;
    urgentLabel: string;
    importantLabel: string;
    colorClass: string;
  }) => (
    <div 
      className={`p-2 border rounded-lg transition-all ${colorClass}`}
    >
      <div className="p-2">
        <h3 className="text-base md:text-lg font-semibold mb-1">{title}</h3>
        <p className="text-xs md:text-sm text-muted-foreground mb-2 hidden md:block">{description}</p>
        <div className="flex flex-wrap gap-1 mb-2">
          <span className={`text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary inline-flex items-center gap-1`}>
            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
            {importantLabel}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 inline-flex items-center gap-1`}>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            {urgentLabel}
          </span>
        </div>
        <div className="min-h-[80px] md:min-h-[200px]">
          {children}
        </div>
      </div>
    </div>
  );

  // Botão de ação flutuante para criar novas tarefas em dispositivos móveis
  const FloatingActionButton = ({ onClick }: { onClick: () => void }) => (
    <button
      onClick={onClick}
      className="fixed bottom-20 right-4 z-40 md:hidden flex items-center justify-center w-14 h-14 rounded-full bg-primary shadow-lg text-white"
      aria-label="Nova tarefa"
    >
      <Plus className="h-6 w-6" />
    </button>
  );

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  // Lista de tags disponíveis
  const availableTags = [
    { id: '1', name: 'Trabalho', color: '#ff79c6' },
    { id: '2', name: 'Pessoal', color: '#8be9fd' },
    { id: '3', name: 'Saúde', color: '#50fa7b' },
    { id: '4', name: 'Escritório', color: '#bd93f9' },
    { id: '5', name: 'Casa', color: '#f1fa8c' }
  ];
  
  // Função para filtrar tarefas por tags
  const handleTagFilter = (type: 'project' | 'context' | 'lifearea', value: string | null) => {
    setTagFilters(prev => ({
      ...prev,
      [type]: value
    }));
  };
  
  // Função para adicionar nova tarefa
  const handleNewTaskAdded = (task: Omit<Task, 'id' | 'quadrant' | 'completed' | 'createdAt' | 'completedAt'>) => {
    const newTaskQuadrant = calculateQuadrant(task.urgency, task.importance);
    const createdTask: Task = {
      ...task,
      id: Date.now().toString(),
      quadrant: newTaskQuadrant,
      completed: false,
      createdAt: new Date(),
      completedAt: null
    };
    setTasks([...tasks, createdTask]);
    toast({
      title: 'Tarefa adicionada',
      description: 'Nova tarefa criada com sucesso!'
    });
  };
  
  // Função para renderizar tarefas em cada quadrante
  const renderTasks = (quadrantNumber: number) => {
    const filteredTasks = tasks.filter(task => {
      // Filtrar por quadrante e se não está concluída
      const matchesQuadrant = task.quadrant === quadrantNumber - 1;
      const matchesCompletion = !task.completed;
      
      // Filtrar por tags se houver tags selecionadas
      const matchesTags = selectedTags.length === 0 || 
                           (task.tags && task.tags.some(tag => selectedTags.includes(tag)));
      
      // Filtrar por tipo de tag (projeto, contexto, área de vida)
      const matchesProjectFilter = !tagFilters.project || 
                                   (task.tags && task.tags.includes(tagFilters.project));
      const matchesContextFilter = !tagFilters.context || 
                                   (task.tags && task.tags.includes(tagFilters.context));
      const matchesLifeareaFilter = !tagFilters.lifearea || 
                                   (task.tags && task.tags.includes(tagFilters.lifearea));
      
      return matchesQuadrant && matchesCompletion && matchesTags && 
             matchesProjectFilter && matchesContextFilter && matchesLifeareaFilter;
    });
    
    return (
      <div className="space-y-2">
        {filteredTasks.length === 0 ? (
          <div className="text-center p-4 text-muted-foreground text-sm">
            Nenhuma tarefa neste quadrante
          </div>
        ) : (
          filteredTasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))
        )}
      </div>
    );
  };

  return (
    <div className="w-full mx-auto relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-1 text-center md:text-left">Matriz de Eisenhower</h2>
          <p className="text-muted-foreground text-sm md:text-base text-center md:text-left">
            Gerencie suas tarefas usando o método de priorização eficiente
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-2 md:gap-4 justify-center sm:justify-end">
          <div className="w-full sm:w-auto">
            <TagFilterSelect 
              type="project" 
              value={tagFilters.project} 
              onChange={(value) => handleTagFilter('project', value)} 
            />
          </div>
          
          <div className="flex justify-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="p-2 bg-primary text-white rounded-lg transition-colors hover:bg-primary-dark"
                    title="Adicionar nova tarefa"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Nova Tarefa</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      <Tabs defaultValue="matriz" className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto mb-6">
          <TabsTrigger value="matriz" className="text-sm">
            <div className="flex items-center gap-1">
              <LayoutGrid className="h-4 w-4" />
              <span className="hidden sm:inline">Matriz</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="concluidas" className="text-sm">
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Concluídas</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="todas" className="text-sm">
            <div className="flex items-center gap-1">
              <BarChart2 className="h-4 w-4" />
              <span className="hidden sm:inline">Todas</span>
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="matriz" className="space-y-4">
          {/* Mobile layout - Vertical stacking */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            <QuadrantContainer
              title="Urgente e Importante"
              description="Faça primeiro: Crises, problemas urgentes, tarefas com prazo"
              urgentLabel="Urgente"
              importantLabel="Importante"
              colorClass="bg-gradient-to-br from-red-50 to-orange-50 border-red-200/30"
            >
              {renderTasks(1)}
            </QuadrantContainer>
            
            <QuadrantContainer
              title="Importante, Não Urgente"
              description="Planeje: Preparação, prevenção, planejamento e relacionamentos"
              urgentLabel="Não urgente"
              importantLabel="Importante"
              colorClass="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200/30"
            >
              {renderTasks(2)}
            </QuadrantContainer>
            
            <QuadrantContainer
              title="Urgente, Não Importante"
              description="Delegue: Interrupções, reuniões, e-mails, chamadas"
              urgentLabel="Urgente"
              importantLabel="Não importante"
              colorClass="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200/30"
            >
              {renderTasks(3)}
            </QuadrantContainer>
            
            <QuadrantContainer
              title="Não Urgente, Não Importante"
              description="Elimine: Distrações, tarefas triviais, tempo perdido"
              urgentLabel="Não urgente"
              importantLabel="Não importante"
              colorClass="bg-gradient-to-br from-green-50 to-teal-50 border-green-200/30"
            >
              {renderTasks(4)}
            </QuadrantContainer>
          </div>
          
          {/* Desktop layout - 2x2 grid */}
          <div className="hidden md:grid md:grid-cols-2 gap-4">
            <QuadrantContainer
              title="Urgente e Importante"
              description="Faça primeiro: Crises, problemas urgentes, tarefas com prazo"
              urgentLabel="Urgente"
              importantLabel="Importante"
              colorClass="bg-gradient-to-br from-red-50 to-orange-50 border-red-200/30"
            >
              {renderTasks(1)}
            </QuadrantContainer>
            
            <QuadrantContainer
              title="Importante, Não Urgente"
              description="Planeje: Preparação, prevenção, planejamento e relacionamentos"
              urgentLabel="Não urgente"
              importantLabel="Importante"
              colorClass="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200/30"
            >
              {renderTasks(2)}
            </QuadrantContainer>
            
            <QuadrantContainer
              title="Urgente, Não Importante"
              description="Delegue: Interrupções, reuniões, e-mails, chamadas"
              urgentLabel="Urgente"
              importantLabel="Não importante"
              colorClass="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200/30"
            >
              {renderTasks(3)}
            </QuadrantContainer>
            
            <QuadrantContainer
              title="Não Urgente, Não Importante"
              description="Elimine: Distrações, tarefas triviais, tempo perdido"
              urgentLabel="Não urgente"
              importantLabel="Não importante"
              colorClass="bg-gradient-to-br from-green-50 to-teal-50 border-green-200/30"
            >
              {renderTasks(4)}
            </QuadrantContainer>
          </div>
        </TabsContent>

        <TabsContent value="concluidas">
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

        <TabsContent value="todas">
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

      {isAddModalOpen && (
        <AddTaskModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAddTask={handleAddTask}
          newTask={newTask}
          setNewTask={setNewTask}
          isDarkMode={isDarkMode}
        />
      )}
      
      {selectedTask && (
        <EditTaskModal
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          onSave={handleSaveTask}
          task={{
            id: selectedTask.id,
            title: selectedTask.title,
            description: selectedTask.description || '',  // Garantir que description seja uma string
            urgency: selectedTask.urgency,
            importance: selectedTask.importance,
            completed: selectedTask.completed,
            tags: selectedTask.tags
          }}
          isDarkMode={isDarkMode}
        />
      )}

      {/* Botão de ação flutuante para dispositivos móveis */}
      <FloatingActionButton onClick={() => setIsAddModalOpen(true)} />
    </div>
  );
};
