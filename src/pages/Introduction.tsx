
import React from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, CheckCircle, BarChart2, ArrowRight, Star, AlertTriangle, Zap, X } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import InnovativeEisenhowerAnimation from '@/components/InnovativeEisenhowerAnimation';

const Introduction = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-10">
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary"
            >
              Matriz de Eisenhower
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-muted-foreground text-lg max-w-2xl mx-auto"
            >
              Uma poderosa técnica de gestão de tempo que ajuda a priorizar tarefas com base em sua urgência e importância.
            </motion.p>
          </div>

          <div className="flex justify-center mb-10">
            <InnovativeEisenhowerAnimation />
          </div>

          <Tabs defaultValue="what" className="w-full">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="what" className="text-sm md:text-base">O que é</TabsTrigger>
              <TabsTrigger value="quadrants" className="text-sm md:text-base">Os 4 Quadrantes</TabsTrigger>
              <TabsTrigger value="benefits" className="text-sm md:text-base">Benefícios</TabsTrigger>
            </TabsList>
            
            <TabsContent value="what" className="space-y-6">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-muted/30 p-6 rounded-xl"
              >
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <Clock className="mr-2 text-primary h-6 w-6" />
                  O que é a Matriz de Eisenhower?
                </h2>
                <p className="text-muted-foreground mb-4">
                  A Matriz de Eisenhower, também conhecida como Matriz de Urgência-Importância, é uma técnica de gerenciamento de tempo nomeada em homenagem ao presidente Dwight D. Eisenhower, que disse: "O importante raramente é urgente, e o urgente raramente é importante."
                </p>
                <p className="text-muted-foreground">
                  Esta técnica ajuda a distinguir entre atividades que são:
                </p>
                <ul className="list-disc ml-6 mt-2 space-y-2 text-muted-foreground">
                  <li>Importantes e urgentes</li>
                  <li>Importantes, mas não urgentes</li>
                  <li>Urgentes, mas não importantes</li>
                  <li>Nem urgentes, nem importantes</li>
                </ul>
                
                <div className="mt-6">
                  <div className="grid grid-cols-2 gap-4 border rounded-lg overflow-hidden shadow-md">
                    <div className="bg-red-500/20 p-6 border-r border-b hover:bg-red-500/30 transition-colors">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="bg-red-500 text-white rounded-full p-1 w-8 h-8 flex items-center justify-center font-bold">Q1</div>
                        <h3 className="font-semibold text-red-600 dark:text-red-400 text-lg">Urgente & Importante</h3>
                      </div>
                      <div className="flex items-center gap-2 text-red-600/80">
                        <Zap className="h-4 w-4" />
                        <p className="text-sm font-medium">FAZER AGORA</p>
                      </div>
                    </div>
                    <div className="bg-blue-500/20 p-6 border-b hover:bg-blue-500/30 transition-colors">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="bg-blue-500 text-white rounded-full p-1 w-8 h-8 flex items-center justify-center font-bold">Q2</div>
                        <h3 className="font-semibold text-blue-600 dark:text-blue-400 text-lg">Não Urgente & Importante</h3>
                      </div>
                      <div className="flex items-center gap-2 text-blue-600/80">
                        <Clock className="h-4 w-4" />
                        <p className="text-sm font-medium">AGENDAR</p>
                      </div>
                    </div>
                    <div className="bg-yellow-500/20 p-6 border-r hover:bg-yellow-500/30 transition-colors">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="bg-yellow-500 text-white rounded-full p-1 w-8 h-8 flex items-center justify-center font-bold">Q3</div>
                        <h3 className="font-semibold text-yellow-600 dark:text-yellow-400 text-lg">Urgente & Não Importante</h3>
                      </div>
                      <div className="flex items-center gap-2 text-yellow-600/80">
                        <AlertTriangle className="h-4 w-4" />
                        <p className="text-sm font-medium">DELEGAR</p>
                      </div>
                    </div>
                    <div className="bg-green-500/20 p-6 hover:bg-green-500/30 transition-colors">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="bg-green-500 text-white rounded-full p-1 w-8 h-8 flex items-center justify-center font-bold">Q4</div>
                        <h3 className="font-semibold text-green-600 dark:text-green-400 text-lg">Não Urgente & Não Importante</h3>
                      </div>
                      <div className="flex items-center gap-2 text-green-600/80">
                        <X className="h-4 w-4" />
                        <p className="text-sm font-medium">ELIMINAR</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="quadrants" className="space-y-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="bg-red-500/10 p-6 rounded-xl border-l-4 border-red-500 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-red-500 text-white rounded-full p-1 w-8 h-8 flex items-center justify-center font-bold">Q1</div>
                    <h3 className="text-xl font-bold text-red-600 dark:text-red-400">Urgente & Importante</h3>
                  </div>
                  <p className="text-muted-foreground mb-2">
                    Tarefas que requerem atenção imediata e têm resultados significativos.
                  </p>
                  <h4 className="font-semibold mt-4 mb-2">Exemplos:</h4>
                  <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                    <li>Crises no trabalho</li>
                    <li>Prazos iminentes</li>
                    <li>Emergências de saúde</li>
                  </ul>
                  <div className="mt-4 text-sm font-medium flex items-center gap-2 text-red-600 dark:text-red-400">
                    <Zap className="h-4 w-4" />
                    Ação: FAZER imediatamente
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="bg-blue-500/10 p-6 rounded-xl border-l-4 border-blue-500 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-blue-500 text-white rounded-full p-1 w-8 h-8 flex items-center justify-center font-bold">Q2</div>
                    <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400">Não Urgente & Importante</h3>
                  </div>
                  <p className="text-muted-foreground mb-2">
                    Tarefas que contribuem para objetivos de longo prazo e crescimento pessoal.
                  </p>
                  <h4 className="font-semibold mt-4 mb-2">Exemplos:</h4>
                  <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                    <li>Planejamento estratégico</li>
                    <li>Exercícios físicos</li>
                    <li>Relacionamentos</li>
                  </ul>
                  <div className="mt-4 text-sm font-medium flex items-center gap-2 text-blue-600 dark:text-blue-400">
                    <Clock className="h-4 w-4" />
                    Ação: AGENDAR tempo para estas atividades
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="bg-yellow-500/10 p-6 rounded-xl border-l-4 border-yellow-500 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-yellow-500 text-white rounded-full p-1 w-8 h-8 flex items-center justify-center font-bold">Q3</div>
                    <h3 className="text-xl font-bold text-yellow-600 dark:text-yellow-400">Urgente & Não Importante</h3>
                  </div>
                  <p className="text-muted-foreground mb-2">
                    Tarefas que parecem urgentes mas têm pouco impacto em seus objetivos.
                  </p>
                  <h4 className="font-semibold mt-4 mb-2">Exemplos:</h4>
                  <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                    <li>Alguns e-mails</li>
                    <li>Algumas reuniões</li>
                    <li>Interrupções</li>
                  </ul>
                  <div className="mt-4 text-sm font-medium flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                    <AlertTriangle className="h-4 w-4" />
                    Ação: DELEGAR para outros quando possível
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="bg-green-500/10 p-6 rounded-xl border-l-4 border-green-500 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-green-500 text-white rounded-full p-1 w-8 h-8 flex items-center justify-center font-bold">Q4</div>
                    <h3 className="text-xl font-bold text-green-600 dark:text-green-400">Não Urgente & Não Importante</h3>
                  </div>
                  <p className="text-muted-foreground mb-2">
                    Atividades que consomem tempo e oferecem pouco valor.
                  </p>
                  <h4 className="font-semibold mt-4 mb-2">Exemplos:</h4>
                  <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                    <li>Navegação excessiva na internet</li>
                    <li>Vídeos aleatórios</li>
                    <li>Atividades sem propósito</li>
                  </ul>
                  <div className="mt-4 text-sm font-medium flex items-center gap-2 text-green-600 dark:text-green-400">
                    <X className="h-4 w-4" />
                    Ação: ELIMINAR ou reduzir ao mínimo
                  </div>
                </motion.div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="benefits" className="space-y-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-muted/30 p-6 rounded-xl"
              >
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <Star className="mr-2 text-primary h-6 w-6" />
                  Benefícios da Matriz de Eisenhower
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="bg-primary/5 p-4 rounded-lg"
                  >
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2 text-primary" />
                      Melhora a Produtividade
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Concentra seu tempo nas tarefas que realmente importam, melhorando sua eficiência geral.
                    </p>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="bg-primary/5 p-4 rounded-lg"
                  >
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2 text-primary" />
                      Reduz o Estresse
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Elimina a sobrecarga de tarefas, proporcionando uma abordagem mais organizada e menos estressante.
                    </p>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="bg-primary/5 p-4 rounded-lg"
                  >
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2 text-primary" />
                      Melhora a Tomada de Decisões
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Fornece um framework claro para avaliar o valor de cada tarefa antes de comprometer seu tempo.
                    </p>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="bg-primary/5 p-4 rounded-lg"
                  >
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2 text-primary" />
                      Foco no Longo Prazo
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Ajuda a balancear tarefas urgentes com atividades importantes de longo prazo que trazem crescimento.
                    </p>
                  </motion.div>
                </div>
                
                <div className="mt-8 bg-primary/10 p-5 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">Como aplicar na prática:</h3>
                  <ol className="list-decimal ml-6 space-y-2 text-muted-foreground">
                    <li>Liste todas as suas tarefas atuais e pendentes</li>
                    <li>Avalie cada tarefa quanto à sua urgência e importância</li>
                    <li>Distribua-as entre os quatro quadrantes</li>
                    <li>Priorize suas ações com base no quadrante</li>
                    <li>Reavalie regularmente e ajuste conforme necessário</li>
                  </ol>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-10 text-center"
          >
            <Link to="/demo">
              <Button size="lg" className="group">
                Ver demonstração
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <p className="text-muted-foreground mt-4 text-sm">
              Ou <Link to="/login" className="text-primary hover:underline">faça login</Link> para começar a usar agora mesmo.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Introduction;
