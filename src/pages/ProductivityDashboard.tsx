
import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowLeft, BarChart2, ClipboardList, Clock, Calendar as CalendarIcon, CheckCircle, XCircle, TrendingUp, Activity, PieChart as PieChartIcon, Target, ChevronRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import { formatDate } from '../utils/dateUtils';
import { getTasks } from '../services/database';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { Task as DatabaseTask } from '../services/types';

// Define uma interface local para a Task que será usada no dashboard
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

// Função para converter os dados do formato do banco para o formato usado no dashboard
const convertTasksFormat = (tasks: DatabaseTask[]): Task[] => {
  return tasks.map(task => ({
    id: task.id || '',
    title: task.title || '',
    description: task.description || '',
    urgency: task.urgency,
    importance: task.importance,
    quadrant: task.quadrant,
    completed: task.completed,
    createdAt: new Date(task.created_at || new Date()),
    completedAt: task.completed_at ? new Date(task.completed_at) : null
  }));
};

const ProductivityDashboard = () => {
  const [period, setPeriod] = useState<'week' | 'month' | 'all'>('week');
  
  // Usando React Query para buscar as tarefas
  const { data: tasksData, isLoading, error } = useQuery({
    queryKey: ['tasks', 'dashboard'],
    queryFn: async () => {
      const { data, error } = await getTasks();
      if (error) {
        throw new Error(`Erro ao buscar tarefas: ${error.message}`);
      }
      return data || [];
    },
    staleTime: 30000, // 30 segundos
  });

  // Mostrar erro se houver
  useEffect(() => {
    if (error) {
      console.error('Erro ao carregar tarefas:', error);
      toast.error(`Não foi possível carregar os dados: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }, [error]);

  // Converter os dados do formato do banco para o formato usado no dashboard
  const tasks = tasksData ? convertTasksFormat(tasksData) : [];

  // Filtrar tarefas com base no período selecionado
  const filterTasksByPeriod = () => {
    const now = new Date();
    let cutoffDate = new Date();
    
    if (period === 'week') {
      cutoffDate.setDate(now.getDate() - 7);
    } else if (period === 'month') {
      cutoffDate.setMonth(now.getMonth() - 1);
    } else {
      // 'all' - não filtra por data
      return tasks;
    }
    
    return tasks.filter(task => task.createdAt >= cutoffDate);
  };

  const filteredTasks = filterTasksByPeriod();

  // Dados para o gráfico de tarefas concluídas por quadrante
  const completedTasksByQuadrant = [
    { name: 'Fazer Agora', value: filteredTasks.filter(t => t.quadrant === 0 && t.completed).length },
    { name: 'Agendar', value: filteredTasks.filter(t => t.quadrant === 1 && t.completed).length },
    { name: 'Delegar', value: filteredTasks.filter(t => t.quadrant === 2 && t.completed).length },
    { name: 'Eliminar', value: filteredTasks.filter(t => t.quadrant === 3 && t.completed).length }
  ];

  // Dados para o gráfico de distribuição de tarefas por quadrante (todas as tarefas)
  const taskDistributionByQuadrant = [
    { name: 'Fazer Agora', value: filteredTasks.filter(t => t.quadrant === 0).length },
    { name: 'Agendar', value: filteredTasks.filter(t => t.quadrant === 1).length },
    { name: 'Delegar', value: filteredTasks.filter(t => t.quadrant === 2).length },
    { name: 'Eliminar', value: filteredTasks.filter(t => t.quadrant === 3).length }
  ];

  // Calcular tempo médio para conclusão (em dias) por quadrante
  const calculateAverageCompletionTime = (quadrantIndex: number) => {
    const completedTasksInQuadrant = filteredTasks.filter(
      t => t.quadrant === quadrantIndex && t.completed && t.completedAt
    );
    if (completedTasksInQuadrant.length === 0) return 0;
    
    const totalTimeInDays = completedTasksInQuadrant.reduce((sum, task) => {
      const creationTime = task.createdAt.getTime();
      const completionTime = task.completedAt ? task.completedAt.getTime() : creationTime;
      const timeDiffInDays = (completionTime - creationTime) / (1000 * 60 * 60 * 24);
      return sum + timeDiffInDays;
    }, 0);
    
    return totalTimeInDays / completedTasksInQuadrant.length;
  };
  
  const averageCompletionTimeData = [
    { name: 'Fazer Agora', dias: calculateAverageCompletionTime(0) },
    { name: 'Agendar', dias: calculateAverageCompletionTime(1) },
    { name: 'Delegar', dias: calculateAverageCompletionTime(2) },
    { name: 'Eliminar', dias: calculateAverageCompletionTime(3) }
  ];

  // Cores para os quadrantes otimizadas para tema escuro
  const COLORS = ['#ff79c6', '#8be9fd', '#f1fa8c', '#bd93f9'];
  const QUADRANT_NAMES = ['Fazer Agora', 'Agendar', 'Delegar', 'Eliminar'];

  // Dados para o gráfico de linha de tempo (últimos 7 dias)
  const generateTimelineData = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = formatDate(date);
      
      // Contar tarefas criadas e concluídas neste dia
      const tasksCreated = filteredTasks.filter(t => {
        const taskDate = new Date(t.createdAt);
        return taskDate.getDate() === date.getDate() && 
               taskDate.getMonth() === date.getMonth() && 
               taskDate.getFullYear() === date.getFullYear();
      }).length;
      
      const tasksCompleted = filteredTasks.filter(t => {
        if (!t.completedAt) return false;
        const taskDate = new Date(t.completedAt);
        return taskDate.getDate() === date.getDate() && 
               taskDate.getMonth() === date.getMonth() && 
               taskDate.getFullYear() === date.getFullYear();
      }).length;
      
      data.push({
        date: dateStr,
        criadas: tasksCreated,
        concluídas: tasksCompleted
      });
    }
    return data;
  };
  
  const timelineData = generateTimelineData();

  // Configurações comuns para os gráficos
  const chartConfig = {
    style: {
      background: 'transparent'
    },
    theme: {
      axis: {
        domain: {
          line: {
            stroke: '#525252'
          }
        },
        ticks: {
          line: {
            stroke: '#525252'
          }
        },
        text: {
          fill: '#A1A1AA'
        }
      },
      grid: {
        line: {
          stroke: '#2D2D2D',
          strokeWidth: 1
        }
      },
      legends: {
        text: {
          fill: '#A1A1AA'
        }
      },
      tooltip: {
        container: {
          background: '#1F1F1F',
          color: '#FFFFFF',
          fontSize: '12px'
        }
      }
    }
  };
  
  // Prioridades das tarefas
  const taskPriorities = [
    { name: 'Alta', value: filteredTasks.filter(t => t.importance > 7).length },
    { name: 'Média', value: filteredTasks.filter(t => t.importance > 4 && t.importance <= 7).length },
    { name: 'Baixa', value: filteredTasks.filter(t => t.importance <= 4).length }
  ];
  
  // Últimas tarefas concluídas
  const recentlyCompletedTasks = filteredTasks
    .filter(t => t.completed)
    .sort((a, b) => (b.completedAt?.getTime() || 0) - (a.completedAt?.getTime() || 0))
    .slice(0, 5);

  // Mostrar mensagem de carregamento
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-8 bg-background/95 rounded-lg border border-border/30">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Carregando dados do dashboard...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-3 sm:p-6 bg-background/95 min-h-screen">
      {/* Header com navegação */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8">
        <div className="flex items-center mb-4 sm:mb-0">
          <Link to="/" className="mr-4 p-2 rounded-full bg-background/80 border border-border/30 hover:bg-gray-800/50 transition-colors">
            <ArrowLeft className="h-5 w-5 text-primary" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Dashboard de Produtividade
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Visualize suas métricas de produtividade e padrões de conclusão de tarefas
            </p>
          </div>
        </div>
        
        <div className="flex gap-2 bg-background/50 p-1 rounded-lg border border-border/20 self-end">
          <button 
            onClick={() => setPeriod('week')} 
            className={`px-3 py-1.5 text-sm rounded-md transition-all ${period === 'week' ? 'bg-primary text-white' : 'hover:bg-gray-800/70 text-gray-400'}`}
          >
            Semana
          </button>
          <button 
            onClick={() => setPeriod('month')} 
            className={`px-3 py-1.5 text-sm rounded-md transition-all ${period === 'month' ? 'bg-primary text-white' : 'hover:bg-gray-800/70 text-gray-400'}`}
          >
            Mês
          </button>
          <button 
            onClick={() => setPeriod('all')} 
            className={`px-3 py-1.5 text-sm rounded-md transition-all ${period === 'all' ? 'bg-primary text-white' : 'hover:bg-gray-800/70 text-gray-400'}`}
          >
            Tudo
          </button>
        </div>
      </div>
      
      {/* Cards de estatísticas rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <Card className="p-4 border-border/30 bg-background/50 backdrop-blur-sm hover:bg-background/60 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total de Tarefas</p>
              <h3 className="text-2xl font-bold">{filteredTasks.length}</h3>
            </div>
            <div className="p-2.5 rounded-full bg-blue-500/10 text-blue-400">
              <ClipboardList className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-xs text-muted-foreground flex items-center">
            <TrendingUp className="h-3.5 w-3.5 mr-1 text-green-400" />
            <span>Total de tarefas no período</span>
          </div>
        </Card>
        
        <Card className="p-4 border-border/30 bg-background/50 backdrop-blur-sm hover:bg-background/60 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tarefas Concluídas</p>
              <h3 className="text-2xl font-bold">{filteredTasks.filter(t => t.completed).length}</h3>
            </div>
            <div className="p-2.5 rounded-full bg-green-500/10 text-green-400">
              <CheckCircle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-xs text-muted-foreground flex items-center">
            <div className="w-full bg-gray-700/30 rounded-full h-1.5">
              <div 
                className="bg-green-500 h-1.5 rounded-full" 
                style={{
                  width: filteredTasks.length ? 
                    `${(filteredTasks.filter(t => t.completed).length / filteredTasks.length) * 100}%` : 
                    '0%'
                }}
              ></div>
            </div>
            <span className="ml-2">
              {filteredTasks.length ? 
                Math.round((filteredTasks.filter(t => t.completed).length / filteredTasks.length) * 100) : 
                0}%
            </span>
          </div>
        </Card>
        
        <Card className="p-4 border-border/30 bg-background/50 backdrop-blur-sm hover:bg-background/60 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tempo Médio (dias)</p>
              <h3 className="text-2xl font-bold">
                {(
                  averageCompletionTimeData.reduce((sum, item) => sum + item.dias, 0) / 
                  averageCompletionTimeData.filter(item => item.dias > 0).length || 0
                ).toFixed(1)}
              </h3>
            </div>
            <div className="p-2.5 rounded-full bg-amber-500/10 text-amber-400">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-xs text-muted-foreground flex items-center">
            <CalendarIcon className="h-3.5 w-3.5 mr-1" />
            <span>Para concluir tarefas</span>
          </div>
        </Card>
        
        <Card className="p-4 border-border/30 bg-background/50 backdrop-blur-sm hover:bg-background/60 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Taxa de Conclusão</p>
              <h3 className="text-2xl font-bold">
                {filteredTasks.length ? 
                  (filteredTasks.filter(t => t.completed).length / filteredTasks.length * 100).toFixed(0) : 
                  '0'}%
              </h3>
            </div>
            <div className="p-2.5 rounded-full bg-purple-500/10 text-purple-400">
              <Target className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-xs text-muted-foreground flex items-center">
            <Activity className="h-3.5 w-3.5 mr-1 text-purple-400" />
            <span>Eficiência global</span>
          </div>
        </Card>
      </div>
      
      {/* Linha do tempo de produtividade */}
      <Card className="p-4 border-border/30 bg-background/50 backdrop-blur-sm mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Linha do Tempo de Produtividade</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-blue-400"></div>
              <span className="text-sm text-muted-foreground">Criadas</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <span className="text-sm text-muted-foreground">Concluídas</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={timelineData} {...chartConfig}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="criadas" name="Tarefas Criadas" stroke="#8be9fd" fill="#8be9fd30" />
            <Area type="monotone" dataKey="concluídas" name="Tarefas Concluídas" stroke="#50fa7b" fill="#50fa7b30" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-6">
        {/* Gráfico de Tarefas Concluídas por Quadrante */}
        <Card className="p-4 border-border/30 bg-background/50 backdrop-blur-sm">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <BarChart2 className="mr-2 h-5 w-5 text-primary/70" />
            Tarefas Concluídas por Quadrante
          </h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={completedTasksByQuadrant} {...chartConfig}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="value" name="Tarefas Concluídas">
                {completedTasksByQuadrant.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Gráfico de Distribuição de Tarefas */}
        <Card className="p-4 border-border/30 bg-background/50 backdrop-blur-sm">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <PieChartIcon className="mr-2 h-5 w-5 text-primary/70" />
            Distribuição de Tarefas
          </h2>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart {...chartConfig}>
              <Pie 
                data={taskDistributionByQuadrant} 
                cx="50%" 
                cy="50%" 
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8" 
                dataKey="value" 
                paddingAngle={2}
                label={({name, percent}) => `${(percent * 100).toFixed(0)}%`}
              >
                {taskDistributionByQuadrant.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [`${value} tarefas`, name]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {QUADRANT_NAMES.map((name, index) => (
              <div key={index} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[index]}}></div>
                <span className="text-xs text-muted-foreground">{name}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Últimas tarefas concluídas */}
        <Card className="p-4 border-border/30 bg-background/50 backdrop-blur-sm flex flex-col">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <CheckCircle className="mr-2 h-5 w-5 text-primary/70" />
            Últimas Tarefas Concluídas
          </h2>
          <div className="space-y-3 flex-1">
            {recentlyCompletedTasks.length > 0 ? (
              recentlyCompletedTasks.map(task => (
                <div key={task.id} className="flex items-start bg-background/30 p-3 rounded-lg border border-border/20">
                  <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{backgroundColor: COLORS[task.quadrant]}}></div>
                  <div className="ml-2 flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{task.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {task.completedAt ? formatDate(task.completedAt) : ''}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-4 text-muted-foreground text-sm h-full flex items-center justify-center">
                Nenhuma tarefa concluída recentemente
              </div>
            )}
          </div>
          <Link to="/" className="mt-3 flex items-center justify-center gap-1 text-primary text-sm font-medium hover:underline self-end">
            Ver todas
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
        {/* Tempo Médio para Conclusão */}
        <Card className="p-4 border-border/30 bg-background/50 backdrop-blur-sm">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Clock className="mr-2 h-5 w-5 text-primary/70" />
            Tempo Médio para Conclusão (Dias)
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={averageCompletionTimeData} {...chartConfig}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="dias" name="Dias">
                {averageCompletionTimeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Distribuição por Prioridade */}
        <Card className="p-4 border-border/30 bg-background/50 backdrop-blur-sm">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Activity className="mr-2 h-5 w-5 text-primary/70" />
            Distribuição por Prioridade
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart {...chartConfig}>
              <Pie 
                data={taskPriorities} 
                cx="50%" 
                cy="50%" 
                outerRadius={80} 
                fill="#8884d8" 
                dataKey="value"
                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                <Cell fill="#ff79c6" />
                <Cell fill="#f1fa8c" />
                <Cell fill="#8be9fd" />
              </Pie>
              <Tooltip formatter={(value, name) => [`${value} tarefas`, name]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-6 mt-2">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#ff79c6]"></div>
              <span className="text-xs text-muted-foreground">Alta</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#f1fa8c]"></div>
              <span className="text-xs text-muted-foreground">Média</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#8be9fd]"></div>
              <span className="text-xs text-muted-foreground">Baixa</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProductivityDashboard;
