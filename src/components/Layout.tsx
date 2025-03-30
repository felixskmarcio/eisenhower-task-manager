
import React from 'react';
import { Clock, Star, CheckCircle, Share, Settings, Home, BarChart2, Tag, CheckSquare, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { AnimatedNavigationTabs } from "@/components/ui/animated-navigation-tabs";
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { signOut, user } = useAuth();
  
  // Define items para o menu AnimatedNavigationTabs
  const navItems = [
    {
      id: 1,
      tile: "Início",
      url: "/",
      icon: Home
    },
    {
      id: 2,
      tile: "Dashboard",
      url: "/dashboard",
      icon: BarChart2
    },
    {
      id: 3,
      tile: "Tags",
      url: "/tags",
      icon: Tag
    },
    {
      id: 4,
      tile: "Configurações",
      url: "/config",
      icon: Settings
    },
  ];

  return (
    <>
      <div className="min-h-screen flex flex-col bg-background">
        <header className="w-full border-b shadow-sm bg-background/95 backdrop-blur-sm sticky top-0 z-20">
          <div className="container mx-auto">
            <div className="flex items-center justify-between py-2 sm:py-3 px-3 sm:px-4">
              <Link to="/" className="group flex items-center gap-1.5 sm:gap-2">
                <div className="relative hidden sm:flex items-center justify-center w-8 sm:w-10 h-8 sm:h-10 rounded-lg bg-gradient-to-br from-primary/80 to-primary transition-all duration-300 group-hover:shadow-md group-hover:shadow-primary/20">
                  <Clock className="h-4 sm:h-5 w-4 sm:w-5 text-white absolute transform group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-primary/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
                </div>
                
                <div className="flex sm:flex-col gap-1 sm:gap-0 items-baseline sm:items-start">
                  <span className="text-base sm:text-xl font-bold text-primary tracking-tight group-hover:text-primary/90 transition-colors duration-300">Eisenhower</span>
                  <div className="h-1 w-1 rounded-full bg-primary/70 mx-0.5 group-hover:bg-primary transition-colors duration-300 hidden sm:block" />
                  <span className="text-xs sm:text-sm font-medium text-muted-foreground tracking-wide group-hover:text-primary/70 transition-colors duration-300">Task Manager</span>
                </div>
              </Link>
              
              <div className="flex items-center gap-2">
                <AnimatedNavigationTabs items={navItems} />
                
                {user && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={signOut} 
                    className="ml-2 text-muted-foreground hover:text-destructive"
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Sair</span>
                  </Button>
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
                <Clock className="h-3.5 w-3.5 text-primary/60" />
                <span className="font-medium text-primary/70">Eisenhower Task Manager</span>
                <span className="text-primary/40">•</span>
                <span>Versão 1.1.0</span>
              </div>
              <p>© 2025 Todos os direitos reservados</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Layout;
