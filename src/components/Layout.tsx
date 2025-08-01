import React from 'react';
import { Star, CheckCircle, Share, Settings, Home, BarChart2, Tag, CheckSquare, LogOut, InfoIcon, PlayCircle } from "lucide-react";
import { useLocation } from "react-router-dom";
import { AnimatedNavigationTabs } from "@/components/ui/animated-navigation-tabs";
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import NavigationLink from './NavigationLink';
import AppLogo from '@/components/ui/app-logo';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({
  children
}: LayoutProps) => {
  const location = useLocation();
  const {
    signOut,
    user
  } = useAuth();

  // Define items para o menu AnimatedNavigationTabs
  const navItems = [{
    id: 1,
    tile: "Dashboard",
    url: "/dashboard",
    icon: Home
  }, {
    id: 2,
    tile: "Produtividade",
    url: "/productivity",
    icon: BarChart2
  }, {
    id: 3,
    tile: "Tags",
    url: "/tags",
    icon: Tag
  }, {
    id: 4,
    tile: "Configurações",
    url: "/config",
    icon: Settings
  }];

  // Items públicos que não requerem autenticação
  const publicItems = [{
    id: 101,
    tile: "Início",
    url: "/",
    icon: Home
  }, {
    id: 102,
    tile: "Introdução",
    url: "/introduction",
    icon: InfoIcon
  }, {
    id: 103,
    tile: "Demonstração",
    url: "/demo",
    icon: PlayCircle
  }];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="w-full border-b shadow-sm bg-background/95 backdrop-blur-sm sticky top-0 z-20">
        <div className="container mx-auto">
          <div className="flex items-center justify-between py-2 sm:py-3 px-3 sm:px-4">
            <NavigationLink to={user ? "/dashboard" : "/"} className="group flex items-center gap-1.5 sm:gap-2" showLoadingScreen={true}>
              <AppLogo size="sm" animated={true} className="hidden sm:block" />
              
              <div className="flex sm:flex-col gap-1 sm:gap-0 items-baseline sm:items-start">
                <span className="text-base sm:text-xl font-bold text-primary tracking-tight group-hover:text-primary/90 transition-colors duration-300">Eisenhower</span>
                <div className="h-1 w-1 rounded-full bg-primary/70 mx-0.5 group-hover:bg-primary transition-colors duration-300 hidden sm:block" />
                <span className="text-xs sm:text-sm font-medium text-muted-foreground tracking-wide group-hover:text-primary/70 transition-colors duration-300">Task Manager</span>
              </div>
            </NavigationLink>
            
            <div className="flex items-center gap-2">
              {user ? (
                <>
                  <AnimatedNavigationTabs items={navItems} />
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={signOut} 
                    className="ml-2 flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Sair</span>
                  </Button>
                </>
              ) : (
                <>
                  <AnimatedNavigationTabs items={publicItems} />
                  <Button asChild variant="default" size="sm" className="ml-2">
                    <NavigationLink to="/login" showLoadingScreen={true}>Entrar</NavigationLink>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-3 sm:px-4 py-4 sm:py-8 mb-16">
        {children}
      </main>
      
      <footer className="w-full py-3 sm:py-4 text-center text-xs text-muted-foreground border-t mt-auto bg-background/90 backdrop-blur-sm hidden sm:block">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            <div className="flex items-center gap-1.5">
              <AppLogo size="sm" animated={true} className="scale-75" />
              <span className="font-medium text-primary/70">Eisenhower Task Manager</span>
              <span className="text-primary/40">•</span>
              <span>Versão 1.3.0</span>
            </div>
            <div className="flex items-center gap-4">
              <NavigationLink to="/introduction" className="text-muted-foreground hover:text-primary transition-colors" showLoadingScreen={true}>Sobre</NavigationLink>
              <NavigationLink to="/demo" className="text-muted-foreground hover:text-primary transition-colors" showLoadingScreen={true}>Demonstração</NavigationLink>
              <p>© 2025 Todos os direitos reservados</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
