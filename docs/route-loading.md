# Carregamento sob demanda das rotas

## Medição

Build de produção com `npm run build`, no mesmo ambiente e sem alterar dependências:

| JavaScript inicial | Antes | Depois | Redução |
| --- | ---: | ---: | ---: |
| Minificado | 1.880,91 KB | 953,50 KB | 49,3% |
| Gzip | 533,65 KB | 279,53 KB | 47,6% |

O CSS inicial continua em 226,53 KB (37,15 KB gzip). A separação reduz o
download inicial, não o total de código necessário para visitar todas as telas.

`Landing` permanece imediata. Login, introdução, layout, matriz (compartilhada
por `/dashboard` e `/matrix`), produtividade, tags, configurações, administração
e 404 usam `React.lazy`. Gráficos de produtividade e dependências da matriz
ficam nos respectivos arquivos sob demanda, sem regras manuais de vendors.

Os guards continuam fora dos componentes lazy: visitantes sem sessão vão ao
login sem baixar o painel. Os providers existentes, inclusive a inicialização
Firebase/Supabase, permanecem no mesmo lugar para preservar sessão e redirects.
Por isso o arquivo inicial ainda ultrapassa o aviso de 500 KB do Vite.

O fallback de `Suspense` tem status acessível e não desaparece por tempo.
Falhas no download chegam ao `ErrorBoundary`, com a ação existente de recarregar.
Não há repetição automática de imports nem ocultação de erros.

## Verificação

```sh
npm run build
npx playwright test --config playwright.routes.config.ts
npx playwright test --config playwright.homepage.config.ts
```

Se necessário, definir `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` para o navegador
instalado. A configuração de rotas inicia um preview de produção temporário
na porta 5001 e usa/inicia o servidor de desenvolvimento na porta 5000.

- Produção: homepage sem chunks internos, limite de tamanho inicial, navegação
  ao login, visitas diretas às seis rotas protegidas, estado de retorno ao
  caminho original, introdução, 404, download lento e erro/recarregamento.
- Desenvolvimento: telas e guards reais com contexto de autenticação simulado
  somente pela interceptação de rede do teste; navegação, voltar, acesso direto
  e rejeição de usuário comum na administração. Leituras REST isoladas de
  dados reais. Não valida login com credenciais reais.
- Homepage: verificações existentes de navegação, layout e menu móvel.

### Problemas anteriores à alteração

- O teste administrativo está marcado como falha esperada: os filtros existentes
  de `AdminPage` usam `SelectItem value=""`, proibido pelo Radix, e a tela termina
  no `ErrorBoundary` após autorizar um administrador. A correção funcional dessa
  tela é separada da mudança de carregamento.
- `tsc --noEmit -p tsconfig.app.json` aponta erros em `TagManager`,
  `ProductivityDashboard`, `database` e `googleCalendar`, arquivos não alterados
  nesta entrega. Build e lint dos arquivos alterados passam.
