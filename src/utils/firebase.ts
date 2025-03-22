import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Atualizar as credenciais (verifique no console do Firebase)
const firebaseConfig = {
  apiKey: "AIzaSyCO7Nmkw6HN6p_yepVXUoIsMBBVdfjRt5U",
  authDomain: "eisenhower-task-manager-21787.firebaseapp.com",
  projectId: "eisenhower-task-manager-21787",
  storageBucket: "eisenhower-task-manager-21787.appspot.com",
  messagingSenderId: "397085532279",
  appId: "1:397085532279:web:8894a798815888492b2672",
  measurementId: "G-LTMET95FBS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);
auth.useDeviceLanguage(); // Usar o idioma do dispositivo

// Configure o provedor Google
export const googleProvider = new GoogleAuthProvider();

// Configurações adicionais do provedor
googleProvider.setCustomParameters({
  prompt: 'select_account',
  // Adicionar escopo para o Calendar se necessário
  // scope: 'https://www.googleapis.com/auth/calendar'
});

export default app; 