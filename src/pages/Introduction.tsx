import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, Variants } from 'framer-motion';
import { ArrowRight, Clock, CheckSquare, AlertTriangle, Trash2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

const QuadrantCard = ({ 
  title, 
  description, 
  action, 
  color, 
  icon: Icon 
}: { 
  title: string; 
  description: string; 
  action: string; 
  color: string; 
  icon: React.ElementType;
}) => (
  <Card className="border-2 h-full">
    <CardHeader className={`border-b-2 border-${color} bg-${color}/10`}>
      <div className="flex items-center gap-2">
        <div className={`p-2 rounded-md bg-${color}/20`}>
          <Icon className={`h-5 w-5 text-${color}`} />
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
      </div>
    </CardHeader>
    <CardContent className="pt-4">
      <CardDescription className="text-sm text-foreground/80 mb-2">{description}</CardDescription>
    </CardContent>
    <CardFooter className="border-t pt-3 text-sm font-medium">
      {action}
    </CardFooter>
  </Card>
);

const Introduction = () => {
  const [activeQuadrant, setActiveQuadrant] = useState<string | null>(null);
  
  // Ciclo entre os quadrantes para efeito de animação
  useEffect(() => {
    const quadrants = ['urgent-important', 'not-urgent-important', 'urgent-not-important', 'not-urgent-not-important'];
    let index = 0;
    
    const interval = setInterval(() => {
      setActiveQuadrant(quadrants[index]);
      index = (index + 1) % quadrants.length;
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  // Seleção de citação
  const quotes = [
    "O que é importante raramente é urgente e o que é urgente raramente é importante.",
    "Planejar é trazer o futuro para o presente para que você possa fazer algo a respeito agora.",
    "A chave não é priorizar o que está em sua agenda, mas agendar suas prioridades."
  ];
  
  const [quote] = useState(quotes[Math.floor(Math.random() * quotes.length)]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-primary">
          Conhecendo a Matriz de Eisenhower
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Uma metodologia poderosa de gerenciamento de tempo criada por Dwight D. Eisenhower, 
          34º presidente dos Estados Unidos, conhecida por ajudar a priorizar tarefas com base 
          em sua importância e urgência.
        </p>
      </div>

      <div className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-card p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="p-2 rounded-md bg-primary/10">
                <Clock className="h-5 w-5 text-primary" />
              </span>
              O que é?
            </h2>
            <p className="text-muted-foreground mb-4">
              A Matriz de Eisenhower é uma ferramenta simples de tomada de decisão que ajuda a 
              priorizar tarefas dividindo-as em quatro quadrantes com base em dois critérios: 
              urgência e importância.
            </p>
            <p className="text-muted-foreground">
              Essa abordagem ajuda a eliminar atividades menos importantes que consomem tempo, 
              permitindo que você se concentre no que realmente importa.
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="p-2 rounded-md bg-primary/10">
                <CheckSquare className="h-5 w-5 text-primary" />
              </span>
              Por que usar?
            </h2>
            <p className="text-muted-foreground mb-4">
              • Melhora a produtividade, eliminando tarefas menos importantes
            </p>
            <p className="text-muted-foreground mb-4">
              • Reduz o estresse ao fornecer uma estrutura clara para decisões
            </p>
            <p className="text-muted-foreground mb-4">
              • Previne o adiamento das tarefas verdadeiramente importantes
            </p>
            <p className="text-muted-foreground">
              • Ajuda a manter o foco no que mais impacta seus objetivos
            </p>
          </div>
        </div>
      </div>

      <motion.h2 
        className="text-5xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 animate-text-shimmer"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ 
          duration: 0.6, 
          type: "spring", 
          stiffness: 100 
        }}
      >
        Os Quatro Quadrantes
      </motion.h2>
      
      <div className="relative overflow-hidden rounded-xl p-8 bg-gradient-to-b from-slate-50 to-slate-100">
        {/* Fundo decorativo estático */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern" />
          <div className="absolute h-56 bottom-0 left-0 right-0 bg-gradient-to-t from-slate-50 to-slate-50/0 backdrop-blur-sm" />
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 mx-auto max-w-4xl relative z-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
        >
          {/* Quadrante 1: Urgente & Importante */}
          <motion.div 
            variants={itemVariants}
            className="flex"
          >
            <motion.div 
              whileHover={{ scale: 1.03 }}
              animate={{
                boxShadow: activeQuadrant === 'urgent-important' ? [
                  '0 10px 15px -3px rgba(0, 0, 0, 0.1)', 
                  '0 0 25px rgba(248, 113, 113, 0.6)', 
                  '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                ] : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                scale: activeQuadrant === 'urgent-important' ? 1.05 : 1
              }}
              transition={{ 
                duration: 1.5,
                scale: { duration: 0.3 },
                boxShadow: { 
                  repeat: activeQuadrant === 'urgent-important' ? Infinity : 0, 
                  repeatType: "reverse", 
                  duration: 1.5 
                }
              }}
              className="w-full h-[250px] bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex flex-col items-center justify-center overflow-hidden relative shadow-lg"
            >
              <motion.div 
                className="mb-4 transform-gpu"
                whileHover={{ scale: 1.2 }}
                animate={{ 
                  y: activeQuadrant === 'urgent-important' ? [0, -5, 0] : 0, 
                  opacity: activeQuadrant === 'urgent-important' ? [0.8, 1, 0.8] : 1 
                }}
                transition={{ 
                  duration: 2, 
                  repeat: activeQuadrant === 'urgent-important' ? Infinity : 0,
                  repeatType: "reverse" 
                }}
              >
                <AlertTriangle className="w-16 h-16 text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold mb-2 text-white">Fazer</h2>
              <p className="text-base text-center text-red-100 px-4">Urgente & Importante</p>
              <div className="mt-4">
                <div className="bg-white/20 px-6 py-2 rounded-full text-center text-sm font-medium">
                  FAÇA IMEDIATAMENTE
                </div>
              </div>
              <motion.div 
                className="absolute w-full h-full top-0 left-0 rounded-lg"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-0 bg-red-500 bg-opacity-20 backdrop-filter backdrop-blur-sm rounded-lg"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                  <p className="text-white text-center text-sm max-w-xs">
                    Tarefas que precisam de atenção imediata e têm grande impacto. 
                    Geralmente são crises ou problemas que surgem de repente.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Quadrante 2: Importante, Não Urgente */}
          <motion.div 
            variants={itemVariants}
            className="flex"
          >
            <motion.div 
              whileHover={{ scale: 1.03 }}
              animate={{
                boxShadow: activeQuadrant === 'not-urgent-important' ? [
                  '0 10px 15px -3px rgba(0, 0, 0, 0.1)', 
                  '0 0 25px rgba(96, 165, 250, 0.6)', 
                  '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                ] : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                scale: activeQuadrant === 'not-urgent-important' ? 1.05 : 1
              }}
              transition={{ 
                duration: 1.5,
                scale: { duration: 0.3 },
                boxShadow: { 
                  repeat: activeQuadrant === 'not-urgent-important' ? Infinity : 0, 
                  repeatType: "reverse", 
                  duration: 1.5 
                }
              }}
              className="w-full h-[250px] bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex flex-col items-center justify-center overflow-hidden relative shadow-lg"
            >
              <motion.div 
                className="mb-4 transform-gpu"
                whileHover={{ scale: 1.2 }}
                animate={{ 
                  rotate: activeQuadrant === 'not-urgent-important' ? [0, 10, -10, 10, 0] : 0,
                  opacity: activeQuadrant === 'not-urgent-important' ? [0.8, 1, 0.8] : 1 
                }}
                transition={{ 
                  duration: 3, 
                  repeat: activeQuadrant === 'not-urgent-important' ? Infinity : 0,
                  repeatType: "loop",
                  ease: "easeInOut",
                  times: [0, 0.2, 0.5, 0.8, 1]
                }}
              >
                <Clock className="w-16 h-16 text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold mb-2 text-white">Agendar</h2>
              <p className="text-base text-center text-blue-100 px-4">Importante & Não Urgente</p>
              <div className="mt-4">
                <div className="bg-white/20 px-6 py-2 rounded-full text-center text-sm font-medium">
                  PROGRAME E PRIORIZE
                </div>
              </div>
              <motion.div 
                className="absolute w-full h-full top-0 left-0 rounded-lg"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-0 bg-blue-500 bg-opacity-20 backdrop-filter backdrop-blur-sm rounded-lg"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                  <p className="text-white text-center text-sm max-w-xs">
                    Atividades que contribuem para seus objetivos de longo prazo, 
                    satisfação pessoal e desenvolvimento. O foco ideal para maior eficiência.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Quadrante 3: Urgente, Não Importante */}
          <motion.div 
            variants={itemVariants}
            className="flex"
          >
            <motion.div 
              whileHover={{ scale: 1.03 }}
              animate={{
                boxShadow: activeQuadrant === 'urgent-not-important' ? [
                  '0 10px 15px -3px rgba(0, 0, 0, 0.1)', 
                  '0 0 25px rgba(251, 191, 36, 0.6)', 
                  '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                ] : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                scale: activeQuadrant === 'urgent-not-important' ? 1.05 : 1
              }}
              transition={{ 
                duration: 1.5,
                scale: { duration: 0.3 },
                boxShadow: { 
                  repeat: activeQuadrant === 'urgent-not-important' ? Infinity : 0, 
                  repeatType: "reverse", 
                  duration: 1.5 
                }
              }}
              className="w-full h-[250px] bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-lg flex flex-col items-center justify-center overflow-hidden relative shadow-lg"
            >
              <motion.div 
                className="mb-4 transform-gpu"
                whileHover={{ scale: 1.2 }}
                animate={{ 
                  scale: activeQuadrant === 'urgent-not-important' ? [1, 1.1, 1] : 1,
                  opacity: activeQuadrant === 'urgent-not-important' ? [0.8, 1, 0.8] : 1 
                }}
                transition={{ 
                  duration: 2, 
                  repeat: activeQuadrant === 'urgent-not-important' ? Infinity : 0,
                  repeatType: "reverse",
                  ease: "easeInOut"
                }}
              >
                <AlertTriangle className="w-16 h-16 text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold mb-2 text-white">Delegar</h2>
              <p className="text-base text-center text-yellow-100 px-4">Urgente & Não Importante</p>
              <div className="mt-4">
                <div className="bg-white/20 px-6 py-2 rounded-full text-center text-sm font-medium">
                  DELEGUE SE POSSÍVEL
                </div>
              </div>
              <motion.div 
                className="absolute w-full h-full top-0 left-0 rounded-lg"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-0 bg-yellow-500 bg-opacity-20 backdrop-filter backdrop-blur-sm rounded-lg"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                  <p className="text-white text-center text-sm max-w-xs">
                    Distrações com prazos. Estas tarefas nos impedem de alcançar nossos objetivos, 
                    apesar de demandarem atenção imediata.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Quadrante 4: Nem Urgente, Nem Importante */}
          <motion.div 
            variants={itemVariants}
            className="flex"
          >
            <motion.div 
              whileHover={{ scale: 1.03 }}
              animate={{
                boxShadow: activeQuadrant === 'not-urgent-not-important' ? [
                  '0 10px 15px -3px rgba(0, 0, 0, 0.1)', 
                  '0 0 25px rgba(156, 163, 175, 0.6)', 
                  '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                ] : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                scale: activeQuadrant === 'not-urgent-not-important' ? 1.05 : 1
              }}
              transition={{ 
                duration: 1.5,
                scale: { duration: 0.3 },
                boxShadow: { 
                  repeat: activeQuadrant === 'not-urgent-not-important' ? Infinity : 0, 
                  repeatType: "reverse", 
                  duration: 1.5 
                }
              }}
              className="w-full h-[250px] bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg flex flex-col items-center justify-center overflow-hidden relative shadow-lg"
            >
              <motion.div 
                className="mb-4 transform-gpu"
                whileHover={{ scale: 1.2 }}
                animate={{ 
                  opacity: activeQuadrant === 'not-urgent-not-important' ? [1, 0.6, 1] : 1,
                }}
                transition={{ 
                  duration: 2, 
                  repeat: activeQuadrant === 'not-urgent-not-important' ? Infinity : 0,
                  repeatType: "mirror"
                }}
              >
                <XCircle className="w-16 h-16 text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold mb-2 text-white">Eliminar</h2>
              <p className="text-base text-center text-gray-100 px-4">Não Urgente & Não Importante</p>
              <div className="mt-4">
                <div className="bg-white/20 px-6 py-2 rounded-full text-center text-sm font-medium">
                  ELIMINE
                </div>
              </div>
              <motion.div 
                className="absolute w-full h-full top-0 left-0 rounded-lg"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-0 bg-gray-500 bg-opacity-20 backdrop-filter backdrop-blur-sm rounded-lg"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                  <p className="text-white text-center text-sm max-w-xs">
                    Atividades que têm pouco ou nenhum valor e podem ser grandes desperdícios de tempo. 
                    Devem ser minimizadas ou eliminadas.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Quote Section */}
        <motion.div 
          className="relative text-center p-8 rounded-lg max-w-2xl mx-auto mb-12 backdrop-filter backdrop-blur-sm z-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(240, 244, 248, 0.95) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            boxShadow: '0 8px 32px rgba(31, 38, 135, 0.1)'
          }}
        >
          {/* Decorative quote marks */}
          <div className="absolute -top-5 -left-5 text-6xl text-indigo-400 opacity-50">"</div>
          <div className="absolute -bottom-12 -right-5 text-6xl text-indigo-400 opacity-50">"</div>
          
          <p className="italic text-xl text-gray-700">{quote}</p>
          <div className="mt-4 flex items-center justify-center">
            <div className="w-10 h-0.5 bg-indigo-500 mr-3"></div>
            <p className="text-indigo-600">Dwight D. Eisenhower</p>
            <div className="w-10 h-0.5 bg-indigo-500 ml-3"></div>
          </div>
        </motion.div>
      </div>

      <motion.div 
        className="text-center mt-12 mb-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        viewport={{ once: true }}
      >
        <Button asChild size="lg" className="gap-2 shadow-md relative overflow-hidden group">
          <Link to="/demo">
            <span className="relative z-10">Experimente agora</span>
            <motion.span 
              className="absolute inset-0 bg-primary opacity-60 z-0"
              initial={{ x: '-100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
            <ArrowRight className="h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
        <p className="text-sm text-muted-foreground mt-4">
          Nenhum cadastro necessário para testar a ferramenta.
        </p>
      </motion.div>

      <style jsx>{`
        @keyframes text-shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        .animate-text-shimmer {
          background-size: 200% auto;
          animation: text-shimmer 4s linear infinite;
        }
        
        .bg-grid-pattern {
          background-size: 32px 32px;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(148 163 184 / 0.2)'%3E%3Cpath d='M0 .5H31.5V32'/%3E%3C/svg%3E");
        }
      `}</style>
    </div>
  );
};

export default Introduction; 