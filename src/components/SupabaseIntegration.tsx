
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Database, Save } from "lucide-react";

const SupabaseIntegration = () => {
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

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
    
    try {
      // Salvar no localStorage para demonstração
      localStorage.setItem('supabaseUrl', supabaseUrl);
      localStorage.setItem('supabaseKey', supabaseKey);
      
      toast({
        title: "Conectado com sucesso!",
        description: "Sua integração com o Supabase foi configurada",
      });
    } catch (error) {
      console.error("Erro ao conectar com Supabase:", error);
      toast({
        title: "Erro na conexão",
        description: "Não foi possível conectar ao Supabase",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    localStorage.removeItem('supabaseUrl');
    localStorage.removeItem('supabaseKey');
    setSupabaseUrl('');
    setSupabaseKey('');
    
    toast({
      title: "Desconectado",
      description: "Integração com Supabase removida",
    });
  };

  const isConnected = Boolean(localStorage.getItem('supabaseUrl') && localStorage.getItem('supabaseKey'));

  return (
    <div>
      {isConnected ? (
        <div className="bg-green-500/10 border border-green-500/30 rounded-md p-4 mb-4">
          <div className="flex items-center gap-2 text-green-600 mb-2">
            <Database size={18} />
            <span className="font-medium">Conectado ao Supabase</span>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Sua conta Supabase está conectada. Agora você pode sincronizar seus dados e utilizar autenticação.
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDisconnect}
              className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
            >
              Desconectar
            </Button>
            <Button
              size="sm"
              className="flex items-center gap-1"
              onClick={() => toast({
                title: "Sincronização simulada",
                description: "Em um ambiente real, isso sincronizaria seus dados",
              })}
            >
              <Save size={14} /> Sincronizar Dados
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
            {isConnecting ? "Conectando..." : "Conectar ao Supabase"}
          </Button>
        </form>
      )}
    </div>
  );
};

export default SupabaseIntegration;
