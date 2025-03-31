import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle2, LayoutGrid, LogIn, InfoIcon, PlayCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const Landing = () => {
  return (
    <div className="min-h-screen bg-base-100 py-12 md:py-20 relative">
      {/* Plano de fundo com gradiente e efeito */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDIiPjwvcmVjdD4KPHBhdGggZD0iTTAgNUw1IDBaTTYgNEw0IDZaTS0xIDFMMSAtMVoiIHN0cm9rZT0iIzIxMjEyMSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4=')] opacity-20"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center text-center mb-16">
          {/* Logo e título */}
          <div className="mb-8">
            <div className="inline-block p-4 rounded-2xl bg-primary/10 mb-6">
              <div className="flex items-center justify-center relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20 z-20">
                  <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-xl bg-primary/90 absolute top-0 transform -translate-x-6 -rotate-6 shadow-lg shadow-primary/10 z-10">
                  <LayoutGrid className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-xl bg-primary/80 absolute top-0 transform translate-x-6 rotate-6 shadow-lg shadow-primary/10 z-10">
                  <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
              </div>
            </div>
            
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/90 to-primary tracking-tight mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              Eisenhower Task Manager
            </motion.h1>
            
            <motion.p 
              className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Organize suas tarefas e aumente sua produtividade com a eficiente metodologia 
              da Matriz de Eisenhower. Priorize o que é importante, não apenas o que é urgente.
            </motion.p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="gap-2">
                <Link to="/login">
                  <LogIn className="h-5 w-5" />
                  Entrar na Plataforma
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2">
                <Link to="/demo">
                  <PlayCircle className="h-5 w-5" />
                  Experimentar Agora
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Seção de recursos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-20">
          <Card className="bg-card/60 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <InfoIcon className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Matriz de Eisenhower</CardTitle>
              <CardDescription>
                Aprenda a classificar suas tarefas em quatro quadrantes para 
                maximizar sua produtividade e foco.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild variant="secondary" className="w-full gap-2">
                <Link to="/introduction">
                  Entenda a Metodologia
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="bg-card/60 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <PlayCircle className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Demonstração Interativa</CardTitle>
              <CardDescription>
                Experimente a ferramenta sem precisar criar uma conta. 
                Cadastre tarefas e veja como funciona.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild variant="secondary" className="w-full gap-2">
                <Link to="/demo">
                  Testar Agora
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="bg-card/60 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <LogIn className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Crie sua Conta</CardTitle>
              <CardDescription>
                Registre-se gratuitamente para salvar suas tarefas na nuvem e 
                acessar todos os recursos avançados.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild variant="secondary" className="w-full gap-2">
                <Link to="/login">
                  Cadastrar
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Rodapé da landing page */}
        <div className="text-center text-muted-foreground text-sm pt-8 border-t">
          <p>© 2025 Eisenhower Task Manager. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  );
};

export default Landing; 