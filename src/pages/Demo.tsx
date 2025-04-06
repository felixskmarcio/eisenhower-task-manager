
import React, { useState, useEffect } from 'react';
import { PlusCircle, AlertTriangle, Clock, CheckSquare, Trash2, ArrowRight, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Task } from '@/components/eisenhower/TaskCard';
import TutorialAlert from '@/components/eisenhower/TutorialAlert';
import CreateTaskDialog from '@/components/eisenhower/CreateTaskDialog';
import MatrixGrid from '@/components/eisenhower/MatrixGrid';
import TaskList from '@/components/eisenhower/TaskList';
import TipsCard from '@/components/eisenhower/TipsCard';

const Demo = () => {
  // Estado para as tarefas de demonstração
  const [tasks, setTasks] = useState<Task[]>(() => {
    // Recupera do localStorage se existir
    const savedTasks = localStorage.getItem('demo-tasks');
    if (savedTasks) {
      return JSON.parse(savedTasks);
    }
    
    // Tarefas de demonstração iniciais
    return [
      { 
        id: '1', 
        title: 'Resolver problema crítico no sistema', 
        description: 'Um problema urgente que afeta os usuários e precisa ser resolvido imediatamente.',
        quadrant: 1, 
        createdAt: new Date() 
      },
      { 
        id: '2', 
        title: 'Planejar estratégia de longo prazo', 
        description: 'Definir metas e objetivos para os próximos 3 meses.',
        quadrant: 2, 
        createdAt: new Date() 
      },
      { 
        id: '3', 
        title: 'Responder e-mails não prioritários', 
        description: 'E-mails que requerem resposta rápida mas não são fundamentais.',
        quadrant: 3, 
        createdAt: new Date() 
      },
      { 
        id: '4', 
        title: 'Verificar redes sociais', 
        description: 'Atividade que consome tempo e não contribui para objetivos importantes.',
        quadrant: 4, 
        createdAt: new Date() 
      },
    ];
  });

  // Estado para a tarefa sendo editada/criada
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    quadrant: 1
  });
  
  // Estado para o dialog de nova tarefa
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  // Estado para drag and drop
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Novo estado para mostrar/ocultar o tutorial
  const [showTutorial, setShowTutorial] = useState(() => {
    // Verifica se o usuário já viu o tutorial antes
    const tutorialShown = localStorage.getItem('demo-tutorial-shown');
    return tutorialShown !== 'true';
  });

  // Guarda as tarefas no localStorage sempre que mudarem
  useEffect(() => {
    localStorage.setItem('demo-tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Adiciona nova tarefa
  const handleAddTask = () => {
    if (!newTask.title) return;
    
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description || '',
      quadrant: newTask.quadrant as 1 | 2 | 3 | 4,
      createdAt: new Date()
    };
    
    setTasks(prev => [...prev, task]);
    setDialogOpen(false);
    setNewTask({ title: '', description: '', quadrant: 1 });
  };

  // Funções para drag and drop
  const handleDragStart = (e: React.DragEvent, task: Task) => {
    e.dataTransfer.setData('taskId', task.id);
    setDraggedTask(task);
    setIsDragging(true);
    
    // Adiciona classe visual para o elemento arrastado
    const element = e.currentTarget as HTMLElement;
    element.classList.add('dragging');
    
    // Adiciona offset para melhorar a experiência visual
    const rect = element.getBoundingClientRect();
    e.dataTransfer.setDragImage(element, rect.width / 2, rect.height / 2);
    
    // Feedback visual para arrastar
    setTimeout(() => {
      element.style.opacity = '0.5';
      element.style.transform = 'scale(1.03)';
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setIsDragging(false);
    setDraggedTask(null);
    
    // Remove estilos visuais
    const element = e.currentTarget as HTMLElement;
    element.classList.remove('dragging');
    element.style.opacity = '';
    element.style.transform = '';
    
    // Remove a classe de todos os quadrantes
    document.querySelectorAll('.quadrant-drop-zone').forEach(zone => {
      zone.classList.remove('drag-over');
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Adiciona efeito visual ao quadrante
    const dropZone = e.currentTarget as HTMLElement;
    dropZone.classList.add('drag-over');
    
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Remove efeito visual quando o cursor sai da zona
    const dropZone = e.currentTarget as HTMLElement;
    dropZone.classList.remove('drag-over');
  };

  const handleDrop = (e: React.DragEvent, newQuadrant: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Remove efeito visual
    const dropZone = e.currentTarget as HTMLElement;
    dropZone.classList.remove('drag-over');
    
    // Recupera o ID da tarefa arrastada
    const taskId = e.dataTransfer.getData('taskId');
    if (!taskId) return;
    
    // Atualiza o quadrante da tarefa
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId && task.quadrant !== newQuadrant) {
        return { ...task, quadrant: newQuadrant as 1 | 2 | 3 | 4 };
      }
      return task;
    });
    
    setTasks(updatedTasks);
  };

  // Remove uma tarefa
  const handleRemoveTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  // Filtra tarefas por quadrante
  const getFilteredTasks = () => {
    if (activeTab === 'all') return tasks;
    const quadrant = parseInt(activeTab);
    return tasks.filter(task => task.quadrant === quadrant);
  };

  // Configura os dados do quadrante
  const quadrantData = {
    1: { title: 'Urgente e Importante', icon: AlertTriangle, color: 'bg-red-500', textColor: 'text-red-500' },
    2: { title: 'Importante, Não Urgente', icon: CheckSquare, color: 'bg-green-500', textColor: 'text-green-500' },
    3: { title: 'Urgente, Não Importante', icon: Clock, color: 'bg-amber-500', textColor: 'text-amber-500' },
    4: { title: 'Nem Urgente, Nem Importante', icon: Trash2, color: 'bg-gray-500', textColor: 'text-gray-500' }
  };

  // Fechar o tutorial e lembrar essa ação
  const closeTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem('demo-tutorial-shown', 'true');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary">Matriz de Eisenhower</h1>
          <p className="text-muted-foreground mt-1">Versão de demonstração - Organize suas tarefas por prioridade</p>
        </div>
        
        <div className="flex gap-4 mt-4 md:mt-0">
          <Button onClick={() => setDialogOpen(true)} className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Nova Tarefa
          </Button>
          <Button asChild variant="outline">
            <Link to="/introduction" className="gap-2">
              Saiba mais
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" onClick={() => setShowTutorial(true)} className="gap-2">
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Como usar</span>
          </Button>
        </div>
      </div>

      {/* Tutorial / Instruções */}
      {showTutorial && <TutorialAlert onClose={closeTutorial} />}

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid grid-cols-5">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="1" className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            Q1
          </TabsTrigger>
          <TabsTrigger value="2" className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Q2
          </TabsTrigger>
          <TabsTrigger value="3" className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            Q3
          </TabsTrigger>
          <TabsTrigger value="4" className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gray-500"></span>
            Q4
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-6">
          {activeTab === 'all' ? (
            <MatrixGrid 
              tasks={tasks}
              quadrantData={quadrantData}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onRemoveTask={handleRemoveTask}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            />
          ) : (
            <TaskList
              tasks={getFilteredTasks()}
              quadrantData={quadrantData}
              onRemoveTask={handleRemoveTask}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Dialog de nova tarefa */}
      <CreateTaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        newTask={newTask}
        setNewTask={setNewTask}
        onAddTask={handleAddTask}
        quadrantData={quadrantData}
      />

      <div className="mt-16 text-center border-t pt-8">
        <TipsCard />

        <p className="text-muted-foreground mb-4">
          Esta é uma versão de demonstração. Crie uma conta para salvar suas tarefas e acessar todos os recursos.
        </p>
        <Button asChild className="gap-2">
          <Link to="/login">
            Criar conta
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Demo;
