# 🤖 RepoGuardian AI - Configuração do GitHub

Este diretório contém toda a configuração automatizada do **RepoGuardian AI** para o repositório Eisenhower Task Manager. O RepoGuardian AI é um sistema de automação que padroniza e otimiza a gestão do repositório GitHub.

## 📁 Estrutura do Diretório

```
.github/
├── ISSUE_TEMPLATE/          # Templates para Issues
│   ├── bug_report.md        # Template para relatório de bugs
│   ├── feature_request.md   # Template para solicitação de funcionalidades
│   ├── documentation.md     # Template para documentação
│   └── config.yml          # Configuração dos templates
├── workflows/               # GitHub Actions Workflows
│   ├── ci.yml              # Integração Contínua
│   ├── deploy.yml          # Deploy Automático
│   ├── release.yml         # Automação de Releases
│   └── security.yml        # Segurança e Dependências
├── CODE_OF_CONDUCT.md      # Código de Conduta
├── CONTRIBUTING.md         # Guia de Contribuição
├── PULL_REQUEST_TEMPLATE.md # Template para Pull Requests
├── dependabot.yml          # Configuração do Dependabot
├── labels.yml              # Definição de Labels
├── repo-guardian-config.yml # Configuração do RepoGuardian AI
└── README.md               # Este arquivo
```

## 🚀 Funcionalidades do RepoGuardian AI

### 🔄 Integração Contínua (CI)
**Arquivo**: `workflows/ci.yml`

- **Lint & Type Check**: Verificação de código com ESLint e TypeScript
- **Testes**: Execução de testes unitários com cobertura
- **Build**: Compilação da aplicação
- **Segurança**: Auditoria de segurança e análise CodeQL
- **Performance**: Análise de tamanho do bundle
- **Dependency Review**: Revisão de dependências em PRs

**Triggers**:
- Push para `main` e `develop`
- Pull Requests para `main` e `develop`
- Execução manual

### 🚀 Deploy Automático
**Arquivo**: `workflows/deploy.yml`

- **Deploy para Vercel**: Automático em produção
- **Smoke Tests**: Testes básicos após deploy
- **Notificações**: Comentários automáticos em PRs
- **Rollback**: Estratégias de reversão

**Triggers**:
- Push para `main`
- Tags de versão (`v*.*.*`)
- Execução manual com opções

### 🏷️ Automação de Releases
**Arquivo**: `workflows/release.yml`

- **Changelog Automático**: Geração baseada em Conventional Commits
- **Categorização**: Organização por tipo de mudança
- **Assets**: Criação de arquivos de release
- **GitHub Release**: Criação automática com notas

**Triggers**:
- Tags de versão (`v*.*.*`)
- Execução manual

### 🔒 Segurança e Dependências
**Arquivo**: `workflows/security.yml`

- **Audit de Segurança**: Verificação de vulnerabilidades
- **CodeQL**: Análise estática de código
- **OSSAR**: Análise adicional de segurança
- **Dependency Updates**: Atualizações automáticas
- **Relatórios**: Resumos de segurança

**Triggers**:
- Agendamento semanal (segundas-feiras)
- Mudanças em `package.json`
- Execução manual

## 📋 Templates e Configurações

### 🐛 Templates de Issues

#### Bug Report (`ISSUE_TEMPLATE/bug_report.md`)
- Descrição estruturada do problema
- Passos para reprodução
- Comportamento esperado vs atual
- Informações de ambiente
- Screenshots e logs

#### Feature Request (`ISSUE_TEMPLATE/feature_request.md`)
- Resumo da funcionalidade
- Problema/motivação
- Solução proposta
- Critérios de aceitação
- Mockups e considerações técnicas

#### Documentation (`ISSUE_TEMPLATE/documentation.md`)
- Tipo de documentação necessária
- Localização e público-alvo
- Conteúdo sugerido
- Prioridade e idioma

### 📝 Template de Pull Request
**Arquivo**: `PULL_REQUEST_TEMPLATE.md`

- Descrição detalhada das mudanças
- Tipo de mudança (feature, fix, docs, etc.)
- Como foi testado
- Checklist completo
- Informações de deploy
- Metadados para automação

### 🤖 Dependabot
**Arquivo**: `dependabot.yml`

- **Atualizações Semanais**: npm, GitHub Actions, Docker
- **Agrupamento**: Dependências relacionadas
- **Configuração de Merge**: Target branch e reviewers
- **Ignorar Major**: Atualizações que requerem revisão manual

### 🏷️ Sistema de Labels
**Arquivo**: `labels.yml`

#### Categorias de Labels:
- **Tipos**: `bug`, `feature`, `enhancement`, `documentation`
- **Prioridades**: `priority:critical`, `priority:high`, `priority:medium`, `priority:low`
- **Status**: `status:needs-review`, `status:in-progress`, `status:blocked`
- **Áreas**: `area:frontend`, `area:backend`, `area:database`
- **Dificuldade**: `difficulty:beginner`, `difficulty:expert`
- **Ferramentas**: `tool:react`, `tool:supabase`, `tool:vite`

## ⚙️ Configuração do RepoGuardian AI
**Arquivo**: `repo-guardian-config.yml`

### Regras de Issues
- Auto-aplicação de labels baseada em conteúdo
- Verificação de templates
- Atribuição automática a projetos
- Notificações para issues incompletas

### Regras de Pull Requests
- Verificação de Conventional Commits
- Validação de referência a issues
- Controle de tamanho de PR
- Auto-aprovação para documentação
- Verificação de testes e CI

### Automação de Releases
- Trigger em tags de versão
- Categorização por labels
- Geração de changelog
- Criação de draft releases

### Quality Gates
- Cobertura mínima de testes (80%)
- Aprovação obrigatória para mudanças críticas
- Verificação de breaking changes
- Validação de documentação

## 📊 Métricas e Monitoramento

O RepoGuardian AI monitora:

- **Tempo de Resolução**: Issues e PRs
- **Qualidade do Código**: Cobertura de testes, lint
- **Segurança**: Vulnerabilidades e dependências
- **Performance**: Tamanho do bundle, tempo de build
- **Atividade**: Contribuições e engajamento

## 🔧 Manutenção

### Atualizações Automáticas
- **Dependências**: Semanalmente via Dependabot
- **GitHub Actions**: Atualizações de versões
- **Configurações**: Sincronização com melhores práticas

### Monitoramento
- **Falhas de Workflow**: Notificações automáticas
- **Vulnerabilidades**: Alertas de segurança
- **Performance**: Relatórios de degradação

## 🚀 Como Usar

### Para Contribuidores
1. **Issues**: Use os templates apropriados
2. **Pull Requests**: Siga o template e convenções
3. **Commits**: Use Conventional Commits
4. **Labels**: Serão aplicadas automaticamente

### Para Mantenedores
1. **Configuração**: Edite `repo-guardian-config.yml`
2. **Labels**: Modifique `labels.yml`
3. **Workflows**: Ajuste os arquivos em `workflows/`
4. **Templates**: Atualize conforme necessário

## 🔍 Troubleshooting

### Problemas Comuns

#### Workflow Falhando
1. Verifique os logs no GitHub Actions
2. Confirme se as secrets estão configuradas
3. Valide a sintaxe dos arquivos YAML

#### Labels Não Aplicadas
1. Verifique a configuração em `repo-guardian-config.yml`
2. Confirme se o bot tem permissões adequadas
3. Teste as regras manualmente

#### Dependabot Não Funcionando
1. Valide a sintaxe de `dependabot.yml`
2. Verifique se está habilitado no repositório
3. Confirme as configurações de branch

### Logs e Debugging
- **GitHub Actions**: Aba "Actions" do repositório
- **Dependabot**: Aba "Insights" > "Dependency graph"
- **Security**: Aba "Security" do repositório

## 📚 Recursos Adicionais

### Documentação
- [GitHub Actions](https://docs.github.com/en/actions)
- [Dependabot](https://docs.github.com/en/code-security/dependabot)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)

### Melhores Práticas
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Code Review](https://github.com/features/code-review/)
- [Security Best Practices](https://docs.github.com/en/code-security)

## 🤝 Contribuindo

Para contribuir com melhorias no RepoGuardian AI:

1. **Fork** este repositório
2. **Crie** uma branch para sua feature
3. **Implemente** as mudanças
4. **Teste** thoroughly
5. **Submeta** um Pull Request

## 📄 Licença

Este sistema de automação está sob a mesma licença do projeto principal.

---

**Versão**: 1.0.0  
**Última Atualização**: Janeiro 2024  
**Mantido por**: RepoGuardian AI 🤖

> 💡 **Dica**: Para sugestões de melhorias no RepoGuardian AI, abra uma issue com a label `enhancement` e `area:automation`.