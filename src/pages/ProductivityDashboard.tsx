import React from 'react';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

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
  const tasks: Task[] = [
    {
      id: '1',
      title: 'Reunião de Equipe',
      description: 'Alinhamento do projeto',
      urgency: 8,
      importance: 9,
      quadrant: 0,
      completed: true,
      createdAt: new Date(Date.now() - 86400000 * 5), // 5 dias atrás
      completedAt: new Date(Date.now() - 86400000 * 3) // 3 dias atrás
    },
    {
      id: '2',
      title: 'Planejamento Estratégico',
      description: 'Definir metas para o próximo trimestre',
      urgency: 6,
      importance: 9,
      quadrant: 1,
      completed: true,
      createdAt: new Date(Date.now() - 172800000 * 3), // 6 dias atrás
      completedAt: new Date(Date.now() - 86400000 * 2) // 2 dias atrás
    },
    {
      id: '3',
      title: 'Responder E-mails',
      description: 'Caixa de entrada',
      urgency: 7,
      importance: 4,
      quadrant: 2,
      completed: true,
      createdAt: new Date(Date.now() - 43200000 * 8), // 4 dias atrás
      completedAt: new Date(Date.now() - 21600000 * 10) // 3 dias atrás
    },
    {
      id: '4',
      title: 'Assistir Netflix',
      description: 'Série favorita',
      urgency: 2,
      importance: 2,
      quadrant: 3,
      completed: true,
      createdAt: new Date(Date.now() - 21600000 * 12), // 3 dias atrás
      completedAt: new Date(Date.now() - 3600000 * 24) // 1 dia atrás
    },
    {
      id: '5',
      title: 'Preparar Apresentação',
      description: 'Slides para reunião',
      urgency: 9,
      importance: 8,
      quadrant: 0,
      completed: true,
      createdAt: new Date(Date.now() - 86400000 * 4), // 4 dias atrás
      completedAt: new Date(Date.now() - 86400000 * 3.5) // 3.5 dias atrás
    },
    {
      id: '6',
      title: 'Curso Online',
      description: 'Aprendizado contínuo',
      urgency: 4,
      importance: 8,
      quadrant: 1,
      completed: false,
      createdAt: new Date(Date.now() - 86400000 * 7), // 7 dias atrás
      completedAt: null
    },
    {
      id: '7',
      title: 'Ligações de Vendas',
      description: 'Contatar clientes',
      urgency: 7,
      importance: 5,
      quadrant: 2,
      completed: false,
      createdAt: new Date(Date.now() - 86400000 * 2), // 2 dias atrás
      completedAt: null
    },
    {
      id: '8',
      title: 'Navegar em Redes Sociais',
      description: 'Verificar atualizações',
      urgency: 3,
      importance: 2,
      quadrant: 3,
      completed: false,
      createdAt: new Date(Date.now() - 86400000 * 1), // 1 dia atrás
      completedAt: null
    }
  ];

  // Dados para o gráfico de tarefas concluídas por quadrante
  const completedTasksByQuadrant = [
    { name: 'Fazer Agora', value: tasks.filter(t => t.quadrant === 0 && t.completed).length },
    { name: 'Agendar', value: tasks.filter(t => t.quadrant === 1 && t.completed).length },
    { name: 'Delegar', value: tasks.filter(t => t.quadrant === 2 && t.completed).length },
    { name: 'Eliminar', value: tasks.filter(t => t.quadrant === 3 && t.completed).length }
  ];

  // Dados para o gráfico de distribuição de tarefas por quadrante (todas as tarefas)
  const taskDistributionByQuadrant = [
    { name: 'Fazer Agora', value: tasks.filter(t => t.quadrant === 0).length },
    { name: 'Agendar', value: tasks.filter(t => t.quadrant === 1).length },
    { name: 'Delegar', value: tasks.filter(t => t.quadrant === 2).length },
    { name: 'Eliminar', value: tasks.filter(t => t.quadrant === 3).length }
  ];

  // Calcular tempo médio para conclusão (em dias) por quadrante
  const calculateAverageCompletionTime = (quadrantIndex: number) => {
    const completedTasksInQuadrant = tasks.filter(
      t => t.quadrant === quadrantIndex && t.completed && t.completedAt
    );
    
    if (completedTasksInQuadrant.length === 0) return 0;
    
    const totalTimeInDays = completedTasksInQuadrant.reduce((sum, task) => {
      const creationTime = new Date(task.createdAt).getTime();
      const completionTime = new Date(task.completedAt as Date).getTime();
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
  const COLORS = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#A06CD5'];
  
  // Configurações comuns para os gráficos
  const chartConfig = {
    style: {
      background: 'transparent',
    },
    theme: {
      axis: {
        domain: { line: { stroke: '#525252' } },
        ticks: { line: { stroke: '#525252' } },
        text: { fill: '#A1A1AA' }
      },
      grid: {
        line: {
          stroke: '#2D2D2D',
          strokeWidth: 1
        }
      },
      legends: {
        text: { fill: '#A1A1AA' }
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
  return (
    <div className="p-6 bg-background/95 min-h-screen">
      <div className="mb-8 text-center backdrop-blur-sm">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Análise de Produtividade</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Gráfico de Tarefas Concluídas por Quadrante */}
        <Card className="p-4 bg-card/30 backdrop-blur-md border-border/50 shadow-xl hover:shadow-primary/5 transition-all duration-300">
          <h2 className="text-xl font-semibold mb-4">Tarefas Concluídas por Quadrante</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={completedTasksByQuadrant} {...chartConfig}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="Tarefas Concluídas">
                {completedTasksByQuadrant.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Gráfico de Tempo Médio para Conclusão */}
        <Card className="p-4 bg-card/30 backdrop-blur-md border-border/50 shadow-xl hover:shadow-primary/5 transition-all duration-300">
          <h2 className="text-xl font-semibold mb-4">Tempo Médio para Conclusão (Dias)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={averageCompletionTimeData} {...chartConfig}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="dias" name="Dias" fill="#8884d8">
                {averageCompletionTimeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gráfico de Distribuição de Tarefas (Tendências) */}
        <Card className="p-4 bg-card/30 backdrop-blur-md border-border/50 shadow-xl hover:shadow-primary/5 transition-all duration-300">
          <h2 className="text-xl font-semibold mb-4">Distribuição de Tarefas por Quadrante</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart {...chartConfig}>
              <Pie
                data={taskDistributionByQuadrant}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {taskDistributionByQuadrant.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Estatísticas Gerais */}
        <Card className="p-4 bg-card/30 backdrop-blur-md border-border/50 shadow-xl hover:shadow-primary/5 transition-all duration-300">
          <h2 className="text-xl font-semibold mb-4">Estatísticas Gerais</h2>
          <div className="space-y-4 backdrop-blur-sm">
            <div className="bg-secondary/40 hover:bg-secondary/50 p-4 rounded-lg backdrop-blur-sm transition-colors duration-300 border border-border/50">
              <h3 className="font-medium text-secondary-foreground">Total de Tarefas</h3>
              <p className="text-2xl font-bold text-secondary-foreground">{tasks.length}</p>
            </div>
            <div className="bg-secondary/40 hover:bg-secondary/50 p-4 rounded-lg backdrop-blur-sm transition-colors duration-300 border border-border/50">
              <h3 className="font-medium text-secondary-foreground">Tarefas Concluídas</h3>
              <p className="text-2xl font-bold text-secondary-foreground">{tasks.filter(t => t.completed).length}</p>
            </div>
            <div className="bg-secondary/40 hover:bg-secondary/50 p-4 rounded-lg backdrop-blur-sm transition-colors duration-300 border border-border/50">
              <h3 className="font-medium text-secondary-foreground">Taxa de Conclusão</h3>
              <p className="text-2xl font-bold text-secondary-foreground">
                {((tasks.filter(t => t.completed).length / tasks.length) * 100).toFixed(0)}%
              </p>
            </div>
            <div className="bg-secondary/40 hover:bg-secondary/50 p-4 rounded-lg backdrop-blur-sm transition-colors duration-300 border border-border/50">
              <h3 className="font-medium text-secondary-foreground">Quadrante com Mais Tarefas</h3>
              <p className="text-2xl font-bold text-secondary-foreground">
                {taskDistributionByQuadrant.reduce((prev, current) => 
                  (prev.value > current.value) ? prev : current
                ).name}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProductivityDashboard;