
import React, { useState, useEffect, useRef } from 'react';
import { PlusCircle, AlertTriangle, Clock, CheckSquare, Trash2, ArrowRight, HelpCircle, X, Move } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Interface para uma tarefa na matriz
interface Task {
  id: string;
  title: string;
  description: string;
  quadrant: 1 | 2 | 3 | 4;
  createdAt: Date;
}

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
      {showTutorial && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Alert className="bg-primary/10 border-primary/20">
            <div className="flex justify-between w-full">
              <div className="flex-1">
                <AlertTitle className="text-lg font-semibold text-primary mb-2">
                  Bem-vindo à demonstração da Matriz de Eisenhower
                </AlertTitle>
                <AlertDescription className="text-muted-foreground">
                  <p className="mb-2">
                    Esta é uma versão demonstrativa onde você pode experimentar como funciona a 
                    matriz de Eisenhower sem necessidade de criar uma conta.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-foreground">Como usar:</h4>
                      <ul className="space-y-1 text-sm list-disc pl-5">
                        <li>Clique em <strong>Nova Tarefa</strong> para adicionar novas atividades</li>
                        <li>Escolha o quadrante apropriado para cada tarefa</li>
                        <li>Use as abas para filtrar tarefas por quadrante</li>
                        <li><strong>Arraste e solte</strong> tarefas entre os quadrantes para reclassificá-las</li>
                        <li>Passe o mouse sobre uma tarefa e clique no ícone de lixeira para removê-la</li>
                      </ul>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium text-foreground">Dicas para classificar suas tarefas:</h4>
                      <ul className="space-y-1 text-sm list-disc pl-5">
                        <li><strong>Q1 (Vermelho):</strong> Crises, problemas urgentes, prazos inadiáveis</li>
                        <li><strong>Q2 (Verde):</strong> Planejamento, desenvolvimento pessoal, relacionamentos</li>
                        <li><strong>Q3 (Amarelo):</strong> Interrupções, algumas reuniões, e-mails</li>
                        <li><strong>Q4 (Cinza):</strong> Distrações, atividades triviais, procrastinação</li>
                      </ul>
                    </div>
                  </div>
                  
                  <p className="text-sm">
                    As tarefas que você adicionar ficarão salvas apenas neste navegador. Para salvar permanentemente e 
                    acessar recursos avançados, crie uma conta.
                  </p>
                </AlertDescription>
              </div>
              
              <Button variant="ghost" size="icon" onClick={closeTutorial} className="h-6 w-6 shrink-0">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </Alert>
        </motion.div>
      )}

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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(quadrant => {
                const quadTasks = tasks.filter(task => task.quadrant === quadrant);
                const { title, icon: Icon, color } = quadrantData[quadrant as 1 | 2 | 3 | 4];
                
                return (
                  <div 
                    key={quadrant} 
                    className="border rounded-lg p-4 quadrant-drop-zone transition-all duration-300"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, quadrant)}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <div className={`p-1.5 rounded-md ${color}/20`}>
                        <Icon className={`h-4 w-4 ${quadrantData[quadrant as 1 | 2 | 3 | 4].textColor}`} />
                      </div>
                      <h3 className="font-medium">{title}</h3>
                      <Badge variant="outline" className="ml-auto">
                        {quadTasks.length}
                      </Badge>
                    </div>
                    
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                      {quadTasks.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          Sem tarefas neste quadrante
                        </p>
                      ) : (
                        quadTasks.map(task => (
                          <TaskCard 
                            key={task.id} 
                            task={task} 
                            quadrantData={quadrantData[task.quadrant]} 
                            onRemove={handleRemoveTask}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                          />
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              {getFilteredTasks().length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">
                  Sem tarefas para mostrar neste quadrante
                </p>
              ) : (
                getFilteredTasks().map(task => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    quadrantData={quadrantData[task.quadrant]} 
                    onRemove={handleRemoveTask}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                  />
                ))
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialog de nova tarefa */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Nova Tarefa</DialogTitle>
            <DialogDescription>
              Preencha os detalhes da tarefa e selecione o quadrante correto na matriz.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título da Tarefa</Label>
              <Input
                id="title"
                placeholder="Digite o título da tarefa"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descrição (opcional)</Label>
              <Textarea
                id="description"
                placeholder="Detalhes adicionais sobre a tarefa"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Quadrante</Label>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(quadrantData).map(([key, data]) => {
                  const Icon = data.icon;
                  const isSelected = newTask.quadrant === parseInt(key);
                  
                  return (
                    <div
                      key={key}
                      className={`border rounded-lg p-3 cursor-pointer transition-all ${
                        isSelected ? 'border-primary ring-1 ring-primary' : ''
                      }`}
                      onClick={() => setNewTask({ ...newTask, quadrant: parseInt(key) as 1 | 2 | 3 | 4 })}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`p-1 rounded-md ${data.color}/20`}>
                          <Icon className={`h-4 w-4 ${data.textColor}`} />
                        </div>
                        <span className="text-sm font-medium">{`Q${key}: ${data.title.split(",")[0]}`}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleAddTask} disabled={!newTask.title}>Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="mt-16 text-center border-t pt-8">
        <Card className="max-w-3xl mx-auto mb-8 bg-muted/40">
          <CardHeader>
            <CardTitle>Maximizando sua produtividade</CardTitle>
            <CardDescription>Dicas para uso eficiente da Matriz de Eisenhower no dia a dia</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <div className="p-1 rounded-full bg-red-500/20">
                      <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
                    </div>
                    <span>Quadrante 1: Urgente & Importante</span>
                  </h4>
                  <p className="text-sm text-muted-foreground">Dedique tempo para <strong>reduzir</strong> as tarefas deste quadrante melhorando seu planejamento. Muitas tarefas aqui indicam gerenciamento reativo.</p>
                </div>
                
                <div className="flex flex-col gap-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <div className="p-1 rounded-full bg-green-500/20">
                      <CheckSquare className="h-3.5 w-3.5 text-green-500" />
                    </div>
                    <span>Quadrante 2: Não-Urgente & Importante</span>
                  </h4>
                  <p className="text-sm text-muted-foreground"><strong>Amplie</strong> seu foco aqui. Investir tempo em planejamento, relacionamentos e desenvolvimento pessoal traz os melhores resultados a longo prazo.</p>
                </div>
                
                <div className="flex flex-col gap-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <div className="p-1 rounded-full bg-amber-500/20">
                      <Clock className="h-3.5 w-3.5 text-amber-500" />
                    </div>
                    <span>Quadrante 3: Urgente & Não-Importante</span>
                  </h4>
                  <p className="text-sm text-muted-foreground"><strong>Reduza ou delegue</strong> estas tarefas. Elas parecem importantes pela urgência, mas não contribuem para seus objetivos de longo prazo.</p>
                </div>
                
                <div className="flex flex-col gap-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <div className="p-1 rounded-full bg-gray-500/20">
                      <Trash2 className="h-3.5 w-3.5 text-gray-500" />
                    </div>
                    <span>Quadrante 4: Não-Urgente & Não-Importante</span>
                  </h4>
                  <p className="text-sm text-muted-foreground"><strong>Elimine</strong> estas atividades. Elas são desperdiçadores de tempo que não trazem valor significativo para sua vida ou objetivos.</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-center">
            <Button asChild variant="outline" size="sm">
              <Link to="/introduction">
                Ver guia completo
                <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

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

// Componente para exibir uma tarefa
const TaskCard = ({ 
  task, 
  quadrantData, 
  onRemove,
  onDragStart,
  onDragEnd
}: { 
  task: Task; 
  quadrantData: { title: string; icon: React.ElementType; color: string; textColor: string; }; 
  onRemove: (id: string) => void;
  onDragStart: (e: React.DragEvent, task: Task) => void;
  onDragEnd: (e: React.DragEvent) => void;
}) => {
  const Icon = quadrantData.icon;
  
  // Modificação aqui: Use manejos de eventos standard HTML para drag ao invés dos eventos do Framer Motion
  return (
    <div
      className="border rounded-lg p-3 hover:shadow-sm transition-all group cursor-grab"
      draggable={true}
      onDragStart={(e) => onDragStart(e, task)}
      onDragEnd={onDragEnd}
    >
      <div className="flex items-start gap-2">
        <div className={`p-1.5 rounded-md ${quadrantData.color}/20 mt-0.5`}>
          <Icon className={`h-3.5 w-3.5 ${quadrantData.textColor}`} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center">
            <h4 className="font-medium text-sm truncate flex-1">{task.title}</h4>
            <Move className="h-3 w-3 text-muted-foreground opacity-40 group-hover:opacity-100 ml-1 drag-handle" />
          </div>
          {task.description && (
            <p className="text-muted-foreground text-xs mt-1 line-clamp-2">{task.description}</p>
          )}
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => onRemove(task.id)}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};

export default Demo;
