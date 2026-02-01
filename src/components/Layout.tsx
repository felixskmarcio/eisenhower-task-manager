import React from 'react';
import { Settings, Home, BarChart2, Tag, LogOut, InfoIcon, PlayCircle, Shield, Terminal } from "lucide-react";
import { useLocation } from "react-router-dom";
import { AnimatedNavigationTabs } from "@/components/ui/animated-navigation-tabs";
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import NavigationLink from './NavigationLink';

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
  }, {
    id: 5,
    tile: "Admin",
    url: "/admin",
    icon: Shield
  }];

  // Items públicos
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
    <div className="min-h-screen flex flex-col bg-[#09090b] text-[#f4f4f5] font-sans selection:bg-[#ccff00] selection:text-black">
      {/* Industrial Grid Background */}
      <div className="fixed inset-0 z-0 industrial-grid opacity-20 pointer-events-none" />

      <header className="w-full border-b border-[#27272a] bg-[#09090b]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto">
          <div className="flex items-center justify-between h-16 px-4">
            <NavigationLink to={user ? "/dashboard" : "/"} className="flex items-center gap-2 group" showLoadingScreen={true}>
              <div className="w-8 h-8 bg-[#ccff00] flex items-center justify-center">
                <Terminal className="w-5 h-5 text-black" />
              </div>
              <span className="font-bold tracking-tight text-white text-lg uppercase font-display">EISENHOWER<span className="text-[#ccff00]">.SYS</span></span>
            </NavigationLink>

            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <div className="hidden md:block">
                    <AnimatedNavigationTabs items={navItems} />
                  </div>

                  <div className="flex items-center gap-3 pl-2 border-l border-[#27272a] ml-2">
                    <div className="bg-[#18181b] border border-[#27272a] px-3 py-1 flex items-center gap-2 hidden sm:flex">
                      <div className="w-1.5 h-1.5 bg-[#ccff00] rounded-sm animate-pulse" />
                      <span className="font-mono text-[10px] text-[#ccff00]">ONLINE</span>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={signOut}
                      className="rounded-none h-8 font-mono text-xs hover:bg-[#27272a] hover:text-white text-[#ccff00] border border-transparent hover:border-[#27272a]"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      SAIR_
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="hidden md:block">
                    <AnimatedNavigationTabs items={publicItems} />
                  </div>
                  <NavigationLink to="/login" showLoadingScreen={true}>
                    <Button className="rounded-none h-8 bg-[#ccff00] hover:bg-[#b3e600] text-black font-mono text-xs font-bold px-4">
                      ACESSAR_SISTEMA
                    </Button>
                  </NavigationLink>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 mb-16 relative z-10">
        {children}
      </main>

      <footer className="w-full py-6 border-t border-[#27272a] bg-[#09090b] relative z-10">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-2 mb-2 opacity-50">
            <span className="font-mono text-xs text-[#a1a1aa]">SYSTEM STATUS: NOMINAL</span>
          </div>
          <p className="font-mono text-[10px] text-[#52525b] uppercase">
            © 2025 Eisenhower Task Manager. Todos os direitos reservados. Protocolo Seguro v2.4
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
