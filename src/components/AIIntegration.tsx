
import React, { useState, useEffect } from 'react';
import { Bot, Send, Sparkles, X, AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import ErrorDisplay from '@/components/ErrorDisplay';
import { logError, ErrorType } from '@/lib/logError';

interface AIResponse {
  text: string;
  timestamp: string;
}

const AIIntegration = () => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [responses, setResponses] = useState<AIResponse[]>([]);
  const [apiKey, setApiKey] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  // Verificar se a chave da API está armazenada localmente
  useEffect(() => {
    try {
      const storedApiKey = localStorage.getItem('ai_api_key');
      if (storedApiKey) {
        setApiKey(storedApiKey);
        setIsConfigured(true);
        
        // Carregar histórico de respostas salvas
        const storedResponses = localStorage.getItem('ai_responses');
        if (storedResponses) {
          try {
            setResponses(JSON.parse(storedResponses));
          } catch (error) {
            console.error('Erro ao carregar histórico de respostas:', error);
          }
        }
      }
    } catch (error) {
      console.error('Erro ao carregar configurações da IA:', error);
    }
  }, []);

  // Salvar respostas quando houver mudanças
  useEffect(() => {
    if (responses.length > 0) {
      try {
        localStorage.setItem('ai_responses', JSON.stringify(responses));
      } catch (error) {
        console.error('Erro ao salvar histórico de respostas:', error);
      }
    }
  }, [responses]);

  const checkInternetConnection = (): Promise<boolean> => {
    return new Promise((resolve) => {
      // Usar um endpoint confiável para verificar a conexão
      fetch('https://www.google.com', { 
        mode: 'no-cors',
        cache: 'no-cache',
        method: 'HEAD'
      })
        .then(() => {
          setConnectionError(null);
          resolve(true);
        })
        .catch(() => {
          setConnectionError('Falha na conexão de rede. Verifique sua internet.');
          resolve(false);
        });
    });
  };

  const handleRetryConnection = async () => {
    setIsRetrying(true);
    const isConnected = await checkInternetConnection();
    setIsRetrying(false);
    
    if (isConnected) {
      toast({
        title: "Conexão restabelecida",
        description: "Sua conexão com a internet está funcionando novamente.",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast({
        title: "O prompt está vazio",
        description: "Por favor, digite algo para enviar para a IA.",
        variant: "destructive"
      });
      return;
    }
    
    if (!isConfigured) {
      toast({
        title: "API não configurada",
        description: "Configure sua API key para usar a integração com IA.",
        variant: "destructive"
      });
      return;
    }
    
    // Verificar conexão com a internet antes de prosseguir
    const isConnected = await checkInternetConnection();
    if (!isConnected) {
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Simulando uma requisição à API
      // Em um caso real, você faria uma requisição para um serviço de IA
      // como OpenAI, Perplexity, etc.
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockResponse = {
        text: `Resposta para: "${prompt}"\n\nEsta é uma demonstração da integração com IA. Em uma implementação real, este texto viria de uma API de IA como OpenAI ou similar.`,
        timestamp: new Date().toLocaleTimeString()
      };
      
      setResponses(prev => [mockResponse, ...prev]);
      setPrompt('');
      setConnectionError(null); // Limpar erro de conexão se tudo der certo
    } catch (error) {
      console.error('Erro ao processar solicitação de IA:', error);
      
      // Verificar se é um erro de conexão
      await checkInternetConnection();
      
      if (!connectionError) {
        // Se não for problema de conexão, mostrar erro genérico
        toast({
          title: "Erro ao processar",
          description: "Ocorreu um erro ao processar sua solicitação.",
          variant: "destructive"
        });
        
        logError(error instanceof Error ? error : new Error(String(error)), {
          type: ErrorType.API,
          context: { component: 'AIIntegration', action: 'handleSubmit' }
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleConfigure = () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key vazia",
        description: "Por favor, forneça uma API key válida.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Salvar a chave da API localmente
      localStorage.setItem('ai_api_key', apiKey);
      
      setIsConfigured(true);
      toast({
        title: "API configurada",
        description: "Sua API key foi configurada com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao salvar API key:', error);
      toast({
        title: "Erro de armazenamento",
        description: "Não foi possível salvar sua API key. Verifique as permissões do navegador.",
        variant: "destructive"
      });
    }
  };
  
  const clearResponses = () => {
    setResponses([]);
    localStorage.removeItem('ai_responses');
    toast({
      title: "Histórico limpo",
      description: "Todas as respostas foram removidas.",
    });
  };

  const resetConfiguration = () => {
    if (window.confirm("Tem certeza que deseja remover sua API key? Você precisará configurá-la novamente para usar a IA.")) {
      localStorage.removeItem('ai_api_key');
      setApiKey('');
      setIsConfigured(false);
      toast({
        title: "Configuração removida",
        description: "Sua API key foi removida com sucesso.",
      });
    }
  };

  return (
    <div className="space-y-6">
      {connectionError && (
        <Card className="p-4 bg-red-500/10 border border-red-500/30 shadow">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-700 dark:text-red-400">
                Problema de conexão
              </h3>
              <p className="text-sm mt-1 text-red-600/90 dark:text-red-300/90">
                {connectionError}
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2 bg-white/50 text-red-600 border-red-200 hover:bg-white"
                onClick={handleRetryConnection}
                disabled={isRetrying}
              >
                {isRetrying ? (
                  <>
                    <div className="h-3 w-3 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    Verificando...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-3 w-3 mr-2" />
                    Tentar novamente
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>
      )}
      
      {!isConfigured ? (
        <Card className="p-6 backdrop-blur-sm bg-background/50 border border-primary/10 shadow-lg">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            Configurar Integração com IA
          </h3>
          
          <p className="text-sm text-muted-foreground mb-4">
            Conecte-se a um serviço de IA para melhorar seu gerenciamento de tarefas com assistência inteligente.
          </p>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="api-key" className="text-sm font-medium block mb-1">
                API Key
              </label>
              <Input
                id="api-key"
                type="password"
                placeholder="sk-xxxxxxxxxxxxxxxxxxxx"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Insira sua chave de API para serviços como OpenAI, Perplexity, Gemini, etc.
              </p>
            </div>
            
            <Button onClick={handleConfigure} className="w-full">
              <Sparkles className="mr-2 h-4 w-4" />
              Configurar API
            </Button>
          </div>
        </Card>
      ) : (
        <>
          <Card className="p-6 backdrop-blur-sm bg-background/50 border border-primary/10 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                Assistente IA
              </h3>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearResponses}
                  disabled={responses.length === 0}
                >
                  <X className="h-4 w-4 mr-1" />
                  Limpar
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetConfiguration}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  Resetar API
                </Button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                placeholder="O que você gostaria de perguntar?"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isLoading || !!connectionError}
                className="flex-1"
              />
              <Button 
                type="submit" 
                disabled={isLoading || !prompt.trim() || !!connectionError}
              >
                {isLoading ? (
                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                Enviar
              </Button>
            </form>
          </Card>
          
          {responses.length > 0 && (
            <Card className="p-6 backdrop-blur-sm bg-background/50 border border-primary/10 shadow-lg">
              <h4 className="text-sm font-semibold mb-4">Histórico de Respostas</h4>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {responses.map((response, index) => (
                  <div key={index} className="space-y-2">
                    <div className="bg-primary/5 p-4 rounded-lg text-sm">
                      <p className="whitespace-pre-line">{response.text}</p>
                      <div className="mt-2 text-xs text-muted-foreground">
                        {response.timestamp}
                      </div>
                    </div>
                    {index < responses.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default AIIntegration;
