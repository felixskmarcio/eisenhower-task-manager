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
  sendPasswordResetEmail,
  getAuth,
  fetchSignInMethodsForEmail
} from 'firebase/auth';
import { auth, googleProvider } from '@/utils/firebase';
import { toast } from '@/hooks/use-toast';
import { logError, ErrorType } from '@/lib/logError';
import { sanitizeInput } from '@/utils/security';
import { applyRateLimit } from '@/utils/rateLimiter';

// Constantes de segurança
const MAX_LOGIN_ATTEMPTS = 5;  // Máximo de tentativas de login em 1 minuto
const MAX_SIGNUP_ATTEMPTS = 3; // Máximo de tentativas de cadastro em 1 minuto
const MAX_PASSWORD_RESET_ATTEMPTS = 2; // Máximo de tentativas de reset de senha em 1 minuto

// Tentativas de login por IP (simulando - em produção seria controlado pelo servidor)
const loginAttempts: Record<string, number> = {};

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
  'auth/invalid-credential': 'Usuário não encontrado ou senha incorreta. Verifique suas credenciais ou crie uma nova conta.',
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
  // Sanitizar entradas
  const sanitizedEmail = sanitizeInput(email);
  
  // Não sanitizamos a senha para não perder caracteres especiais válidos
  
  return applyRateLimit(
    'auth:signup',
    async () => {
      try {
        // Verificar se o email é válido
        if (!isValidEmail(sanitizedEmail)) {
          throw new Error('auth/invalid-email');
        }
        
        // Verificar força da senha
        if (!isStrongPassword(password)) {
          throw new Error('auth/weak-password');
        }
        
        const userCredential = await createUserWithEmailAndPassword(auth, sanitizedEmail, password);
        
        return userCredential.user;
      } catch (error) {
        const authError = error as AuthError;
        
        // Registrar no sistema de log
        logError(authError, {
          type: ErrorType.AUTH,
          code: authError.code || 'auth/unknown',
          details: {
            provider: 'email',
            errorInfo: {
              name: authError.name || 'Error',
              message: authError.message || 'Erro desconhecido'
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
    },
    MAX_SIGNUP_ATTEMPTS
  );
};

// Fazer login com email e senha
export const signInWithEmail = async (email: string, password: string): Promise<User | null> => {
  // Sanitizar entradas
  const sanitizedEmail = sanitizeInput(email);
  
  return applyRateLimit(
    'auth:login',
    async () => {
      try {
        console.log('Tentando login com email:', sanitizedEmail);
        const userCredential = await signInWithEmailAndPassword(auth, sanitizedEmail, password);
        console.log('Login bem-sucedido para:', sanitizedEmail);
        
        return userCredential.user;
      } catch (error) {
        const authError = error as AuthError;
        
        // Registrar no sistema de log
        logError(authError, {
          type: ErrorType.AUTH,
          code: authError.code || 'auth/unknown',
          details: {
            provider: 'email',
            email: sanitizedEmail,
            errorInfo: {
              name: authError.name || 'Error',
              message: authError.message || 'Erro desconhecido'
            }
          },
          context: {
            action: 'signInWithEmail',
            timestamp: new Date().toISOString()
          }
        });
        
        // Log detalhado no console para desenvolvimento
        console.error('Erro ao fazer login:', {
          email: sanitizedEmail,
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
    },
    MAX_LOGIN_ATTEMPTS
  );
};

export const signInWithGoogle = async (): Promise<User | null> => {
  return applyRateLimit(
    'auth:google',
    async () => {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        
        if (token) {
          // Armazenamos o token em sessionStorage para maior segurança (comparado a localStorage)
          sessionStorage.setItem('googleAccessToken', token);
        }
        
        return result.user;
      } catch (error) {
        const authError = error as AuthError;
        
        // Registrar no sistema de log
        logError(authError, {
          type: ErrorType.AUTH,
          code: authError.code || 'auth/unknown',
          details: {
            provider: 'google',
            errorInfo: {
              name: authError.name || 'Error',
              message: authError.message || 'Erro desconhecido'
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
    },
    MAX_LOGIN_ATTEMPTS
  );
};

export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
    // Limpar dados sensíveis
    sessionStorage.removeItem('googleAccessToken');
    localStorage.removeItem('googleAccessToken'); // Remover também do localStorage para compatibilidade
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
  // Primeiro tenta no sessionStorage (mais seguro)
  const sessionToken = sessionStorage.getItem('googleAccessToken');
  if (sessionToken) return sessionToken;
  
  // Fallback para localStorage (para compatibilidade)
  return localStorage.getItem('googleAccessToken');
};

// Função auxiliar para monitorar mudanças no estado de autenticação
export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export const resetPassword = async (email: string): Promise<void> => {
  // Sanitizar entrada
  const sanitizedEmail = sanitizeInput(email);
  
  return applyRateLimit(
    'auth:reset-password',
    async () => {
      try {
        await sendPasswordResetEmail(auth, sanitizedEmail);
        
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
          code: authError.code || 'auth/unknown',
          details: {
            provider: 'email',
            errorInfo: {
              name: authError.name || 'Error',
              message: authError.message || 'Erro desconhecido'
            }
          },
          context: {
            action: 'resetPassword',
            timestamp: new Date().toISOString()
          }
        });
        
        console.error('Erro ao redefinir senha:', authError);
        
        // Mensagem amigável para o usuário
        const friendlyMessage = errorMessages[authError.code] || 
                              'Não foi possível enviar o email para redefinir a senha.';
        
        toast({
          title: "Erro na Redefinição",
          description: friendlyMessage,
          variant: "destructive"
        });
        
        throw authError;
      }
    },
    MAX_PASSWORD_RESET_ATTEMPTS
  );
};

// Verificar se usuário existe
export const checkIfUserExists = async (email: string): Promise<boolean> => {
  // Sanitizar entrada
  const sanitizedEmail = sanitizeInput(email);
  
  try {
    console.log('Verificando se usuário existe:', sanitizedEmail);
    const methods = await fetchSignInMethodsForEmail(auth, sanitizedEmail);
    console.log('Métodos de login disponíveis:', methods);
    return methods && methods.length > 0;
  } catch (error) {
    console.error('Erro ao verificar existência do usuário:', error);
    // Em caso de erro, vamos tentar uma abordagem alternativa
    try {
      // Tentar verificar enviando um reset de senha - se não der erro, o usuário existe
      await auth.sendPasswordResetEmail(sanitizedEmail);
      // Se chegou aqui, o usuário existe
      return true;
    } catch (fallbackError: any) {
      // Se o erro for auth/user-not-found, o usuário não existe
      if (fallbackError.code === 'auth/user-not-found') {
        return false;
      }
      // Para outros erros, assumimos que não conseguimos determinar com certeza
      console.error('Erro na verificação alternativa:', fallbackError);
      return false;
    }
  }
};

// Função auxiliar para verificação de credenciais
export const verifyCredentials = async (email: string, password: string): Promise<{valid: boolean, message: string}> => {
  // Sanitizar entrada
  const sanitizedEmail = sanitizeInput(email);
  
  return applyRateLimit(
    'auth:verify-credentials',
    async () => {
      try {
        console.log('Verificando credenciais para:', sanitizedEmail);
        const userCredential = await signInWithEmailAndPassword(auth, sanitizedEmail, password);
        console.log('Credenciais válidas para:', sanitizedEmail);
        return {
          valid: true,
          message: 'Credenciais válidas'
        };
      } catch (error) {
        const authError = error as AuthError;
        console.error('Erro na verificação de credenciais:', {
          email: sanitizedEmail,
          code: authError.code,
          message: authError.message
        });
        
        return {
          valid: false,
          message: errorMessages[authError.code] || 'Credenciais inválidas'
        };
      }
    },
    MAX_LOGIN_ATTEMPTS
  );
};

/**
 * Validar email
 */
const isValidEmail = (email: string): boolean => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
};

/**
 * Verificar força da senha
 * Retorna true se a senha for forte o suficiente
 */
const isStrongPassword = (password: string): boolean => {
  // Mínimo de 6 caracteres (compatível com Firebase)
  if (password.length < 6) return false;
  
  // Verifica se contém pelo menos 2 dos seguintes:
  // - Letras maiúsculas
  // - Letras minúsculas
  // - Números
  // - Caracteres especiais
  let strength = 0;
  
  if (/[A-Z]/.test(password)) strength++; // Tem maiúsculas
  if (/[a-z]/.test(password)) strength++; // Tem minúsculas
  if (/[0-9]/.test(password)) strength++; // Tem números
  if (/[^A-Za-z0-9]/.test(password)) strength++; // Tem caracteres especiais
  
  return strength >= 2;
};
