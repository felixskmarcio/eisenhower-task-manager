import React, { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Settings, Moon, Sun, Palette, Calendar, Database, Save, FileText } from "lucide-react";
import MarkdownImport from '@/components/MarkdownImport';
import SupabaseIntegration from '@/components/SupabaseIntegration';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { signInWithGoogle, signOut, getCurrentUser, subscribeToAuthChanges } from '@/services/auth';
import { auth } from '@/lib/firebase';
import { User } from 'firebase/auth';

const SettingsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(getCurrentUser());

  useEffect(() => {
    // Monitorar mudanças no estado de autenticação
    const unsubscribe = subscribeToAuthChanges((currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      const user = await signInWithGoogle();
      if (user?.email) {
        toast({
          title: "Login Realizado",
          description: `Conectado como ${user.email}`,
        });
      }
    } catch (error) {
      console.error('Erro no login:', error);
      toast({
        title: "Erro na Conexão",
        description: "Não foi possível fazer login com o Google.",
        variant: "destructive"
      });
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

  return (
    <div className="min-h-screen bg-base-100 py-8 px-4 sm:px-6 md:px-8 relative">
      {/* Plano de fundo com gradiente e efeito */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-base-100 to-secondary/5"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuMDIiPjwvcmVjdD4KPHBhdGggZD0iTTAgNUw1IDBaTTYgNEw0IDZaTS0xIDFMMSAtMVoiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4=')] opacity-10"></div>
      </div>
      
      <div className="container mx-auto max-w-2xl pt-10 z-10 relative animate-fade-in">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-primary">Configurações</h1>
        </div>
        
        <Card className="p-6 mb-6 backdrop-blur-sm bg-background/50 border border-primary/10 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            Integração com Supabase
          </h2>
          <Separator className="my-4" />
          
          <p className="text-sm text-muted-foreground mb-4">
            Conecte-se ao Supabase para sincronizar dados, utilizar autenticação e armazenamento.
          </p>
          
          <SupabaseIntegration />
        </Card>
        
        <Card className="p-6 mb-6 backdrop-blur-sm bg-background/50 border border-primary/10 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Importar Arquivos Markdown
          </h2>
          <Separator className="my-4" />
          
          <p className="text-sm text-muted-foreground mb-4">
            Importe arquivos Markdown (.md ou .markdown) diretamente para a Matriz de Eisenhower.
          </p>
          
          <MarkdownImport />
        </Card>
        
        <Card className="p-6 mb-6 backdrop-blur-sm bg-background/50 border border-primary/10 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Conta Google
          </h2>
          <Separator className="my-4" />
          
          <div>
            {user ? (
              <div className="bg-green-500/10 border border-green-500/30 rounded-md p-4">
                <div className="flex items-center gap-2 text-green-600 mb-2">
                  <Calendar size={18} />
                  <span className="font-medium">Conectado como {user.email}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Sua conta Google está conectada.
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
              <Button 
                onClick={handleGoogleLogin}
                className="w-full"
                disabled={isLoading}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {isLoading ? 'Conectando...' : 'Entrar com Google'}
              </Button>
            )}
          </div>
        </Card>
        
        <Card className="p-6 backdrop-blur-sm bg-background/50 border border-primary/10 shadow-lg">
          <h2 className="text-xl font-semibold mb-2">Sobre</h2>
          <Separator className="my-4" />
          <p className="text-sm text-muted-foreground mb-3">
            Gerenciador de Tarefas - Versão 1.0.0
          </p>
          <p className="text-sm text-muted-foreground">
            Um aplicativo de gerenciamento de tarefas que utiliza a Matriz de Eisenhower para ajudar você a priorizar suas atividades.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
