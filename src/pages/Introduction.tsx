import React from 'react';
import { Link } from 'react-router-dom';
import { motion, Variants } from 'framer-motion';
import { ArrowRight, Clock, CheckSquare, AlertTriangle, Trash2 } from 'lucide-react';
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

      <h2 className="text-2xl font-bold mb-6 text-center">Os Quatro Quadrantes</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <QuadrantCard 
          title="Quadrante 1: Urgente e Importante" 
          description="Tarefas que precisam de atenção imediata e têm grande impacto. 
                       Geralmente são crises ou problemas que surgem de repente."
          action="FAÇA IMEDIATAMENTE" 
          color="red-500" 
          icon={AlertTriangle} 
        />
        
        <QuadrantCard 
          title="Quadrante 2: Importante, Não Urgente" 
          description="Atividades que contribuem para seus objetivos de longo prazo, 
                       satisfação pessoal e desenvolvimento. O foco ideal para maior eficiência."
          action="PROGRAME E PRIORIZE" 
          color="green-500" 
          icon={CheckSquare} 
        />
        
        <QuadrantCard 
          title="Quadrante 3: Urgente, Não Importante" 
          description="Distrações com prazos. Estas tarefas nos impedem de alcançar nossos objetivos, 
                      apesar de demandarem atenção imediata."
          action="DELEGUE SE POSSÍVEL" 
          color="amber-500" 
          icon={Clock} 
        />
        
        <QuadrantCard 
          title="Quadrante 4: Nem Urgente, Nem Importante" 
          description="Atividades que têm pouco ou nenhum valor e podem ser 
                       grandes desperdícios de tempo. Devem ser minimizadas ou eliminadas."
          action="ELIMINE" 
          color="gray-500" 
          icon={Trash2} 
        />
      </div>

      <div className="text-center mt-8 mb-4">
        <Button asChild size="lg" className="gap-2 shadow-md">
          <Link to="/demo">
            Experimente agora
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <p className="text-sm text-muted-foreground mt-4">
          Nenhum cadastro necessário para testar a ferramenta.
        </p>
      </div>
    </div>
  );
};

export default Introduction; 