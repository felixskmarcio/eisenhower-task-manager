import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowLeft, BarChart2, ClipboardList, Clock, Calendar, CheckCircle, XCircle, TrendingUp, Activity, PieChart as PieChartIcon, Target, ChevronRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
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

const ProductivityDashboard = () => {
  // Mock data - in a real app, this would come from your task state or API
  const tasks: Task[] = [{
    id: '1',
    title: 'Reunião de Equipe',
    description: 'Alinhamento do projeto',
    urgency: 8,
    importance: 9,
    quadrant: 0,
    completed: true,
    createdAt: new Date(Date.now() - 86400000 * 5),
    // 5 dias atrás
    completedAt: new Date(Date.now() - 86400000 * 3) // 3 dias atrás
  }, {
    id: '2',
    title: 'Planejamento Estratégico',
    description: 'Definir metas para o próximo trimestre',
    urgency: 6,
    importance: 9,
    quadrant: 1,
    completed: true,
    createdAt: new Date(Date.now() - 172800000 * 3),
    // 6 dias atrás
    completedAt: new Date(Date.now() - 86400000 * 2) // 2 dias atrás
  }, {
    id: '3',
    title: 'Responder E-mails',
    description: 'Caixa de entrada',
    urgency: 7,
    importance: 4,
    quadrant: 2,
    completed: true,
    createdAt: new Date(Date.now() - 43200000 * 8),
    // 4 dias atrás
    completedAt: new Date(Date.now() - 21600000 * 10) // 3 dias atrás
  }, {
    id: '4',
    title: 'Assistir Netflix',
    description: 'Série favorita',
    urgency: 2,
    importance: 2,
    quadrant: 3,
    completed: true,
    createdAt: new Date(Date.now() - 21600000 * 12),
    // 3 dias atrás
    completedAt: new Date(Date.now() - 3600000 * 24) // 1 dia atrás
  }, {
    id: '5',
    title: 'Preparar Apresentação',
    description: 'Slides para reunião',
    urgency: 9,
    importance: 8,
    quadrant: 0,
    completed: true,
    createdAt: new Date(Date.now() - 86400000 * 4),
    // 4 dias atrás
    completedAt: new Date(Date.now() - 86400000 * 3.5) // 3.5 dias atrás
  }, {
    id: '6',
    title: 'Curso Online',
    description: 'Aprendizado contínuo',
    urgency: 4,
    importance: 8,
    quadrant: 1,
    completed: false,
    createdAt: new Date(Date.now() - 86400000 * 7),
    // 7 dias atrás
    completedAt: null
  }, {
    id: '7',
    title: 'Ligações de Vendas',
    description: 'Contatar clientes',
    urgency: 7,
    importance: 5,
    quadrant: 2,
    completed: false,
    createdAt: new Date(Date.now() - 86400000 * 2),
    // 2 dias atrás
    completedAt: null
  }, {
    id: '8',
    title: 'Navegar em Redes Sociais',
    description: 'Verificar atualizações',
    urgency: 3,
    importance: 2,
    quadrant: 3,
    completed: false,
    createdAt: new Date(Date.now() - 86400000 * 1),
    // 1 dia atrás
    completedAt: null
  }];

  // Dados para o gráfico de tarefas concluídas por quadrante
  const completedTasksByQuadrant = [{
    name: 'Fazer Agora',
    value: tasks.filter(t => t.quadrant === 0 && t.completed).length
  }, {
    name: 'Agendar',
    value: tasks.filter(t => t.quadrant === 1 && t.completed).length
  }, {
    name: 'Delegar',
    value: tasks.filter(t => t.quadrant === 2 && t.completed).length
  }, {
    name: 'Eliminar',
    value: tasks.filter(t => t.quadrant === 3 && t.completed).length
  }];

  // Dados para o gráfico de distribuição de tarefas por quadrante (todas as tarefas)
  const taskDistributionByQuadrant = [{
    name: 'Fazer Agora',
    value: tasks.filter(t => t.quadrant === 0).length
  }, {
    name: 'Agendar',
    value: tasks.filter(t => t.quadrant === 1).length
  }, {
    name: 'Delegar',
    value: tasks.filter(t => t.quadrant === 2).length
  }, {
    name: 'Eliminar',
    value: tasks.filter(t => t.quadrant === 3).length
  }];

  // Calcular tempo médio para conclusão (em dias) por quadrante
  const calculateAverageCompletionTime = (quadrantIndex: number) => {
    const completedTasksInQuadrant = tasks.filter(t => t.quadrant === quadrantIndex && t.completed && t.completedAt);
    if (completedTasksInQuadrant.length === 0) return 0;
    const totalTimeInDays = completedTasksInQuadrant.reduce((sum, task) => {
      const creationTime = new Date(task.createdAt).getTime();
      const completionTime = new Date(task.completedAt as Date).getTime();
      const timeDiffInDays = (completionTime - creationTime) / (1000 * 60 * 60 * 24);
      return sum + timeDiffInDays;
    }, 0);
    return totalTimeInDays / completedTasksInQuadrant.length;
  };
  const averageCompletionTimeData = [{
    name: 'Fazer Agora',
    dias: calculateAverageCompletionTime(0)
  }, {
    name: 'Agendar',
    dias: calculateAverageCompletionTime(1)
  }, {
    name: 'Delegar',
    dias: calculateAverageCompletionTime(2)
  }, {
    name: 'Eliminar',
    dias: calculateAverageCompletionTime(3)
  }];

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
      const tasksCreated = tasks.filter(t => {
        const taskDate = new Date(t.createdAt);
        return taskDate.getDate() === date.getDate() && 
               taskDate.getMonth() === date.getMonth() && 
               taskDate.getFullYear() === date.getFullYear();
      }).length;
      
      const tasksCompleted = tasks.filter(t => {
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
  
  // Período de análise
  const [period, setPeriod] = useState<'week' | 'month' | 'all'>('week');
  
  // Prioridades das tarefas
  const taskPriorities = [
    { name: 'Alta', value: tasks.filter(t => t.importance > 7).length },
    { name: 'Média', value: tasks.filter(t => t.importance > 4 && t.importance <= 7).length },
    { name: 'Baixa', value: tasks.filter(t => t.importance <= 4).length }
  ];
  
  // Últimas tarefas concluídas
  const recentlyCompletedTasks = tasks
    .filter(t => t.completed)
    .sort((a, b) => (b.completedAt?.getTime() || 0) - (a.completedAt?.getTime() || 0))
    .slice(0, 5);
  
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
              <h3 className="text-2xl font-bold">{tasks.length}</h3>
            </div>
            <div className="p-2.5 rounded-full bg-blue-500/10 text-blue-400">
              <ClipboardList className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-xs text-muted-foreground flex items-center">
            <TrendingUp className="h-3.5 w-3.5 mr-1 text-green-400" />
            <span>Aumento de 12% em relação à semana anterior</span>
          </div>
        </Card>
        
        <Card className="p-4 border-border/30 bg-background/50 backdrop-blur-sm hover:bg-background/60 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tarefas Concluídas</p>
              <h3 className="text-2xl font-bold">{tasks.filter(t => t.completed).length}</h3>
            </div>
            <div className="p-2.5 rounded-full bg-green-500/10 text-green-400">
              <CheckCircle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-xs text-muted-foreground flex items-center">
            <div className="w-full bg-gray-700/30 rounded-full h-1.5">
              <div className="bg-green-500 h-1.5 rounded-full" style={{width: `${(tasks.filter(t => t.completed).length / tasks.length) * 100}%`}}></div>
            </div>
            <span className="ml-2">{Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)}%</span>
          </div>
        </Card>
        
        <Card className="p-4 border-border/30 bg-background/50 backdrop-blur-sm hover:bg-background/60 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tempo Médio (dias)</p>
              <h3 className="text-2xl font-bold">{(
                averageCompletionTimeData.reduce((sum, item) => sum + item.dias, 0) / 
                averageCompletionTimeData.filter(item => item.dias > 0).length
              ).toFixed(1)}</h3>
            </div>
            <div className="p-2.5 rounded-full bg-amber-500/10 text-amber-400">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-xs text-muted-foreground flex items-center">
            <Calendar className="h-3.5 w-3.5 mr-1" />
            <span>Para concluir tarefas</span>
          </div>
        </Card>
        
        <Card className="p-4 border-border/30 bg-background/50 backdrop-blur-sm hover:bg-background/60 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Taxa de Conclusão</p>
              <h3 className="text-2xl font-bold">{(tasks.filter(t => t.completed).length / tasks.length * 100).toFixed(0)}%</h3>
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