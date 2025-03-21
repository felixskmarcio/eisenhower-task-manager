import React from 'react';
import { TubelightNavbar } from "@/components/ui/tubelight-navbar";
import { Clock, Star, CheckCircle, Share, Settings, Home, BarChart2, Tag } from "lucide-react";
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
      <header className="w-full py-4 px-6 border-b shadow-sm bg-background/95 backdrop-blur-sm sticky top-0 z-20">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Clock className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-primary tracking-tight">Eisenhower Task Manager</h1>
          </Link>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-8 mb-16">
        {children}
      </main>
      
      <footer className="w-full py-4 text-center text-sm text-muted-foreground border-t mt-auto">
        <div className="container mx-auto">
          <p>© 2024 Eisenhower Task Manager. Todos os direitos reservados.</p>
        </div>
      </footer>
      
      <div className="fixed bottom-4 left-4 right-4 z-30">
        <TubelightNavbar items={navItems} />
      </div>
    </div>
  );
};

export default Layout;
