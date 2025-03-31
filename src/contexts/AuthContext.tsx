import React, { createContext, useState, useEffect, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { auth as firebaseAuth, googleProvider } from '@/utils/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: any | null;
  signUp: (email: string, password: string, nome: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Credenciais para teste
const TEST_EMAIL = 'teste@example.com';
const TEST_PASSWORD = 'senha123';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Configurar o listener de alterações de estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (event === 'SIGNED_IN' && currentSession?.user) {
          // Use setTimeout para evitar deadlocks
          setTimeout(() => {
            fetchProfile(currentSession.user.id);
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
        }
      }
    );

    // Verificar sessão atual ao iniciar
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        fetchProfile(currentSession.user.id);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Erro ao buscar perfil:', error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Erro ao processar perfil:', error);
    }
  };

  const signUp = async (email: string, password: string, nome: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: nome,
          }
        }
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Cadastro realizado",
        description: "Verifique seu e-mail para confirmar seu cadastro.",
      });
      
      // Redireciona para login após cadastro
      navigate('/login');

    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      let mensagem = 'Erro ao criar conta. Tente novamente.';
      
      if (error.message.includes('already registered')) {
        mensagem = 'Este e-mail já está registrado. Tente fazer login.';
      }
      
      toast({
        title: "Erro no cadastro",
        description: mensagem,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Verificar se são as credenciais de teste
      if (email === TEST_EMAIL && password === TEST_PASSWORD) {
        // Criar um usuário de teste simulado
        const testUser = {
          id: 'test-user-id',
          email: TEST_EMAIL,
          user_metadata: {
            full_name: 'Usuário de Teste'
          },
          app_metadata: {},
          created_at: new Date().toISOString()
        };
        
        // Simular uma sessão
        const testSession = {
          access_token: 'test-token',
          refresh_token: 'test-refresh-token',
          expires_in: 3600,
          expires_at: Math.floor(Date.now() / 1000) + 3600,
          user: testUser as unknown as User
        };
        
        // Atualizar o estado da autenticação
        setUser(testUser as unknown as User);
        setSession(testSession as unknown as Session);
        setProfile({
          id: testUser.id,
          full_name: 'Usuário de Teste',
          email: TEST_EMAIL
        });
        
        toast({
          title: "Login de teste realizado",
          description: "Você está usando uma conta de teste"
        });
        
        // Redirecionar para o dashboard em vez da página inicial
        navigate('/dashboard');
        return;
      }
      
      // Login normal com Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      // Redirecionar para o dashboard em vez da página inicial
      navigate('/dashboard');

    } catch (error: any) {
      console.error('Erro no login:', error);
      let mensagem = 'E-mail ou senha incorretos.';
      
      if (error.message.includes('Invalid login')) {
        mensagem = 'E-mail ou senha incorretos.';
      } else if (error.message.includes('Email not confirmed')) {
        mensagem = 'E-mail não confirmado. Verifique sua caixa de entrada.';
      }
      
      toast({
        title: "Erro no login",
        description: mensagem,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      
      // Autenticação com o Google via Firebase
      const result = await signInWithPopup(firebaseAuth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      
      if (!credential) throw new Error('Falha na autenticação');
      
      const user = result.user;
      
      // Integração com o Supabase
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo de volta!"
      });
      
      // Redirecionar para o dashboard em vez da página inicial
      navigate('/dashboard');
      
    } catch (error: any) {
      console.error('Erro no login com Google:', error);
      
      toast({
        title: "Erro no login com Google",
        description: "Não foi possível fazer login com o Google. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      // Verificar se é usuário de teste
      if (user?.email === TEST_EMAIL) {
        // Limpar estado para usuário de teste
        setUser(null);
        setSession(null);
        setProfile(null);
        navigate('/login');
        return;
      }
      
      // Logout normal do Supabase
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      toast({
        title: "Erro ao desconectar",
        description: "Ocorreu um erro ao tentar desconectar.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const value = {
    session,
    user,
    profile,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
