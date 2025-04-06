
import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Zap, AlertTriangle, X } from "lucide-react";

const WhatIsTab = () => {
  return (
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
  );
};

export default WhatIsTab;
