import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { cn } from "@/utils/classNames";
import { useLocation } from "react-router-dom";
import NavigationLink from "@/components/NavigationLink";

interface NavItem {
  id: number;
  tile: string;
  url: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface AnimatedNavigationTabsProps {
  items: NavItem[];
}

export function AnimatedNavigationTabs({ items }: AnimatedNavigationTabsProps) {
  const location = useLocation();
  const [active, setActive] = useState<NavItem>(
    items.find(item => item.url === location.pathname) || items[0]
  );
  const [isHover, setIsHover] = useState<NavItem | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  
  useEffect(() => {
    // Atualizar o item ativo quando a URL mudar
    const currentItem = items.find(
      item => location.pathname === item.url || location.pathname.startsWith(`${item.url}/`)
    );
    if (currentItem) {
      setActive(currentItem);
    }
  }, [location.pathname, items]);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <div className="relative">
      <ul className="flex items-center justify-center">
        {items.map((item) => (
          <NavigationLink
            key={item.id}
            to={item.url}
            className={cn(
              "py-2 relative duration-300 transition-colors hover:!text-primary",
              active.id === item.id ? "text-primary" : "text-muted-foreground"
            )}
            showLoadingScreen={true}
            onClick={() => setActive(item)}
            onMouseEnter={() => setIsHover(item)}
            onMouseLeave={() => setIsHover(null)}
          >
            <div className="px-3 sm:px-5 py-1 sm:py-2 relative flex items-center gap-1.5">
              {item.icon && <item.icon className="w-4 h-4" />}
              <span className={isMobile ? "hidden sm:inline" : ""}>{item.tile}</span>
              {isHover?.id === item.id && (
                <motion.div
                  layoutId="hover-bg"
                  className="absolute bottom-0 left-0 right-0 w-full h-full bg-primary/10"
                  style={{
                    borderRadius: 6,
                  }}
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
            </div>
            {active.id === item.id && (
              <motion.div
                layoutId="active"
                className="absolute bottom-0 left-0 right-0 w-full h-0.5 bg-primary"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            {isHover?.id === item.id && (
              <motion.div
                layoutId="hover"
                className="absolute bottom-0 left-0 right-0 w-full h-0.5 bg-primary"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
          </NavigationLink>
        ))}
      </ul>
    </div>
  );
} 