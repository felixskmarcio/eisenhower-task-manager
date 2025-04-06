
import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface StatusTextProps {
  loadingComplete: boolean;
}

const StatusText: React.FC<StatusTextProps> = ({ loadingComplete }) => {
  return (
    <div 
      className="h-6 mt-2 overflow-hidden" 
      style={{ 
        width: '120px',
        perspective: '100px' 
      }}
    >
      {loadingComplete ? (
        <div className="flex items-center justify-center text-sm text-green-600 animate-fade-slide-up">
          <span>Inicializado</span>
          <CheckCircle2 className="ml-1 w-4 h-4" />
        </div>
      ) : (
        <div className="text-sm text-indigo-600 text-center relative">
          <div className="absolute inset-0 flex justify-center items-center overflow-hidden">
            {["Carregando", "Preparando", "Inicializando"].map((text, i) => (
              <span 
                key={i} 
                className="absolute whitespace-nowrap"
                style={{
                  opacity: ((Math.floor(Date.now() / 1000) % 3) === i) ? 1 : 0,
                  transition: 'opacity 0.5s ease-out',
                  transform: 'translateZ(20px)'
                }}
              >
                {text}<span className="animate-dots">...</span>
              </span>
            ))}
          </div>
          <span className="invisible">Placeholder</span>
        </div>
      )}
    </div>
  );
};

export default StatusText;
