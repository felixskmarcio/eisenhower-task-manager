import React from 'react';
import { TubelightNavbar } from "@/components/ui/tubelight-navbar";
import { Clock, Star, CheckCircle, Share, Settings, Home, BarChart2, Tag, CheckSquare } from "lucide-react";
import { Link } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navItems = [
    {
      name: "Início",
      url: "/",
      icon: Home,
    },
    {
      name: "Dashboard",
      url: "/dashboard",
      icon: BarChart2,
    },
    {
      name: "Tarefas",
      url: "/tarefas",
      icon: Clock,
    },
    {
      name: "Concluídas",
      url: "/concluidas",
      icon: CheckCircle,
    },
    {
      name: "Tags",
      url: "/tags",
      icon: Tag,
    },
    {
      name: "Configurações",
      url: "/config",
      icon: Settings,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="w-full border-b shadow-sm bg-background/95 backdrop-blur-sm sticky top-0 z-20">
        <div className="container mx-auto">
          <div className="flex items-center justify-between py-3 px-4">
            <Link to="/" className="group flex items-center gap-2">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary/80 to-primary transition-all duration-300 group-hover:shadow-md group-hover:shadow-primary/20">
                <Clock className="h-5 w-5 text-white absolute transform group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-primary/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
              </div>
              
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-primary tracking-tight group-hover:text-primary/90 transition-colors duration-300">Eisenhower</span>
                  <div className="h-1.5 w-1.5 rounded-full bg-primary/70 mx-0.5 group-hover:bg-primary transition-colors duration-300" />
                </div>
                <span className="text-sm font-medium text-muted-foreground tracking-wide group-hover:text-primary/70 transition-colors duration-300">Task Manager</span>
              </div>
            </Link>
            
            <div className="hidden md:flex items-center space-x-1">
              <div className="flex items-center rounded-full bg-primary/10 px-3 py-1 gap-2 text-xs text-primary font-medium">
                <CheckSquare className="h-3.5 w-3.5" />
                <span>Matriz de Eisenhower</span>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-8 mb-16">
        {children}
      </main>
      
      <footer className="w-full py-4 text-center text-xs text-muted-foreground border-t mt-auto bg-background/90 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-primary/60" />
              <span className="font-medium text-primary/70">Eisenhower Task Manager</span>
              <span className="text-primary/40">•</span>
              <span>Versão 1.0.0</span>
            </div>
            <p>© 2024 Todos os direitos reservados</p>
          </div>
        </div>
      </footer>
      
      <div className="fixed bottom-4 left-4 right-4 z-30">
        <TubelightNavbar items={navItems} />
      </div>
    </div>
  );
};

export default Layout;
