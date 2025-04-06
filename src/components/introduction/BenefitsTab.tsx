
import React from 'react';
import { motion } from 'framer-motion';
import { Star, CheckCircle } from "lucide-react";
import BenefitItem from './BenefitItem';

const BenefitsTab = () => {
  const benefits = [
    {
      title: "Melhora a Produtividade",
      description: "Concentra seu tempo nas tarefas que realmente importam, melhorando sua eficiência geral.",
      delay: 0.1
    },
    {
      title: "Reduz o Estresse",
      description: "Elimina a sobrecarga de tarefas, proporcionando uma abordagem mais organizada e menos estressante.",
      delay: 0.2
    },
    {
      title: "Melhora a Tomada de Decisões",
      description: "Fornece um framework claro para avaliar o valor de cada tarefa antes de comprometer seu tempo.",
      delay: 0.3
    },
    {
      title: "Foco no Longo Prazo",
      description: "Ajuda a balancear tarefas urgentes com atividades importantes de longo prazo que trazem crescimento.",
      delay: 0.4
    }
  ];

  return (
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
        {benefits.map((benefit, index) => (
          <BenefitItem 
            key={index}
            icon={<CheckCircle />}
            title={benefit.title}
            description={benefit.description}
            delay={benefit.delay}
          />
        ))}
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
  );
};

export default BenefitsTab;
