
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Calendar, CheckCircle, RefreshCw, ExternalLink, LogOut } from 'lucide-react';
import { 
  loadGoogleApi, 
  isUserSignedIn, 
  signInWithGoogle, 
  signOutFromGoogle,
  getGoogleUserInfo,
  addSignInListener,
  syncTasksToCalendar,
  Task
} from '@/services/googleCalendar';
import './styles.css';

interface GoogleCalendarSyncProps {
  tasks: Task[];
  onSync?: (success: boolean) => void;
  className?: string;
}

const GoogleCalendarSync: React.FC<GoogleCalendarSyncProps> = ({ 
  tasks, 
  onSync, 
  className = '' 
}) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<{ name: string; email: string; imageUrl: string } | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    const initGoogleApi = async () => {
      try {
        console.log('Loading Google API...');
        await loadGoogleApi();
        setIsLoading(false);
        
        // Add listener for auth state changes
        addSignInListener((signedIn) => {
          setIsSignedIn(signedIn);
          setUserInfo(signedIn ? getGoogleUserInfo() : null);
        });
        
        console.log('Google API loaded successfully');
      } catch (error) {
        console.error('Error initializing Google API:', error);
        setIsLoading(false);
        setInitError(`Erro ao inicializar Google API: ${error instanceof Error ? error.message : String(error)}`);
        toast({
          title: "Erro na API Google",
          description: "Não foi possível conectar à API do Google. Verifique as credenciais.",
          variant: "destructive"
        });
      }
    };

    initGoogleApi();
  }, []);

  const handleAuthClick = async () => {
    if (isSignedIn) {
      try {
        await signOutFromGoogle();
        setUserInfo(null);
        toast({
          title: "Desconectado",
          description: "Você saiu da sua conta Google com sucesso."
        });
      } catch (error) {
        console.error('Error signing out:', error);
        toast({
          title: "Erro",
          description: "Não foi possível desconectar da sua conta Google.",
          variant: "destructive"
        });
      }
    } else {
      try {
        setIsLoading(true);
        await signInWithGoogle();
        setUserInfo(getGoogleUserInfo());
        setIsLoading(false);
        toast({
          title: "Conectado",
          description: "Você está conectado à sua conta Google."
        });
      } catch (error) {
        console.error('Error signing in:', error);
        setIsLoading(false);
        toast({
          title: "Erro",
          description: "Não foi possível fazer login com o Google.",
          variant: "destructive"
        });
      }
    }
  };

  const handleSyncTasks = async () => {
    if (!isSignedIn || tasks.length === 0) {
      setSyncStatus('Não há tarefas para sincronizar ou usuário não está logado');
      return;
    }

    setIsSyncing(true);
    setSyncStatus('Sincronizando tarefas...');

    try {
      const result = await syncTasksToCalendar(tasks);
      
      setSyncStatus(result.message);
      toast({
        title: result.success ? "Sincronização Concluída" : "Sincronização Parcial",
        description: result.message
      });
      
      if (onSync) {
        onSync(result.success);
      }
    } catch (error) {
      console.error('Error syncing tasks:', error);
      setSyncStatus('Erro ao sincronizar tarefas');
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao tentar sincronizar suas tarefas.",
        variant: "destructive"
      });
      
      if (onSync) {
        onSync(false);
      }
    } finally {
      setIsSyncing(false);
    }
  };

  const openCalendarSettings = () => {
    window.open('https://calendar.google.com/calendar/u/0/r/settings', '_blank');
  };

  return (
    <Card className={`google-calendar-sync p-5 ${className}`}>
      <div className="flex items-center gap-2 mb-4 text-primary">
        <Calendar className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Sincronização com Google Calendar</h3>
      </div>
      
      <p className="text-sm text-muted-foreground mb-6">
        Sincronize suas tarefas com o Google Calendar para manter tudo organizado em um só lugar.
        Tarefas concluídas serão automaticamente removidas do calendário.
      </p>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-4">
          <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : isSignedIn && userInfo ? (
        <div className="space-y-4">
          <div className="bg-green-500/10 border border-green-500/30 rounded-md p-4">
            <div className="flex items-center gap-3">
              {userInfo.imageUrl && (
                <img 
                  src={userInfo.imageUrl} 
                  alt={userInfo.name} 
                  className="w-10 h-10 rounded-full"
                />
              )}
              <div>
                <p className="font-medium">{userInfo.name}</p>
                <p className="text-sm text-muted-foreground">{userInfo.email}</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="default" 
              className="flex-1"
              onClick={handleSyncTasks}
              disabled={isSyncing}
            >
              {isSyncing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Sincronizando...
                </>
              ) : (
                <>
                  <Calendar className="mr-2 h-4 w-4" />
                  Sincronizar Tarefas
                </>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={openCalendarSettings}
              className="flex-1"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Abrir Calendário
            </Button>
          </div>
          
          <Button 
            variant="ghost" 
            onClick={handleAuthClick}
            className="w-full text-red-500 hover:text-red-600 hover:bg-red-500/10"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Desconectar Conta
          </Button>
          
          {syncStatus && (
            <div className="mt-4 text-sm">
              <p className="flex items-center gap-2 font-medium">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>{syncStatus}</span>
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center">
          <Button 
            onClick={handleAuthClick}
            className="w-full"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Conectar ao Google Calendar
          </Button>
          
          {syncStatus && <p className="mt-4 text-sm text-muted-foreground">{syncStatus}</p>}
        </div>
      )}
    </Card>
  );
};

export default GoogleCalendarSync;
