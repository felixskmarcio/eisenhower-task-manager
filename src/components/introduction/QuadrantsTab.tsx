
import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Clock, AlertTriangle, X } from "lucide-react";
import QuadrantBox from './QuadrantBox';

const QuadrantsTab = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      <QuadrantBox 
        number={1}
        title="Urgente & Importante"
        examples={["Crises no trabalho", "Prazos iminentes", "Emergências de saúde"]}
        actionText="FAZER imediatamente"
        actionIcon={<Zap className="h-4 w-4" />}
        color="red"
        delay={0.1}
      />

      <QuadrantBox 
        number={2}
        title="Não Urgente & Importante"
        examples={["Planejamento estratégico", "Exercícios físicos", "Relacionamentos"]}
        actionText="AGENDAR tempo para estas atividades"
        actionIcon={<Clock className="h-4 w-4" />}
        color="blue"
        delay={0.2}
      />

      <QuadrantBox 
        number={3}
        title="Urgente & Não Importante"
        examples={["Alguns e-mails", "Algumas reuniões", "Interrupções"]}
        actionText="DELEGAR para outros quando possível"
        actionIcon={<AlertTriangle className="h-4 w-4" />}
        color="yellow"
        delay={0.3}
      />

      <QuadrantBox 
        number={4}
        title="Não Urgente & Não Importante"
        examples={["Navegação excessiva na internet", "Vídeos aleatórios", "Atividades sem propósito"]}
        actionText="ELIMINAR ou reduzir ao mínimo"
        actionIcon={<X className="h-4 w-4" />}
        color="green"
        delay={0.4}
      />
    </motion.div>
  );
};

export default QuadrantsTab;
