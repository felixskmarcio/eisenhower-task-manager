import React, { createContext, useState, useEffect, useContext } from 'react';
import { User } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { 
  signInWithGoogle,
  signInWithEmail,
  createUserWithEmail, 
  signOut as authSignOut,
  getCurrentUser,
  subscribeToAuthChanges,
  resetPassword as authResetPassword,
  verifyCredentials,
  checkIfUserExists,
  handleRedirectResult
} from '@/services/auth';

interface AuthContextType {
  user: User | null;
  profile: any | null;
  signUp: (email: string, password: string, nome: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  verifyUserCredentials: (email: string, password: string) => Promise<{valid: boolean, message: string}>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TEST_EMAIL = 'teste@example.com';
const TEST_PASSWORD = 'senha123';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Buscando perfil para o usuário ID:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data && !error) {
        console.log('Perfil encontrado no Supabase:', data);
        setProfile(data);
        return;
      }

      const currentUser = getCurrentUser();
      if (currentUser) {
        console.log('Usando dados do perfil do Firebase:', {
          id: currentUser.uid,
          displayName: currentUser.displayName,
          email: currentUser.email
        });
        setProfile({
          id: currentUser.uid,
          nome: currentUser.displayName || 'Usuário',
          email: currentUser.email,
          foto_url: currentUser.photoURL
        });
      }
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
    }
  };

  useEffect(() => {
    console.log('AuthProvider: Inicializando...');
    
    // Verificar se há sessão do Supabase
    const checkSupabaseSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          console.log('Sessão do Supabase encontrada:', session);
          // Aqui você pode definir o usuário a partir da sessão do Supabase
          const supabaseUser = session.user;
          if (supabaseUser) {
            console.log('Usuário do Supabase:', supabaseUser);
            // Se necessário, adapte o formato do usuário do Supabase para o formato do seu User
            fetchProfile(supabaseUser.id);
          }
        }
      } catch (error) {
        console.error('Erro ao verificar sessão do Supabase:', error);
      }
    };
    
    // Configurar observador de alteração no estado de autenticação do Firebase
    const unsubscribe = subscribeToAuthChanges((currentUser) => {
      console.log('Estado de autenticação alterado:', currentUser ? `Usuário: ${currentUser.email}` : 'Não autenticado');
      setUser(currentUser);
      
      if (currentUser) {
        setTimeout(() => {
          fetchProfile(currentUser.uid);
        }, 0);
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    // Verificar se há resultado de redirecionamento pendente
    const checkRedirectResult = async () => {
      try {
        console.log('🔍 Checking for redirect result...');
        const redirectUser = await handleRedirectResult();
        if (redirectUser) {
          console.log('✅ Redirect login successful:', redirectUser.email);
          // O subscribeToAuthChanges já vai processar o usuário
        }
      } catch (error) {
        console.error('❌ Error handling redirect result:', error);
      }
    };

    // Verificar usuário atual do Firebase
    const currentUser = getCurrentUser();
    if (currentUser) {
      console.log('Usuário já autenticado no Firebase:', currentUser.email);
      setUser(currentUser);
      fetchProfile(currentUser.uid);
    } else {
      console.log('Nenhum usuário autenticado no Firebase, verificando Supabase...');
      checkSupabaseSession();
      checkRedirectResult();
    }
    
    setLoading(false);

    return () => {
      console.log('AuthProvider: Cancelando subscrição de autenticação');
      unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, nome: string) => {
    try {
      console.log('Iniciando processo de cadastro para:', email);
      setLoading(true);
      
      if (email === TEST_EMAIL && password === TEST_PASSWORD) {
        toast({
          title: "Conta de teste",
          description: "Esta é uma conta de teste e não pode ser usada para cadastro.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
      
      const userExists = await checkIfUserExists(email);
      if (userExists) {
        console.log('Usuário já existe:', email);
        toast({
          title: "Email já cadastrado",
          description: "Este email já está sendo usado. Tente fazer login ou recuperar sua senha.",
          variant: "destructive",
          action: (
            <Button variant="outline" onClick={() => navigate('/login', { state: { defaultValues: { email } } })}>
              Ir para login
            </Button>
          )
        });
        setLoading(false);
        return;
      }
      
      // Tentar primeiro no Supabase
      try {
        console.log('Tentando criar usuário no Supabase para:', email);
        const { data: supabaseUser, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              nome: nome
            }
          }
        });
        
        if (error) {
          console.error('Erro ao criar usuário no Supabase:', error);
          throw error;
        }
        
        if (supabaseUser.user) {
          console.log('Usuário criado com sucesso no Supabase, ID:', supabaseUser.user.id);
          setUser(supabaseUser.user as unknown as User);
          
          // O perfil deve ser criado automaticamente pelo trigger
          console.log('Aguardando criação do perfil pelo trigger...');
          
          toast({
            title: "Cadastro realizado",
            description: "Sua conta foi criada com sucesso. Você já está conectado."
          });
          
          navigate('/dashboard');
          return;
        }
      } catch (supabaseError) {
        console.error('Falha ao criar usuário no Supabase, tentando Firebase:', supabaseError);
      }
      
      // Fallback para Firebase se Supabase falhar
      const newUser = await createUserWithEmail(email, password);
      
      if (newUser) {
        console.log('Usuário criado com sucesso no Firebase, ID:', newUser.uid);
        try {
          console.log('Criando perfil no Supabase para usuário do Firebase');
          await supabase.from('profiles').insert({
            id: newUser.uid,
            nome: nome,
            email: email
          });
          console.log('Perfil criado com sucesso no Supabase');
        } catch (error) {
          console.log('Erro ao criar perfil no Supabase:', error);
        }
        
        toast({
          title: "Cadastro realizado",
          description: "Sua conta foi criada com sucesso. Você já está conectado."
        });
        
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      
      if (error.code === 'auth/email-already-in-use') {
        toast({
          title: "Email já cadastrado",
          description: "Este email já está sendo usado. Tente fazer login ou recuperar sua senha.",
          variant: "destructive",
          action: (
            <Button variant="outline" onClick={() => navigate('/login', { state: { defaultValues: { email } } })}>
              Ir para login
            </Button>
          )
        });
      } else {
        toast({
          title: "Erro no cadastro",
          description: error.message || "Ocorreu um erro ao tentar criar sua conta.",
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Iniciando processo de login para:', email);
      setLoading(true);
      
      if (email === TEST_EMAIL && password === TEST_PASSWORD) {
        console.log('Usando credenciais de teste');
        const testUser = {
          uid: 'test-user-id',
          email: TEST_EMAIL,
          displayName: 'Usuário de Teste',
          photoURL: null,
          emailVerified: true,
          isAnonymous: false,
          metadata: {
            creationTime: new Date().toISOString(),
            lastSignInTime: new Date().toISOString()
          },
          providerData: [],
          refreshToken: '',
          tenantId: null,
          delete: () => Promise.resolve(),
          getIdToken: () => Promise.resolve(''),
          getIdTokenResult: () => Promise.resolve({} as any),
          reload: () => Promise.resolve(),
          toJSON: () => ({})
        } as unknown as User;
        
        setUser(testUser);
        setProfile({
          id: testUser.uid,
          nome: 'Usuário de Teste',
          email: TEST_EMAIL
        });
        
        toast({
          title: "Login de teste realizado",
          description: "Você está usando uma conta de teste"
        });
        
        navigate('/dashboard');
        return;
      }
      
      // Tentar login no Supabase primeiro
      try {
        console.log('Tentando login no Supabase para:', email);
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) {
          console.error('Erro no login com Supabase:', error);
          // Se o erro for de credenciais inválidas, lance o erro para ser capturado logo abaixo
          if (error.message?.includes('Invalid login credentials')) {
            const customError = new Error('Credenciais inválidas');
            customError.name = 'AuthError';
            (customError as any).code = 'invalid_credentials';
            (customError as any).message = 'Senha incorreta ou usuário não encontrado';
            throw customError;
          }
        } else if (data.user) {
          console.log('Login com Supabase bem-sucedido para:', email);
          setUser(data.user as unknown as User);
          
          // Buscar perfil
          fetchProfile(data.user.id);
          
          toast({
            title: "Login realizado",
            description: "Bem-vindo de volta!"
          });
          
          navigate('/dashboard');
          return;
        }
      } catch (supabaseError: any) {
        console.error('Falha no login com Supabase:', supabaseError);
        throw supabaseError; // Relanç0a o erro para ser capturado
      }
      
      // Verificar se o usuário existe antes de tentar o login do Firebase
      const userExists = await checkIfUserExists(email);
      if (!userExists) {
        console.log('Usuário não encontrado em nenhum provedor:', email);
        const notFoundError = new Error('Usuário não encontrado');
        (notFoundError as any).code = 'auth/user-not-found';
        (notFoundError as any).message = 'Este email não está cadastrado em nosso sistema';
        throw notFoundError;
      }
      
      // Tentar com Firebase como fallback
      try {
        const loggedUser = await signInWithEmail(email, password);
        
        if (loggedUser) {
          console.log('Login com Firebase bem-sucedido para:', email);
          toast({
            title: "Login realizado",
            description: "Bem-vindo de volta!"
          });
          navigate('/dashboard');
        }
      } catch (firebaseError: any) {
        console.error('Erro no login com Firebase:', firebaseError);
        throw firebaseError;
      }
      
    } catch (error: any) {
      console.error('Erro geral no login:', error);
      throw error; // Relançar o erro para ser capturado pelo componente
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      console.log('Iniciando login com Google via Firebase');
      setLoading(true);
      
      const googleUser = await signInWithGoogle();
      console.log('Usuário retornado do Firebase:', googleUser);
      
      if (googleUser) {
        console.log('Login com Google realizado com sucesso via Firebase, ID:', googleUser.uid);
        
        // Tentar criar/atualizar perfil no Supabase
        try {
          console.log('Criando/atualizando perfil no Supabase para usuário do Google');
          await supabase.from('profiles')
            .upsert({
              id: googleUser.uid,
              nome: googleUser.displayName || 'Usuário Google',
              email: googleUser.email,
              foto_url: googleUser.photoURL
            });
          console.log('Perfil atualizado com sucesso no Supabase');
        } catch (error) {
          console.log('Erro ao atualizar perfil no Supabase:', error);
        }
        
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo de volta!"
        });
        
        navigate('/dashboard');
      } else {
        console.log('Nenhum usuário retornado do Firebase');
      }
      
    } catch (error: any) {
      console.error('Erro detalhado no login Google:', {
        code: error.code,
        message: error.message,
        stack: error.stack,
        fullError: error
      });
      
      // Mensagem de erro mais específica baseada no código
      let errorMessage = "Não foi possível fazer login com o Google. Tente novamente.";
      
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = "A janela de login foi fechada. Tente novamente.";
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = "O popup foi bloqueado pelo navegador. Permita popups e tente novamente.";
      } else if (error.code === 'auth/unauthorized-domain') {
        errorMessage = "Domínio não autorizado. Verifique a configuração do Firebase.";
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = "Login com Google não está habilitado. Verifique a configuração.";
      }
      
      toast({
        title: "Erro no login",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      console.log('Iniciando processo de logout');
      setLoading(true);
      
      if (user?.email === TEST_EMAIL) {
        console.log('Fazendo logout de usuário de teste');
        setUser(null);
        setProfile(null);
        navigate('/login');
        return;
      }
      
      // Tentar logout do Supabase primeiro
      try {
        console.log('Fazendo logout do Supabase');
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.error('Erro ao fazer logout do Supabase:', error);
          // Continuar para logout do Firebase
        } else {
          console.log('Logout do Supabase realizado com sucesso');
        }
      } catch (supabaseError) {
        console.error('Falha completa no logout do Supabase:', supabaseError);
        // Continuar para logout do Firebase
      }
      
      // Sempre fazer logout do Firebase também
      console.log('Fazendo logout do Firebase');
      await authSignOut();
      console.log('Logout realizado com sucesso');
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

  const handleResetPassword = async (email: string) => {
    try {
      console.log('Solicitando redefinição de senha para:', email);
      
      // Tentar com Supabase primeiro
      try {
        console.log('Tentando redefinir senha com Supabase para:', email);
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin + '/reset-password'
        });
        
        if (error) {
          console.error('Erro ao redefinir senha com Supabase:', error);
          // Continuar para tentativa com Firebase
        } else {
          console.log('Email de redefinição enviado com sucesso via Supabase');
          toast({
            title: "Email enviado",
            description: "Instruções para redefinir sua senha foram enviadas para seu email."
          });
          return;
        }
      } catch (supabaseError) {
        console.error('Falha completa na redefinição de senha com Supabase:', supabaseError);
        // Continuar para tentativa com Firebase
      }
      
      // Fallback para Firebase
      await authResetPassword(email);
      console.log('Email de redefinição enviado com sucesso via Firebase');
      toast({
        title: "Email enviado",
        description: "Instruções para redefinir sua senha foram enviadas para seu email."
      });
    } catch (error) {
      console.error('Erro ao solicitar redefinição de senha:', error);
      toast({
        title: "Erro na redefinição",
        description: "Não foi possível enviar o email de redefinição. Verifique o endereço e tente novamente.",
        variant: "destructive"
      });
    }
  };

  const verifyUserCredentials = async (email: string, password: string) => {
    console.log('Verificando credenciais para:', email);
    
    // Tentar verificar no Supabase primeiro
    try {
      console.log('Tentando verificar credenciais no Supabase para:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Erro na verificação de credenciais com Supabase:', error);
        // Não retornar aqui, tentar verificar no Firebase em seguida
      } else if (data.user) {
        console.log('Credenciais válidas no Supabase para:', email);
        return { valid: true, message: 'Credenciais válidas' };
      }
    } catch (supabaseError) {
      console.error('Falha completa na verificação de credenciais com Supabase:', supabaseError);
      // Continuar para tentativa com Firebase
    }
    
    // Fallback para Firebase
    return await verifyCredentials(email, password);
  };

  const value = {
    user,
    profile,
    signUp,
    signIn,
    signInWithGoogle: handleGoogleSignIn,
    signOut: handleSignOut,
    resetPassword: handleResetPassword,
    verifyUserCredentials,
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
