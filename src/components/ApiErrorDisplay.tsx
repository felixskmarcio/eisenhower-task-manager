
import React, { useState } from 'react';
import { Copy, Check, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ApiErrorDisplayProps {
  error: {
    status?: number;
    statusText?: string;
    message?: string;
    details?: Record<string, unknown>;
    path?: string;
    method?: string;
    timestamp?: string;
  };
  onRetry?: () => void;
  className?: string;
}

const ApiErrorDisplay: React.FC<ApiErrorDisplayProps> = ({ 
  error, 
  onRetry,
  className = ''
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyError = () => {
    const errorDetails = JSON.stringify(error, null, 2);
    
    navigator.clipboard.writeText(errorDetails)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Falha ao copiar o erro:', err);
      });
  };

  const getErrorMessage = () => {
    if (error.message) return error.message;
    
    if (error.status) {
      switch (error.status) {
        case 400: return 'Requisição inválida';
        case 401: return 'Não autorizado';
        case 403: return 'Acesso negado';
        case 404: return 'Recurso não encontrado';
        case 500: return 'Erro interno do servidor';
        default: return `Erro ${error.status}: ${error.statusText || 'Desconhecido'}`;
      }
    }
    
    return 'Ocorreu um erro na comunicação com o servidor';
  };

  return (
    <div className={`bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4 ${className}`}>
      <div className="flex flex-col space-y-3">
        <div className="flex justify-between items-start">
          <h3 className="text-amber-800 dark:text-amber-300 font-semibold">
            {getErrorMessage()}
          </h3>
          
          {error.status && (
            <span className="bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 text-xs px-2 py-1 rounded-full font-medium">
              Status {error.status}
            </span>
          )}
        </div>
        
        {(error.path || error.method) && (
          <div className="text-xs text-amber-700 dark:text-amber-400 font-mono">
            {error.method && <span className="uppercase">{error.method}</span>}
            {error.method && error.path && ' '}
            {error.path && <span>{error.path}</span>}
          </div>
        )}
        
        {error.details && (
          <details className="cursor-pointer mt-2">
            <summary className="text-sm text-amber-700 dark:text-amber-400 font-medium">
              Detalhes do erro
            </summary>
            <pre className="mt-2 p-3 bg-amber-100 dark:bg-amber-900/50 rounded text-xs font-mono overflow-auto max-h-48 text-amber-900 dark:text-amber-200">
              {JSON.stringify(error.details, null, 2)}
            </pre>
          </details>
        )}
        
        <div className="flex justify-end items-center gap-2 pt-2">
          {onRetry && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRetry}
              className="text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-800/50 flex items-center gap-1"
            >
              <RefreshCcw size={14} />
              <span>Tentar novamente</span>
            </Button>
          )}
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleCopyError}
            className="text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-800/50 flex items-center gap-1"
          >
            {copied ? (
              <>
                <Check size={14} />
                <span>Copiado!</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>Copiar erro</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ApiErrorDisplay; 
