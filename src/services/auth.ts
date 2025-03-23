import { 
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  Auth,
  AuthError
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
  'access_denied': 'Permissão negada. Você não autorizou o acesso ao Google Calendar.'
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