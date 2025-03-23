import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Database, Import } from "lucide-react";

const NotionImport = () => {
  const [notionToken, setNotionToken] = useState('');
  const [databaseId, setDatabaseId] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!notionToken || !databaseId) {
      toast({
        title: "Campos obrigatórios",
        description: "Token e ID do banco de dados são necessários",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    
    try {
      // Salvar no localStorage para demonstração
      localStorage.setItem('notionToken', notionToken);
      localStorage.setItem('notionDatabaseId', databaseId);
      
      toast({
        title: "Conectado com sucesso!",
        description: "Sua integração com o Notion foi configurada",
      });
    } catch (error) {
      console.error("Erro ao conectar com Notion:", error);
      toast({
        title: "Erro na conexão",
        description: "Não foi possível conectar ao Notion",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    localStorage.removeItem('notionToken');
    localStorage.removeItem('notionDatabaseId');
    setNotionToken('');
    setDatabaseId('');
    
    toast({
      title: "Desconectado",
      description: "Integração com Notion removida",
    });
  };

  const isConnected = Boolean(localStorage.getItem('notionToken') && localStorage.getItem('notionDatabaseId'));

  return (
    <div>
      {isConnected ? (
        <div className="bg-green-500/10 border border-green-500/30 rounded-md p-4 mb-4">
          <div className="flex items-center gap-2 text-green-600 mb-2">
            <Database size={18} />
            <span className="font-medium">Conectado ao Notion</span>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Sua conta Notion está conectada. Você pode importar tarefas do banco de dados configurado.
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
                title: "Importação simulada",
                description: "Em um ambiente real, isso importaria suas tarefas",
              })}
            >
              <Import size={14} /> Importar Tarefas
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleConnect} className="space-y-4">
          <div>
            <label htmlFor="notionToken" className="block text-sm font-medium mb-1">
              Token de Integração Notion
            </label>
            <Input
              id="notionToken"
              type="password"
              value={notionToken}
              onChange={(e) => setNotionToken(e.target.value)}
              placeholder="secret_xxxxxxxxxxxxxxxxxxxxx"
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Encontre seu token em{" "}
              <a 
                href="https://www.notion.so/my-integrations" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Notion Integrations
              </a>
            </p>
          </div>
          
          <div>
            <label htmlFor="databaseId" className="block text-sm font-medium mb-1">
              ID do Banco de Dados
            </label>
            <Input
              id="databaseId"
              value={databaseId}
              onChange={(e) => setDatabaseId(e.target.value)}
              placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-1">
              ID encontrado na URL do seu banco de dados Notion
            </p>
          </div>
          
          <Button type="submit" disabled={isConnecting} className="w-full">
            {isConnecting ? "Conectando..." : "Conectar ao Notion"}
          </Button>
        </form>
      )}
    </div>
  );
};

export default NotionImport;
