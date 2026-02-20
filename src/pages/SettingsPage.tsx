import React, { useEffect, useState } from 'react';
import { Card } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { Settings, Moon, Sun, Palette, Calendar as CalendarIcon, Database, Save, User, Key, Bell, ChevronRight, Eye, EyeOff } from "lucide-react";

import SupabaseIntegration from '../components/SupabaseIntegration';
import { Button } from '../components/ui/button';
import { toast } from '../hooks/use-toast';
import { signInWithGoogle, signOut, getCurrentUser, subscribeToAuthChanges } from '../services/auth';
import { auth } from '../utils/firebase';
import { User as FirebaseUser } from 'firebase/auth';
import GoogleCalendarErrorDisplay from '../components/GoogleCalendarErrorDisplay';
import { AuthError } from 'firebase/auth';
import GoogleCalendarSyncButton from '../components/GoogleCalendarSyncButton';
import GoogleCalendarSync from '../components/GoogleCalendarSync/GoogleCalendarSync';

interface Task {
  id: string;
  title: string;
  description?: string;
  quadrant: number;
  completed: boolean;
  dueDate?: string;
  tags?: string[];
}

const SettingsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(getCurrentUser());
  const [googleError, setGoogleError] = useState<{ code?: string; message: string; details?: Record<string, unknown> } | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });

    return () => unsubscribe();
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
      setGoogleError(null);

      const user = await signInWithGoogle();
      if (user?.email) {
        toast({
          title: "Login Realizado",
          description: `Conectado como ${user.email}`,
        });
      }
    } catch (error) {
      console.error('Erro no login:', error);

      if (error instanceof Error) {
        const authError = error as AuthError;
        setGoogleError({
          code: 'code' in authError ? authError.code as string : undefined,
          message: authError.message || 'Não foi possível fazer login com o Google.',
          details: {
            name: authError.name,
            stack: authError.stack,
            ...(('customData' in authError && authError.customData) ? { customData: authError.customData } : {})
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

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-300 font-sans selection:bg-[#ccff00] selection:text-black py-8 px-4 sm:px-6 md:px-8 relative">
      <div className="container mx-auto max-w-2xl pt-4 animate-in fade-in duration-500">
        <div className="flex items-center gap-3 mb-8 border-b border-zinc-800 pb-4">
          <div className="p-2 bg-[#ccff00]/10 rounded-none border border-[#ccff00]/20">
            <Settings className="h-6 w-6 text-[#ccff00]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight uppercase">Configurações</h1>
            <p className="text-[10px] text-[#ccff00] font-mono tracking-widest uppercase">SYSTEM.CONFIG</p>
          </div>
        </div>

        <Card className="p-6 mb-8 bg-zinc-900 border-zinc-800 rounded-none shadow-none">
          <h2 className="text-lg font-bold mb-2 flex items-center gap-2 text-white uppercase tracking-wide">
            <Database className="h-4 w-4 text-[#ccff00]" />
            Integração com Supabase
          </h2>
          <Separator className="my-4 bg-zinc-800" />

          <p className="text-sm text-zinc-400 mb-6 leading-relaxed font-mono">
            &gt; Conecte-se ao Supabase para sincronizar dados, utilizar autenticação e armazenamento.
          </p>

          <SupabaseIntegration />
        </Card>


        <Card className="p-6 mb-8 bg-zinc-900 border-zinc-800 rounded-none shadow-none">
          <h2 className="text-lg font-bold mb-2 flex items-center gap-2 text-white uppercase tracking-wide">
            <CalendarIcon className="h-4 w-4 text-[#ccff00]" />
            Conta Google
          </h2>
          <Separator className="my-4 bg-zinc-800" />

          <div>
            {googleError && (
              <div className="mb-4">
                <GoogleCalendarErrorDisplay
                  error={googleError}
                  onRetry={() => handleGoogleLogin()}
                />
              </div>
            )}

            {user ? (
              <div className="bg-black/40 border border-zinc-800 p-5 rounded-none">
                <div className="flex items-center gap-2 text-[#ccff00] mb-3 font-medium font-mono text-sm">
                  <CalendarIcon size={16} />
                  <span>Conectado como <span className="font-bold text-white">{user.email}</span></span>
                </div>
                <p className="text-xs text-zinc-500 mb-4 leading-relaxed font-mono uppercase">
                  STATUS: ONLINE | SYNC: ENABLED
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="rounded-none border-red-900/50 text-red-500 hover:text-red-400 hover:bg-red-950/30 hover:border-red-500/50 transition-all uppercase text-xs font-bold tracking-wider"
                >
                  Desconectar
                </Button>
                {user && (
                  <div className="mt-4 pt-4 border-t border-zinc-800">
                    <h4 className="text-xs font-bold mb-3 text-white uppercase tracking-wider">Sincronização Calendar</h4>
                    <p className="text-xs text-zinc-400 mb-3 font-mono">
                      &gt; Sincronize tarefas locais com Google Calendar.
                    </p>

                    <GoogleCalendarSyncButton
                      tasks={tasks}
                      className="w-full mt-2"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-zinc-400 mb-4 leading-relaxed font-mono">
                  &gt; Conecte sua conta Google para habilitar sincronização.
                </p>
                <Button
                  onClick={handleGoogleLogin}
                  className="w-full bg-[#ccff00] text-black hover:bg-[#b0dd00] rounded-none font-bold uppercase tracking-wider border-none h-12"
                  disabled={isLoading}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {isLoading ? 'Conectando...' : 'Entrar com Google'}
                </Button>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6 bg-zinc-900 border-zinc-800 rounded-none shadow-none">
          <h2 className="text-lg font-bold mb-2 text-white uppercase tracking-wide">Sobre</h2>
          <Separator className="my-4 bg-zinc-800" />
          <p className="text-xs font-bold mb-3 text-[#ccff00] font-mono">
            VERSION 1.3.0 :: BUILD 2024
          </p>
          <p className="text-sm text-zinc-400 leading-relaxed max-w-prose">
            Um sistema de gerenciamento de tarefas tático baseado na Matriz de Eisenhower para priorização de alta eficiência.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
