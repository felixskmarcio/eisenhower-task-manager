import React from 'react';
import { Matrix } from '@/components/Matrix';
import { Clock, CheckCircle2, ArrowDownToLine, LayoutGrid, InfoIcon, PlayCircle, AlertTriangle, CheckSquare, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const Index = () => {
  return (
    <div className="min-h-screen bg-base-100 py-4 sm:py-8 relative">
      {/* Plano de fundo com gradiente e efeito */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDIiPjwvcmVjdD4KPHBhdGggZD0iTTAgNUw1IDBaTTYgNEw0IDZaTS0xIDFMMSAtMVoiIHN0cm9rZT0iIzIxMjEyMSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4=')] opacity-20"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mb-6 sm:mb-10 text-center"
        >
          <div className="inline-flex items-center justify-center -space-x-3 sm:-space-x-4 mb-3 sm:mb-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20 z-20">
              <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-xl bg-primary/90 shadow-lg shadow-primary/10 z-10 transform -rotate-6">
              <LayoutGrid className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-xl bg-primary/80 shadow-lg shadow-primary/10 z-0 transform rotate-6">
              <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
          </div>
          
          <motion.h1 
            className="text-2xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary tracking-tight"
            initial={{ letterSpacing: "-0.05em" }}
            animate={{ letterSpacing: "0" }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            Eisenhower Task Manager
          </motion.h1>
          
          <motion.p 
            className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto mt-2 px-4 sm:px-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Organize suas tarefas com a eficiente metodologia da Matriz de Eisenhower.
            <span className="hidden sm:inline"> Priorize o que é importante, não apenas o que é urgente.</span>
          </motion.p>

          <div className="flex items-center justify-center gap-4 mt-6">
            <Button asChild variant="outline" size="sm" className="gap-2">
              <Link to="/introduction">
                <InfoIcon className="h-4 w-4" />
                Sobre a Matriz
              </Link>
            </Button>
            <Button asChild size="sm" className="gap-2">
              <Link to="/demo">
                <PlayCircle className="h-4 w-4" />
                Demonstração
              </Link>
            </Button>
          </div>
        </motion.div>
        
        {/* Introdução à Matriz de Eisenhower */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          className="mb-10 max-w-4xl mx-auto"
        >
          <Card className="p-6 shadow-sm bg-card/60 backdrop-blur-sm border">
            <h2 className="text-xl font-bold mb-4 text-primary">O que é a Matriz de Eisenhower?</h2>
            
            <p className="mb-4 text-muted-foreground">
              A Matriz de Eisenhower é uma ferramenta de gerenciamento de tempo que ajuda você a priorizar tarefas com base em dois fatores principais: <strong>urgência</strong> e <strong>importância</strong>.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 my-6">
              <div className="p-3 bg-red-100 dark:bg-red-950/30 rounded-md border border-red-200 dark:border-red-800">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="font-medium text-sm">Urgente e Importante</span>
                </div>
                <p className="text-xs text-muted-foreground">Faça imediatamente</p>
              </div>
              
              <div className="p-3 bg-green-100 dark:bg-green-950/30 rounded-md border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 mb-2">
                  <CheckSquare className="h-4 w-4 text-green-500" />
                  <span className="font-medium text-sm">Importante, Não Urgente</span>
                </div>
                <p className="text-xs text-muted-foreground">Programe e priorize</p>
              </div>
              
              <div className="p-3 bg-amber-100 dark:bg-amber-950/30 rounded-md border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-amber-500" />
                  <span className="font-medium text-sm">Urgente, Não Importante</span>
                </div>
                <p className="text-xs text-muted-foreground">Delegue se possível</p>
              </div>
              
              <div className="p-3 bg-gray-100 dark:bg-gray-800/30 rounded-md border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <Trash2 className="h-4 w-4 text-gray-500" />
                  <span className="font-medium text-sm">Nem Urgente, Nem Importante</span>
                </div>
                <p className="text-xs text-muted-foreground">Elimine</p>
              </div>
            </div>
            
            <p className="text-muted-foreground text-sm">
              Utilize esta matriz para organizar suas tarefas diárias, projetos e compromissos. 
              Para mais detalhes sobre como maximizar sua produtividade com este método, confira nossa 
              <Link to="/introduction" className="text-primary font-medium mx-1">introdução completa</Link>
              ou experimente nossa
              <Link to="/demo" className="text-primary font-medium mx-1">versão de demonstração</Link>.
            </p>
          </Card>
        </motion.div>
        
        <Matrix />
      </div>
    </div>
  );
};

export default Index;
