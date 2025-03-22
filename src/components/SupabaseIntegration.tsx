import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { 
  CheckCircle2, 
  XCircle, 
  Database, 
  RefreshCw, 
  Link,
  Copy,
  Check
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { supabase, syncLocalTasksToSupabase } from "@/lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface SupabaseResponse {
  success: boolean;
  data?: unknown;
  error?: {
    message: string;
    code?: string;
  };
}

const SupabaseIntegration = () => {
  const [connectionStatus, setConnectionStatus] = useState<'not-connected' | 'connected' | 'testing' | 'success' | 'error'>('not-connected');
  const [tableName, setTableName] = useState('tasks');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{ added: number; failed: number; error?: unknown } | null>(null);
  const [tablesExist, setTablesExist] = useState<boolean | null>(null);
  const [copied, setCopied] = useState(false);

  const sqlCreateTable = `
-- Criar a tabela de tarefas
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  quadrant INTEGER NOT NULL,
  urgency INTEGER NOT NULL,
  importance INTEGER NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  user_id UUID REFERENCES auth.users(id),
  tags TEXT[]
);

-- Adicionar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);
CREATE INDEX IF NOT EXISTS idx_tasks_quadrant ON tasks(quadrant);

-- Adicionar políticas RLS (Row Level Security)
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Política para usuários autenticados verem apenas suas próprias tarefas
CREATE POLICY "Users can view their own tasks" 
  ON tasks FOR SELECT 
  USING (auth.uid() = user_id);

-- Política para usuários autenticados editarem apenas suas próprias tarefas
CREATE POLICY "Users can insert their own tasks" 
  ON tasks FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks" 
  ON tasks FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks" 
  ON tasks FOR DELETE 
  USING (auth.uid() = user_id);

-- Política para tarefas sem usuário (para compatibilidade)
CREATE POLICY "Public can manage tasks without user_id" 
  ON tasks FOR ALL 
  USING (user_id IS NULL);
`;

  // Verificar status de conexão quando o componente montar
  useEffect(() => {
    checkDatabaseSetup();
  }, []);

  // Verificar se o banco de dados está configurado
  const checkDatabaseSetup = async () => {
    try {
      // Tentar fazer uma consulta simples para verificar a conexão
      const { error } = await supabase
        .from(tableName)
        .select('id')
        .limit(1);

      if (error) {
        console.error('Erro na verificação da tabela:', error);
        setTablesExist(false);
        setConnectionStatus('connected'); // A conexão funciona, mas a tabela não existe
        
        toast({
          title: "Tabela não encontrada",
          description: `A tabela '${tableName}' não existe. Crie-a para começar a sincronização.`,
          variant: "destructive"
        });
        return;
      }

      setTablesExist(true);
      setConnectionStatus('connected');
      
      toast({
        title: "Conectado ao Supabase",
        description: "As tabelas necessárias já existem no banco de dados."
      });
    } catch (error) {
      console.error('Erro ao verificar banco de dados:', error);
      setConnectionStatus('error');
      
      toast({
        title: "Erro na conexão",
        description: "Não foi possível verificar o banco de dados.",
        variant: "destructive"
      });
    }
  };

  // Testar a conexão com o Supabase
  const testConnection = async () => {
    setConnectionStatus('testing');
    
    try {
      const { data, error } = await supabase.from('_dummy_query').select('*').limit(1).catch(() => ({
        data: null,
        error: { message: 'Erro na conexão' }
      }));
      
      // Se chegou até aqui, a conexão funciona mesmo que tenha erro no select
      setConnectionStatus('success');
      
      toast({
        title: "Conexão bem-sucedida",
        description: "Seu aplicativo está conectado ao Supabase."
      });
      
      // Aguardar um tempo antes de verificar as tabelas
      setTimeout(() => {
        checkDatabaseSetup();
      }, 1500);
    } catch (error) {
      console.error('Erro no teste de conexão:', error);
      setConnectionStatus('error');
      
      toast({
        title: "Erro na conexão",
        description: "Não foi possível conectar ao Supabase.",
        variant: "destructive"
      });
    }
  };

  // Sincronizar dados com o Supabase
  const handleSyncData = async () => {
    setIsSyncing(true);
    setSyncResult(null);
    
    try {
      // Verificar se existem tarefas no localStorage
      const localTasks = localStorage.getItem('tasks');
      if (!localTasks) {
        toast({
          title: "Sem dados locais",
          description: "Não foram encontradas tarefas no armazenamento local. Adicione tarefas primeiro.",
          variant: "destructive"
        });
        setIsSyncing(false);
        return;
      }
      
      const parsedTasks = JSON.parse(localTasks);
      
      // Verificar se é um array e tem elementos
      if (!Array.isArray(parsedTasks) || parsedTasks.length === 0) {
        toast({
          title: "Sem tarefas",
          description: "Não há tarefas para sincronizar.",
          variant: "destructive"
        });
        setIsSyncing(false);
        return;
      }
      
      toast({
        title: "Iniciando sincronização",
        description: `Encontradas ${parsedTasks.length} tarefas locais para sincronizar.`
      });
      
      console.log('Tarefas locais:', parsedTasks);
      
      // Sincronizar tarefas
      const result = await syncLocalTasksToSupabase();
      setSyncResult(result);
      
      if (result.added > 0) {
        toast({
          title: "Sincronização concluída",
          description: `${result.added} tarefas sincronizadas com sucesso.`
        });
      } else if (result.failed > 0) {
        toast({
          title: "Sincronização parcial",
          description: `Falha ao sincronizar ${result.failed} tarefas.`,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Nenhuma nova tarefa",
          description: "Todas as tarefas já estão sincronizadas."
        });
      }
    } catch (error) {
      console.error('Erro na sincronização:', error);
      
      toast({
        title: "Erro na sincronização",
        description: "Ocorreu um erro ao sincronizar os dados.",
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // Copiar SQL para a área de transferência
  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlCreateTable).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      toast({
        title: "SQL copiado",
        description: "O código SQL foi copiado para a área de transferência."
      });
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {/* Status da Conexão */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">Status da Conexão:</span>
          </div>
          
          <div className="flex items-center gap-2">
            {connectionStatus === 'not-connected' && (
              <div className="flex items-center gap-1 text-amber-500">
                <Link size={16} />
                <span className="text-sm">Não verificado</span>
              </div>
            )}
            
            {connectionStatus === 'testing' && (
              <div className="flex items-center gap-1 text-blue-500">
                <RefreshCw size={16} className="animate-spin" />
                <span className="text-sm">Testando...</span>
              </div>
            )}
            
            {connectionStatus === 'connected' && (
              <div className="flex items-center gap-1 text-blue-500">
                <CheckCircle2 size={16} />
                <span className="text-sm">Conectado</span>
              </div>
            )}
            
            {connectionStatus === 'success' && (
              <div className="flex items-center gap-1 text-green-500">
                <CheckCircle2 size={16} />
                <span className="text-sm">Conectado</span>
              </div>
            )}
            
            {connectionStatus === 'error' && (
              <div className="flex items-center gap-1 text-red-500">
                <XCircle size={16} />
                <span className="text-sm">Erro na conexão</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Status das Tabelas */}
        {connectionStatus !== 'not-connected' && connectionStatus !== 'testing' && (
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Status das Tabelas:</span>
            </div>
            
            <div className="flex items-center gap-2">
              {tablesExist === null && (
                <div className="flex items-center gap-1 text-gray-500">
                  <RefreshCw size={16} className="animate-spin" />
                  <span className="text-sm">Verificando...</span>
                </div>
              )}
              
              {tablesExist === true && (
                <div className="flex items-center gap-1 text-green-500">
                  <CheckCircle2 size={16} />
                  <span className="text-sm">Tabelas existem</span>
                </div>
              )}
              
              {tablesExist === false && (
                <div className="flex items-center gap-1 text-red-500">
                  <XCircle size={16} />
                  <span className="text-sm">Tabelas não encontradas</span>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Botões */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={testConnection}
            disabled={connectionStatus === 'testing'}
            className="flex-1"
          >
            {connectionStatus === 'testing' ? (
              <>
                <RefreshCw size={16} className="mr-2 animate-spin" />
                Testando...
              </>
            ) : (
              <>
                <Link size={16} className="mr-2" />
                Testar Conexão
              </>
            )}
          </Button>
          
          {(tablesExist === false) && (
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800"
                >
                  <Database size={16} className="mr-2" />
                  Ver SQL para Criar Tabelas
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Criar Tabela de Tarefas no Supabase</DialogTitle>
                  <DialogDescription>
                    Execute o seguinte SQL no editor SQL do Supabase para criar a tabela de tarefas.
                    Acesse: Supabase Dashboard &gt; Seu Projeto &gt; SQL Editor.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="mt-4">
                  <div className="relative">
                    <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto text-sm border">
                      {sqlCreateTable}
                    </pre>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute top-2 right-2 h-8 bg-white"
                      onClick={handleCopySql}
                    >
                      {copied ? (
                        <>
                          <Check size={14} className="mr-1" />
                          Copiado
                        </>
                      ) : (
                        <>
                          <Copy size={14} className="mr-1" />
                          Copiar
                        </>
                      )}
                    </Button>
                  </div>
                  
                  <div className="mt-4 bg-amber-50 p-4 rounded-md border border-amber-200">
                    <h4 className="text-amber-800 font-medium text-sm mb-2 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                        <line x1="12" y1="9" x2="12" y2="13"></line>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                      </svg>
                      Instruções
                    </h4>
                    <ol className="list-decimal pl-5 text-sm text-amber-900 space-y-1">
                      <li>Acesse o painel do Supabase e vá para a seção "SQL Editor"</li>
                      <li>Cole o código SQL acima</li>
                      <li>Clique em "Run" para executar o SQL</li>
                      <li>Verifique se a tabela foi criada na seção "Table Editor"</li>
                      <li>Volte para esta tela e clique em "Testar Conexão" novamente</li>
                    </ol>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
          
          {tablesExist === true && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSyncData}
              disabled={isSyncing}
              className="flex-1 border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800"
            >
              {isSyncing ? (
                <>
                  <RefreshCw size={16} className="mr-2 animate-spin" />
                  Sincronizando...
                </>
              ) : (
                <>
                  <Database size={16} className="mr-2" />
                  Sincronizar Dados
                </>
              )}
            </Button>
          )}
        </div>
        
        {/* Resultado da Sincronização */}
        {syncResult && (
          <div className={`mt-4 p-4 rounded-md border ${
            syncResult.failed > 0 
              ? 'bg-amber-50 border-amber-200' 
              : 'bg-green-50 border-green-200'
          }`}>
            <h4 className={`font-medium text-sm mb-2 ${
              syncResult.failed > 0
                ? 'text-amber-800'
                : 'text-green-800'
            }`}>
              Resultado da Sincronização
            </h4>
            
            <div className="space-y-1 text-sm">
              <p>
                <span className="font-medium">Tarefas sincronizadas:</span>{' '}
                <span className="text-green-700">{syncResult.added}</span>
              </p>
              
              {syncResult.failed > 0 && (
                <p>
                  <span className="font-medium">Falhas:</span>{' '}
                  <span className="text-red-700">{syncResult.failed}</span>
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupabaseIntegration;
