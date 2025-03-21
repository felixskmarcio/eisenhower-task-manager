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
    console.error('Erro detalhado:', {
      code: authError.code,
      message: authError.message
    });
    throw authError;
  }
};

export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
    localStorage.removeItem('googleAccessToken');
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    throw error;
  }
};

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

// Função auxiliar para monitorar mudanças no estado de autenticação
export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
}; 