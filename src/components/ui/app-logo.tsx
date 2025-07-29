import React from 'react';
import { Clock, CheckCircle2, LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}

/**
 * AppLogo - Um componente de logo para o Eisenhower Task Manager
 * Inspirado na animação de carregamento, mas mais leve para uso em toda a aplicação
 */
const AppLogo = ({ 
  size = 'md', 
  animated = false,
  className
}: AppLogoProps) => {
  // Configurações de tamanho
  const sizes = {
    sm: {
      container: 'w-8 h-8',
      icons: 'w-4 h-4',
      offset: 'translate-x-2 -translate-x-2',
    },
    md: {
      container: 'w-12 h-12',
      icons: 'w-6 h-6',
      offset: 'translate-x-3 -translate-x-3',
    },
    lg: {
      container: 'w-16 h-16',
      icons: 'w-8 h-8',
      offset: 'translate-x-4 -translate-x-4',
    }
  };

  const { container, icons, offset } = sizes[size];

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {/* Efeito de brilho/glow com pulsação */}
      <div 
        className={cn(
          "absolute inset-0 rounded-xl bg-primary/20 blur-lg",
          animated ? "animate-glow-pulse" : "opacity-70"
        )} 
      />
      
      {/* Conjunto de ícones agrupados */}
      <div className={cn("relative", animated ? "animate-gentle-bounce" : "")}>
        {/* Ícone principal */}
        <div className={cn(
          container, 
          "flex items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20 z-20",
          animated ? "animate-glow-shadow" : ""
        )}>
          <Clock className={cn(
            icons, 
            "text-white",
            animated ? "animate-pulse-slow" : ""
          )} />
        </div>

        {/* Ícones de fundo */}
        <div className={cn(
          container,
          "flex items-center justify-center rounded-xl bg-primary/90 absolute top-0 z-10 -translate-x-3",
          animated ? "animate-rotate-left" : "transform -rotate-6"
        )}>
          <LayoutGrid className={cn(icons, "text-white")} />
        </div>
        
        <div className={cn(
          container,
          "flex items-center justify-center rounded-xl bg-primary/80 absolute top-0 z-10 translate-x-3",
          animated ? "animate-rotate-right" : "transform rotate-6"
        )}>
          <CheckCircle2 className={cn(icons, "text-white")} />
        </div>
      </div>
    </div>
  );
};

export default AppLogo; 