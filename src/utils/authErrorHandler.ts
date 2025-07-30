/**
 * Utilitários para tratamento e normalização de erros de autenticação
 * Fornece funções type-safe para lidar com erros de diferentes provedores
 */

import {
  AuthErrorCode,
  NormalizedAuthError,
  ValidationResult,
  EmailValidation,
  PasswordValidation,
  AUTH_CONSTANTS,
  AUTH_ERROR_MESSAGES,
  isValidEmail,
  isValidPassword
} from '@/types/auth';

/**
 * Normaliza erros de autenticação de diferentes provedores
 * @param error - Erro original do Supabase, Firebase ou outro provedor
 * @returns Erro normalizado com código e mensagem padronizados
 */
export const normalizeAuthError = (error: any): NormalizedAuthError => {
  console.error('Erro original:', error);
  
  // Mapear erros do Supabase
  if (error?.message?.includes('Invalid login credentials')) {
    return {
      code: 'invalid_credentials',
      message: AUTH_ERROR_MESSAGES.invalid_credentials.pt,
      originalError: error
    };
  }
  
  if (error?.message?.includes('Email not confirmed')) {
    return {
      code: 'email_not_confirmed',
      message: AUTH_ERROR_MESSAGES.email_not_confirmed.pt,
      originalError: error
    };
  }
  
  if (error?.message?.includes('User not found')) {
    return {
      code: 'user_not_found',
      message: AUTH_ERROR_MESSAGES.user_not_found.pt,
      originalError: error
    };
  }
  
  // Mapear erros do Firebase
  const firebaseErrorMap: Record<string, AuthErrorCode> = {
    'auth/user-not-found': 'user_not_found',
    'auth/wrong-password': 'invalid_credentials',
    'auth/invalid-credential': 'invalid_credentials',
    'auth/too-many-requests': 'too_many_requests',
    'auth/email-already-in-use': 'invalid_credentials',
    'auth/weak-password': 'invalid_credentials',
    'auth/popup-closed-by-user': 'unknown_error',
    'auth/popup-blocked': 'unknown_error',
    'auth/unauthorized-domain': 'unknown_error',
    'auth/operation-not-allowed': 'unknown_error'
  };
  
  if (error?.code && firebaseErrorMap[error.code]) {
    const normalizedCode = firebaseErrorMap[error.code];
    return {
      code: normalizedCode,
      message: AUTH_ERROR_MESSAGES[normalizedCode]?.pt || error.message,
      originalError: error
    };
  }
  
  // Erro genérico
  return {
    code: 'unknown_error',
    message: error?.message || AUTH_ERROR_MESSAGES.unknown_error.pt,
    originalError: error
  };
};

/**
 * Valida formato de email
 * @param email - Email a ser validado
 * @returns Resultado da validação com detalhes
 */
export const validateEmail = (email: string): EmailValidation => {
  const errors: string[] = [];
  
  if (!email) {
    errors.push('Email é obrigatório');
  } else if (!email.trim()) {
    errors.push('Email não pode estar vazio');
  } else if (!isValidEmail(email)) {
    errors.push('Formato de email inválido');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    email: email?.trim().toLowerCase()
  };
};

/**
 * Valida senha com critérios de segurança
 * @param password - Senha a ser validada
 * @returns Resultado da validação com força da senha
 */
export const validatePassword = (password: string): PasswordValidation => {
  const errors: string[] = [];
  
  if (!password) {
    errors.push('Senha é obrigatória');
  } else {
    if (password.length < AUTH_CONSTANTS.PASSWORD_MIN_LENGTH) {
      errors.push(`Senha deve ter pelo menos ${AUTH_CONSTANTS.PASSWORD_MIN_LENGTH} caracteres`);
    }
    
    // Verificar força da senha
    let strength: 'weak' | 'medium' | 'strong' = 'weak';
    
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;
    
    const strengthScore = [
      hasLowerCase,
      hasUpperCase,
      hasNumbers,
      hasSpecialChar,
      isLongEnough
    ].filter(Boolean).length;
    
    if (strengthScore >= 4) {
      strength = 'strong';
    } else if (strengthScore >= 2) {
      strength = 'medium';
    }
    
    if (strength === 'weak' && password.length >= AUTH_CONSTANTS.PASSWORD_MIN_LENGTH) {
      errors.push('Senha muito fraca. Use letras maiúsculas, minúsculas, números e símbolos');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    strength: password ? (errors.length === 0 ? 'strong' : 'weak') : undefined
  };
};

/**
 * Valida dados de login
 * @param email - Email do usuário
 * @param password - Senha do usuário
 * @returns Resultado da validação combinada
 */
export const validateLoginData = (email: string, password: string): ValidationResult => {
  const emailValidation = validateEmail(email);
  const passwordValidation = validatePassword(password);
  
  const allErrors = [...emailValidation.errors, ...passwordValidation.errors];
  
  return {
    isValid: allErrors.length === 0,
    errors: allErrors
  };
};

/**
 * Valida dados de cadastro
 * @param email - Email do usuário
 * @param password - Senha do usuário
 * @param nome - Nome do usuário
 * @returns Resultado da validação combinada
 */
export const validateSignUpData = (email: string, password: string, nome: string): ValidationResult => {
  const emailValidation = validateEmail(email);
  const passwordValidation = validatePassword(password);
  const errors = [...emailValidation.errors, ...passwordValidation.errors];
  
  if (!nome || !nome.trim()) {
    errors.push('Nome é obrigatório');
  } else if (nome.trim().length < 2) {
    errors.push('Nome deve ter pelo menos 2 caracteres');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Cria um erro customizado de autenticação
 * @param code - Código do erro
 * @param message - Mensagem personalizada (opcional)
 * @returns Erro normalizado
 */
export const createAuthError = (code: AuthErrorCode, message?: string): NormalizedAuthError => {
  return {
    code,
    message: message || AUTH_ERROR_MESSAGES[code]?.pt || 'Erro de autenticação',
    originalError: null
  };
};

/**
 * Verifica se um erro é de credenciais inválidas
 * @param error - Erro a ser verificado
 * @returns True se for erro de credenciais inválidas
 */
export const isInvalidCredentialsError = (error: NormalizedAuthError): boolean => {
  return error.code === 'invalid_credentials' || 
         error.code === 'auth/invalid-credential' ||
         error.code === 'auth/wrong-password';
};

/**
 * Verifica se um erro é de usuário não encontrado
 * @param error - Erro a ser verificado
 * @returns True se for erro de usuário não encontrado
 */
export const isUserNotFoundError = (error: NormalizedAuthError): boolean => {
  return error.code === 'user_not_found' || 
         error.code === 'auth/user-not-found';
};

/**
 * Verifica se um erro é de muitas tentativas
 * @param error - Erro a ser verificado
 * @returns True se for erro de muitas tentativas
 */
export const isTooManyRequestsError = (error: NormalizedAuthError): boolean => {
  return error.code === 'too_many_requests' || 
         error.code === 'auth/too-many-requests';
};

/**
 * Verifica se um erro é de email não confirmado
 * @param error - Erro a ser verificado
 * @returns True se for erro de email não confirmado
 */
export const isEmailNotConfirmedError = (error: NormalizedAuthError): boolean => {
  return error.code === 'email_not_confirmed';
};

/**
 * Obtém sugestão de ação baseada no tipo de erro
 * @param error - Erro normalizado
 * @returns Sugestão de ação para o usuário
 */
export const getErrorActionSuggestion = (error: NormalizedAuthError): string => {
  switch (error.code) {
    case 'invalid_credentials':
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
      return 'Verifique seu email e senha, ou redefina sua senha.';
    
    case 'user_not_found':
    case 'auth/user-not-found':
      return 'Verifique o email ou crie uma nova conta.';
    
    case 'email_not_confirmed':
      return 'Verifique sua caixa de entrada e confirme seu email.';
    
    case 'too_many_requests':
    case 'auth/too-many-requests':
      return 'Aguarde alguns minutos antes de tentar novamente.';
    
    default:
      return 'Tente novamente ou entre em contato com o suporte.';
  }
};

/**
 * Formata erro para exibição ao usuário
 * @param error - Erro normalizado
 * @param includeCode - Se deve incluir o código do erro
 * @returns String formatada para exibição
 */
export const formatErrorForDisplay = (error: NormalizedAuthError, includeCode = false): string => {
  let message = error.message;
  
  if (includeCode) {
    message += ` (Código: ${error.code})`;
  }
  
  return message;
};

/**
 * Log estruturado de erro de autenticação
 * @param error - Erro normalizado
 * @param context - Contexto adicional
 */
export const logAuthError = (error: NormalizedAuthError, context?: Record<string, any>): void => {
  console.error('Auth Error:', {
    code: error.code,
    message: error.message,
    originalError: error.originalError,
    context,
    timestamp: new Date().toISOString()
  });
};