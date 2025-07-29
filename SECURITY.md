# Política de Segurança

## Versões Suportadas

Atualmente, oferecemos suporte de segurança para as seguintes versões:

| Versão | Suportada          |
| ------ | ------------------ |
| 1.3.x  | :white_check_mark: |
| 1.2.x  | :white_check_mark: |
| < 1.2  | :x:                |

## Reportando uma Vulnerabilidade

A segurança do Task Eagle Eye é uma prioridade. Se você descobrir uma vulnerabilidade de segurança, pedimos que nos ajude a resolvê-la de forma responsável.

### Como Reportar

**NÃO** abra uma issue pública para vulnerabilidades de segurança.

Em vez disso, envie um email para:
- **Email**: security@task-eagle-eye.com (substitua pelo seu email)
- **Assunto**: [SECURITY] Vulnerabilidade em Task Eagle Eye

### Informações a Incluir

Por favor, inclua as seguintes informações em seu relatório:

- **Descrição** da vulnerabilidade
- **Passos para reproduzir** o problema
- **Impacto potencial** da vulnerabilidade
- **Versão afetada** do software
- **Ambiente** onde foi descoberta (browser, OS, etc.)
- **Evidências** (screenshots, logs, etc.) se aplicável

### Processo de Resposta

1. **Confirmação** (24-48 horas): Confirmaremos o recebimento do seu relatório
2. **Avaliação** (3-5 dias): Avaliaremos a vulnerabilidade e sua severidade
3. **Correção** (7-14 dias): Desenvolveremos e testaremos uma correção
4. **Divulgação** (após correção): Publicaremos uma correção e, se apropriado, um aviso de segurança

### Reconhecimento

Reconhecemos e agradecemos pesquisadores de segurança responsáveis:

- Seu nome será incluído em nosso hall da fama de segurança (se desejar)
- Você será creditado no changelog da versão que corrige a vulnerabilidade
- Para vulnerabilidades críticas, consideramos recompensas (se aplicável)

## Melhores Práticas de Segurança

### Para Usuários

- **Mantenha atualizado**: Use sempre a versão mais recente
- **Credenciais seguras**: Use senhas fortes e autenticação de dois fatores
- **HTTPS**: Acesse sempre via HTTPS em produção
- **Logout**: Faça logout em dispositivos compartilhados

### Para Desenvolvedores

- **Dependências**: Mantenha dependências atualizadas
- **Secrets**: Nunca commite credenciais ou chaves de API
- **Validação**: Sempre valide e sanitize entradas do usuário
- **Autenticação**: Implemente autenticação e autorização adequadas
- **HTTPS**: Use HTTPS em produção

## Implementações de Segurança

O Task Eagle Eye implementa várias medidas de segurança:

### Autenticação e Autorização
- Firebase Authentication com múltiplos provedores
- Tokens JWT seguros
- Sessões com timeout automático
- Row Level Security (RLS) no Supabase

### Proteção de Dados
- Sanitização de entradas com DOMPurify e Zod
- Proteção contra XSS e CSRF
- Rate limiting para prevenir abuso
- Criptografia de dados sensíveis

### Infraestrutura
- HTTPS obrigatório em produção
- Headers de segurança configurados
- Backup automático de dados
- Monitoramento de logs de segurança

Para mais detalhes técnicos, consulte [docs/SECURITY.md](docs/SECURITY.md).

## Contato

Para questões relacionadas à segurança:
- **Email**: security@task-eagle-eye.com
- **Issues não-sensíveis**: [GitHub Issues](https://github.com/SEU_USERNAME/eisenhower-task-manager/issues)

---

**Obrigado por ajudar a manter o Task Eagle Eye seguro!** 🛡️