# Configuração do Firebase e Google OAuth

## Problemas Identificados e Soluções

### 1. Erro `auth/popup-blocked`
**Problema:** O navegador está bloqueando popups de autenticação.

**Soluções:**
- Permita popups para `localhost` no seu navegador
- A aplicação agora usa redirecionamento como fallback automático
- Teste em modo incógnito para verificar se extensões estão interferindo

### 2. Erro `auth/api-key-not-valid`
**Problema:** A chave API do Firebase pode estar incorreta ou o projeto não está configurado corretamente.

**Soluções:**
1. **Verificar Firebase Console:**
   - Acesse [Firebase Console](https://console.firebase.google.com/)
   - Selecione o projeto `eisenhower-task-manager-21787`
   - Vá em "Configurações do projeto" > "Geral"
   - Verifique se a chave API está correta

2. **Verificar Google Cloud Console:**
   - Acesse [Google Cloud Console](https://console.cloud.google.com/)
   - Selecione o projeto `eisenhower-task-manager-21787`
   - Vá em "APIs e serviços" > "Credenciais"
   - Verifique se a chave API está ativa e tem as permissões corretas

3. **Verificar domínios autorizados:**
   - No Firebase Console, vá em "Authentication" > "Settings" > "Authorized domains"
   - Adicione `localhost` se não estiver presente
   - Para produção, adicione seu domínio

### 3. Configuração do Google OAuth

**No Google Cloud Console:**
1. Vá em "APIs e serviços" > "Credenciais"
2. Edite o Client ID OAuth 2.0
3. Em "Origens JavaScript autorizadas", adicione:
   - `http://localhost:8080`
   - `http://localhost:8081`
   - `http://localhost:3000`
4. Em "URIs de redirecionamento autorizados", adicione:
   - `http://localhost:8080/__/auth/handler`
   - `http://localhost:8081/__/auth/handler`
   - `http://localhost:3000/__/auth/handler`

### 4. Variáveis de Ambiente

Verifique se todas as variáveis estão definidas no arquivo `.env`:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyCO7Nmkw6HN6p_yepVXUoIsMBBVdfjRt5U
VITE_FIREBASE_AUTH_DOMAIN=eisenhower-task-manager-21787.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=eisenhower-task-manager-21787
VITE_FIREBASE_STORAGE_BUCKET=eisenhower-task-manager-21787.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=397085532279
VITE_FIREBASE_APP_ID=1:397085532279:web:8894a798815888492b2672

# Google Calendar API credentials
VITE_GOOGLE_CLIENT_ID=830556982464-5v8bmo0l98246fti335khm4t1ndifk1t.apps.googleusercontent.com
VITE_GOOGLE_API_KEY=AIzaSyBx9Wz5wJ7UK7SaYjqzA1GQ4w59QYm5qAM
```

### 5. Melhorias Implementadas

✅ **Fallback de Redirecionamento:** Se o popup for bloqueado, a aplicação automaticamente tenta usar redirecionamento

✅ **Logs Detalhados:** Adicionados logs de depuração para identificar problemas

✅ **Tratamento de Erros:** Mensagens de erro mais específicas e amigáveis

✅ **Verificação de Redirecionamento:** A aplicação verifica automaticamente se há resultado de redirecionamento pendente

### 6. Como Testar

1. **Teste no navegador:**
   - Abra `http://localhost:8081`
   - Tente fazer login com Google
   - Verifique o console do navegador para logs detalhados

2. **Teste de configuração:**
   - Abra `test-google-api.html` no navegador
   - Clique em "Testar Autenticação Google"
   - Verifique se há erros específicos

### 7. Próximos Passos

Se os problemas persistirem:

1. **Regenerar chaves API:**
   - No Google Cloud Console, crie uma nova chave API
   - Atualize o arquivo `.env`

2. **Verificar cotas e limites:**
   - Verifique se as APIs estão habilitadas
   - Confirme se não há limites de cota excedidos

3. **Testar em produção:**
   - Configure domínios de produção
   - Teste com HTTPS

### 8. Comandos Úteis

```bash
# Testar configuração do Firebase
node test-firebase-config.cjs

# Iniciar servidor de desenvolvimento
npm run dev

# Verificar variáveis de ambiente
type .env | findstr FIREBASE
type .env | findstr GOOGLE
```