import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Clock, CheckCircle, Plus, Trash2, BarChart2, Activity, ChevronLeft, ChevronRight, Volume2, Headphones, X, LayoutGrid, AlertTriangle, Calendar as LucideCalendar, CalendarIcon } from 'lucide-react';
import AddTaskModal from './AddTaskModal';
import EditTaskModal from './EditTaskModal';
import { formatDate } from '@/utils/dateUtils';
import TagFilterSelect from './TagFilterSelect';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { motion } from 'framer-motion';
import { Tag } from '../contexts/TagContext';

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
  start_date?: string | null;
}

// Type for new task that excludes certain properties that will be generated when created
type NewTask = Omit<Task, 'id' | 'quadrant' | 'completed' | 'createdAt' | 'completedAt'>;

// Definir a interface para o resultado de drag-and-drop
interface DragResult {
  draggableId: string;
  type: string;
  source: {
    droppableId: string;
    index: number;
  };
  destination: {
    droppableId: string;
    index: number;
  } | null;
  reason: 'DROP' | 'CANCEL';
}

export const Matrix = () => {
  const { toast } = useToast();
  const [activeTimer, setActiveTimer] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60); // 25 minutes in seconds
  const [isBreak, setIsBreak] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [timerElapsed, setTimerElapsed] = useState<number>(0);
  const [taskTimeSpent, setTaskTimeSpent] = useState<{[key: string]: number}>({});

  // Lista de tags disponíveis (movida para o início do componente)
  const availableTags = [
    { id: '1', name: 'Trabalho', color: '#ff79c6' },
    { id: '2', name: 'Pessoal', color: '#8be9fd' },
    { id: '3', name: 'Saúde', color: '#50fa7b' },
    { id: '4', name: 'Escritório', color: '#bd93f9' },
    { id: '5', name: 'Casa', color: '#f1fa8c' }
  ];

  // Limpar o intervalo quando o componente for desmontado
  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  const startTimer = (taskId: string) => {
    if (activeTimer && activeTimer !== taskId) {
      stopTimer();
    }

    setActiveTimer(taskId);
    setIsBreak(false);
    setTimeLeft(25 * 60);
    setTimerElapsed(0);
    
    // Inicializar ou recuperar o tempo já gasto na tarefa
    const currentTask = tasks.find(t => t.id === taskId);
    setTaskTimeSpent(prev => ({
      ...prev,
      [taskId]: currentTask?.timeSpent || 0
    }));

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

      // Atualizar apenas o tempo decorrido sem modificar o estado das tarefas a cada segundo
      setTimerElapsed(prev => prev + 1);
      
      // Atualiza o tempo gasto na tarefa atual em um objeto separado
      setTaskTimeSpent(prev => ({
        ...prev,
        [taskId]: (prev[taskId] || 0) + 1
      }));
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
    
    if (activeTimer && timerElapsed > 0) {
      // Atualizar o tempo total gasto na tarefa quando o timer parar
      const totalTimeSpent = taskTimeSpent[activeTimer] || 0;
      
      const updatedTasks = tasks.map((task) =>
        task.id === activeTimer
          ? { ...task, timeSpent: totalTimeSpent, isTimerActive: false }
          : task.isTimerActive ? { ...task, isTimerActive: false } : task
      );
      
      setTasks(updatedTasks);
      // Salvar as tarefas atualizadas no localStorage
      saveTasksToLocalStorage(updatedTasks);
    } else {
      const updatedTasks = tasks.map((task) =>
        task.isTimerActive ? { ...task, isTimerActive: false } : task
      );
      
      setTasks(updatedTasks);
      // Salvar as tarefas atualizadas no localStorage
      saveTasksToLocalStorage(updatedTasks);
    }
    
    setActiveTimer(null);
    setTimerElapsed(0);
    
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
  const [newTask, setNewTask] = useState<NewTask>({    
    title: '',
    description: undefined,
    urgency: 5,
    importance: 5,
    tags: [],
    start_date: null
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
    start_date?: string | Date | null;
    tags?: string[];
  }) => {
    // Converter para o tipo Task
    const updatedTask: Task = {
      ...editedTask,
      quadrant: calculateQuadrant(editedTask.urgency, editedTask.importance),
      createdAt: tasks.find(t => t.id === editedTask.id)?.createdAt || new Date(),
      completedAt: editedTask.completed ? (tasks.find(t => t.id === editedTask.id)?.completedAt || new Date()) : null,
      start_date: editedTask.start_date ? 
        (typeof editedTask.start_date === 'string' ? 
          editedTask.start_date : 
          editedTask.start_date.toISOString()) : 
        null
    };
    
    const updatedTasks = tasks.map(task => task.id === updatedTask.id ? updatedTask : task);
    updateTasks(updatedTasks);
    
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
    // Adicionar classe para efeito visual
    const element = e.currentTarget as HTMLElement;
    element.classList.add('dragging');
    
    // Adicionar ghost element para feedback visual
    const rect = element.getBoundingClientRect();
    const ghostElement = document.createElement('div');
    ghostElement.classList.add('drag-ghost');
    ghostElement.style.width = `${rect.width}px`;
    ghostElement.style.height = `${rect.height}px`;
    ghostElement.style.left = `${rect.left}px`;
    ghostElement.style.top = `${rect.top}px`;
    document.body.appendChild(ghostElement);
    
    // Customizar imagem de arrasto para melhor experiência
    const dragImage = document.createElement('div');
    dragImage.style.width = '1px';
    dragImage.style.height = '1px';
    dragImage.style.opacity = '0';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 0, 0);
    
    // Adicionar efeito visual à tarefa
    element.style.transform = 'scale(1.05) rotate(1deg)';
    
    // Limpar elementos temporários após o próximo ciclo de renderização
    setTimeout(() => {
      document.body.removeChild(dragImage);
      // Não remover o ghost element ainda, será removido no dragEnd
    }, 0);
    
    // Armazenar referência ao ghost element para remoção posterior
    (e.currentTarget as any)._ghostElement = ghostElement;
    // Armazenar a tarefa que está sendo arrastada
    (document as any)._draggedTask = task;
  };

  const handleDragEnd = (e: React.DragEvent) => {
    // Remover ghost element
    const elements = document.querySelectorAll('.dragging');
    elements.forEach(element => {
      element.classList.remove('dragging');
      const ghostElement = (element as any)._ghostElement;
      if (ghostElement && ghostElement.parentNode) {
        ghostElement.parentNode.removeChild(ghostElement);
      }
      (element as HTMLElement).style.transform = '';
    });
    
    // Limpar a tarefa arrastada
    (document as any)._draggedTask = null;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    // Adicionar efeito visual na zona de soltar
    const element = e.currentTarget as HTMLElement;
    element.classList.add('dropzone-hover');
    element.classList.add('quadrant-highlight');
    element.classList.add('active');
    
    // Atualizar posição do ghost element
    const draggingElements = document.querySelectorAll('.dragging');
    draggingElements.forEach(draggingElement => {
      const ghostElement = (draggingElement as any)._ghostElement;
      if (ghostElement) {
        // Calcular posição dentro do quadrante para o ghost element
        const rect = element.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;
        
        // Limitar ao tamanho do quadrante
        const maxX = rect.width - ghostElement.offsetWidth;
        const maxY = rect.height - ghostElement.offsetHeight;
        const limitedX = Math.max(0, Math.min(offsetX, maxX));
        const limitedY = Math.max(0, Math.min(offsetY, maxY));
        
        ghostElement.style.top = `${limitedY + rect.top}px`;
        ghostElement.style.left = `${limitedX + rect.left}px`;
        ghostElement.style.opacity = '0.2';
      }
    });
    
    // Indicar que o drop é permitido
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Remover efeito visual quando o cursor sair da zona
    const element = e.currentTarget as HTMLElement;
    element.classList.remove('dropzone-hover');
    element.classList.remove('active');
  };

  const handleDrop = (e: React.DragEvent, quadrantIndex: number) => {
    e.preventDefault();
    // Remover efeito visual da zona de soltar
    const element = e.currentTarget as HTMLElement;
    element.classList.remove('dropzone-hover');
    element.classList.remove('active');
    
    const taskData = e.dataTransfer.getData('text/plain');
    if (taskData) {
      try {
        const droppedTask = JSON.parse(taskData);
        
        // Verificar se o quadrante mudou
        if (droppedTask.quadrant !== quadrantIndex) {
          // Animação de destaque na tarefa sendo movida
          const taskElement = document.getElementById(`task-${droppedTask.id}`);
          if (taskElement) {
            // Adicionar classe para animar a transição
            taskElement.style.transition = 'all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
            taskElement.style.transform = 'scale(1.08)';
            taskElement.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.2)';
            
            // Restaurar após a animação
            setTimeout(() => {
              taskElement.style.transform = '';
              taskElement.style.boxShadow = '';
            }, 600);
          }
          
          const updatedTasks = tasks.map(task => 
            task.id === droppedTask.id 
              ? { ...task, quadrant: quadrantIndex } 
              : task
          );
          
          // Atualizar as tarefas e salvar no localStorage
          updateTasks(updatedTasks);
          
          // Adicionar efeito visual de destaque temporário ao quadrante de destino
          element.style.transition = 'box-shadow 0.4s ease, background-color 0.4s ease';
          element.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.7)';
          element.style.backgroundColor = 'rgba(99, 102, 241, 0.1)';
          
          setTimeout(() => {
            element.style.boxShadow = '';
            element.style.backgroundColor = '';
          }, 800);
          
          // Mostrar notificação com ícone relevante
          toast({
            title: 'Tarefa movida',
            description: `Tarefa "${droppedTask.title}" movida para ${
              quadrantIndex === 0 ? 'Urgente e Importante' :
              quadrantIndex === 1 ? 'Importante, Não Urgente' :
              quadrantIndex === 2 ? 'Urgente, Não Importante' :
              'Não Urgente, Não Importante'
            }`,
          });
        }
      } catch (error) {
        console.error("Erro ao processar a tarefa arrastada:", error);
        toast({
          title: 'Erro',
          description: 'Ocorreu um erro ao mover a tarefa.',
        });
      }
    }
  };

  // Função para gerar UUIDs válidos
  const generateUUID = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  // Modificar a função handleAddTask para usar UUIDs
  const handleAddTask = () => {
    const newTaskQuadrant = calculateQuadrant(newTask.urgency, newTask.importance);
    const createdTask: Task = {
      ...newTask,
      id: generateUUID(),
      quadrant: newTaskQuadrant,
      completed: false,
      createdAt: new Date(),
      completedAt: null,
      start_date: newTask.start_date
    };
    const updatedTasks = [...tasks, createdTask];
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
    setIsAddModalOpen(false);
    setNewTask({
      title: '',
      description: undefined,
      urgency: 5,
      importance: 5,
      tags: [],
      start_date: null
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
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const completedAt = !task.completed ? new Date() : null;
        const newTask = { ...task, completed: !task.completed, completedAt };
        if (newTask.completed) {
          setActiveView('completed');
        }
        return newTask;
      }
      return task;
    });
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
  };
  
  const deleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
    toast({
      title: 'Tarefa excluída',
      description: 'A tarefa foi removida permanentemente.'
    });
  };

  // Estado para o diálogo de confirmação de exclusão
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  
  // Função para confirmar a exclusão
  const confirmDeleteTask = (taskId: string) => {
    setTaskToDelete(taskId);
    setIsDeleteDialogOpen(true);
  };
  
  // Função para realizar a exclusão após confirmação
  const handleConfirmDelete = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete);
      setTaskToDelete(null);
    }
    setIsDeleteDialogOpen(false);
  };
  
  // Função para cancelar a exclusão
  const handleCancelDelete = () => {
    setTaskToDelete(null);
    setIsDeleteDialogOpen(false);
  };
  
  // Prevenir que o diálogo feche ao clicar fora dele
  const preventDialogClose = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Componente simplificado para a tarefa
  const TaskCard = ({ task }: { task: Task }) => {
    return (
      <div 
        className={`matrix-card mb-2 ${task.completed ? 'opacity-60' : ''}`}
        draggable={true}
        onDragStart={(e) => handleDragStart(e, task)}
        onDragEnd={handleDragEnd}
        id={`task-${task.id}`}
      >
        <div className="p-2 bg-base-200 rounded-md hover:bg-base-300 transition-all duration-300">
          {/* Cabeçalho da tarefa */}
          <div className="flex items-start justify-between">
            <div className="flex items-start flex-1 min-w-0">
              {/* Botão de completar */}
              <div className="flex-shrink-0 mt-0.5">
                <button
                  onClick={() => toggleTaskCompletion(task.id)}
                  className="btn btn-circle btn-xs bg-opacity-30 hover:bg-opacity-50 mr-2"
                  aria-label={task.completed ? "Marcar como não concluída" : "Marcar como concluída"}
                >
                  {task.completed ? (
                    <CheckCircle className="h-4 w-4 text-success" />
                  ) : (
                    <div className="w-3 h-3 rounded-full border-2 border-base-content"></div>
                  )}
                </button>
              </div>
              
              {/* Conteúdo principal */}
              <div className="flex-1 min-w-0">
                <motion.h4 
                  className={`task-title ${
                    task.completed 
                      ? 'line-through text-gray-400' 
                      : 'task-title-gradient task-title-animated task-title-fade-in'
                  } ${
                    !task.completed && (
                      task.urgency > 7 
                        ? 'task-title-high-priority' 
                        : task.urgency > 4 
                          ? 'task-title-medium-priority' 
                          : 'task-title-low-priority'
                    )
                  } font-bold text-md tracking-tight truncate`}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {task.title}
                </motion.h4>
                
                {task.description && (
                  <p className="text-xs mt-1 text-base-content/70 line-clamp-2 leading-snug">
                    {task.description}
                  </p>
                )}
                
                {task.start_date && (
                  <div className="flex items-center mt-1.5 text-xs text-base-content/60">
                    <CalendarIcon className="w-3 h-3 mr-1" />
                    <span>
                      {new Date(task.start_date).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Ações e timer */}
          <div className="card-actions flex items-center justify-between mt-2 pt-2 border-t border-base-content border-opacity-10">
            {/* Botões de ação */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => handleEditTask(task)}
                className="btn btn-ghost btn-xs hover:bg-opacity-30"
                aria-label="Editar tarefa"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
              <button
                onClick={() => confirmDeleteTask(task.id)}
                className="btn btn-ghost btn-xs hover:bg-opacity-30"
                aria-label="Excluir tarefa"
              >
                <Trash2 className="h-3.5 w-3.5 text-error" />
              </button>
            </div>
            
            {/* Timer */}
            <div className="flex items-center">
              {(task.timeSpent || (activeTimer === task.id && taskTimeSpent[task.id])) && (
                <span className="text-xs mr-2 flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {Math.floor((activeTimer === task.id ? taskTimeSpent[task.id] : task.timeSpent) / 60)}m
                </span>
              )}
              
              {activeTimer === task.id ? (
                <div className="flex items-center">
                  <span className="text-xs mr-1 font-mono">{formatTime(timeLeft)}</span>
                  <button
                    onClick={stopTimer}
                    className="btn btn-xs btn-error btn-circle"
                    aria-label="Parar timer"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => startTimer(task.id)}
                  disabled={task.completed}
                  className={`btn btn-ghost btn-xs rounded-full ${task.completed ? 'opacity-50' : 'hover:bg-opacity-30'}`}
                  aria-label="Iniciar timer"
                >
                  <Clock className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

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

  const DaySelector = () => {
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
  const QuadrantContainer = ({ title, description, children, urgentLabel, importantLabel, colorClass, quadrantIndex }: {
    title: string;
    description: string;
    children: React.ReactNode;
    urgentLabel: string;
    importantLabel: string;
    colorClass: string;
    quadrantIndex: number;
  }) => {
    const [isDragOver, setIsDragOver] = useState(false);
    
    const handleDragOverQuadrant = (e: React.DragEvent) => {
      e.preventDefault();
      if (!isDragOver) {
        setIsDragOver(true);
      }
      handleDragOver(e);
    };
    
    const handleDragLeaveQuadrant = (e: React.DragEvent) => {
      // Verificar se o cursor realmente saiu do elemento e não entrou em um filho
      const relatedTarget = e.relatedTarget as HTMLElement;
      if (!e.currentTarget.contains(relatedTarget)) {
        setIsDragOver(false);
        handleDragLeave(e);
      }
    };
    
    const handleDropQuadrant = (e: React.DragEvent) => {
      setIsDragOver(false);
      handleDrop(e, quadrantIndex);
    };
    
    return (
      <motion.div
        className={`quadrant-card q${quadrantIndex + 1} h-full flex flex-col ${isDragOver ? 'drop-ready' : ''}`}
        onDragOver={handleDragOverQuadrant}
        onDragLeave={handleDragLeaveQuadrant}
        onDrop={handleDropQuadrant}
        animate={isDragOver ? {
          scale: 1.01,
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)"
        } : {
          scale: 1,
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.06)"
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      >
        <div className={`p-4 bg-base-200 bg-opacity-50 glass-effect`}>
          <h2 className="text-xl font-bold mb-1 gradient-heading">{title}</h2>
          <p className="text-sm opacity-75">{description}</p>
          <div className="mt-3 text-xs grid grid-cols-2 gap-2">
            <div className="flex items-center">
              <span className={`inline-block w-3 h-3 rounded-full mr-1 bg-opacity-80 ${colorClass}`}></span>
              <span>{urgentLabel}</span>
            </div>
            <div className="flex items-center">
              <span className={`inline-block w-3 h-3 rounded-full mr-1 bg-opacity-80 ${colorClass}`}></span>
              <span>{importantLabel}</span>
            </div>
          </div>
          {isDragOver && (
            <motion.div 
              className="drop-indicator mt-2 p-1 rounded-md border border-dashed border-primary bg-primary bg-opacity-10 text-center"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-xs text-primary">Solte aqui para mover para este quadrante</p>
            </motion.div>
          )}
        </div>
        <div className="flex-1 p-2 overflow-y-auto custom-scrollbar bg-base-100 bg-opacity-90">
          {children}
        </div>
      </motion.div>
    );
  };

  // Botão de ação flutuante para criar novas tarefas em dispositivos móveis
  const FloatingActionButton = ({ onClick }: { onClick: () => void }) => (
    <button
      onClick={onClick}
      className="btn btn-primary btn-circle fixed right-6 bottom-6 shadow-xl floating-button btn-gradient btn-primary-gradient"
      aria-label="Adicionar nova tarefa"
    >
      <Plus size={24} />
    </button>
  );

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  // Seletor de tags rápidas como chips
  const QuickTagSelector = () => {
  return (
      <div className="flex flex-wrap gap-1.5 items-center mt-1 tag-selector">
        <span className="text-xs text-muted-foreground mr-1 whitespace-nowrap">Projeto:</span>
        {availableTags.map(tag => (
        <button
            key={tag.id}
            onClick={() => handleTagFilter('project', tagFilters.project === tag.id ? null : tag.id)}
            className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 transition-all
              ${tagFilters.project === tag.id 
                ? 'ring-1 ring-offset-1 ring-offset-background shadow-sm selected' 
                : 'opacity-70 hover:opacity-100'}`}
            style={{ 
              backgroundColor: `${tag.color}20`, 
              color: tag.color,
              boxShadow: tagFilters.project === tag.id ? `0 0 0 1px ${tag.color}30` : 'none'
            }}
          >
            <span 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: tag.color }} 
            />
            {tag.name}
        </button>
        ))}
      </div>
    );
  };
  
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

  // Função auxiliar para salvar tarefas no localStorage
  const saveTasksToLocalStorage = (tasks) => {
    try {
      localStorage.setItem('tasks', JSON.stringify(tasks));
      console.log(`${tasks.length} tarefas salvas no localStorage`);
    } catch (error) {
      console.error('Erro ao salvar tarefas no localStorage:', error);
    }
  };

  // Função para atualizar o estado de tarefas e salvá-las no localStorage
  const updateTasks = (newTasks) => {
    setTasks(newTasks);
    saveTasksToLocalStorage(newTasks);
  };

  // Carregar tarefas do localStorage ao inicializar
  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem('tasks');
      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);
        // Converter strings de data para objetos Date
        const formattedTasks = parsedTasks.map(task => ({
          ...task,
          createdAt: task.createdAt ? new Date(task.createdAt) : new Date(),
          completedAt: task.completedAt ? new Date(task.completedAt) : null,
          // Manter start_date como string ISO para compatibilidade com o restante do código
          start_date: task.start_date || null
        }));
        setTasks(formattedTasks);
        console.log(`${formattedTasks.length} tarefas carregadas do localStorage`);
      }
    } catch (error) {
      console.error('Erro ao carregar tarefas do localStorage:', error);
    }
  }, []);

  return (
    <div className="w-full mx-auto relative">
      {/* Wrapper para aplicar o efeito de blur quando o modal estiver aberto */}
      <div className={isDeleteDialogOpen ? 'blur-sm pointer-events-none transition-all duration-300' : ''}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center md:text-left">
              Matriz de Eisenhower
            </h2>
            <p className="text-muted-foreground text-sm md:text-base text-center md:text-left max-w-xl mb-2">
              Organize suas tarefas baseado em importância e urgência para maximizar sua produtividade
            </p>
            
            {/* Quick Tag Selector */}
            <div className="md:flex items-center gap-2 hidden">
              <QuickTagSelector />
            </div>
      </div>

          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-2 md:gap-3 justify-center sm:justify-end">
            <div className="md:hidden w-full">
              <QuickTagSelector />
            </div>
            
            <div className="flex justify-center gap-2 w-full sm:w-auto">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setIsAddModalOpen(true)}
                      className="p-2.5 bg-primary text-white rounded-lg transition-all duration-300 hover:bg-primary/90 hover:shadow-md shadow-sm flex items-center gap-1.5 w-full sm:w-auto justify-center"
                      title="Adicionar nova tarefa"
                    >
                      <Plus className="h-4 w-4" />
                      <span className="text-sm font-medium">Nova Tarefa</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Nova Tarefa</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
                  </div>
                </div>

        <Tabs defaultValue="matriz" className="w-full">
          <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto mb-8 border rounded-lg p-1 bg-muted/20 backdrop-blur-sm shadow-sm">
            <TabsTrigger value="matriz" className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md">
              <div className="flex items-center gap-1.5">
                <LayoutGrid className="h-4 w-4" />
                <span className="hidden sm:inline">Matriz</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="concluidas" className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Concluídas</span>
                </div>
            </TabsTrigger>
            <TabsTrigger value="todas" className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md">
              <div className="flex items-center gap-1.5">
                <BarChart2 className="h-4 w-4" />
                <span className="hidden sm:inline">Todas</span>
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="matriz" className="space-y-4">
            {/* Mobile layout - Vertical stacking */}
            <div className="grid grid-cols-1 gap-5 md:hidden">
              <QuadrantContainer
                title="Urgente e Importante"
                description="Faça primeiro: Crises, problemas urgentes, tarefas com prazo"
                urgentLabel="Urgente"
                importantLabel="Importante"
                colorClass="bg-gradient-to-br from-red-50 to-orange-50 border-red-200/30"
                quadrantIndex={0}
              >
                {renderTasks(1)}
              </QuadrantContainer>
              
              <QuadrantContainer
                title="Importante, Não Urgente"
                description="Planeje: Preparação, prevenção, planejamento e relacionamentos"
                urgentLabel="Não urgente"
                importantLabel="Importante"
                colorClass="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200/30"
                quadrantIndex={1}
              >
                {renderTasks(2)}
              </QuadrantContainer>
              
              <QuadrantContainer
                title="Urgente, Não Importante"
                description="Delegue: Interrupções, reuniões, e-mails, chamadas"
                urgentLabel="Urgente"
                importantLabel="Não importante"
                colorClass="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200/30"
                quadrantIndex={2}
              >
                {renderTasks(3)}
              </QuadrantContainer>
              
              <QuadrantContainer
                title="Não Urgente, Não Importante"
                description="Elimine: Distrações, tarefas triviais, tempo perdido"
                urgentLabel="Não urgente"
                importantLabel="Não importante"
                colorClass="bg-gradient-to-br from-green-50 to-teal-50 border-green-200/30"
                quadrantIndex={3}
              >
                {renderTasks(4)}
              </QuadrantContainer>
            </div>
            
            {/* Desktop layout - 2x2 grid */}
            <div className="hidden md:grid md:grid-cols-2 gap-6">
              <QuadrantContainer
                title="Urgente e Importante"
                description="Faça primeiro: Crises, problemas urgentes, tarefas com prazo"
                urgentLabel="Urgente"
                importantLabel="Importante"
                colorClass="bg-gradient-to-br from-red-50 to-orange-50 border-red-200/30"
                quadrantIndex={0}
              >
                {renderTasks(1)}
              </QuadrantContainer>
              
              <QuadrantContainer
                title="Importante, Não Urgente"
                description="Planeje: Preparação, prevenção, planejamento e relacionamentos"
                urgentLabel="Não urgente"
                importantLabel="Importante"
                colorClass="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200/30"
                quadrantIndex={1}
              >
                {renderTasks(2)}
              </QuadrantContainer>
              
              <QuadrantContainer
                title="Urgente, Não Importante"
                description="Delegue: Interrupções, reuniões, e-mails, chamadas"
                urgentLabel="Urgente"
                importantLabel="Não importante"
                colorClass="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200/30"
                quadrantIndex={2}
              >
                {renderTasks(3)}
              </QuadrantContainer>
              
              <QuadrantContainer
                title="Não Urgente, Não Importante"
                description="Elimine: Distrações, tarefas triviais, tempo perdido"
                urgentLabel="Não urgente"
                importantLabel="Não importante"
                colorClass="bg-gradient-to-br from-green-50 to-teal-50 border-green-200/30"
                quadrantIndex={3}
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
      </div>

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

      {isEditModalOpen && selectedTask && (
        <EditTaskModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveTask}
          task={{
            id: selectedTask.id,
            title: selectedTask.title,
            description: selectedTask.description || '',
            urgency: selectedTask.urgency,
            importance: selectedTask.importance,
            completed: selectedTask.completed,
            tags: selectedTask.tags,
            start_date: selectedTask.start_date
          }}
          isDarkMode={isDarkMode}
        />
      )}

      {/* Botão de ação flutuante para dispositivos móveis */}
      <FloatingActionButton onClick={() => setIsAddModalOpen(true)} />
      
      {/* Modal de confirmação de exclusão personalizado */}
      {isDeleteDialogOpen && taskToDelete && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center" 
          onClick={(e) => {
            // Fechar o modal quando clicar no backdrop (fora do modal)
            if (e.target === e.currentTarget) {
              handleCancelDelete();
            }
          }}
        >
          <div 
            className="bg-background border border-gray-700 rounded-lg shadow-lg p-6 max-w-md mx-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleCancelDelete();
              }}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-100 rounded-full p-1 hover:bg-gray-800/50 transition-colors"
              title="Fechar"
              aria-label="Fechar diálogo"
            >
              <X size={18} />
            </button>
            
            <div className="mb-4">
              <h2 className="flex items-center gap-2 text-red-400 text-lg font-semibold">
                <AlertTriangle size={18} />
                Confirmar exclusão
              </h2>
              
              {/* Informações da tarefa que será excluída */}
              <div className="mt-4 mb-3 p-3 border border-gray-700/60 rounded-md bg-gray-800/20">
                <p className="font-medium mb-1 text-base">
                  {tasks.find(t => t.id === taskToDelete)?.title || "Tarefa"}
                </p>
                {tasks.find(t => t.id === taskToDelete)?.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {tasks.find(t => t.id === taskToDelete)?.description}
                  </p>
                )}
              </div>
              
              <p className="text-sm text-muted-foreground mt-2">
                Tem certeza que deseja excluir esta tarefa? Esta ação não poderá ser desfeita.
              </p>
            </div>
            
            <div className="flex sm:justify-end gap-2 mt-6">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancelDelete();
                }}
                className="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600 text-white border-0 focus:ring-1 focus:ring-gray-400 text-sm font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleConfirmDelete();
                }}
                className="px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white border-0 text-sm font-medium"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
