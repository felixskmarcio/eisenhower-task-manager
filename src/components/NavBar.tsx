
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { LucideIcon, Home, PlusSquare, Clock, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";

interface NavItem {
  name: string;
  url: string;
  icon: LucideIcon;
}

interface NavBarProps {
  items?: NavItem[];
  className?: string;
}

export function NavBar({ className }: NavBarProps) {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState("Início");
  const [isMobile, setIsMobile] = useState(false);

  // Default navigation items
  const defaultItems: NavItem[] = [
    { name: "Início", url: "/", icon: Home },
    { name: "Adicionar", url: "/add", icon: PlusSquare },
    { name: "Histórico", url: "/history", icon: Clock },
    { name: "Configurações", url: "/settings", icon: Settings },
  ];

  const items = defaultItems;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Set the active tab based on the current URL
    const path = window.location.pathname;
    const currentItem = items.find(item => item.url === path);
    if (currentItem) {
      setActiveTab(currentItem.name);
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className={cn(
        "fixed bottom-0 sm:bottom-auto sm:top-0 left-1/2 -translate-x-1/2 z-50 mb-6 sm:mt-6",
        className
      )}
    >
      <div className={`flex items-center gap-3 ${isDarkMode ? 'bg-dark-300/30' : 'bg-white/70'} border ${isDarkMode ? 'border-white/10' : 'border-gray-200'} backdrop-blur-lg py-1 px-1 rounded-full shadow-lg`}>
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.name;

          return (
            <Link
              key={item.name}
              to={item.url}
              onClick={() => setActiveTab(item.name)}
              className={cn(
                "relative cursor-pointer text-sm font-semibold px-6 py-2 rounded-full transition-colors",
                isDarkMode 
                  ? "text-gray-300/80 hover:text-primary" 
                  : "text-gray-700/80 hover:text-primary",
                isActive && (isDarkMode 
                  ? "bg-dark-200 text-primary" 
                  : "bg-gray-100 text-primary")
              )}
            >
              <span className="hidden md:inline">{item.name}</span>
              <span className="md:hidden">
                <Icon size={18} strokeWidth={2.5} />
              </span>
              {isActive && (
                <motion.div
                  layoutId="lamp"
                  className={`absolute inset-0 w-full ${isDarkMode ? 'bg-primary/20' : 'bg-primary/10'} rounded-full -z-10`}
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-t-full">
                    <div className="absolute w-12 h-6 bg-primary/20 rounded-full blur-md -top-2 -left-2" />
                    <div className="absolute w-8 h-6 bg-primary/20 rounded-full blur-md -top-1" />
                    <div className="absolute w-4 h-4 bg-primary/20 rounded-full blur-sm top-0 left-2" />
                  </div>
                </motion.div>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  );
}

export default NavBar;
