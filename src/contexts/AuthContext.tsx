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
  checkUserExists
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

    const currentUser = getCurrentUser();
    if (currentUser) {
      console.log('Usuário já autenticado:', currentUser.email);
      setUser(currentUser);
      fetchProfile(currentUser.uid);
    } else {
      console.log('Nenhum usuário autenticado no início');
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
      
      const userExists = await checkUserExists(email);
      if (userExists) {
        console.log('Usuário já existe:', email);
        toast({
          title: "Email já cadastrado",
          description: "Este email já está sendo usado. Tente fazer login ou recuperar sua senha."
        });
        setLoading(false);
        return;
      }
      
      if (email === TEST_EMAIL && password === TEST_PASSWORD) {
        toast({
          title: "Conta de teste",
          description: "Esta é uma conta de teste e não pode ser usada para cadastro."
        });
        setLoading(false);
        return;
      }
      
      const newUser = await createUserWithEmail(email, password);
      
      if (newUser) {
        console.log('Usuário criado com sucesso no Firebase, ID:', newUser.uid);
        try {
          console.log('Tentando criar perfil no Supabase');
          await supabase.from('profiles').insert({
            id: newUser.uid,
            nome: nome,
            email: email
          });
          console.log('Perfil criado com sucesso no Supabase');
        } catch (error) {
          console.log('Supabase não configurado ou erro ao criar perfil:', error);
        }
        
        toast({
          title: "Cadastro realizado",
          description: "Sua conta foi criada com sucesso. Você já está conectado."
        });
        
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Erro no cadastro:', error);
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
      
      const userExists = await checkUserExists(email);
      if (!userExists) {
        console.log('Usuário não encontrado:', email);
        toast({
          title: "Usuário não encontrado",
          description: "Este email não está cadastrado. Deseja criar uma conta?",
          variant: "destructive",
          action: (
            <Button variant="outline" onClick={() => navigate('/login', { state: { activateSignup: true, email } })}>
              Criar conta
            </Button>
          ),
        });
        setLoading(false);
        return;
      }
      
      const loggedUser = await signInWithEmail(email, password);
      
      if (loggedUser) {
        console.log('Login bem-sucedido para:', email);
        toast({
          title: "Login realizado",
          description: "Bem-vindo de volta!"
        });
        navigate('/dashboard');
      }
      
    } catch (error: any) {
      console.error('Erro no login:', error);
      if (error.code === 'auth/invalid-credential') {
        toast({
          title: "Credenciais inválidas",
          description: "Verifique seu email e senha ou crie uma nova conta se não estiver cadastrado.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      console.log('Iniciando login com Google');
      setLoading(true);
      
      const googleUser = await signInWithGoogle();
      
      if (googleUser) {
        console.log('Login com Google bem-sucedido para:', googleUser.email);
        try {
          console.log('Atualizando perfil no Supabase');
          const { data, error } = await supabase
            .from('profiles')
            .upsert({
              id: googleUser.uid,
              nome: googleUser.displayName,
              email: googleUser.email,
              foto_url: googleUser.photoURL
            });
          console.log('Perfil atualizado com sucesso no Supabase');
        } catch (error) {
          console.log('Supabase não configurado ou erro ao atualizar perfil:', error);
        }
        
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo de volta!"
        });
        
        navigate('/dashboard');
      }
      
    } catch (error: any) {
      console.error('Erro no login com Google:', error);
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
      await authResetPassword(email);
      console.log('Email de redefinição enviado com sucesso');
    } catch (error) {
      console.error('Erro ao solicitar redefinição de senha:', error);
    }
  };

  const verifyUserCredentials = async (email: string, password: string) => {
    console.log('Verificando credenciais para:', email);
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
