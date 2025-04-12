
import React, { useState } from 'react';
import { Bot, Send, Sparkles, X } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';

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
    } catch (error) {
      console.error('Erro ao processar solicitação de IA:', error);
      toast({
        title: "Erro ao processar",
        description: "Ocorreu um erro ao processar sua solicitação.",
        variant: "destructive"
      });
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
    
    setIsConfigured(true);
    toast({
      title: "API configurada",
      description: "Sua API key foi configurada com sucesso!",
    });
  };
  
  const clearResponses = () => {
    setResponses([]);
    toast({
      title: "Histórico limpo",
      description: "Todas as respostas foram removidas.",
    });
  };

  return (
    <div className="space-y-6">
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
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                placeholder="O que você gostaria de perguntar?"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isLoading}
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading || !prompt.trim()}>
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
