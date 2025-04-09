
import React, { createContext, useState, useEffect, useContext } from 'react';
import { User } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
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

// Credenciais para teste
const TEST_EMAIL = 'teste@example.com';
const TEST_PASSWORD = 'senha123';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Função para buscar perfil do usuário
  const fetchProfile = async (userId: string) => {
    try {
      console.log('Buscando perfil para o usuário ID:', userId);
      // Primeiro tentamos obter do Supabase (se integrado)
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

      // Se não encontramos no Supabase ou houver erro, usamos os dados do Firebase
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
    // Configurar listener para mudanças no estado de autenticação do Firebase
    const unsubscribe = subscribeToAuthChanges((currentUser) => {
      console.log('Estado de autenticação alterado:', currentUser ? `Usuário: ${currentUser.email}` : 'Não autenticado');
      setUser(currentUser);
      
      if (currentUser) {
        // Use setTimeout para evitar deadlocks
        setTimeout(() => {
          fetchProfile(currentUser.uid);
        }, 0);
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    // Verificar se já existe um usuário autenticado
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
      
      // Verificar se já existe um usuário com este email
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
      
      // Verificar se são as credenciais de teste
      if (email === TEST_EMAIL && password === TEST_PASSWORD) {
        toast({
          title: "Conta de teste",
          description: "Esta é uma conta de teste e não pode ser usada para cadastro."
        });
        setLoading(false);
        return;
      }
      
      // Cadastrar com Firebase
      console.log('Criando novo usuário no Firebase');
      const newUser = await createUserWithEmail(email, password);
      
      if (newUser) {
        console.log('Usuário criado com sucesso no Firebase, ID:', newUser.uid);
        // Tentar criar perfil no Supabase se estiver integrado
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
      // Mensagem de erro já é mostrada no serviço de autenticação
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Iniciando processo de login para:', email);
      setLoading(true);
      
      // Verificar se são as credenciais de teste
      if (email === TEST_EMAIL && password === TEST_PASSWORD) {
        console.log('Usando credenciais de teste');
        // Criar um usuário de teste simulado
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
        
        // Atualizar o estado da autenticação
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
      
      // Login normal com Firebase
      console.log('Tentando login com Firebase para:', email);
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
      // Mensagem de erro já é mostrada no serviço de autenticação
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      console.log('Iniciando login com Google');
      setLoading(true);
      
      // Autenticação com o Google via Firebase
      const googleUser = await signInWithGoogle();
      
      if (googleUser) {
        console.log('Login com Google bem-sucedido para:', googleUser.email);
        // Tentar criar/atualizar perfil no Supabase se estiver integrado
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
      // Mensagem de erro já é mostrada no serviço de autenticação
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      console.log('Iniciando processo de logout');
      setLoading(true);
      
      // Verificar se é usuário de teste
      if (user?.email === TEST_EMAIL) {
        console.log('Fazendo logout de usuário de teste');
        // Limpar estado para usuário de teste
        setUser(null);
        setProfile(null);
        navigate('/login');
        return;
      }
      
      // Logout normal do Firebase
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

  // Método para verificar as credenciais do usuário
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
