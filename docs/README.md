# 📚 Documentação do Task Eagle Eye

Bem-vindo à documentação técnica do Task Eagle Eye! Aqui você encontrará informações detalhadas sobre a arquitetura, segurança e funcionamento interno do projeto.

## 📋 Índice

### 🏗️ Arquitetura e Design
- [**Arquitetura do Sistema**](arquitetura.md) - Visão geral da arquitetura em camadas
- [**Estrutura de Pastas**](#estrutura-de-pastas) - Organização do código
- [**Fluxo de Dados**](#fluxo-de-dados) - Como os dados fluem pela aplicação

### 🛡️ Segurança
- [**Política de Segurança**](SECURITY.md) - Implementações e práticas de segurança
- [**Autenticação**](#autenticação) - Sistema de autenticação e autorização
- [**Proteção de Dados**](#proteção-de-dados) - Como protegemos os dados dos usuários

### 🔌 APIs e Integrações
- [**Google Calendar API**](#google-calendar-api) - Integração com Google Calendar
- [**Notion API**](#notion-api) - Importação de tarefas do Notion
- [**Supabase**](#supabase) - Configuração do banco de dados
- [**Firebase Auth**](#firebase-auth) - Configuração da autenticação

### 🚀 Deploy e Infraestrutura
- [**Guia de Deploy**](#guia-de-deploy) - Como fazer deploy da aplicação
- [**Variáveis de Ambiente**](#variáveis-de-ambiente) - Configurações necessárias
- [**Docker**](#docker) - Containerização da aplicação

### 🧪 Testes e Qualidade
- [**Estratégia de Testes**](#estratégia-de-testes) - Como testamos a aplicação
- [**Linting e Formatação**](#linting-e-formatação) - Padrões de código
- [**Performance**](#performance) - Otimizações implementadas

## 🏗️ Estrutura de Pastas

```
src/
├── components/          # Componentes React reutilizáveis
│   ├── ui/             # Componentes base (shadcn/ui)
│   ├── forms/          # Formulários específicos
│   └── layout/         # Componentes de layout
├── pages/              # Páginas da aplicação
├── hooks/              # Custom hooks React
├── services/           # Serviços e APIs
│   ├── auth/          # Autenticação
│   ├── database/      # Operações de banco
│   └── integrations/  # Integrações externas
├── utils/              # Utilitários e helpers
├── types/              # Definições TypeScript
├── styles/             # Estilos globais
└── config/             # Configurações

docs/
├── README.md           # Este arquivo
├── arquitetura.md      # Documentação da arquitetura
├── SECURITY.md         # Documentação de segurança
└── api/               # Documentação das APIs
```

## 🔄 Fluxo de Dados

### 1. Autenticação
```
Usuário → Firebase Auth → Token JWT → Supabase RLS
```

### 2. Gerenciamento de Tarefas
```
Interface → React State → Supabase → PostgreSQL
                ↓
        Google Calendar (sync)
```

### 3. Importação do Notion
```
Notion API → Parser → Validação → Supabase
```

## 🔐 Autenticação

### Provedores Suportados
- **Email/Senha** - Autenticação tradicional
- **Google** - OAuth 2.0
- **GitHub** - OAuth 2.0 (configurável)
- **Microsoft** - OAuth 2.0 (configurável)

### Fluxo de Autenticação
1. Usuário faz login via Firebase Auth
2. Firebase retorna token JWT
3. Token é enviado para Supabase
4. Supabase valida e aplica RLS
5. Usuário acessa dados protegidos

## 🛡️ Proteção de Dados

### Sanitização
- **DOMPurify** - Sanitização de HTML
- **Zod** - Validação de schemas
- **Rate Limiting** - Proteção contra abuso

### Criptografia
- **HTTPS** obrigatório em produção
- **Tokens JWT** para sessões
- **Row Level Security** no Supabase

## 🔌 Google Calendar API

### Configuração
1. Criar projeto no Google Cloud Console
2. Ativar Google Calendar API
3. Configurar OAuth 2.0
4. Adicionar domínios autorizados

### Funcionalidades
- **Sincronização bidirecional** de tarefas
- **Criação automática** de eventos
- **Atualização em tempo real**
- **Resolução de conflitos**

## 📝 Notion API

### Configuração
1. Criar integração no Notion
2. Obter token de acesso
3. Compartilhar páginas com a integração

### Funcionalidades
- **Importação de páginas** como tarefas
- **Mapeamento de propriedades**
- **Preservação de formatação**
- **Importação em lote**

## 🗄️ Supabase

### Configuração do Banco
```sql
-- Tabelas principais
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  priority INTEGER NOT NULL,
  urgency INTEGER NOT NULL,
  status TEXT DEFAULT 'pending',
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only see their own tasks" ON tasks
  FOR ALL USING (auth.uid() = user_id);
```

### Funcionalidades
- **PostgreSQL** como banco principal
- **Row Level Security** para isolamento
- **Real-time subscriptions**
- **Backup automático**

## 🔥 Firebase Auth

### Configuração
```javascript
// firebase.config.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
```

## 🚀 Guia de Deploy

### Vercel (Recomendado)
1. Conectar repositório GitHub
2. Configurar variáveis de ambiente
3. Deploy automático a cada push

### Netlify
1. Conectar repositório
2. Configurar build command: `npm run build`
3. Configurar publish directory: `dist`

### Docker
```bash
# Build
docker build -t task-eagle-eye .

# Run
docker run -p 3000:80 task-eagle-eye
```

## 🔧 Variáveis de Ambiente

### Obrigatórias
```env
# Firebase
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=

# Supabase
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

### Opcionais
```env
# Google Calendar
VITE_GOOGLE_CLIENT_ID=
VITE_GOOGLE_API_KEY=

# Notion
VITE_NOTION_CLIENT_ID=
VITE_NOTION_CLIENT_SECRET=
```

## 🧪 Estratégia de Testes

### Tipos de Teste
- **Unit Tests** - Jest + React Testing Library
- **Integration Tests** - Cypress
- **E2E Tests** - Playwright
- **Visual Tests** - Chromatic (Storybook)

### Cobertura
- **Componentes** - 90%+
- **Hooks** - 95%+
- **Utilities** - 100%
- **Services** - 85%+

## 📊 Performance

### Otimizações
- **Code Splitting** - Lazy loading de rotas
- **Tree Shaking** - Remoção de código não usado
- **Bundle Analysis** - Análise de tamanho
- **Image Optimization** - Compressão automática
- **Caching** - Service Worker + Cache API

### Métricas
- **First Contentful Paint** < 1.5s
- **Largest Contentful Paint** < 2.5s
- **Cumulative Layout Shift** < 0.1
- **First Input Delay** < 100ms

## 🤝 Contribuindo para a Documentação

Para contribuir com a documentação:

1. **Fork** o repositório
2. **Crie** uma branch: `git checkout -b docs/nova-documentacao`
3. **Edite** os arquivos Markdown
4. **Commit**: `git commit -m 'docs: Add nova documentação'`
5. **Push**: `git push origin docs/nova-documentacao`
6. **Abra** um Pull Request

### Padrões de Documentação
- Use **Markdown** para formatação
- Inclua **exemplos de código** quando relevante
- Mantenha **links atualizados**
- Use **emojis** para melhor legibilidade
- Siga a **estrutura existente**

---

## 📞 Suporte

Para dúvidas sobre a documentação:
- **Issues**: [GitHub Issues](https://github.com/SEU_USERNAME/eisenhower-task-manager/issues)
- **Discussions**: [GitHub Discussions](https://github.com/SEU_USERNAME/eisenhower-task-manager/discussions)

---

<div align="center">
  <p><strong>Documentação mantida pela comunidade</strong> 📚</p>
  <p>Última atualização: Janeiro 2025</p>
</div>