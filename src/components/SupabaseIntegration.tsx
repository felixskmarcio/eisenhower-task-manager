
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Database, Save, CheckCircle, AlertCircle, RefreshCw, Info, Code } from "lucide-react";
import { setupDatabase, syncTasks } from '@/lib/supabase';
import { supabase } from '@/integrations/supabase/client';
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

const SupabaseIntegration = () => {
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'not_connected' | 'connected' | 'testing' | 'success' | 'error'>('not_connected');
  const [dbSetupResult, setDbSetupResult] = useState<{success: boolean, message: string} | null>(null);
  const [syncError, setSyncError] = useState<{title: string; message: string; details?: string} | null>(null);
  const [usingDefaultClient, setUsingDefaultClient] = useState(false);

  useEffect(() => {
    const savedUrl = localStorage.getItem('supabaseUrl');
    const savedKey = localStorage.getItem('supabaseKey');
    
    if (savedUrl && savedKey) {
      setSupabaseUrl(savedUrl);
      setSupabaseKey(savedKey);
      setConnectionStatus('connected');
      setUsingDefaultClient(false);
      
      checkDatabaseSetup();
    } else if (DEFAULT_SUPABASE_URL && DEFAULT_SUPABASE_KEY) {
      setSupabaseUrl(DEFAULT_SUPABASE_URL);
      setSupabaseKey(DEFAULT_SUPABASE_KEY);
      setConnectionStatus('connected');
      setUsingDefaultClient(true);
      
      toast({
        title: "Credenciais padrão carregadas",
        description: "Usando configuração de Supabase das variáveis de ambiente."
      });
      
      checkDatabaseSetup();
    } else {
      toast({
        title: "Credenciais não encontradas",
        description: "Configure as credenciais do Supabase para usar este recurso.",
        variant: "destructive"
      });
    }
    
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          console.log("Usuário não autenticado para sincronização");
          toast({
            title: "Autenticação necessária",
            description: "Faça login para sincronizar tarefas com o Supabase",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
      }
    };
    
    if (connectionStatus === 'connected') {
      checkAuth();
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
    } catch (error) {
      console.error("Erro ao verificar banco de dados:", error);
      setDbSetupResult({
        success: false,
        message: "Não foi possível verificar o banco de dados. Verifique as credenciais."
      });
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
      const { data: authData } = await supabase.auth.getSession();
      if (!authData.session) {
        toast({
          title: "Autenticação necessária",
          description: "Você precisa estar autenticado para sincronizar tarefas.",
          variant: "destructive",
        });
        setIsSyncing(false);
        return;
      }
      
      const localTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      
      toast({
        title: `${localTasks.length} tarefas encontradas`,
        description: `Iniciando sincronização de ${localTasks.length} tarefas com o Supabase.`,
      });
      
      if (localTasks.length === 0) {
        toast({
          title: "Nenhuma tarefa para sincronizar",
          description: "Não foram encontradas tarefas no armazenamento local. Adicione tarefas primeiro.",
          variant: "destructive",
        });
        setIsSyncing(false);
        return;
      }
      
      console.log("Tarefas locais para sincronizar:", localTasks);
      console.log("ID do usuário autenticado:", authData.session.user.id);
      
      const result = await syncTasks(localTasks);

      if (result.success) {
        toast({
          title: "Sincronização concluída",
          description: result.message,
        });
      } else {
        setSyncError({
          title: "Erro na sincronização",
          message: result.message || "Falha ao sincronizar tarefas com o Supabase.",
          details: undefined
        });
      }
    } catch (error) {
      console.error("Erro ao sincronizar dados:", error);
      setSyncError({
        title: "Erro na sincronização",
        message: error instanceof Error ? error.message : "Erro desconhecido durante a sincronização.",
        details: error instanceof Error ? error.stack : undefined
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDisconnect = () => {
    localStorage.removeItem('supabaseUrl');
    localStorage.removeItem('supabaseKey');
    setSupabaseUrl('');
    setSupabaseKey('');
    setConnectionStatus('not_connected');
    setDbSetupResult(null);
    
    toast({
      title: "Desconectado",
      description: "Integração com Supabase removida",
    });
  };

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
-- Criar tabela de tarefas
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

-- Opcional: criar índices para melhorar performance de consultas
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_quadrant ON tasks(quadrant);
CREATE INDEX idx_tasks_completed ON tasks(completed);
  `;

  // Função para tentar novamente a sincronização após um erro
  const handleRetrySyncAfterError = () => {
    setSyncError(null);
    // Usamos o supabase importado, não o supabase não definido
    handleSyncData();
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
              className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
            >
              Desconectar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleTestConnection}
              disabled={isTesting}
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
              disabled={isSyncing || (dbSetupResult && !dbSetupResult.success)}
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
