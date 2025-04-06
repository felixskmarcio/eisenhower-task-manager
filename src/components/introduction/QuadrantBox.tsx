
import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface QuadrantBoxProps {
  number: number;
  title: string;
  examples: string[];
  actionText: string;
  actionIcon: React.ReactElement;
  color: string;
  delay: number;
}

const QuadrantBox: React.FC<QuadrantBoxProps> = ({
  number,
  title,
  examples,
  actionText,
  actionIcon,
  color,
  delay
}) => {
  const colorClasses = {
    red: {
      bg: "bg-red-500/10",
      border: "border-red-500",
      circleColor: "bg-red-500",
      textColor: "text-red-600 dark:text-red-400"
    },
    blue: {
      bg: "bg-blue-500/10",
      border: "border-blue-500",
      circleColor: "bg-blue-500",
      textColor: "text-blue-600 dark:text-blue-400"
    },
    yellow: {
      bg: "bg-yellow-500/10",
      border: "border-yellow-500",
      circleColor: "bg-yellow-500",
      textColor: "text-yellow-600 dark:text-yellow-400"
    },
    green: {
      bg: "bg-green-500/10",
      border: "border-green-500",
      circleColor: "bg-green-500",
      textColor: "text-green-600 dark:text-green-400"
    }
  };

  const colorClass = colorClasses[color as keyof typeof colorClasses];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className={`${colorClass.bg} p-6 rounded-xl border-l-4 ${colorClass.border} hover:shadow-lg transition-shadow`}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className={`${colorClass.circleColor} text-white rounded-full p-1 w-8 h-8 flex items-center justify-center font-bold`}>
          Q{number}
        </div>
        <h3 className={`text-xl font-bold ${colorClass.textColor}`}>{title}</h3>
      </div>
      <p className="text-muted-foreground mb-2">
        {title === "Urgente & Importante" && "Tarefas que requerem atenção imediata e têm resultados significativos."}
        {title === "Não Urgente & Importante" && "Tarefas que contribuem para objetivos de longo prazo e crescimento pessoal."}
        {title === "Urgente & Não Importante" && "Tarefas que parecem urgentes mas têm pouco impacto em seus objetivos."}
        {title === "Não Urgente & Não Importante" && "Atividades que consomem tempo e oferecem pouco valor."}
      </p>
      <h4 className="font-semibold mt-4 mb-2">Exemplos:</h4>
      <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
        {examples.map((example, i) => (
          <li key={i}>{example}</li>
        ))}
      </ul>
      <div className={`mt-4 text-sm font-medium flex items-center gap-2 ${colorClass.textColor}`}>
        {actionIcon}
        Ação: {actionText}
      </div>
    </motion.div>
  );
};

export default QuadrantBox;
