import React, { useState } from 'react';
import { Copy, Check, RefreshCw, AlertTriangle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface GoogleCalendarErrorProps {
  error: {
    code?: string;
    message: string;
    details?: Record<string, unknown>;
  };
  onRetry?: () => void;
  className?: string;
}

const GoogleCalendarErrorDisplay: React.FC<GoogleCalendarErrorProps> = ({
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

  // Mapa de códigos de erro comuns do Google para mensagens amigáveis
  const getErrorMessage = () => {
    if (!error.code) return error.message;

    switch (error.code) {
      case 'popup_closed_by_user':
        return 'A janela de autenticação foi fechada antes da conclusão. Por favor, tente novamente.';
      case 'popup_blocked_by_browser':
        return 'O popup de login foi bloqueado pelo navegador. Por favor, permita popups para este site.';
      case 'auth/cancelled-popup-request':
        return 'A operação foi cancelada. Por favor, tente novamente.';
      case 'auth/network-request-failed':
        return 'Não foi possível conectar com o Google. Verifique sua conexão com a internet.';
      case 'auth/unauthorized-domain':
        return 'Este domínio não está autorizado para operações com o Google. Contate o administrador.';
      case 'auth/user-disabled':
        return 'Esta conta de usuário foi desativada.';
      case 'auth/invalid-api-key':
        return 'A chave API do Google é inválida. Por favor, contate o administrador.';
      case 'access_denied':
        return 'Permissão negada. Você não autorizou o acesso ao Google Calendar.';
      case 'idpiframe_initialization_failed':
        return 'Falha na inicialização da biblioteca do Google. Verifique a configuração.';
      default:
        return `Erro: ${error.message}`;
    }
  };

  // Dicas de solução com base no código de erro
  const getTroubleshootingTips = () => {
    if (!error.code) return null;

    switch (error.code) {
      case 'popup_blocked_by_browser':
        return (
          <ul className="list-disc pl-5 text-xs mt-2 space-y-1">
            <li>Desative o bloqueador de popups do navegador para este site</li>
            <li>Verifique configurações de segurança do navegador</li>
          </ul>
        );
      case 'auth/network-request-failed':
        return (
          <ul className="list-disc pl-5 text-xs mt-2 space-y-1">
            <li>Verifique sua conexão com a internet</li>
            <li>Tente novamente em alguns minutos</li>
          </ul>
        );
      case 'idpiframe_initialization_failed':
        return (
          <ul className="list-disc pl-5 text-xs mt-2 space-y-1">
            <li>Certifique-se de que os cookies estão habilitados no navegador</li>
            <li>Tente usar outro navegador</li>
            <li>Limpe o cache e cookies do seu navegador</li>
          </ul>
        );
      default:
        return null;
    }
  };

  return (
    <Card className={`border-red-900/50 bg-red-950/20 shadow-none rounded-none ${className}`}>
      <div className="p-4">
        <div className="flex flex-col space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle size={20} className="text-red-500 flex-shrink-0" />
              <h3 className="text-red-500 font-bold uppercase tracking-wider text-sm">
                Erro na Conexão
              </h3>
            </div>

            {error.code && (
              <span className="bg-red-900/50 text-red-400 text-[10px] px-2 py-1 font-mono uppercase tracking-widest border border-red-900/50">
                {error.code}
              </span>
            )}
          </div>

          <p className="text-sm text-red-400 font-mono">
            &gt; {getErrorMessage()}
          </p>

          {getTroubleshootingTips() && (
            <div className="mt-1">
              <details className="text-xs text-red-400/80 font-mono">
                <summary className="cursor-pointer font-bold uppercase tracking-wide hover:text-red-300">
                  Sugestões para resolver
                </summary>
                <div className="mt-2 pl-2 border-l-2 border-red-900/50">
                  {getTroubleshootingTips()}
                </div>
              </details>
            </div>
          )}

          <div className="flex justify-end items-center gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyError}
              className="text-red-500 border-red-900/50 hover:bg-red-950/30 rounded-none uppercase text-[10px] font-bold tracking-wider flex items-center gap-1"
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

            {onRetry && (
              <Button
                variant="default"
                size="sm"
                onClick={onRetry}
                className="bg-red-600 hover:bg-red-700 text-white rounded-none uppercase text-[10px] font-bold tracking-wider flex items-center gap-1 border-none"
              >
                <RefreshCw size={14} />
                <span>Tentar novamente</span>
              </Button>
            )}
          </div>

          <div className="mt-1 pt-2 border-t border-red-900/30">
            <a
              href="https://support.google.com/calendar/answer/2917929?hl=pt-BR"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-red-500 hover:text-red-400 flex items-center gap-1 font-mono uppercase tracking-wider"
            >
              <ExternalLink size={10} />
              <span>Ver soluções na Ajuda do Google Calendar</span>
            </a>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default GoogleCalendarErrorDisplay; 