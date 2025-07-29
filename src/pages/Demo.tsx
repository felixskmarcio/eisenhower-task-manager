import React, { useState, useEffect } from 'react';
import { PlusCircle, AlertTriangle, Clock, CheckSquare, Trash2, ArrowRight, HelpCircle, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useTheme } from '@/contexts/ThemeContext';

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
    return [{
      id: '1',
      title: 'Resolver problema crítico no sistema',
      description: 'Um problema urgente que afeta os usuários e precisa ser resolvido imediatamente.',
      quadrant: 1,
      createdAt: new Date()
    }, {
      id: '2',
      title: 'Planejar estratégia de longo prazo',
      description: 'Definir metas e objetivos para os próximos 3 meses.',
      quadrant: 2,
      createdAt: new Date()
    }, {
      id: '3',
      title: 'Responder e-mails não prioritários',
      description: 'E-mails que requerem resposta rápida mas não são fundamentais.',
      quadrant: 3,
      createdAt: new Date()
    }, {
      id: '4',
      title: 'Verificar redes sociais',
      description: 'Atividade que consome tempo e não contribui para objetivos importantes.',
      quadrant: 4,
      createdAt: new Date()
    }];
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
  const {
    currentTheme
  } = useTheme();

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
    setNewTask({
      title: '',
      description: '',
      quadrant: 1
    });
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
    1: {
      title: 'Urgente e Importante',
      icon: AlertTriangle,
      color: 'bg-red-500',
      textColor: 'text-red-500',
      gradient: 'from-red-50/80 via-red-50/50 to-red-50/30'
    },
    2: {
      title: 'Importante, Não Urgente',
      icon: CheckSquare,
      color: 'bg-green-500',
      textColor: 'text-green-500',
      gradient: 'from-green-50/80 via-green-50/50 to-green-50/30'
    },
    3: {
      title: 'Urgente, Não Importante',
      icon: Clock,
      color: 'bg-amber-500',
      textColor: 'text-amber-500',
      gradient: 'from-amber-50/80 via-amber-50/50 to-amber-50/30'
    },
    4: {
      title: 'Nem Urgente, Nem Importante',
      icon: Trash2,
      color: 'bg-gray-500',
      textColor: 'text-gray-500',
      gradient: 'from-gray-50/80 via-gray-50/50 to-gray-50/30'
    }
  };

  // Fechar o tutorial e lembrar essa ação
  const closeTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem('demo-tutorial-shown', 'true');
  };
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  const headerVariants = {
    hidden: {
      opacity: 0,
      y: -20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <motion.div initial="hidden" animate="visible" variants={headerVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-purple-500/20 to-indigo-600/20 rounded-lg blur opacity-25"></div>
            <div className="relative">
              <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-600 to-indigo-600 mb-2">
                Matriz de Eisenhower
              </h1>
              <p className="text-muted-foreground/80 text-lg">Versão de demonstração - Organize suas tarefas por prioridade</p>
            </div>
          </div>
          
          <div className="flex gap-4 mt-6 md:mt-0">
            <Button 
              onClick={() => setDialogOpen(true)} 
              className="gap-2 bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0"
            >
              <PlusCircle className="h-4 w-4" />
              Nova Tarefa
            </Button>
            <Button 
              asChild 
              variant="outline" 
              className="glass-effect border-white/20 hover:bg-white/10 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Link to="/introduction" className="gap-2">
                Saiba mais
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.div>

      {/* Tutorial / Instruções */}
      <AnimatePresence>
        {showTutorial && <motion.div initial={{
        opacity: 0,
        y: -20
      }} animate={{
        opacity: 1,
        y: 0
      }} exit={{
        opacity: 0,
        y: -20
      }} transition={{
        duration: 0.3
      }} className="mb-6">
            <Alert className="bg-primary/10 border-primary/20 backdrop-blur-sm shadow-lg">
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
                      <div className="space-y-2 p-3 bg-background/50 backdrop-blur-sm rounded-lg border border-border/50">
                        <h4 className="font-medium text-foreground">Como usar:</h4>
                        <ul className="space-y-1 text-sm list-disc pl-5">
                          <li>Clique em <strong>Nova Tarefa</strong> para adicionar novas atividades</li>
                          <li>Escolha o quadrante apropriado para cada tarefa</li>
                          <li>Use as abas para filtrar tarefas por quadrante</li>
                          <li>Passe o mouse sobre uma tarefa e clique no ícone de lixeira para removê-la</li>
                        </ul>
                      </div>
                      
                      <div className="space-y-2 p-3 bg-background/50 backdrop-blur-sm rounded-lg border border-border/50">
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
          </motion.div>}
      </AnimatePresence>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid grid-cols-5 glass-effect border-white/20 shadow-xl backdrop-blur-xl bg-white/10 dark:bg-black/10 p-1">
            <TabsTrigger value="all" className="data-[state=active]:bg-white/20 data-[state=active]:shadow-lg transition-all duration-300">Todas</TabsTrigger>
            <TabsTrigger value="1" className="flex items-center gap-2 data-[state=active]:bg-red-500/20 data-[state=active]:shadow-lg transition-all duration-300">
              <span className="w-2 h-2 rounded-full bg-red-500 shadow-sm"></span>
              Q1
            </TabsTrigger>
            <TabsTrigger value="2" className="flex items-center gap-2 data-[state=active]:bg-green-500/20 data-[state=active]:shadow-lg transition-all duration-300">
              <span className="w-2 h-2 rounded-full bg-green-500 shadow-sm"></span>
              Q2
            </TabsTrigger>
            <TabsTrigger value="3" className="flex items-center gap-2 data-[state=active]:bg-amber-500/20 data-[state=active]:shadow-lg transition-all duration-300">
              <span className="w-2 h-2 rounded-full bg-amber-500 shadow-sm"></span>
              Q3
            </TabsTrigger>
            <TabsTrigger value="4" className="flex items-center gap-2 data-[state=active]:bg-gray-500/20 data-[state=active]:shadow-lg transition-all duration-300">
              <span className="w-2 h-2 rounded-full bg-gray-500 shadow-sm"></span>
              Q4
            </TabsTrigger>
          </TabsList>
        
        <TabsContent value={activeTab} className="mt-6">
          {activeTab === 'all' ? <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(quadrant => {
            const quadTasks = tasks.filter(task => task.quadrant === quadrant);
            const {
              title,
              icon: Icon,
              color,
              gradient
            } = quadrantData[quadrant as 1 | 2 | 3 | 4];
            return <motion.div key={quadrant} variants={{
              hidden: {
                opacity: 0,
                y: 20
              },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.4
                }
              }
            }} className={`glass-card border-white/20 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br ${gradient} backdrop-blur-xl transform hover:scale-[1.02] hover:-translate-y-1`}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`p-2 rounded-xl ${color}/20 shadow-lg backdrop-blur-sm`}>
                        <Icon className={`h-5 w-5 ${quadrantData[quadrant as 1 | 2 | 3 | 4].textColor}`} />
                      </div>
                      <h3 className="font-semibold text-lg">{title}</h3>
                      <Badge variant="outline" className="ml-auto glass-effect border-white/30 bg-white/10 shadow-sm">
                        {quadTasks.length}
                      </Badge>
                    </div>
                    
                    <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                      <AnimatePresence>
                        {quadTasks.length === 0 ? <p className="text-sm text-muted-foreground text-center py-4">
                            Sem tarefas neste quadrante
                          </p> : quadTasks.map((task, index) => <TaskCard key={task.id} task={task} quadrantData={quadrantData[task.quadrant]} onRemove={handleRemoveTask} index={index} />)}
                      </AnimatePresence>
                    </div>
                  </motion.div>;
          })}
            </motion.div> : <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
              <AnimatePresence>
                {getFilteredTasks().length === 0 ? <p className="text-center py-8 text-muted-foreground">
                    Sem tarefas para mostrar neste quadrante
                  </p> : getFilteredTasks().map((task, index) => <TaskCard key={task.id} task={task} quadrantData={quadrantData[task.quadrant]} onRemove={handleRemoveTask} index={index} />)}
              </AnimatePresence>
            </motion.div>}
        </TabsContent>
      </Tabs>

        {/* Dialog de nova tarefa */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="glass-card backdrop-blur-2xl bg-white/10 dark:bg-black/20 border-white/20 shadow-2xl max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">Adicionar Nova Tarefa</DialogTitle>
              <DialogDescription className="text-muted-foreground/80">
                Preencha os detalhes da tarefa e selecione o quadrante correto na matriz.
              </DialogDescription>
            </DialogHeader>
          
            <div className="grid gap-6 py-6">
              <div className="space-y-3">
                <Label htmlFor="title" className="text-sm font-medium">Título da Tarefa</Label>
                <Input 
                  id="title" 
                  placeholder="Digite o título da tarefa" 
                  value={newTask.title} 
                  onChange={e => setNewTask({
                    ...newTask,
                    title: e.target.value
                  })} 
                  className="glass-effect border-white/20 bg-white/5 shadow-lg focus:shadow-xl transition-all duration-300" 
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="description" className="text-sm font-medium">Descrição (opcional)</Label>
                <Textarea 
                  id="description" 
                  placeholder="Detalhes adicionais sobre a tarefa" 
                  value={newTask.description} 
                  onChange={e => setNewTask({
                    ...newTask,
                    description: e.target.value
                  })} 
                  className="glass-effect border-white/20 bg-white/5 shadow-lg focus:shadow-xl transition-all duration-300 min-h-[100px]" 
                />
              </div>
            
              <div className="space-y-3">
                <Label className="text-sm font-medium">Quadrante</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(quadrantData).map(([key, data]) => {
                    const Icon = data.icon;
                    const isSelected = newTask.quadrant === parseInt(key);
                    return <motion.div 
                      key={key} 
                      whileHover={{ scale: 1.03, y: -2 }} 
                      whileTap={{ scale: 0.98 }} 
                      className={`glass-effect border-white/20 rounded-xl p-4 cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl ${
                        isSelected 
                          ? 'border-primary/50 ring-2 ring-primary/30 bg-primary/10 shadow-primary/20' 
                          : 'hover:bg-white/5'
                      }`} 
                      onClick={() => setNewTask({
                        ...newTask,
                        quadrant: parseInt(key) as 1 | 2 | 3 | 4
                      })}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${data.color}/20 shadow-md`}>
                          <Icon className={`h-4 w-4 ${data.textColor}`} />
                        </div>
                        <div>
                          <span className="text-sm font-semibold">{`Q${key}`}</span>
                          <p className="text-xs text-muted-foreground/80">{data.title.split(",")[0]}</p>
                        </div>
                      </div>
                    </motion.div>;
                  })}
                </div>
              </div>
          </div>
          
            <DialogFooter className="gap-3">
              <Button 
                variant="outline" 
                onClick={() => setDialogOpen(false)}
                className="glass-effect border-white/20 hover:bg-white/10 shadow-lg transition-all duration-300"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleAddTask} 
                disabled={!newTask.title} 
                className="bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0 disabled:opacity-50 disabled:transform-none"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Adicionar Tarefa
              </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>

        <div className="mt-20 text-center">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent mb-12"></div>
          <Card className="max-w-4xl mx-auto mb-12 glass-card border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.01]">
            <CardHeader className="pb-8">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-purple-500/20 to-indigo-600/20 rounded-lg blur opacity-25"></div>
                <div className="relative">
                  <CardTitle className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-600 to-indigo-600 mb-3">
                    Maximizando sua produtividade
                  </CardTitle>
                  <CardDescription className="text-lg text-muted-foreground/80">Dicas para uso eficiente da Matriz de Eisenhower no dia a dia</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-8">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div 
                    whileHover={{
                      scale: 1.05,
                      y: -5,
                      boxShadow: "0 20px 40px -10px rgba(239, 68, 68, 0.2)"
                    }} 
                    className="glass-effect border-white/20 rounded-2xl p-6 bg-gradient-to-br from-red-50/30 via-red-50/10 to-transparent backdrop-blur-xl shadow-xl"
                  >
                    <h4 className="font-semibold text-lg flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-xl bg-red-500/20 shadow-lg">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                      </div>
                      <span>Quadrante 1: Urgente & Importante</span>
                    </h4>
                    <p className="text-sm text-muted-foreground/90 leading-relaxed">Dedique tempo para <strong className="text-red-600">reduzir</strong> as tarefas deste quadrante melhorando seu planejamento. Muitas tarefas aqui indicam gerenciamento reativo.</p>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{
                      scale: 1.05,
                      y: -5,
                      boxShadow: "0 20px 40px -10px rgba(34, 197, 94, 0.2)"
                    }} 
                    className="glass-effect border-white/20 rounded-2xl p-6 bg-gradient-to-br from-green-50/30 via-green-50/10 to-transparent backdrop-blur-xl shadow-xl"
                  >
                    <h4 className="font-semibold text-lg flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-xl bg-green-500/20 shadow-lg">
                        <CheckSquare className="h-5 w-5 text-green-500" />
                      </div>
                      <span>Quadrante 2: Não-Urgente & Importante</span>
                    </h4>
                    <p className="text-sm text-muted-foreground/90 leading-relaxed"><strong className="text-green-600">Amplie</strong> seu foco aqui. Investir tempo em planejamento, relacionamentos e desenvolvimento pessoal traz os melhores resultados a longo prazo.</p>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{
                      scale: 1.05,
                      y: -5,
                      boxShadow: "0 20px 40px -10px rgba(245, 158, 11, 0.2)"
                    }} 
                    className="glass-effect border-white/20 rounded-2xl p-6 bg-gradient-to-br from-amber-50/30 via-amber-50/10 to-transparent backdrop-blur-xl shadow-xl"
                  >
                    <h4 className="font-semibold text-lg flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-xl bg-amber-500/20 shadow-lg">
                        <Clock className="h-5 w-5 text-amber-500" />
                      </div>
                      <span>Quadrante 3: Urgente & Não-Importante</span>
                    </h4>
                    <p className="text-sm text-muted-foreground/90 leading-relaxed"><strong className="text-amber-600">Reduza ou delegue</strong> estas tarefas. Elas parecem importantes pela urgência, mas não contribuem para seus objetivos de longo prazo.</p>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{
                      scale: 1.05,
                      y: -5,
                      boxShadow: "0 20px 40px -10px rgba(107, 114, 128, 0.2)"
                    }} 
                    className="glass-effect border-white/20 rounded-2xl p-6 bg-gradient-to-br from-gray-50/30 via-gray-50/10 to-transparent backdrop-blur-xl shadow-xl"
                  >
                    <h4 className="font-semibold text-lg flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-xl bg-gray-500/20 shadow-lg">
                        <Trash2 className="h-5 w-5 text-gray-500" />
                      </div>
                      <span>Quadrante 4: Não-Urgente & Não-Importante</span>
                    </h4>
                    <p className="text-sm text-muted-foreground/90 leading-relaxed"><strong className="text-gray-600">Elimine</strong> estas atividades. Elas são desperdiçadores de tempo que não trazem valor significativo para sua vida ou objetivos.</p>
                  </motion.div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-center pb-8">
              <Button 
                asChild 
                variant="outline" 
                size="lg" 
                className="glass-effect border-white/20 hover:bg-white/10 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
              >
                <Link to="/introduction">
                  <span className="relative z-10 flex items-center gap-2">
                    Ver guia completo
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <div className="space-y-8 mt-12 mb-16">
            <p className="text-muted-foreground/80 text-lg max-w-2xl mx-auto leading-relaxed text-center">
              Esta é uma versão de demonstração. Crie uma conta para salvar suas tarefas e acessar todos os recursos.
            </p>
            <div className="flex justify-center">
              <Button 
                asChild 
                size="lg" 
                className="bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-0 px-8 py-3 text-lg group"
              >
                <Link to="/login">
                  <span className="flex items-center gap-3">
                    Criar conta
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente para exibir uma tarefa
const TaskCard = ({
  task,
  quadrantData,
  onRemove,
  index
}: {
  task: Task;
  quadrantData: {
    title: string;
    icon: React.ElementType;
    color: string;
    textColor: string;
    gradient: string;
  };
  onRemove: (id: string) => void;
  index: number;
}) => {
  const Icon = quadrantData.icon;
  return <motion.div 
    initial={{ opacity: 0, x: -10 }} 
    animate={{ opacity: 1, x: 0 }} 
    exit={{ opacity: 0, x: 10 }} 
    transition={{ duration: 0.3, delay: index * 0.05 }} 
    whileHover={{ 
      scale: 1.03, 
      y: -2,
      boxShadow: "0 12px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 15px -5px rgba(0, 0, 0, 0.08)"
    }} 
    className={`glass-card border-white/20 rounded-xl p-4 hover:shadow-xl transition-all duration-500 group bg-gradient-to-br ${quadrantData.gradient} backdrop-blur-xl transform hover:-translate-y-1`}
  >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-xl ${quadrantData.color}/20 mt-0.5 shadow-lg backdrop-blur-sm`}>
          <Icon className={`h-4 w-4 ${quadrantData.textColor}`} />
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm truncate mb-1">{task.title}</h4>
          {task.description && <p className="text-muted-foreground/80 text-xs line-clamp-2 leading-relaxed">{task.description}</p>}
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-500/20 hover:text-red-500 rounded-lg" 
          onClick={() => onRemove(task.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>;
};
export default Demo;