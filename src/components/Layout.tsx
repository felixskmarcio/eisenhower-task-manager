import React from 'react';
import { TubelightNavbar } from "@/components/ui/tubelight-navbar";
import { Clock, Star, CheckCircle, Share, Settings, Home, BarChart2, Tag } from "lucide-react";

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
    <div className="app-container">
      <header>
        {/* seu conteúdo de cabeçalho */}
      </header>
      
      <main className="content-container">
        {children}
      </main>
      
      <footer className="text-center">
        {/* seu conteúdo de rodapé */}
      </footer>
      
      <div className="sm:fixed sm:bottom-4 sm:left-4 sm:right-4 sm:z-10">
        <TubelightNavbar items={navItems} />
      </div>
    </div>
  );
};

export default Layout;
