import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  copied: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      copied: false
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
      copied: false
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({
      error,
      errorInfo
    });
    
    // Enviar erro para sistema de log centralizado
    console.error('Erro capturado pelo ErrorBoundary:', error, errorInfo);
    
    // Se tiver algum serviço de monitoramento, pode enviar aqui
    // reportErrorToMonitoringService(error, errorInfo);
  }
  
  handleCopyError = (): void => {
    const { error, errorInfo } = this.state;
    
    let errorText = 'Erro na aplicação:\n\n';
    
    if (error) {
      errorText += `${error.name}: ${error.message}\n`;
      if (error.stack) {
        errorText += `\nStack Trace:\n${error.stack}\n`;
      }
    }
    
    if (errorInfo && errorInfo.componentStack) {
      errorText += `\nComponente:\n${errorInfo.componentStack}`;
    }
    
    navigator.clipboard.writeText(errorText)
      .then(() => {
        this.setState({ copied: true });
        setTimeout(() => this.setState({ copied: false }), 2000);
      })
      .catch(err => {
        console.error('Falha ao copiar o erro:', err);
      });
  };
  
  handleReload = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    const { hasError, error, errorInfo, copied } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      // Você pode renderizar qualquer fallback UI personalizado
      return fallback || (
        <div className="p-6 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 m-4 shadow-lg">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-red-600 dark:text-red-400">
                Algo deu errado!
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={this.handleReload}
                className="hover:bg-red-100 dark:hover:bg-red-800"
              >
                <RefreshCw size={16} className="mr-2" />
                Recarregar página
              </Button>
            </div>
            
            <div className="p-4 bg-red-100 dark:bg-red-900/50 rounded-md">
              <p className="font-medium mb-2 text-red-800 dark:text-red-300">
                {error && error.message}
              </p>
              
              {errorInfo && (
                <div className="mt-2">
                  <details className="cursor-pointer">
                    <summary className="text-sm text-red-700 dark:text-red-400 font-medium mb-2">
                      Detalhes técnicos (para desenvolvedores)
                    </summary>
                    <pre className="mt-2 p-3 bg-red-50 dark:bg-red-950 rounded text-xs font-mono overflow-auto max-h-60 text-red-900 dark:text-red-200 whitespace-pre-wrap">
                      {error && error.stack}
                      {errorInfo.componentStack}
                    </pre>
                  </details>
                </div>
              )}
            </div>
            
            <div className="flex justify-end">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={this.handleCopyError}
                className="flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <Check size={16} />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    Copiar erro
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary; 