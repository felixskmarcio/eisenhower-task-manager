
import React, { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Settings, Moon, Sun, Palette, Calendar, Database, Save, FileText } from "lucide-react";
import MarkdownImport from '@/components/MarkdownImport';
import SupabaseIntegration from '@/components/SupabaseIntegration';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { signInWithGoogle, signOut, getCurrentUser, subscribeToAuthChanges } from '@/services/auth';
import { auth } from '@/utils/firebase';
import { User } from 'firebase/auth';

const SettingsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(getCurrentUser());

  useEffect(() => {
    // Verificar usuário atual ao montar o componente
    const checkUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setIsLoading(false);
    };
    
    checkUser();
    
    // Ativar listener para mudanças de autenticação (opcional)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
        setIsLoading(false);
      }
    );
    
    // Limpeza ao desmontar
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const loadTasks = () => {
      try {
        const storedTasks = localStorage.getItem('tasks');
        if (storedTasks) {
          const parsedTasks = JSON.parse(storedTasks);
          setTasks(parsedTasks);
        }
      } catch (error) {
        console.error('Erro ao carregar tarefas do localStorage:', error);
      }
    };

    loadTasks();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      // Limpar erros anteriores quando tenta novamente
      setGoogleError(null);
      
      const result = await signInWithGoogle();
      
      if (!result.success) {
        throw new Error(result.error instanceof Error ? result.error.message : 'Falha ao conectar com o Google');
      }
      
      toast({
        title: "Login Iniciado",
        description: "Você será redirecionado para a página de login do Google.",
      });
    } catch (error) {
      console.error('Erro no login:', error);
      
      // Capturar detalhes do erro para exibição
      if (error instanceof Error) {
        setGoogleError({
          code: error.name,
          message: error.message || 'Não foi possível fazer login com o Google.',
          details: {
            name: error.name,
            stack: error.stack
          }
        });
      } else {
        setGoogleError({
          message: 'Erro desconhecido durante a autenticação com o Google.'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await signOut();
      toast({
        title: "Logout Realizado",
        description: "Você foi desconectado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao Desconectar",
        description: "Ocorreu um erro ao tentar desconectar.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncComplete = (success: boolean) => {
    console.log('Sync completed:', success);
    // In a real app, you might want to update your state or trigger other actions
  };

  return (
    <div className="min-h-screen bg-base-100 py-8 px-4 sm:px-6 md:px-8 relative">
      {/* Plano de fundo com gradiente e efeito */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-base-100 to-secondary/5"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuMDIiPjwvcmVjdD4KPHBhdGggZD0iTTAgNUw1IDBaTTYgNEw0IDZaTS0xIDFMMSAtMVoiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4=')] opacity-10"></div>
      </div>
      
      <div className="container mx-auto max-w-2xl pt-10 z-10 relative animate-fade-in">
        <div className="flex items-center gap-3 mb-8 border-b pb-4 border-primary/10">
          <Settings className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-primary tracking-tight">Configurações</h1>
        </div>
        
        <Card className="p-6 mb-8 backdrop-blur-sm bg-background/50 border border-primary/10 shadow-lg">
          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2 text-primary/90">
            <Calendar className="h-5 w-5 text-primary" />
            Google Calendar
          </h2>
          <Separator className="my-4" />
          
          <GoogleCalendarSync tasks={tasks} onSync={handleSyncComplete} />
        </Card>
        
        <Card className="p-6 mb-8 backdrop-blur-sm bg-background/50 border border-primary/10 shadow-lg">
          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2 text-primary/90">
            <Database className="h-5 w-5 text-primary" />
            Integração com Supabase
          </h2>
          <Separator className="my-4" />
          
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            Conecte-se ao Supabase para sincronizar dados, utilizar autenticação e armazenamento.
          </p>
          
          <SupabaseIntegration />
        </Card>
        
        <Card className="p-6 mb-8 backdrop-blur-sm bg-background/50 border border-primary/10 shadow-lg">
          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2 text-primary/90">
            <FileText className="h-5 w-5 text-primary" />
            Importar Arquivos Markdown
          </h2>
          <Separator className="my-4" />
          
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            Importe arquivos Markdown (.md ou .markdown) diretamente para a Matriz de Eisenhower.
          </p>
          
          <MarkdownImport />
        </Card>
        
        <Card className="p-6 mb-8 backdrop-blur-sm bg-background/50 border border-primary/10 shadow-lg">
          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2 text-primary/90">
            <Calendar className="h-5 w-5 text-primary" />
            Conta Google
          </h2>
          <Separator className="my-4" />
          
          <div>
            {user ? (
              <div className="bg-green-500/10 border border-green-500/30 rounded-md p-5">
                <div className="flex items-center gap-2 text-green-600 mb-3 font-medium">
                  <Calendar size={18} />
                  <span>Conectado como <span className="font-semibold">{user.email}</span></span>
                </div>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  Sua conta Google está conectada. Você pode usar os recursos de sincronização do calendário.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                >
                  Desconectar
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  Conecte-se com sua conta Google para sincronizar suas tarefas com o Google Calendar.
                </p>
                <Button 
                  onClick={handleGoogleLogin}
                  className="w-full"
                  disabled={isLoading}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {isLoading ? 'Conectando...' : 'Entrar com Google'}
                </Button>
              </div>
            )}
          </div>
        </Card>
        
        <Card className="p-6 backdrop-blur-sm bg-background/50 border border-primary/10 shadow-lg">
          <h2 className="text-xl font-semibold mb-2 text-primary/90">Sobre</h2>
          <Separator className="my-4" />
          <p className="text-sm font-medium mb-3 text-primary/80">
            Gerenciador de Tarefas - Versão 1.0.0
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Um aplicativo de gerenciamento de tarefas que utiliza a Matriz de Eisenhower para ajudar você a priorizar suas atividades de forma eficiente.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
