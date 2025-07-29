# 🤝 Guia de Contribuição

Obrigado por considerar contribuir para o Eisenhower Task Manager! Este documento fornece diretrizes e informações sobre como contribuir efetivamente para o projeto.

## 📋 Índice

- [Código de Conduta](#código-de-conduta)
- [Como Posso Contribuir?](#como-posso-contribuir)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Processo de Desenvolvimento](#processo-de-desenvolvimento)
- [Padrões de Código](#padrões-de-código)
- [Commits e Pull Requests](#commits-e-pull-requests)
- [Reportando Bugs](#reportando-bugs)
- [Sugerindo Funcionalidades](#sugerindo-funcionalidades)
- [Documentação](#documentação)

## 📜 Código de Conduta

Este projeto adere ao [Código de Conduta do Contributor Covenant](CODE_OF_CONDUCT.md). Ao participar, você deve seguir este código. Reporte comportamentos inaceitáveis para [felixskmarcio@gmail.com](mailto:felixskmarcio@gmail.com).

## 🚀 Como Posso Contribuir?

### 🐛 Reportando Bugs

1. **Verifique se o bug já foi reportado** nas [Issues existentes](https://github.com/felixskmarcio/eisenhower-task-manager/issues)
2. **Use o template de bug report** ao criar uma nova issue
3. **Forneça informações detalhadas** incluindo:
   - Passos para reproduzir
   - Comportamento esperado vs atual
   - Screenshots/logs quando aplicável
   - Informações do ambiente (OS, navegador, versão)

### ✨ Sugerindo Funcionalidades

1. **Verifique se a funcionalidade já foi sugerida** nas Issues
2. **Use o template de feature request**
3. **Explique claramente**:
   - O problema que a funcionalidade resolve
   - Como você imagina que funcionaria
   - Por que seria útil para outros usuários

### 💻 Contribuindo com Código

1. **Fork o repositório**
2. **Crie uma branch** para sua funcionalidade/correção
3. **Faça suas mudanças** seguindo os padrões do projeto
4. **Teste suas mudanças** completamente
5. **Submeta um Pull Request**

## 🛠️ Configuração do Ambiente

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- Git

### Instalação

```bash
# 1. Fork e clone o repositório
git clone https://github.com/SEU_USERNAME/eisenhower-task-manager.git
cd eisenhower-task-manager

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

### Estrutura do Projeto

```
eisenhower-task-manager/
├── src/
│   ├── components/     # Componentes React reutilizáveis
│   ├── pages/         # Páginas da aplicação
│   ├── hooks/         # Custom hooks
│   ├── contexts/      # Context providers
│   ├── services/      # Serviços e APIs
│   ├── utils/         # Funções utilitárias
│   ├── styles/        # Arquivos de estilo
│   └── types/         # Definições de tipos TypeScript
├── public/            # Arquivos estáticos
├── docs/             # Documentação
└── .github/          # Templates e workflows do GitHub
```

## 🔄 Processo de Desenvolvimento

### 1. Planejamento

- **Sempre comece com uma Issue** para discutir mudanças significativas
- **Aguarde aprovação** antes de começar a trabalhar em funcionalidades grandes
- **Divida trabalhos grandes** em PRs menores quando possível

### 2. Desenvolvimento

```bash
# 1. Crie uma branch a partir da main
git checkout main
git pull origin main
git checkout -b feature/nome-da-funcionalidade

# 2. Faça suas mudanças
# ...

# 3. Teste suas mudanças
npm run test
npm run lint
npm run type-check

# 4. Commit suas mudanças
git add .
git commit -m "feat: adicionar nova funcionalidade"

# 5. Push para seu fork
git push origin feature/nome-da-funcionalidade
```

### 3. Pull Request

- **Use o template de PR** fornecido
- **Referencie a Issue relacionada**
- **Forneça descrição detalhada** das mudanças
- **Inclua screenshots** para mudanças visuais
- **Aguarde revisão** antes de fazer merge

## 📝 Padrões de Código

### TypeScript/JavaScript

- **Use TypeScript** para todos os novos arquivos
- **Defina tipos explícitos** sempre que possível
- **Use ESLint e Prettier** para formatação
- **Prefira const/let** ao invés de var
- **Use async/await** ao invés de Promises quando possível

### React

- **Use componentes funcionais** com hooks
- **Extraia lógica complexa** para custom hooks
- **Use Context** para estado global quando apropriado
- **Implemente error boundaries** para componentes críticos
- **Otimize re-renders** com React.memo quando necessário

### CSS/Styling

- **Use Tailwind CSS** para estilização
- **Mantenha consistência** com o design system
- **Implemente responsividade** mobile-first
- **Use variáveis CSS** para valores reutilizáveis

### Testes

- **Escreva testes** para novas funcionalidades
- **Mantenha cobertura** acima de 80%
- **Use Jest e React Testing Library**
- **Teste casos de erro** além dos casos de sucesso

## 📝 Commits e Pull Requests

### Conventional Commits

Usamos o padrão [Conventional Commits](https://www.conventionalcommits.org/) para mensagens de commit:

```
tipo(escopo): descrição

[corpo opcional]

[rodapé opcional]
```

#### Tipos Válidos:

- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação/estilo (sem mudança de lógica)
- `refactor`: Refatoração de código
- `test`: Adição ou correção de testes
- `chore`: Tarefas de manutenção
- `perf`: Melhorias de performance
- `ci`: Mudanças em CI/CD
- `build`: Mudanças no sistema de build

#### Exemplos:

```bash
feat(auth): adicionar autenticação com Google
fix(tasks): corrigir bug na criação de tarefas
docs(readme): atualizar instruções de instalação
style(components): formatar código com prettier
refactor(utils): simplificar função de validação
test(auth): adicionar testes para login
chore(deps): atualizar dependências
```

### Pull Request Guidelines

- **Título descritivo** seguindo Conventional Commits
- **Descrição detalhada** usando o template
- **Referência à Issue** relacionada
- **Screenshots** para mudanças visuais
- **Testes** para novas funcionalidades
- **Documentação** atualizada quando necessário

## 🐛 Reportando Bugs

### Antes de Reportar

1. **Atualize para a versão mais recente**
2. **Verifique Issues existentes**
3. **Reproduza o bug** consistentemente
4. **Colete informações** do ambiente

### Informações Necessárias

- **Passos detalhados** para reproduzir
- **Comportamento esperado** vs atual
- **Screenshots/vídeos** quando aplicável
- **Logs de erro** do console
- **Informações do ambiente**:
  - Sistema operacional
  - Navegador e versão
  - Versão da aplicação

## ✨ Sugerindo Funcionalidades

### Critérios para Novas Funcionalidades

- **Alinhamento** com os objetivos do projeto
- **Benefício** para a maioria dos usuários
- **Viabilidade técnica**
- **Manutenibilidade** a longo prazo

### Processo de Aprovação

1. **Discussão inicial** na Issue
2. **Feedback da comunidade**
3. **Aprovação dos mantenedores**
4. **Planejamento da implementação**

## 📚 Documentação

### Tipos de Documentação

- **README**: Informações básicas do projeto
- **API Docs**: Documentação de APIs e serviços
- **Component Docs**: Documentação de componentes
- **Guides**: Tutoriais e guias de uso
- **Architecture**: Documentação da arquitetura

### Padrões de Documentação

- **Use Markdown** para toda documentação
- **Inclua exemplos** de código quando aplicável
- **Mantenha atualizado** com as mudanças do código
- **Use linguagem clara** e acessível
- **Inclua screenshots** para interfaces visuais

## 🔍 Revisão de Código

### Para Autores

- **Auto-revise** seu código antes de submeter
- **Teste completamente** suas mudanças
- **Responda rapidamente** aos comentários
- **Seja receptivo** ao feedback

### Para Revisores

- **Seja construtivo** nos comentários
- **Foque na qualidade** do código
- **Considere o contexto** das mudanças
- **Aprove rapidamente** PRs simples

## 🏷️ Labels e Milestones

### Labels de Tipo
- `bug`: Correções de bugs
- `enhancement`: Novas funcionalidades
- `documentation`: Melhorias na documentação
- `question`: Perguntas e discussões

### Labels de Prioridade
- `priority:critical`: Problemas críticos
- `priority:high`: Alta prioridade
- `priority:medium`: Prioridade média
- `priority:low`: Baixa prioridade

### Labels de Status
- `status:needs-triage`: Precisa ser triado
- `status:needs-info`: Precisa de mais informações
- `status:in-progress`: Em desenvolvimento
- `status:needs-review`: Precisa de revisão
- `status:blocked`: Bloqueado

## 🚀 Release Process

### Versionamento

Usamos [Semantic Versioning](https://semver.org/):

- **MAJOR**: Mudanças incompatíveis na API
- **MINOR**: Novas funcionalidades compatíveis
- **PATCH**: Correções de bugs compatíveis

### Processo de Release

1. **Criar milestone** para a versão
2. **Agrupar Issues/PRs** no milestone
3. **Testar completamente** as mudanças
4. **Criar tag** da versão
5. **Gerar release notes** automaticamente
6. **Publicar release**

## 🤖 Automação (RepoGuardian AI)

Este repositório usa o RepoGuardian AI para automação:

- **Triagem automática** de Issues e PRs
- **Verificação de padrões** de commit
- **Geração automática** de releases
- **Aplicação de labels** baseada em conteúdo
- **Notificações** para a equipe

### Configuração

A configuração está em `.github/repo-guardian-config.yml`.

## 📞 Suporte

### Canais de Comunicação

- **Issues**: Para bugs e funcionalidades
- **Discussions**: Para perguntas e ideias
- **Email**: [felixskmarcio@gmail.com](mailto:felixskmarcio@gmail.com)

### Tempo de Resposta

- **Issues críticas**: 24 horas
- **PRs**: 48-72 horas
- **Perguntas gerais**: 1 semana

## 🙏 Reconhecimento

Todos os contribuidores são reconhecidos:

- **Contributors list** no README
- **Release notes** mencionam contribuidores
- **Hall of Fame** para contribuidores frequentes

---

**Obrigado por contribuir! 🎉**

*Este documento é mantido pelo RepoGuardian AI e pela comunidade.*