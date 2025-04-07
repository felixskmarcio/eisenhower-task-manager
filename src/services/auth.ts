
import { 
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  Auth,
  AuthError,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { auth, googleProvider } from '@/utils/firebase';
import { toast } from '@/hooks/use-toast';
import { logError, ErrorType } from '@/lib/logError';

// Códigos de erro comuns e suas mensagens amigáveis
const errorMessages: Record<string, string> = {
  'auth/popup-closed-by-user': 'A janela de autenticação foi fechada antes da conclusão.',
  'auth/cancelled-popup-request': 'A operação de login foi cancelada.',
  'auth/popup-blocked': 'O popup de login foi bloqueado pelo navegador.',
  'auth/network-request-failed': 'Falha na conexão de rede. Verifique sua internet.',
  'auth/user-disabled': 'Esta conta de usuário foi desativada.',
  'auth/unauthorized-domain': 'Este domínio não está autorizado para operações de login.',
  'auth/invalid-api-key': 'A chave API do Firebase é inválida.',
  'auth/operation-not-allowed': 'O método de login com Google não está habilitado.',
  'auth/account-exists-with-different-credential': 'Uma conta já existe com o mesmo email mas usando diferentes credenciais.',
  'auth/email-already-in-use': 'Este email já está sendo usado por outra conta.',
  'auth/invalid-email': 'O endereço de email não é válido.',
  'auth/weak-password': 'A senha é muito fraca. Use pelo menos 6 caracteres.',
  'auth/wrong-password': 'Senha incorreta para este email.',
  'auth/user-not-found': 'Não existe usuário com este email.',
  'access_denied': 'Permissão negada. Você não autorizou o acesso ao Google Calendar.'
};

// Criar um novo usuário com email e senha
export const createUserWithEmail = async (email: string, password: string): Promise<User | null> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    return userCredential.user;
  } catch (error) {
    const authError = error as AuthError;
    
    // Registrar no sistema de log
    logError(authError, {
      type: ErrorType.AUTH,
      code: authError.code,
      details: {
        provider: 'email',
        errorInfo: {
          name: authError.name,
          message: authError.message
        }
      },
      context: {
        action: 'createUserWithEmail',
        timestamp: new Date().toISOString()
      }
    });
    
    // Log detalhado no console para desenvolvimento
    console.error('Erro ao criar usuário:', {
      code: authError.code,
      message: authError.message,
      details: authError
    });
    
    // Mensagem amigável para o usuário
    const friendlyMessage = errorMessages[authError.code] || 
                            'Não foi possível criar a conta. Tente novamente.';
    
    toast({
      title: "Erro no Cadastro",
      description: friendlyMessage,
      variant: "destructive"
    });
    
    throw authError;
  }
};

// Fazer login com email e senha
export const signInWithEmail = async (email: string, password: string): Promise<User | null> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    return userCredential.user;
  } catch (error) {
    const authError = error as AuthError;
    
    // Registrar no sistema de log
    logError(authError, {
      type: ErrorType.AUTH,
      code: authError.code,
      details: {
        provider: 'email',
        errorInfo: {
          name: authError.name,
          message: authError.message
        }
      },
      context: {
        action: 'signInWithEmail',
        timestamp: new Date().toISOString()
      }
    });
    
    // Log detalhado no console para desenvolvimento
    console.error('Erro ao fazer login:', {
      code: authError.code,
      message: authError.message,
      details: authError
    });
    
    // Mensagem amigável para o usuário
    const friendlyMessage = errorMessages[authError.code] || 
                            'Não foi possível fazer login. Verifique seu email e senha.';
    
    toast({
      title: "Erro no Login",
      description: friendlyMessage,
      variant: "destructive"
    });
    
    throw authError;
  }
};

export const signInWithGoogle = async (): Promise<User | null> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;
    
    if (token) {
      localStorage.setItem('googleAccessToken', token);
    }
    
    return result.user;
  } catch (error) {
    const authError = error as AuthError;
    
    // Registrar no sistema de log
    logError(authError, {
      type: ErrorType.AUTH,
      code: authError.code,
      details: {
        provider: 'google',
        errorInfo: {
          name: authError.name,
          message: authError.message
        }
      },
      context: {
        action: 'signInWithGoogle',
        timestamp: new Date().toISOString()
      }
    });
    
    // Log detalhado no console para desenvolvimento
    console.error('Erro de autenticação Google:', {
      code: authError.code,
      message: authError.message,
      details: authError
    });
    
    // Mensagem amigável para o usuário
    const friendlyMessage = errorMessages[authError.code] || 
                            'Não foi possível fazer login com o Google.';
    
    toast({
      title: "Erro na Conexão",
      description: friendlyMessage,
      variant: "destructive"
    });
    
    throw authError;
  }
};

export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
    localStorage.removeItem('googleAccessToken');
  } catch (error) {
    const authError = error as Error;
    
    // Registrar no sistema de log
    logError(authError, {
      type: ErrorType.AUTH,
      code: 'auth/sign-out-error',
      context: {
        action: 'signOut',
        timestamp: new Date().toISOString()
      }
    });
    
    console.error('Erro ao fazer logout:', authError);
    throw error;
  }
};

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

export const getAccessToken = (): string | null => {
  return localStorage.getItem('googleAccessToken');
};

// Função auxiliar para monitorar mudanças no estado de autenticação
export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
