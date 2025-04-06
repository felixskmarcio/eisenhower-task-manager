import React, { useEffect, useState, useMemo } from 'react';
import InnovativeEisenhowerAnimation from './InnovativeEisenhowerAnimation';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  onLoadingComplete?: () => void;
  minLoadingTime?: number; // tempo mínimo para exibir a tela de carregamento em ms
}

// Componente de partícula de fundo
const Particle = ({ index }: { index: number }) => {
  const style = useMemo(() => {
    const size = Math.random() * 10 + 5;
    const opacity = Math.random() * 0.4 + 0.1;
    const tx1 = Math.random() * 100 - 50;
    const ty1 = Math.random() * 100 - 50;
    const tx2 = Math.random() * 100 - 50;
    const ty2 = Math.random() * 100 - 50;
    const tx3 = Math.random() * 100 - 50;
    const ty3 = Math.random() * 100 - 50;
    const duration = Math.random() * 20 + 10;
    
    return {
      width: `${size}px`,
      height: `${size}px`,
      opacity,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      '--tx1': `${tx1}px`,
      '--ty1': `${ty1}px`,
      '--tx2': `${tx2}px`,
      '--ty2': `${ty2}px`,
      '--tx3': `${tx3}px`,
      '--ty3': `${ty3}px`,
      animationDuration: `${duration}s`,
      animationDelay: `${Math.random() * 5}s`
    } as React.CSSProperties;
  }, [index]);
  
  return <div className="particle" style={style} />;
};

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  onLoadingComplete,
  minLoadingTime = 1800 // padrão de 1.8 segundos
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [tip, setTip] = useState('');
  
  // Array de dicas motivacionais ou informativas sobre a Matriz de Eisenhower
  const tips = [
    "Dica: Foque primeiro nas tarefas importantes e urgentes.",
    "Dica: Agende um tempo específico para tarefas importantes não urgentes.",
    "Dica: Tarefas não importantes mas urgentes podem ser delegadas.",
    "Dica: Elimine tarefas que não são importantes nem urgentes.",
    "Dica: Revise sua matriz pelo menos uma vez ao dia.",
    "Dica: Use tags para agrupar tarefas semelhantes.",
    "Dica: Reserve blocos de tempo para tarefas urgentes.",
    "Dica: Controle seu tempo com a Matriz de Eisenhower."
  ];

  // Selecionar uma dica aleatória ao carregar
  useEffect(() => {
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    setTip(randomTip);
  }, []);

  useEffect(() => {
    const startTime = Date.now();
    
    // Simula um tempo mínimo de carregamento para que o usuário possa ver a animação
    const timer = setTimeout(() => {
      const elapsedTime = Date.now() - startTime;
      
      // Se ainda não passou o tempo mínimo, aguardamos um pouco mais
      if (elapsedTime < minLoadingTime) {
        const remainingTime = minLoadingTime - elapsedTime;
        setTimeout(() => {
          setIsVisible(false);
          if (onLoadingComplete) onLoadingComplete();
        }, remainingTime);
      } else {
        // Se já passou o tempo mínimo, podemos esconder o loader
        setIsVisible(false);
        if (onLoadingComplete) onLoadingComplete();
      }
    }, 600); // Damos um pequeno tempo para que o componente seja montado e renderizado

    return () => clearTimeout(timer);
  }, [onLoadingComplete, minLoadingTime]);

  // Gera um array de partículas
  const particles = useMemo(() => Array.from({ length: 20 }, (_, i) => i), []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="fixed inset-0 flex flex-col items-center justify-center z-50 bg-base-100 bg-opacity-80 bg-blur-overlay transition-all duration-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Partículas de fundo */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((i) => (
              <Particle key={i} index={i} />
            ))}
          </div>
          
          {/* Container flutuante */}
          <motion.div
            className="float-animation"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="relative glow-effect rounded-xl">
              <InnovativeEisenhowerAnimation />
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-8 text-center max-w-md px-4"
          >
            <p className="text-sm text-muted-foreground italic text-glow">{tip}</p>
            
            <motion.div 
              className="mt-6 bg-base-200 px-4 py-2 rounded-lg bg-opacity-50"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.4 }}
            >
              <h3 className="text-xs uppercase tracking-wider text-center text-muted-foreground mb-1">Carregando</h3>
              <div className="w-full bg-base-300 h-1 rounded-full overflow-hidden mt-1">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: minLoadingTime / 1000, ease: "easeInOut" }}
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen; 