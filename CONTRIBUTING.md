# 🤝 Guia de Contribuição

Obrigado por considerar contribuir para o Task Eagle Eye! Este documento fornece diretrizes e informações sobre como contribuir para o projeto.

## 📋 Índice

- [Código de Conduta](#código-de-conduta)
- [Como Posso Contribuir?](#como-posso-contribuir)
- [Configuração do Ambiente de Desenvolvimento](#configuração-do-ambiente-de-desenvolvimento)
- [Processo de Contribuição](#processo-de-contribuição)
- [Diretrizes de Código](#diretrizes-de-código)
- [Reportando Bugs](#reportando-bugs)
- [Sugerindo Melhorias](#sugerindo-melhorias)
- [Pull Requests](#pull-requests)

## 📜 Código de Conduta

Este projeto e todos os participantes estão sujeitos ao [Código de Conduta](CODE_OF_CONDUCT.md). Ao participar, você concorda em manter este código.

## 🚀 Como Posso Contribuir?

Existem várias maneiras de contribuir para o Task Eagle Eye:

### 🐛 Reportando Bugs
- Use o template de issue para bugs
- Inclua passos para reproduzir o problema
- Forneça informações sobre seu ambiente (OS, browser, versão)

### 💡 Sugerindo Melhorias
- Use o template de issue para feature requests
- Explique claramente o problema que a feature resolveria
- Descreva a solução proposta

### 🔧 Contribuindo com Código
- Correções de bugs
- Implementação de novas features
- Melhorias de performance
- Refatoração de código

### 📚 Melhorando a Documentação
- Corrigindo erros na documentação
- Adicionando exemplos
- Traduzindo documentação

## 🛠️ Configuração do Ambiente de Desenvolvimento

### Pré-requisitos

- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn**
- **Git**

### Configuração Inicial

1. **Fork o repositório**
   ```bash
   # Clique no botão "Fork" no GitHub
   ```

2. **Clone seu fork**
   ```bash
   git clone https://github.com/felixskmarcio/eisenhower-task-manager
   cd eisenhower-task-manager
   ```

3. **Adicione o repositório original como upstream**
   ```bash
   git remote add upstream https://github.com/felixskmarcio/eisenhower-task-manager
   ```

4. **Instale as dependências**
   ```bash
   npm install
   ```

5. **Configure as variáveis de ambiente**
   ```bash
   cp .env.example .env
   # Edite o arquivo .env com suas credenciais
   ```

6. **Inicie o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

### Configuração dos Serviços

#### Firebase
1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
2. Ative Authentication e configure os provedores desejados
3. Copie as credenciais para o arquivo `.env`

#### Supabase
1. Crie um projeto no [Supabase](https://supabase.com/)
2. Configure as tabelas necessárias (veja `docs/database-schema.md`)
3. Copie a URL e chave anônima para o arquivo `.env`

#### Google Calendar (Opcional)
1. Crie um projeto no [Google Cloud Console](https://console.cloud.google.com/)
2. Ative a Google Calendar API
3. Crie credenciais OAuth 2.0
4. Adicione as credenciais ao arquivo `.env`

## 🔄 Processo de Contribuição

### 1. Escolha uma Issue
- Procure por issues marcadas com `good first issue` para começar
- Comente na issue que você gostaria de trabalhar nela
- Aguarde confirmação de um mantenedor

### 2. Crie uma Branch
```bash
# Atualize sua branch main
git checkout main
git pull upstream main

# Crie uma nova branch
git checkout -b feature/nome-da-feature
# ou
git checkout -b fix/nome-do-bug
```

### 3. Faça suas Alterações
- Siga as [diretrizes de código](#diretrizes-de-código)
- Escreva testes para novas funcionalidades
- Mantenha os commits pequenos e focados

### 4. Teste suas Alterações
```bash
# Execute os testes
npm run test

# Execute o linter
npm run lint

# Teste a build
npm run build
```

### 5. Commit suas Alterações
```bash
git add .
git commit -m "feat: adiciona nova funcionalidade X"
```

### 6. Push e Crie um Pull Request
```bash
git push origin feature/nome-da-feature
```

Em seguida, crie um Pull Request no GitHub.

## 📝 Diretrizes de Código

### Estilo de Código
- Use **TypeScript** para todo código novo
- Siga as configurações do **ESLint** e **Prettier**
- Use **camelCase** para variáveis e funções
- Use **PascalCase** para componentes React
- Use **kebab-case** para nomes de arquivos

### Estrutura de Arquivos
```
src/
├── components/          # Componentes reutilizáveis
├── pages/              # Páginas da aplicação
├── hooks/              # Custom hooks
├── contexts/           # React contexts
├── services/           # Lógica de negócio
├── utils/              # Funções utilitárias
├── types/              # Definições de tipos
└── styles/             # Arquivos de estilo
```

### Convenções de Commit

Use o formato [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]

[optional footer]
```

**Tipos:**
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Alterações na documentação
- `style`: Alterações de formatação
- `refactor`: Refatoração de código
- `test`: Adição ou correção de testes
- `chore`: Tarefas de manutenção

**Exemplos:**
```
feat(auth): adiciona login com Google
fix(tasks): corrige bug na edição de tarefas
docs(readme): atualiza instruções de instalação
```

### Testes
- Escreva testes unitários para funções utilitárias
- Escreva testes de integração para componentes complexos
- Mantenha cobertura de testes acima de 80%
- Use **Jest** e **React Testing Library**

### Documentação
- Documente funções complexas com JSDoc
- Atualize o README.md se necessário
- Adicione comentários explicativos para lógica complexa

## 🐛 Reportando Bugs

Antes de reportar um bug:
1. Verifique se já existe uma issue similar
2. Teste na versão mais recente
3. Reproduza o bug em um ambiente limpo

### Template de Bug Report
```markdown
**Descrição do Bug**
Descrição clara e concisa do bug.

**Passos para Reproduzir**
1. Vá para '...'
2. Clique em '....'
3. Role para baixo até '....'
4. Veja o erro

**Comportamento Esperado**
Descrição do que deveria acontecer.

**Screenshots**
Se aplicável, adicione screenshots.

**Ambiente:**
- OS: [e.g. Windows 10]
- Browser: [e.g. Chrome 91]
- Versão: [e.g. 1.2.0]
```

## 💡 Sugerindo Melhorias

### Template de Feature Request
```markdown
**Problema Relacionado**
Descreva o problema que esta feature resolveria.

**Solução Proposta**
Descreva a solução que você gostaria de ver.

**Alternativas Consideradas**
Descreva alternativas que você considerou.

**Contexto Adicional**
Adicione qualquer contexto ou screenshots sobre a feature.
```

## 🔀 Pull Requests

### Checklist do PR
- [ ] Código segue as diretrizes de estilo
- [ ] Testes passam localmente
- [ ] Adicionei testes para novas funcionalidades
- [ ] Documentação foi atualizada
- [ ] Commit messages seguem o padrão
- [ ] PR tem uma descrição clara

### Template de PR
```markdown
## Descrição
Descrição clara das alterações.

## Tipo de Mudança
- [ ] Bug fix
- [ ] Nova funcionalidade
- [ ] Breaking change
- [ ] Documentação

## Como Testar
Passos para testar as alterações.

## Screenshots
Se aplicável, adicione screenshots.

## Checklist
- [ ] Código testado
- [ ] Documentação atualizada
- [ ] Testes passando
```

## 🎯 Primeiros Passos

Se você é novo no projeto, comece por:

1. **Leia toda a documentação**
2. **Configure o ambiente de desenvolvimento**
3. **Procure issues marcadas com `good first issue`**
4. **Faça uma pequena contribuição primeiro**
5. **Participe das discussões na comunidade**

## 📞 Precisa de Ajuda?

- Abra uma issue com a tag `question`
- Participe das discussões no GitHub
- Consulte a documentação em `docs/`

## 🙏 Reconhecimento

Todos os contribuidores serão reconhecidos no arquivo [CONTRIBUTORS.md](CONTRIBUTORS.md).

Obrigado por contribuir para o Task Eagle Eye! 🦅