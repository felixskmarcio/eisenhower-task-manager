# Configuração de Dados de Teste

Este documento descreve como configurar e usar os dados de teste para o projeto Eisenhower Task Manager.

## 📋 Visão Geral

O projeto possui um sistema completo de dados de teste que permite:
- Criar usuários e tarefas de teste
- Executar testes funcionais e de API
- Simular cenários reais de uso
- Validar a integração com o banco de dados

## 🚀 Scripts Disponíveis

### 1. Modo Demonstração (Recomendado para testes iniciais)
```bash
npm run db:seed:demo
```
Este script:
- Cria arquivos JSON com dados de teste
- Não requer conexão com banco de dados
- Ideal para desenvolvimento local
- Cria `test-config.json` com credenciais de teste

### 2. Modo Real (Requer Supabase configurado)
```bash
npm run db:seed:real
```
Este script:
- Conecta ao Supabase usando service key
- Cria usuário e tarefas reais no banco
- Requer configuração de ambiente
- Ideal para testes de integração

### 3. Script Original (Modo híbrido)
```bash
npm run db:seed
```
Este script tenta conectar ao Supabase, mas falha silenciosamente se não houver conexão.

## 📁 Arquivos Gerados

Após executar o script de demonstração, os seguintes arquivos são criados:

### test-config.json
Arquivo principal de configuração contendo:
```json
{
  "testUser": {
    "id": "test-user-123",
    "email": "test@example.com",
    "password": "Test@123456",
    "full_name": "Usuário de Teste"
  },
  "testTasks": [...],
  "loginCredentials": {
    "email": "test@example.com",
    "password": "Test@123456"
  }
}
```

### test-data/users.json
Lista de usuários de teste.

### test-data/tasks.json
Lista de tarefas de teste distribuídas nos 4 quadrantes.

## 🔧 Configuração do Ambiente

### Para modo demonstração
Nenhuma configuração adicional é necessária.

### Para modo real
Adicione ao arquivo `.env`:
```env
VITE_SUPABASE_URL=https://sua-instancia.supabase.co
VITE_SUPABASE_SERVICE_KEY=sua-service-key-aqui
```

## 🧪 Testes Disponíveis

### Testes Funcionais
```bash
npm run test:matrix-functional
```
Testes que verificam:
- Login com credenciais de teste
- Navegação na matriz
- Criação de tarefas
- Drag and drop entre quadrantes
- Completar/excluir tarefas
- Responsividade

### Testes de API
```bash
npm run test:matrix-api
```
Testes que verificam:
- Endpoints de autenticação
- CRUD de tarefas
- Validação de dados
- Autorização
- Estatísticas

### Testes Visuais
```bash
npm run test:matrix-simple
```
Testes que verificam:
- CSS e estilos
- Layout da matriz
- Componentes visuais

## 📊 Dados de Teste Padrão

### Usuário de Teste
- **Email**: test@example.com
- **Senha**: Test@123456
- **ID**: test-user-123

### Tarefas de Teste
1. **Fazer** (Urgente/Importante)
   - Título: "Tarefa Urgente Importante"
   - Descrição: "Esta é uma tarefa que deve ser feita imediatamente"
   - Prioridade: alta

2. **Agendar** (Não Urgente/Importante)
   - Título: "Tarefa Importante Não Urgente"
   - Descrição: "Esta tarefa pode ser agendada para depois"
   - Prioridade: média

3. **Delegar** (Urgente/Não Importante)
   - Título: "Tarefa Urgente Não Importante"
   - Descrição: "Esta tarefa pode ser delegada"
   - Prioridade: baixa

4. **Eliminar** (Não Urgente/Não Importante)
   - Título: "Tarefa Não Urgente Não Importante"
   - Descrição: "Esta tarefa pode ser eliminada"
   - Prioridade: baixa

## 🔄 Fluxo de Teste Recomendado

1. **Executar script de demonstração**
   ```bash
   npm run db:seed:demo
   ```

2. **Iniciar servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

3. **Executar testes funcionais**
   ```bash
   npm run test:matrix-functional
   ```

4. **Executar testes de API**
   ```bash
   npm run test:matrix-api
   ```

5. **Executar testes visuais**
   ```bash
   npm run test:matrix-simple
   ```

## 📝 Notas Importantes

### Segurança
- Os dados de teste são fictícios e não devem ser usados em produção
- As credenciais do Supabase service key devem ser mantidas em segredo
- Use apenas o modo demonstração para desenvolvimento local

### Performance
- Os testes usam Playwright para automação de navegador
- Cada teste cria seu próprio contexto de navegador
- Os testes são executados em sequência por padrão

### Manutenção
- Os arquivos de teste são recriados a cada execução do script
- Os dados de teste podem ser atualizados editando os scripts
- Novos cenários de teste podem ser adicionados seguindo os padrões existentes

## 🐛 Solução de Problemas

### Script falha ao conectar ao Supabase
- Verifique as credenciais no arquivo `.env`
- Certifique-se de que a service key tem permissões adequadas
- Use o modo demonstração se não precisar de dados reais

### Testes falham ao encontrar elementos
- Verifique se o servidor está rodando na porta correta (5000)
- Execute os testes visuais primeiro para validar o layout
- Verifique os seletores CSS usados nos testes

### Timeout em testes de API
- Verifique se a API está funcionando corretamente
- Aumente o timeout se necessário
- Verifique os logs do servidor para erros

## 📚 Próximos Passos

1. Configurar CI/CD para executar testes automaticamente
2. Adicionar mais cenários de teste
3. Criar testes de performance
4. Adicionar testes de acessibilidade
5. Criar testes de integração com serviços externos