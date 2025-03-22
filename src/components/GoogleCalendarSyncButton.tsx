import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, RefreshCw, Check, AlertCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { syncTasksWithCalendar, checkCalendarAccess } from '@/services/googleCalendar';
import { getAccessToken } from '@/services/auth';
import GoogleCalendarErrorDisplay from './GoogleCalendarErrorDisplay';

interface GoogleCalendarSyncButtonProps {
  tasks: Array<{
    id: string;
    title: string;
    description?: string;
    quadrant: number;
    dueDate?: string;
    completed: boolean;
    tags?: string[];
  }>;
  className?: string;
  onlySyncNew?: boolean;
}

const GoogleCalendarSyncButton: React.FC<GoogleCalendarSyncButtonProps> = ({
  tasks,
  className = '',
  onlySyncNew = true
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [syncError, setSyncError] = useState<{
    code?: string;
    message: string;
    details?: Record<string, unknown>;
  } | null>(null);

  // Verificar se o usuário está conectado quando o componente montar
  useEffect(() => {
    checkConnection();
  }, []);
  
  // Verificar conexão com o Google Calendar
  const checkConnection = async () => {
    const token = getAccessToken();
    
    if (!token) {
      setIsConnected(false);
      return;
    }
    
    try {
      const hasAccess = await checkCalendarAccess();
      setIsConnected(hasAccess);
    } catch (error) {
      console.error("Erro ao verificar acesso ao Google Calendar:", error);
      setIsConnected(false);
    }
  };
  
  // Filtrar apenas tarefas não sincronizadas
  const getTasksToSync = () => {
    if (!onlySyncNew) return tasks;
    
    // Se for onlySyncNew, filtramos para pegar apenas tasks sem o campo googleCalendarId
    return tasks.filter(task => !('googleCalendarId' in task));
  };

  // Sincronizar tarefas com o Google Calendar
  const handleSync = async () => {
    setSyncError(null);
    setIsLoading(true);
    
    const tasksToSync = getTasksToSync();
    
    // Verificar se há tarefas para sincronizar
    if (tasksToSync.length === 0) {
      toast({
        title: "Nenhuma tarefa para sincronizar",
        description: "Não há tarefas para sincronizar no momento.",
      });
      setIsLoading(false);
      return;
    }
    
    try {
      // Sincronizar tarefas
      const result = await syncTasksWithCalendar(tasksToSync);
      
      if (!result.success && result.errors?.length) {
        setSyncError(result.errors[0]);
      }
    } catch (error) {
      if (error instanceof Error) {
        setSyncError({
          code: 'sync_failed',
          message: error.message,
          details: { 
            tasks: tasksToSync.length,
            error: error.toString() 
          }
        });
      } else {
        setSyncError({
          code: 'unknown_error',
          message: 'Erro desconhecido durante a sincronização.'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Tentar novamente a sincronização
  const handleRetry = () => {
    setSyncError(null);
    handleSync();
  };

  if (isConnected === null) {
    // Ainda verificando conexão
    return (
      <Button
        variant="outline"
        size="sm"
        disabled
        className={`flex items-center gap-2 ${className}`}
      >
        <RefreshCw size={16} className="animate-spin" />
        <span>Verificando...</span>
      </Button>
    );
  }

  if (!isConnected) {
    // Não conectado ao Google
    return (
      <Button
        variant="outline"
        size="sm"
        className={`text-amber-600 border-amber-200 hover:bg-amber-50 flex items-center gap-2 ${className}`}
        onClick={() => toast({
          title: "Não conectado ao Google",
          description: "Acesse as configurações e conecte-se ao Google para sincronizar tarefas.",
          variant: "destructive",
        })}
      >
        <AlertCircle size={16} />
        <span>Não conectado</span>
      </Button>
    );
  }

  return (
    <div className={className}>
      {syncError && (
        <div className="mb-4">
          <GoogleCalendarErrorDisplay
            error={syncError}
            onRetry={handleRetry}
          />
        </div>
      )}
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleSync}
        disabled={isLoading}
        className="flex items-center gap-2 text-primary"
      >
        {isLoading ? (
          <>
            <RefreshCw size={16} className="animate-spin" />
            <span>Sincronizando...</span>
          </>
        ) : (
          <>
            <Calendar size={16} />
            <span>Sincronizar com Google Calendar</span>
          </>
        )}
      </Button>
    </div>
  );
};

export default GoogleCalendarSyncButton; 