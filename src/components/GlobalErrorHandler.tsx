import React, { useEffect, useState } from 'react';
import { AlertTriangle, X, Copy, Check } from 'lucide-react';

interface ErrorState {
  hasError: boolean;
  message: string;
  stack?: string;
  timestamp: number;
}

export const GlobalErrorHandler: React.FC = () => {
  const [errors, setErrors] = useState<ErrorState[]>([]);
  const [copying, setCopying] = useState<number | null>(null);

  // Captura erros não tratados de JavaScript
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      event.preventDefault();
      const newError: ErrorState = {
        hasError: true,
        message: event.message || 'Um erro ocorreu',
        stack: event.error?.stack,
        timestamp: Date.now()
      };
      
      setErrors(prev => [newError, ...prev].slice(0, 5)); // Limita a 5 erros recentes
      
      console.error('Erro global capturado:', event.error);
      return false;
    };

    // Captura erros de Promises não tratados
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      event.preventDefault();
      const newError: ErrorState = {
        hasError: true,
        message: event.reason?.message || 'Rejeição de Promise não tratada',
        stack: event.reason?.stack,
        timestamp: Date.now()
      };
      
      setErrors(prev => [newError, ...prev].slice(0, 5));
      
      console.error('Rejeição de Promise não tratada:', event.reason);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  const dismissError = (timestamp: number) => {
    setErrors(errors.filter(error => error.timestamp !== timestamp));
  };

  const copyErrorToClipboard = (error: ErrorState) => {
    const errorText = `Erro: ${error.message}\n\nStack Trace:\n${error.stack || 'Indisponível'}`;
    
    navigator.clipboard.writeText(errorText)
      .then(() => {
        setCopying(error.timestamp);
        setTimeout(() => setCopying(null), 2000);
      })
      .catch(err => {
        console.error('Falha ao copiar o erro:', err);
      });
  };

  if (errors.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-3 max-w-md">
      {errors.map((error) => (
        <div 
          key={error.timestamp}
          className="bg-red-100 dark:bg-red-900/90 border border-red-300 dark:border-red-700 rounded-lg shadow-lg p-3 text-red-800 dark:text-red-200 animate-in slide-in-from-left duration-300"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertTriangle size={18} className="text-red-500 flex-shrink-0" />
              <span className="font-medium text-sm">Erro detectado</span>
            </div>
            <button 
              onClick={() => dismissError(error.timestamp)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="Fechar"
              title="Fechar"
            >
              <X size={16} />
            </button>
          </div>
          
          <div className="mt-2 text-sm">
            <p className="font-mono break-words">{error.message}</p>
          </div>
          
          <div className="mt-3 flex justify-end">
            <button
              onClick={() => copyErrorToClipboard(error)}
              className="flex items-center gap-1.5 text-xs bg-white dark:bg-gray-800 px-2 py-1 rounded border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              {copying === error.timestamp ? (
                <>
                  <Check size={12} />
                  <span>Copiado</span>
                </>
              ) : (
                <>
                  <Copy size={12} />
                  <span>Copiar detalhes</span>
                </>
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GlobalErrorHandler; 