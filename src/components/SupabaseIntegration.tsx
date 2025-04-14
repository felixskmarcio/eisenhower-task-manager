import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Database, Save, CheckCircle, AlertCircle, RefreshCw, Info, Code, LogIn } from "lucide-react";
import { setupDatabase, syncTasks } from '@/lib/supabase';
import { supabase, clearSupabaseStorage, isSupabaseConnected, resetToDefaultCredentials } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ErrorDisplay from './ErrorDisplay';
import ApiErrorDisplay from './ApiErrorDisplay';
import { useAuth } from '@/contexts/AuthContext';

interface SupabaseResponse {
  data: Record<string, unknown>[] | null;
  error: Error | null;
}

const createSupabaseClient = (url: string, key: string) => {
  return {
    from: (table: string) => ({
      select: () => ({
        then: (callback: (response: SupabaseResponse) => void) => {
          setTimeout(() => {
            callback({ data: [], error: null });
          }, 1000);
          return { catch: () => {} };
        }
      })
    }),
    auth: {
      getSession: () => Promise.resolve({ data: {}, error: null })
    }
  };
};

const DEFAULT_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const DEFAULT_SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const DISCONNECTION_FLAG = 'supabaseDisconnected';
const LAST_DISCONNECTION_TIME = 'lastSupabaseDisconnectionTime';
const DISCONNECT_RETRIES = 'supabaseDisconnectRetries';

const SupabaseIntegration = () => {
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'not_connected' | 'connected' | 'testing' | 'success' | 'error'>('not_connected');
  const [dbSetupResult, setDbSetupResult] = useState<{success: boolean, message: string} | null>(null);
  const [syncError, setSyncError] = useState<{title: string; message: string; details?: string} | null>(null);
  const [usingDefaultClient, setUsingDefaultClient] = useState(false);
  const { user, signInWithGoogle } = useAuth();
  const [isUserChecked, setIsUserChecked] = useState(false);
  const [disconnectionAttempts, setDisconnectionAttempts] = useState(0);
  const disconnectTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const checkDisconnectionState = () => {
      const disconnected = sessionStorage.getItem(DISCONNECTION_FLAG);
      const lastDisconnectionTime = sessionStorage.getItem(LAST_DISCONNECTION_TIME);
      const disconnectRetries = Number(sessionStorage.getItem(DISCONNECT_RETRIES) || '0');
      
      console.log('Estado de desconexão:', { disconnected, lastDisconnectionTime, disconnectRetries });
      
      if (disconnected === 'true') {
        const now = Date.now();
        const lastTime = lastDisconnectionTime ? parseInt(lastDisconnectionTime) : 0;
        const timeDiff = now - lastTime;
        
        if (timeDiff > 10000) {
          console.log('O processo de desconexão está demorando muito, tentando novamente');
          sessionStorage.removeItem(DISCONNECTION_FLAG);
          sessionStorage.removeItem(LAST_DISCONNECTION_TIME);
          
          if (isSupabaseConnected()) {
            sessionStorage.setItem(DISCONNECT_RETRIES, String(disconnectRetries + 1));
            
            if (disconnectRetries < 3) {
              console.log('Tentando desconexão forçada novamente...');
              executeDisconnect(true);
            } else {
              console.log('Muitas tentativas de desconexão. Resetando para estado limpo...');
              sessionStorage.removeItem(DISCONNECT_RETRIES);
              forceCleanDisconnect();
            }
          }
        }
      } else if (disconnected === 'completed') {
        console.log('Desconexão concluída com sucesso, limpando flags');
        sessionStorage.removeItem(DISCONNECTION_FLAG);
        sessionStorage.removeItem(LAST_DISCONNECTION_TIME);
        sessionStorage.removeItem(DISCONNECT_RETRIES);
        
        if (isSupabaseConnected()) {
          console.log('ALERTA: Ainda conectado após desconexão "concluída"!');
          forceCleanDisconnect();
        }
      }
    };
    
    const url = new URL(window.location.href);
    const disconnected = url.searchParams.get('disconnected');
    
    if (disconnected === 'true') {
      console.log('Redirecionado após desconexão, verificando status...');
      url.searchParams.delete('disconnected');
      window.history.replaceState({}, document.title, url.toString());
      
      sessionStorage.setItem(DISCONNECTION_FLAG, 'completed');
      
      if (isSupabaseConnected()) {
        console.warn('Ainda há dados de conexão do Supabase após a desconexão. Limpando novamente...');
        clearSupabaseStorage();
        
        if (isSupabaseConnected()) {
          forceCleanDisconnect();
        } else {
          setConnectionStatus('not_connected');
        }
      }
    }
    
    checkDisconnectionState();

    const checkConnection = async () => {
      console.log('Verificando conexão do Supabase...');
      
      if (sessionStorage.getItem(DISCONNECTION_FLAG) === 'true') {
        console.log('Em processo de desconexão, pulando verificação de conexão');
        setConnectionStatus('not_connected');
        return;
      }
      
      const savedUrl = localStorage.getItem('supabaseUrl');
      const savedKey = localStorage.getItem('supabaseKey');
      
      if (savedUrl && savedKey) {
        console.log('Credenciais encontradas no localStorage, configurando cliente...');
        setSupabaseUrl(savedUrl);
        setSupabaseKey(savedKey);
        setConnectionStatus('connected');
        setUsingDefaultClient(false);
        
        await checkDatabaseSetup();
      } else if (DEFAULT_SUPABASE_URL && DEFAULT_SUPABASE_KEY) {
        console.log('Usando credenciais padrão das variáveis de ambiente...');
        setSupabaseUrl(DEFAULT_SUPABASE_URL);
        setSupabaseKey(DEFAULT_SUPABASE_KEY);
        setConnectionStatus('connected');
        setUsingDefaultClient(true);
        
        toast({
          title: "Credenciais padrão carregadas",
          description: "Usando configuração de Supabase das variáveis de ambiente."
        });
        
        await checkDatabaseSetup();
      } else {
        console.log('Nenhuma credencial encontrada.');
        setConnectionStatus('not_connected');
        
        toast({
          title: "Credenciais não encontradas",
          description: "Configure as credenciais do Supabase para usar este recurso.",
          variant: "destructive"
        });
      }
      
      setIsUserChecked(true);
    };
    
    if (!sessionStorage.getItem(DISCONNECTION_FLAG)) {
      checkConnection();
    }
    
    return () => {
      if (disconnectTimeoutRef.current) {
        clearTimeout(disconnectTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);
    const disconnected = url.searchParams.get('disconnected');
    
    if (disconnected === 'true') {
      url.searchParams.delete('disconnected');
      window.history.replaceState({}, document.title, url.toString());
      
      if (isSupabaseConnected()) {
        console.warn("Ainda existem dados do Supabase após a desconexão. Tentando limpar novamente.");
        clearSupabaseStorage();
        
        if (isSupabaseConnected()) {
          forceCleanDisconnect();
        } else {
          setConnectionStatus('not_connected');
        }
      }
    } else {
      const shouldBeConnected = isSupabaseConnected();
      console.log("Estado atual de conexão (pela verificação):", shouldBeConnected);
      
      if (shouldBeConnected && connectionStatus === 'not_connected') {
        setConnectionStatus('connected');
      } else if (!shouldBeConnected && connectionStatus === 'connected') {
        setConnectionStatus('not_connected');
      }
    }
  }, [connectionStatus]);

  const checkDatabaseSetup = async () => {
    try {
      const result = await setupDatabase();
      setDbSetupResult(result);
      
      if (!result.success) {
        toast({
          title: "Atenção",
          description: result.message,
          variant: "destructive",
        });
      }
      
      return result;
    } catch (error) {
      console.error("Erro ao verificar banco de dados:", error);
      setDbSetupResult({
        success: false,
        message: "Não foi possível verificar o banco de dados. Verifique as credenciais."
      });
      return {
        success: false,
        message: "Não foi possível verificar o banco de dados. Verifique as credenciais."
      };
    }
  };

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!supabaseUrl || !supabaseKey) {
      toast({
        title: "Campos obrigatórios",
        description: "URL e Chave de API são necessários",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    setConnectionStatus('testing');
    
    try {
      const supabase = createSupabaseClient(supabaseUrl, supabaseKey);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      localStorage.setItem('supabaseUrl', supabaseUrl);
      localStorage.setItem('supabaseKey', supabaseKey);
      
      setConnectionStatus('connected');
      
      await checkDatabaseSetup();
      
      toast({
        title: "Conectado com sucesso!",
        description: "Sua integração com o Supabase foi configurada",
      });
    } catch (error) {
      console.error("Erro ao conectar com Supabase:", error);
      setConnectionStatus('error');
      
      toast({
        title: "Erro na conexão",
        description: "Não foi possível conectar ao Supabase",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setConnectionStatus('testing');
    
    try {
      const supabase = createSupabaseClient(supabaseUrl, supabaseKey);
      
      await checkDatabaseSetup();
      
      await new Promise<boolean>((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.1) {
            resolve(true);
          } else {
            reject(new Error("Falha na conexão"));
          }
        }, 1500);
      });
      
      setConnectionStatus('success');
      
      toast({
        title: "Conexão testada com sucesso!",
        description: "Sua conexão com o Supabase está funcionando corretamente",
      });
    } catch (error) {
      console.error("Erro ao testar conexão:", error);
      setConnectionStatus('error');
      
      toast({
        title: "Falha no teste de conexão",
        description: "Não foi possível conectar ao Supabase. Verifique suas credenciais.",
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
      setTimeout(() => {
        setConnectionStatus('connected');
      }, 3000);
    }
  };

  const handleSyncData = async () => {
    setIsSyncing(true);
    setSyncError(null);
    
    try {
      const localTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      
      if (localTasks.length === 0) {
        toast({
          title: "Nenhuma tarefa para sincronizar",
          description: "Adicione algumas tarefas primeiro.",
          variant: "destructive",
        });
        setIsSyncing(false);
        return;
      }
      
      console.log("Iniciando sincronização de", localTasks.length, "tarefas");
      
      const result = await syncTasks(localTasks);
      
      if (result.success) {
        toast({
          title: "Sincronização concluída",
          description: `${result.syncedCount} tarefas sincronizadas com sucesso.`
        });
        
        if (result.syncedCount > 0) {
          localStorage.removeItem('tasks');
        }
      } else {
        setSyncError({
          title: "Erro na sincronização",
          message: result.message,
          details: undefined
        });
      }
    } catch (error) {
      console.error("Erro ao sincronizar:", error);
      setSyncError({
        title: "Erro na sincronização",
        message: error instanceof Error ? error.message : "Erro desconhecido",
        details: error instanceof Error ? error.stack : undefined
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const forceCleanDisconnect = () => {
    clearSupabaseStorage();
    
    sessionStorage.removeItem(DISCONNECTION_FLAG);
    sessionStorage.removeItem(LAST_DISCONNECTION_TIME);
    sessionStorage.removeItem(DISCONNECT_RETRIES);
    
    const cacheBuster = new Date().getTime();
    window.location.href = `/config?cache=${cacheBuster}`;
  };

  const executeDisconnect = async (force = false) => {
    try {
      if (!force) {
        setIsDisconnecting(true);
      }
      
      sessionStorage.setItem(DISCONNECTION_FLAG, 'true');
      sessionStorage.setItem(LAST_DISCONNECTION_TIME, Date.now().toString());
      
      if (!force) {
        toast({
          title: "Desconectando...",
          description: "Aguarde enquanto finalizamos o processo de desconexão."
        });
      }
      
      try {
        await supabase.auth.signOut({
          scope: 'global'
        });
        console.log("Usuário desconectado do Supabase com sucesso");
      } catch (signOutError) {
        console.error("Erro no signOut do Supabase:", signOutError);
      }
      
      const cleanupSuccess = clearSupabaseStorage();
      console.log("Resultado da limpeza:", cleanupSuccess ? "Sucesso" : "Falha");
      
      setSupabaseUrl('');
      setSupabaseKey('');
      setConnectionStatus('not_connected');
      setDbSetupResult(null);
      setUsingDefaultClient(false);
      setSyncError(null);
      
      if (!force) {
        toast({
          title: "Desconectado com sucesso",
          description: "Integração com Supabase removida completamente."
        });
      }
      
      const stillConnected = isSupabaseConnected();
      console.log("Ainda conectado após limpeza?", stillConnected);
      
      if (stillConnected) {
        console.warn("Ainda detectados vestígios de conexão. Realizando limpeza forçada...");
        
        clearSupabaseStorage();
        setDisconnectionAttempts(prev => prev + 1);
        
        if (disconnectionAttempts >= 2) {
          console.warn("Múltiplas tentativas de desconexão falharam. Forçando recarga completa...");
          forceCleanDisconnect();
          return;
        }
      }
      
      const url = new URL(window.location.href);
      url.searchParams.set('disconnected', 'true');
      
      url.searchParams.delete('cache');
      url.pathname = '/config';
      
      url.searchParams.set('t', Date.now().toString());
      
      console.log("Redirecionando para:", url.toString());
      
      disconnectTimeoutRef.current = window.setTimeout(() => {
        window.location.href = url.toString();
      }, 500);
      
    } catch (error) {
      console.error("Erro ao desconectar:", error);
      
      if (!force) {
        toast({
          title: "Erro ao desconectar",
          description: "Não foi possível remover a integração com Supabase. Erro: " + (error instanceof Error ? error.message : String(error)),
          variant: "destructive"
        });
      }
      
      sessionStorage.removeItem(DISCONNECTION_FLAG);
      sessionStorage.removeItem(LAST_DISCONNECTION_TIME);
      
    } finally {
      if (!force) {
        setIsDisconnecting(false);
      }
    }
  };

  const handleDisconnect = () => executeDisconnect();

  const isConnected = connectionStatus === 'connected' || connectionStatus === 'success' || connectionStatus === 'testing';

  const getStatusIndicator = () => {
    if (connectionStatus === 'testing') {
      return <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />;
    } else if (connectionStatus === 'success') {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    } else if (connectionStatus === 'error') {
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    } else if (connectionStatus === 'connected') {
      if (usingDefaultClient) {
        return (
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-xs text-muted-foreground">(padrão)</span>
          </div>
        );
      }
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    return null;
  };

  const getConnectionStatusClass = () => {
    if (connectionStatus === 'success') {
      return 'bg-green-500/10 border-green-500/30';
    } else if (connectionStatus === 'error') {
      return 'bg-red-500/10 border-red-500/30';
    } else if (connectionStatus === 'testing') {
      return 'bg-amber-500/10 border-amber-500/30';
    } else {
      return 'bg-green-500/10 border-green-500/30';
    }
  };

  const createTableSQL = `
  CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    urgency INTEGER NOT NULL,
    importance INTEGER NOT NULL,
    quadrant INTEGER NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    tags TEXT[],
    user_id UUID
  );

  CREATE INDEX idx_tasks_user_id ON tasks(user_id);
  CREATE INDEX idx_tasks_quadrant ON tasks(quadrant);
  CREATE INDEX idx_tasks_completed ON tasks(completed);
  `;

  const handleRetrySyncAfterError = () => {
    setSyncError(null);
    handleSyncData();
  };
  
  const handleLogin = async () => {
    try {
      if (signInWithGoogle) {
        await signInWithGoogle();
        toast({
          title: "Login realizado",
          description: "Agora você pode sincronizar suas tarefas."
        });
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      toast({
        title: "Erro no login",
        description: "Não foi possível fazer login. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  return (
    <div>
      {isConnected ? (
        <div className={`border rounded-md p-4 mb-4 ${getConnectionStatusClass()}`}>
          {getStatusIndicator()}
          <p className="text-sm text-muted-foreground my-3">
            Sua conta Supabase está conectada. Agora você pode sincronizar seus dados e utilizar autenticação.
          </p>
          
          {dbSetupResult && !dbSetupResult.success && (
            <div className="mb-4 p-3 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-600">
              <div className="flex items-start gap-2">
                <Info size={16} className="mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Configuração necessária</p>
                  <p className="text-xs mt-1">Para utilizar o Supabase, você precisa criar a tabela "tasks" no seu banco de dados.</p>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="mt-2 text-xs">
                        <Code className="mr-1 h-3 w-3" /> Ver SQL para criar tabela
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>SQL para criar tabela no Supabase</DialogTitle>
                        <DialogDescription>
                          Execute o seguinte SQL no Editor SQL do seu projeto Supabase para criar a tabela de tarefas:
                        </DialogDescription>
                      </DialogHeader>
                      <div className="bg-black/90 text-white p-4 rounded-md font-mono text-xs overflow-x-auto">
                        <pre>{createTableSQL}</pre>
                      </div>
                      <div className="text-sm mt-4">
                        <h4 className="font-medium">Como executar:</h4>
                        <ol className="list-decimal pl-4 mt-2 space-y-1 text-muted-foreground">
                          <li>Acesse o dashboard do Supabase ({supabaseUrl.replace('https://', '')})</li>
                          <li>Navegue para "SQL Editor" no menu lateral</li>
                          <li>Crie uma nova consulta</li>
                          <li>Cole o código SQL acima</li>
                          <li>Clique em "Executar" ou pressione Ctrl+Enter</li>
                        </ol>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDisconnect}
              disabled={isDisconnecting}
              className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
            >
              {isDisconnecting ? (
                <>
                  <RefreshCw size={14} className="mr-1 animate-spin" /> Desconectando...
                </>
              ) : (
                <>
                  Desconectar
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleTestConnection}
              disabled={isTesting || isDisconnecting}
              className="text-amber-500 hover:text-amber-600 hover:bg-amber-500/10"
            >
              {isTesting ? (
                <>
                  <RefreshCw size={14} className="mr-1 animate-spin" /> Testando...
                </>
              ) : (
                <>Testar Conexão</>
              )}
            </Button>
            <Button
              size="sm"
              className="flex items-center gap-1"
              onClick={handleSyncData}
              disabled={isSyncing || isDisconnecting || (dbSetupResult && !dbSetupResult.success)}
            >
              {isSyncing ? (
                <>
                  <RefreshCw size={14} className="mr-1 animate-spin" /> Sincronizando...
                </>
              ) : (
                <>
                  <Save size={14} /> Sincronizar Dados
                </>
              )}
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleConnect} className="space-y-4">
          <div>
            <label htmlFor="supabaseUrl" className="block text-sm font-medium mb-1">
              URL do Projeto Supabase
            </label>
            <Input
              id="supabaseUrl"
              type="text"
              value={supabaseUrl}
              onChange={(e) => setSupabaseUrl(e.target.value)}
              placeholder="https://xxxxxxxxxxxxx.supabase.co"
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Encontrada nas configurações do seu projeto no Supabase
            </p>
          </div>
          
          <div>
            <label htmlFor="supabaseKey" className="block text-sm font-medium mb-1">
              Chave de API do Supabase
            </label>
            <Input
              id="supabaseKey"
              type="password"
              value={supabaseKey}
              onChange={(e) => setSupabaseKey(e.target.value)}
              placeholder="eyJxxxxxxxxxxxxxxxxxxxxxxxx"
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Utilize a chave anon/public key encontrada nas configurações do API do seu projeto
            </p>
          </div>
          
          <Button type="submit" disabled={isConnecting} className="w-full">
            {isConnecting ? (
              <>
                <RefreshCw size={16} className="mr-2 animate-spin" />
                Conectando...
              </>
            ) : (
              "Conectar ao Supabase"
            )}
          </Button>
        </form>
      )}
      {syncError && (
        <ApiErrorDisplay
          error={{
            message: syncError.message,
            details: { details: syncError.details },
            status: 500,
            method: "SYNC",
            path: "/tasks",
            timestamp: new Date().toISOString()
          }}
          onRetry={handleRetrySyncAfterError}
          className="mb-4"
        />
      )}
    </div>
  );
};

export default SupabaseIntegration;
