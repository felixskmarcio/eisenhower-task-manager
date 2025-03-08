import React, { useEffect } from 'react';
import { TubelightNavbar } from "@/components/ui/tubelight-navbar";
import { Clock, Star, CheckCircle, Share, Settings, Home, BarChart2 } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  useEffect(() => {
    // Aplica o tema Dracula
    document.documentElement.setAttribute("data-theme", "dracula");
  }, []);

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
      name: "Configurações",
      url: "/config",
      icon: Settings,
    },
  ];

  return (
    <div className="min-h-screen bg-base-100">
      {children}
      <TubelightNavbar items={navItems} />
    </div>
  );
};

export default Layout;