
import { 
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  Auth,
  AuthError,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail
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
  'auth/too-many-requests': 'Muitas tentativas de login. Por favor, tente novamente mais tarde.',
  'auth/invalid-credential': 'As credenciais de autenticação fornecidas são inválidas.',
  'auth/invalid-verification-code': 'O código de verificação fornecido é inválido.',
  'auth/invalid-verification-id': 'O ID de verificação fornecido é inválido.',
  'auth/missing-verification-code': 'O código de verificação está faltando.',
  'auth/missing-verification-id': 'O ID de verificação está faltando.',
  'auth/credential-already-in-use': 'Esta credencial já está associada a uma conta de usuário diferente.',
  'auth/requires-recent-login': 'Esta operação é sensível e requer autenticação recente.',
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
    console.log('Tentando login com email:', email);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('Login bem-sucedido para:', email);
    
    return userCredential.user;
  } catch (error) {
    const authError = error as AuthError;
    
    // Registrar no sistema de log
    logError(authError, {
      type: ErrorType.AUTH,
      code: authError.code,
      details: {
        provider: 'email',
        email: email, // Adicionando o email para ajudar no diagnóstico
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
      email: email,
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

export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
    
    toast({
      title: "E-mail enviado",
      description: "Enviamos um link para redefinição de senha ao seu e-mail.",
      variant: "default"
    });
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
        action: 'resetPassword',
        timestamp: new Date().toISOString()
      }
    });
    
    // Log detalhado no console para desenvolvimento
    console.error('Erro ao enviar e-mail de recuperação:', {
      code: authError.code,
      message: authError.message,
      details: authError
    });
    
    // Mensagem amigável para o usuário
    const friendlyMessage = errorMessages[authError.code] || 
                           'Não foi possível enviar o e-mail de recuperação. Verifique se o e-mail está correto.';
    
    toast({
      title: "Erro ao enviar e-mail",
      description: friendlyMessage,
      variant: "destructive"
    });
    
    throw authError;
  }
};

// Função para verificar se um usuário existe
export const checkUserExists = async (email: string): Promise<boolean> => {
  try {
    // Firebase não possui uma API direta para verificar se um usuário existe
    // Uma abordagem comum é tentar fazer login com uma senha inválida e capturar o erro
    try {
      await signInWithEmailAndPassword(auth, email, 'temporaryPassword123456');
      // Se não lançar erro, o usuário existe e a senha estava correta (improvável com uma senha aleatória)
      return true;
    } catch (error) {
      const authError = error as AuthError;
      if (authError.code === 'auth/wrong-password') {
        // Se o erro for senha incorreta, significa que o usuário existe
        return true;
      } else if (authError.code === 'auth/user-not-found') {
        // Se o erro for usuário não encontrado, significa que o usuário não existe
        return false;
      } else {
        // Para outros erros, logamos e consideramos que não conseguimos verificar
        console.error('Erro ao verificar existência do usuário:', authError);
        return false;
      }
    }
  } catch (error) {
    console.error('Erro na verificação de usuário:', error);
    return false;
  }
};

// Função auxiliar para verificação de credenciais
export const verifyCredentials = async (email: string, password: string): Promise<{valid: boolean, message: string}> => {
  try {
    console.log('Verificando credenciais para:', email);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('Credenciais válidas para:', email);
    return {
      valid: true,
      message: 'Credenciais válidas'
    };
  } catch (error) {
    const authError = error as AuthError;
    console.error('Erro na verificação de credenciais:', {
      email: email,
      code: authError.code,
      message: authError.message
    });
    
    return {
      valid: false,
      message: errorMessages[authError.code] || 'Credenciais inválidas'
    };
  }
};
