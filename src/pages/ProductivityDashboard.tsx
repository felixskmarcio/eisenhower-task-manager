
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BarChart2, ClipboardList, Clock, Calendar as CalendarIcon, CheckCircle, TrendingUp, Activity, PieChart as PieChartIcon, Target, ChevronRight, Terminal, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { formatDate } from '../utils/dateUtils';
import { getTasks } from '../services/database';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { Task as DatabaseTask } from '../services/types';
import { motion } from 'framer-motion';

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

  // Cores Industrias
  const COLORS = ['#ccff00', '#00f0ff', '#ff003c', '#ffffff'];
  const QUADRANT_NAMES = ['Fazer Agora', 'Agendar', 'Delegar', 'Eliminar'];

  // Dados para o gráfico de linha de tempo (últimos 7 dias)
  const generateTimelineData = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = formatDate(date);

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#09090b] text-[#ccff00]">
        <div className="flex flex-col items-center gap-4">
          <Zap className="w-8 h-8 animate-pulse" />
          <span className="font-mono text-xs tracking-[0.2em] animate-pulse">CARREGANDO SISTEMA...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] p-6 lg:p-12 font-sans selection:bg-[#ccff00] selection:text-black">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none opacity-20"
        style={{ backgroundImage: 'linear-gradient(#27272a 1px, transparent 1px), linear-gradient(90deg, #27272a 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8 border-b border-[#27272a] pb-8">
          <div className="space-y-2">
            <Link to="/" className="inline-flex items-center gap-2 text-[#71717a] hover:text-[#ccff00] transition-colors group mb-2">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="font-mono text-[10px] uppercase tracking-wider">Voltar ao Matrix</span>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#ccff00] flex items-center justify-center">
                <Terminal className="w-5 h-5 text-black" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-wide leading-none text-white">
                  Produtividade
                </h1>
                <p className="font-mono text-xs text-[#71717a] mt-1 tracking-widest">
                  ANÁLISE DE DADOS E MÉTRICAS
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-[#18181b] border border-[#27272a]">
              <div className="w-2 h-2 bg-[#ccff00] animate-pulse shadow-[0_0_10px_#ccff00]" />
              <span className="font-mono text-[10px] text-[#ccff00] uppercase tracking-widest">Sistema Operante</span>
            </div>

            <div className="flex border border-[#27272a] bg-[#18181b]">
              {[
                { id: 'week', label: '7 Dias' },
                { id: 'month', label: '30 Dias' },
                { id: 'all', label: 'Global' }
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPeriod(p.id as any)}
                  className={`
                                px-4 py-2 text-[10px] font-mono uppercase tracking-wider transition-all
                                ${period === p.id
                      ? 'bg-[#f4f4f5] text-black font-bold'
                      : 'text-[#71717a] hover:text-[#f4f4f5] hover:bg-[#27272a]'}
                            `}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Tarefas', val: filteredTasks.length, icon: ClipboardList, sub: 'No Período', color: 'text-white' },
            { label: 'Conclusão', val: filteredTasks.filter(t => t.completed).length, icon: CheckCircle, sub: `${filteredTasks.length ? Math.round((filteredTasks.filter(t => t.completed).length / filteredTasks.length) * 100) : 0}% Taxa`, color: 'text-[#ccff00]' },
            { label: 'Tempo Médio', val: (averageCompletionTimeData.reduce((sum, item) => sum + item.dias, 0) / averageCompletionTimeData.filter(item => item.dias > 0).length || 0).toFixed(1), icon: Clock, sub: 'Dias / Tarefa', color: 'text-[#00f0ff]' },
            { label: 'Eficiência', val: `${filteredTasks.length ? (filteredTasks.filter(t => t.completed).length / filteredTasks.length * 100).toFixed(0) : 0}%`, icon: Target, sub: 'Performance Total', color: 'text-[#ff003c]' },
          ].map((kpi, idx) => (
            <div key={idx} className="bg-[#18181b] border border-[#27272a] p-5 relative overflow-hidden group hover:border-[#3f3f46] transition-colors">
              <div className="flex justify-between items-start mb-4">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#71717a]">{kpi.label}</span>
                <kpi.icon className={`w-4 h-4 ${kpi.color} opacity-50`} />
              </div>
              <div className={`text-3xl font-bold ${kpi.color} font-mono tracking-tighter`}>
                {kpi.val}
              </div>
              <div className="mt-2 flex items-center gap-2">
                <div className={`w-1 h-1 rounded-full ${kpi.color.replace('text-', 'bg-')}`} />
                <span className="text-[10px] text-[#52525b] uppercase tracking-wider font-mono">{kpi.sub}</span>
              </div>
              {/* Corner Accent */}
              <div className={`absolute top-0 right-0 w-2 h-2 ${kpi.color.replace('text-', 'bg-')} opacity-0 group-hover:opacity-100 transition-opacity`} />
            </div>
          ))}
        </div>

        {/* Timeline Chart */}
        <div className="bg-[#18181b] border border-[#27272a] p-6 mb-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold uppercase tracking-wide text-sm flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#ccff00]" />
              Fluxo de Atividade
            </h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#ccff00]" />
                <span className="font-mono text-[10px] text-[#71717a] uppercase">Concluídas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#00f0ff]" />
                <span className="font-mono text-[10px] text-[#71717a] uppercase">Criadas</span>
              </div>
            </div>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData}>
                <defs>
                  <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#00f0ff" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ccff00" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#ccff00" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="#52525b"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  fontFamily="JetBrains Mono, monospace"
                  dy={10}
                />
                <YAxis
                  stroke="#52525b"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  fontFamily="JetBrains Mono, monospace"
                  dx={-10}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#09090b',
                    borderColor: '#27272a',
                    color: '#f4f4f5',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '12px',
                    textTransform: 'uppercase'
                  }}
                  itemStyle={{ color: '#f4f4f5' }}
                />
                <Area type="monotone" dataKey="criadas" stroke="#00f0ff" strokeWidth={2} fillOpacity={1} fill="url(#colorCreated)" />
                <Area type="monotone" dataKey="concluídas" stroke="#ccff00" strokeWidth={2} fillOpacity={1} fill="url(#colorCompleted)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Quadrant Performance */}
          <div className="bg-[#18181b] border border-[#27272a] p-6 flex flex-col">
            <h3 className="font-bold uppercase tracking-wide text-sm flex items-center gap-2 mb-6">
              <BarChart2 className="w-4 h-4 text-[#ccff00]" />
              Performance do Quadrante
            </h3>
            <div className="flex-1 min-h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={completedTasksByQuadrant} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={80}
                    stroke="#71717a"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    fontFamily="JetBrains Mono, monospace"
                  />
                  <Tooltip
                    cursor={{ fill: '#27272a' }}
                    contentStyle={{
                      backgroundColor: '#09090b',
                      borderColor: '#27272a',
                      color: '#f4f4f5',
                      fontFamily: 'JetBrains Mono, monospace'
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {completedTasksByQuadrant.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Distribution */}
          <div className="bg-[#18181b] border border-[#27272a] p-6 flex flex-col">
            <h3 className="font-bold uppercase tracking-wide text-sm flex items-center gap-2 mb-6">
              <PieChartIcon className="w-4 h-4 text-[#ccff00]" />
              Distribuição de Carga
            </h3>
            <div className="flex-1 min-h-[200px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskDistributionByQuadrant}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {taskDistributionByQuadrant.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0)" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#09090b',
                      borderColor: '#27272a',
                      color: '#f4f4f5',
                      fontFamily: 'JetBrains Mono, monospace'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center Stat */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{filteredTasks.length}</div>
                  <div className="text-[9px] uppercase tracking-widest text-[#71717a]">Total</div>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              {QUADRANT_NAMES.map((name, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2" style={{ backgroundColor: COLORS[index] }} />
                  <span className="text-[10px] uppercase text-[#71717a] font-mono">{name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Log */}
          <div className="bg-[#18181b] border border-[#27272a] p-6 flex flex-col">
            <h3 className="font-bold uppercase tracking-wide text-sm flex items-center gap-2 mb-6">
              <Terminal className="w-4 h-4 text-[#ccff00]" />
              Log de Conclusão Recente
            </h3>
            <div className="flex-1 space-y-1 overflow-auto custom-scrollbar max-h-[250px] pr-2">
              {recentlyCompletedTasks.length > 0 ? (
                recentlyCompletedTasks.map((task, i) => (
                  <div key={task.id} className="group flex items-center p-3 hover:bg-[#27272a] transition-colors border-l-2 border-transparent hover:border-[#ccff00]">
                    <span className="font-mono text-[#52525b] text-[10px] mr-3">0{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-[#f4f4f5] truncate">{task.title}</div>
                      <div className="text-[10px] text-[#71717a] font-mono mt-0.5">
                        {task.completedAt ? formatDate(task.completedAt) : ''}
                      </div>
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS[task.quadrant] }} />
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-[#52525b] border border-dashed border-[#27272a] p-8">
                  <span className="text-xs font-mono uppercase tracking-widest">Nenhum dado registrado</span>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductivityDashboard;
