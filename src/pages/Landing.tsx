import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { InfoIcon, PlayCircle, ArrowRight, LogIn, Mail, Phone, MapPin, Github, Linkedin, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppLogo from '@/components/ui/app-logo';

const Landing = () => {
  return (
    <main className="min-h-screen bg-base-100 py-12 md:py-20 relative">
      {/* Plano de fundo com gradiente e efeito */}
      <div className="absolute inset-0 overflow-hidden -z-10" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10" />
        <div className="absolute inset-0 opacity-20 bg-[length:5px_5px] bg-[image:repeating-linear-gradient(45deg,transparent,transparent_2px,rgba(33,33,33,0.05)_2px,rgba(33,33,33,0.05)_4px)]" />
      </div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Hero Section */}
        <header className="flex flex-col items-center text-center mb-16">
          {/* Logo e título */}
          <div className="mb-8">
            <div className="inline-block p-6 mb-6">
              <AppLogo size="lg" animated={true} />
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
            
            <nav className="flex flex-wrap justify-center gap-4" aria-label="Ações principais">
              <Button asChild size="lg" className="gap-2">
                <Link to="/login" aria-label="Acessar plataforma de gerenciamento de tarefas">
                  <LogIn className="h-5 w-5" aria-hidden="true" />
                  Entrar na Plataforma
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2">
                <Link to="/demo" aria-label="Experimentar demonstração interativa">
                  <PlayCircle className="h-5 w-5" aria-hidden="true" />
                  Experimentar Agora
                </Link>
              </Button>
            </nav>
          </div>
        </header>
        
        {/* Seção de recursos */}
        <section className="mb-20" aria-labelledby="features-heading">
          <h2 id="features-heading" className="sr-only">Recursos principais</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <Card className="bg-card/60 backdrop-blur-sm flex flex-col transition-transform hover:scale-105 focus-within:scale-105">
              <CardHeader className="flex-1">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4" aria-hidden="true">
                  <InfoIcon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Matriz de Eisenhower</CardTitle>
                <CardDescription className="min-h-[60px]">
                  Aprenda a classificar suas tarefas em quatro quadrantes para 
                  maximizar sua produtividade e foco.
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex items-end">
                <Button asChild variant="secondary" className="w-full gap-2 h-10">
                  <Link to="/introduction" aria-label="Saiba mais sobre a metodologia Eisenhower">
                    Entenda a Metodologia
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          
          <Card className="bg-card/60 backdrop-blur-sm flex flex-col transition-transform hover:scale-105 focus-within:scale-105">
            <CardHeader className="flex-1">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4" aria-hidden="true">
                <PlayCircle className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Demonstração Interativa</CardTitle>
              <CardDescription className="min-h-[60px]">
                Experimente a ferramenta sem precisar criar uma conta. 
                Cadastre tarefas e veja como funciona.
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex items-end">
              <Button asChild variant="secondary" className="w-full gap-2 h-10">
                <Link to="/demo" aria-label="Acessar demonstração interativa">
                  Testar Agora
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="bg-card/60 backdrop-blur-sm flex flex-col transition-transform hover:scale-105 focus-within:scale-105">
            <CardHeader className="flex-1">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4" aria-hidden="true">
                <LogIn className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Crie sua Conta</CardTitle>
              <CardDescription className="min-h-[60px]">
                Registre-se gratuitamente para salvar suas tarefas na nuvem e 
                acessar todos os recursos avançados.
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex items-end">
              <Button asChild variant="secondary" className="w-full gap-2 h-10">
                <Link to="/login" aria-label="Criar nova conta">
                  Cadastrar
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
          </div>
        </section>
        
        {/* Seção de Contato */}
        <section className="mb-16" aria-labelledby="contact-heading">
          <div className="text-center mb-12">
            <h2 id="contact-heading" className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Entre em Contato
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Tem dúvidas ou sugestões? Estamos aqui para ajudar você a maximizar sua produtividade.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Email */}
            <Card className="bg-card/60 backdrop-blur-sm transition-transform hover:scale-105">
              <CardHeader className="text-center">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Email</CardTitle>
                <CardDescription>
                  <a 
                     href="mailto:felixskmarcio2@gmail.com" 
                     className="text-primary hover:text-primary/80 transition-colors"
                     aria-label="Enviar email para felixskmarcio2@gmail.com"
                   >
                     felixskmarcio2@gmail.com
                   </a>
                </CardDescription>
              </CardHeader>
            </Card>
            
            {/* Telefone */}
            <Card className="bg-card/60 backdrop-blur-sm transition-transform hover:scale-105">
              <CardHeader className="text-center">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Telefone</CardTitle>
                <CardDescription>
                  <a 
                     href="tel:+5582998274851" 
                     className="text-primary hover:text-primary/80 transition-colors"
                     aria-label="Ligar para +55 82 9.9827-4851"
                   >
                     +55 82 9.9827-4851
                   </a>
                </CardDescription>
              </CardHeader>
            </Card>
            
            {/* Localização */}
            <Card className="bg-card/60 backdrop-blur-sm transition-transform hover:scale-105 md:col-span-2 lg:col-span-1">
              <CardHeader className="text-center">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Localização</CardTitle>
                <CardDescription>
                   Penedo, AL<br />
                   Brasil
                 </CardDescription>
              </CardHeader>
            </Card>
          </div>
          
          {/* Redes Sociais */}
          <div className="mt-12 text-center">
            <h3 className="text-xl font-semibold text-foreground mb-6">Siga-nos nas Redes Sociais</h3>
            <div className="flex justify-center gap-4">
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                asChild
              >
                <a 
                  href="https://github.com/felixskmarcio?tab=repositories" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Seguir no GitHub"
                >
                  <Github className="h-5 w-5" />
                </a>
              </Button>
              
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                asChild
              >
                <a 
                  href="https://www.linkedin.com/in/marcio-eduardo-felixbr-0010a530/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Seguir no LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </Button>
              
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                asChild
              >
                <a 
                  href="https://x.com/felixskmarcio2" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Seguir no Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Rodapé da landing page */}
        <footer className="text-center text-muted-foreground text-sm pt-8 border-t" role="contentinfo">
          <p>© 2025 Eisenhower Task Manager. Todos os direitos reservados.</p>
        </footer>
      </div>
    </main>
  );
};

export default Landing;