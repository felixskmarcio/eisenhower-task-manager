
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Clock, Star, CheckCircle, Share2, Settings, Plus, Trash2 } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
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
  const [isDarkMode, setIsDarkMode] = useState(false);
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

  // Estado para o modal de nova tarefa
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    urgency: 5,
    importance: 5
  });

  // Estado para controlar a visualização atual
  const [activeView, setActiveView] = useState('matrix');

  // Definição dos quadrantes da Matriz de Eisenhower
  const quadrants = [
    { 
      title: 'Fazer Agora', 
      description: 'Importante e Urgente',
      color: isDarkMode ? 'bg-gradient-to-br from-red-900 to-red-800' : 'bg-gradient-to-br from-red-100 to-red-50',
      borderColor: isDarkMode ? 'border-red-700' : 'border-red-200',
      textColor: isDarkMode ? 'text-white' : 'text-black'
    },
    { 
      title: 'Agendar', 
      description: 'Importante, mas Não Urgente',
      color: isDarkMode ? 'bg-gradient-to-br from-green-900 to-green-800' : 'bg-gradient-to-br from-green-100 to-green-50',
      borderColor: isDarkMode ? 'border-green-700' : 'border-green-200',
      textColor: isDarkMode ? 'text-white' : 'text-black'
    },
    { 
      title: 'Delegar', 
      description: 'Não Importante, mas Urgente',
      color: isDarkMode ? 'bg-gradient-to-br from-yellow-900 to-yellow-800' : 'bg-gradient-to-br from-yellow-100 to-yellow-50',
      borderColor: isDarkMode ? 'border-yellow-700' : 'border-yellow-200',
      textColor: isDarkMode ? 'text-white' : 'text-black'
    },
    { 
      title: 'Eliminar', 
      description: 'Não Importante e Não Urgente',
      color: isDarkMode ? 'bg-gradient-to-br from-purple-900 to-purple-800' : 'bg-gradient-to-br from-purple-100 to-purple-50',
      borderColor: isDarkMode ? 'border-purple-700' : 'border-purple-200',
      textColor: isDarkMode ? 'text-white' : 'text-black'
    }
  ];

  // Função para iniciar o arrasto
  const handleDragStart = (e: React.DragEvent, task: Task) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(task));
  };

  // Função para soltar a tarefa em um quadrante
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Função para soltar a tarefa
  const handleDrop = (e: React.DragEvent, quadrantIndex: number) => {
    e.preventDefault();
    const taskData = e.dataTransfer.getData('text/plain');
    if (taskData) {
      const droppedTask = JSON.parse(taskData);
      
      // Atualiza o quadrante da tarefa
      const updatedTasks = tasks.map(task => 
        task.id === droppedTask.id 
          ? { ...task, quadrant: quadrantIndex } 
          : task
      );
      
      setTasks(updatedTasks);
    }
  };

  // Função para adicionar nova tarefa
  const handleAddTask = () => {
    // Determina o quadrante baseado em urgência e importância
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
    // Limpa o formulário
    setNewTask({
      title: '',
      description: '',
      urgency: 5,
      importance: 5
    });
  };
  
  // Função para marcar uma tarefa como concluída ou não concluída
  const toggleTaskCompletion = (taskId: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        // Se estamos marcando como concluída, adicionamos a data atual
        // Se estamos desmarcando, definimos como null
        const completedAt = !task.completed ? new Date() : null;
        return { ...task, completed: !task.completed, completedAt };
      }
      return task;
    }));
  };
  
  // Função para deletar uma tarefa
  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  // Componente de Tarefa
  const TaskCard = ({ task }: { task: Task }) => (
    <div 
      draggable
      onDragStart={(e) => handleDragStart(e, task)}
      className={`p-4 rounded-lg shadow-md cursor-move hover:shadow-xl transition-all 
      ${quadrants[task.quadrant].color} backdrop-blur-sm
      border ${task.quadrant === 0 ? isDarkMode ? 'border-red-700' : 'border-red-200' : 
              task.quadrant === 1 ? isDarkMode ? 'border-green-700' : 'border-green-200' : 
              task.quadrant === 2 ? isDarkMode ? 'border-yellow-700' : 'border-yellow-200' : 
              isDarkMode ? 'border-purple-700' : 'border-purple-200'}
      ${task.completed ? 'opacity-60' : 'hover:scale-102'}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className={`font-bold text-lg ${quadrants[task.quadrant].textColor} ${task.completed ? 'line-through opacity-75' : ''}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className={`text-sm ${quadrants[task.quadrant].textColor} opacity-80 ${task.completed ? 'line-through' : ''}`}>
              {task.description}
            </p>
          )}
          <p className={`text-xs mt-1 ${quadrants[task.quadrant].textColor} opacity-60`}>
            Criada em: {formatDate(task.createdAt)}
          </p>
          {task.completed && task.completedAt && (
            <p className={`text-xs ${quadrants[task.quadrant].textColor} opacity-60`}>
              Concluída em: {formatDate(task.completedAt)}
            </p>
          )}
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => toggleTaskCompletion(task.id)}
            className={`flex-shrink-0 p-2 rounded-full transition-colors shadow-sm hover:shadow-md
            ${task.completed 
              ? isDarkMode 
                ? 'bg-green-800 text-white' 
                : 'bg-green-200 text-green-700' 
              : isDarkMode 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
          >
            <CheckCircle size={16} className={task.completed ? 'opacity-100' : 'opacity-50'} />
          </button>
          <button 
            onClick={() => deleteTask(task.id)}
            className={`flex-shrink-0 p-2 rounded-full transition-colors shadow-sm hover:shadow-md
            ${isDarkMode 
              ? 'bg-gray-700 text-red-300 hover:bg-red-900 hover:text-white' 
              : 'bg-gray-200 text-red-500 hover:bg-red-500 hover:text-white'}`}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      <div className="flex justify-between mt-2">
        <span className="text-xs opacity-60">
          Urgência: {task.urgency}/10
        </span>
        <span className="text-xs opacity-60">
          Importância: {task.importance}/10
        </span>
      </div>
      {task.completed && (
        <div className="mt-2 text-xs font-medium px-2 py-1 rounded-full text-center
          bg-gradient-to-r from-green-500 to-green-600 text-white inline-block shadow-sm">
          Concluída
        </div>
      )}
    </div>
  );

  return (
    <div 
      className={`min-h-screen transition-colors duration-300 
      ${isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white' 
        : 'bg-gradient-to-br from-blue-50 via-white to-blue-50 text-black'}`}
    >
      {/* Modal de Adicionar Tarefa */}
      <AddTaskModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        newTask={newTask}
        setNewTask={setNewTask}
        onAddTask={handleAddTask}
        isDarkMode={isDarkMode}
      />

      {/* Cabeçalho */}
      <header className={`flex justify-between items-center p-6 bg-opacity-90 backdrop-blur-sm border-b border-opacity-10
        ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
          Eisenhower Planner
        </h1>
        
        {/* Botões de ação */}
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center"
          >
            <Plus />
          </button>
          <ThemeToggle 
            isDarkMode={isDarkMode} 
            toggleDarkMode={() => setIsDarkMode(!isDarkMode)} 
          />
        </div>
      </header>

      {/* Conteúdo principal - muda dependendo da visualização ativa */}
      {activeView === 'matrix' && (
        <div className="grid grid-cols-2 gap-4 p-6">
          {quadrants.map((quadrant, index) => (
            <div 
              key={index} 
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              className={`p-4 rounded-lg ${quadrant.color} min-h-[400px] border-2 border-dashed 
              shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300
              ${quadrant.borderColor} hover:border-opacity-90 border-opacity-50`}
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
            <h2 className="text-2xl font-bold mb-2">Todas as Tarefas</h2>
            <p className="text-sm opacity-70">Visualize e gerencie todas as suas tarefas em um só lugar</p>
          </div>
          
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
            {tasks.length > 0 ? (
              <div className="space-y-3">
                {tasks
                  .filter(task => !task.completed)
                  .sort((a, b) => {
                    // Primeiro por quadrante, depois por importância e urgência
                    if (a.quadrant !== b.quadrant) return a.quadrant - b.quadrant;
                    const aScore = a.importance * a.urgency;
                    const bScore = b.importance * b.urgency;
                    return bScore - aScore;
                  })
                  .map(task => (
                    <div 
                      key={task.id} 
                      className={`p-4 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center mb-1">
                            <span 
                              className={`inline-block w-3 h-3 rounded-full mr-2`}
                              style={{
                                backgroundColor: task.quadrant === 0 
                                  ? "#EF4444" 
                                  : task.quadrant === 1 
                                    ? "#10B981" 
                                    : task.quadrant === 2 
                                      ? "#F59E0B" 
                                      : "#8B5CF6"
                              }}
                            />
                            <h3 className="font-bold text-lg">{task.title}</h3>
                          </div>
                          {task.description && (
                            <p className="text-sm opacity-80 mb-2">{task.description}</p>
                          )}
                          <div className="flex flex-col space-y-1 text-xs opacity-70 mb-2">
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
                            ${isDarkMode 
                              ? 'bg-gray-600 text-gray-300 hover:bg-green-800 hover:text-white' 
                              : 'bg-gray-200 text-gray-600 hover:bg-green-500 hover:text-white'}`}
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button 
                            onClick={() => deleteTask(task.id)}
                            className={`flex-shrink-0 p-2 rounded-full transition-colors
                            ${isDarkMode 
                              ? 'bg-gray-600 text-red-300 hover:bg-red-900 hover:text-white' 
                              : 'bg-gray-200 text-red-500 hover:bg-red-500 hover:text-white'}`}
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
                <p className="text-lg mb-4">Nenhuma tarefa pendente</p>
                <button 
                  onClick={() => setIsAddModalOpen(true)}
                  className={`px-4 py-2 rounded-lg font-medium 
                  ${isDarkMode ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
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
            <h2 className="text-2xl font-bold mb-2">Tarefas Concluídas</h2>
            <p className="text-sm opacity-70">Histórico de tarefas que você já finalizou</p>
          </div>
          
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
            {tasks.filter(task => task.completed).length > 0 ? (
              <div className="space-y-3">
                {tasks
                  .filter(task => task.completed)
                  .map(task => (
                    <div 
                      key={task.id} 
                      className={`p-4 rounded-lg shadow-md opacity-80 
                      ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center mb-1">
                            <span 
                              className={`inline-block w-3 h-3 rounded-full mr-2`}
                              style={{
                                backgroundColor: task.quadrant === 0 
                                  ? "#EF4444" 
                                  : task.quadrant === 1 
                                    ? "#10B981" 
                                    : task.quadrant === 2 
                                      ? "#F59E0B" 
                                      : "#8B5CF6"
                              }}
                            />
                            <h3 className="font-bold text-lg line-through">{task.title}</h3>
                            <span className="ml-2 text-xs px-2 py-1 bg-green-500 text-white rounded-full">
                              Concluída
                            </span>
                          </div>
                          {task.description && (
                            <p className="text-sm opacity-80 mb-2 line-through">{task.description}</p>
                          )}
                          <div className="flex flex-col space-y-1 text-xs opacity-70">
                            <span>Quadrante: {quadrants[task.quadrant].title}</span>
                            <span>Criada em: {formatDate(task.createdAt)}</span>
                            <span>Concluída em: {formatDate(task.completedAt)}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => toggleTaskCompletion(task.id)}
                            className={`flex-shrink-0 p-2 rounded-full
                            ${isDarkMode 
                              ? 'bg-green-800 text-white' 
                              : 'bg-green-200 text-green-700'}`}
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button 
                            onClick={() => deleteTask(task.id)}
                            className={`flex-shrink-0 p-2 rounded-full transition-colors
                            ${isDarkMode 
                              ? 'bg-gray-600 text-red-300 hover:bg-red-900 hover:text-white' 
                              : 'bg-gray-200 text-red-500 hover:bg-red-500 hover:text-white'}`}
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
                <p className="text-lg">Nenhuma tarefa concluída ainda</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Barra de Navegação */}
      <nav 
        className={`fixed bottom-0 left-0 right-0 flex justify-around p-4 shadow-lg backdrop-blur-lg bg-opacity-90 border-t transition-colors
        ${isDarkMode 
          ? 'bg-gray-900 text-white border-gray-800' 
          : 'bg-white text-black border-gray-200'}`}
      >
        <button 
          onClick={() => setActiveView('tasks')}
          className={`flex flex-col items-center transition-all rounded-lg px-4 py-2
          ${activeView === 'tasks' 
            ? isDarkMode 
              ? 'bg-gray-800 text-blue-400 shadow-inner' 
              : 'bg-blue-50 text-blue-600 shadow-inner' 
            : 'hover:bg-opacity-10 hover:bg-blue-500'}`}
        >
          <Clock className={`mb-1 ${activeView === 'tasks' ? 'text-blue-500' : ''}`} />
          <span className="text-xs font-medium">Tarefas</span>
        </button>
        
        <button 
          onClick={() => setActiveView('matrix')}
          className={`flex flex-col items-center transition-all rounded-lg px-4 py-2
          ${activeView === 'matrix' 
            ? isDarkMode 
              ? 'bg-gray-800 text-yellow-400 shadow-inner' 
              : 'bg-yellow-50 text-yellow-600 shadow-inner' 
            : 'hover:bg-opacity-10 hover:bg-yellow-500'}`}
        >
          <Star className={`mb-1 ${activeView === 'matrix' ? 'text-yellow-500' : ''}`} />
          <span className="text-xs font-medium">Matriz</span>
        </button>
        
        <button 
          onClick={() => setActiveView('completed')}
          className={`flex flex-col items-center transition-all rounded-lg px-4 py-2
          ${activeView === 'completed' 
            ? isDarkMode 
              ? 'bg-gray-800 text-green-400 shadow-inner' 
              : 'bg-green-50 text-green-600 shadow-inner' 
            : 'hover:bg-opacity-10 hover:bg-green-500'}`}
        >
          <CheckCircle className={`mb-1 ${activeView === 'completed' ? 'text-green-500' : ''}`} />
          <span className="text-xs font-medium">Concluídas</span>
        </button>
        
        <button 
          onClick={() => setActiveView('share')}
          className={`flex flex-col items-center transition-all rounded-lg px-4 py-2
          ${activeView === 'share' 
            ? isDarkMode 
              ? 'bg-gray-800 text-purple-400 shadow-inner' 
              : 'bg-purple-50 text-purple-600 shadow-inner' 
            : 'hover:bg-opacity-10 hover:bg-purple-500'}`}
        >
          <Share2 className={`mb-1 ${activeView === 'share' ? 'text-purple-500' : ''}`} />
          <span className="text-xs font-medium">Compartilhar</span>
        </button>
        
        <button 
          onClick={() => setActiveView('settings')}
          className={`flex flex-col items-center transition-all rounded-lg px-4 py-2
          ${activeView === 'settings' 
            ? isDarkMode 
              ? 'bg-gray-800 text-gray-400 shadow-inner' 
              : 'bg-gray-100 text-gray-600 shadow-inner' 
            : 'hover:bg-opacity-10 hover:bg-gray-500'}`}
        >
          <Settings className={`mb-1 ${activeView === 'settings' ? 'text-gray-500' : ''}`} />
          <span className="text-xs font-medium">Config</span>
        </button>
      </nav>
      
      {/* Espaçamento para a barra de navegação fixa */}
      <div className="h-20"></div>
    </div>
  );
};

export default Matrix;
