// Script para testar a configuração do Firebase
const { initializeApp } = require('firebase/app');
const { getAuth, GoogleAuthProvider } = require('firebase/auth');
require('dotenv').config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

console.log('🔧 Testando configuração do Firebase...');
console.log('📋 Configurações carregadas:');
console.log('- API Key:', firebaseConfig.apiKey ? '✅ Definida' : '❌ Não definida');
console.log('- Auth Domain:', firebaseConfig.authDomain ? '✅ Definida' : '❌ Não definida');
console.log('- Project ID:', firebaseConfig.projectId ? '✅ Definida' : '❌ Não definida');
console.log('- Storage Bucket:', firebaseConfig.storageBucket ? '✅ Definida' : '❌ Não definida');
console.log('- Messaging Sender ID:', firebaseConfig.messagingSenderId ? '✅ Definida' : '❌ Não definida');
console.log('- App ID:', firebaseConfig.appId ? '✅ Definida' : '❌ Não definida');

try {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const googleProvider = new GoogleAuthProvider();
  
  console.log('\n✅ Firebase inicializado com sucesso!');
  console.log('✅ Auth configurado com sucesso!');
  console.log('✅ Google Provider configurado com sucesso!');
  
  console.log('\n🔍 Detalhes da configuração:');
  console.log('- Project ID:', firebaseConfig.projectId);
  console.log('- Auth Domain:', firebaseConfig.authDomain);
  
} catch (error) {
  console.error('\n❌ Erro ao inicializar Firebase:', error.message);
  console.error('📋 Detalhes do erro:', error);
}