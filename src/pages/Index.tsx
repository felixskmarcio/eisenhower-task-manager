import React from 'react';
import { Matrix } from '@/components/Matrix';
import { Clock, CheckCircle2, ArrowDownToLine, LayoutGrid } from 'lucide-react';
import { motion } from 'framer-motion';

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
        </motion.div>
        
        <Matrix />
      </div>
    </div>
  );
};

export default Index;
