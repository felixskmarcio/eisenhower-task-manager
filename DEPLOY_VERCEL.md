# Deploy na Vercel - Solução para Erro 404

## Problema Identificado

O erro 404 na rota `/productivity` (e outras rotas) ocorria porque a Vercel não estava configurada corretamente para aplicações SPA (Single Page Application) com React Router.

## Solução Implementada

### 1. Arquivo `vercel.json` Criado

Foi criado o arquivo `vercel.json` na raiz do projeto com a seguinte configuração:

```json
{
  "rewrites": [
    {
      "source": "/((?!api/.*).*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### 2. Como Funciona

- **Rewrites**: Todas as rotas (exceto APIs) são redirecionadas para `/index.html`
- **Headers de Segurança**: Adicionados headers de segurança para proteção adicional
- **Compatibilidade SPA**: Permite que o React Router gerencie as rotas no lado do cliente

### 3. Rotas Configuradas no App

As seguintes rotas estão configuradas no `App.tsx`:

- `/dashboard` - Dashboard principal
- `/productivity` - Dashboard de produtividade
- `/tags` - Gerenciamento de tags
- `/config` - Página de configurações
- `/login` - Página de autenticação
- `/` - Landing page

### 4. Próximos Passos

1. Faça commit das alterações:
   ```bash
   git add vercel.json
   git commit -m "fix: adiciona configuração vercel.json para SPA routing"
   git push
   ```

2. A Vercel irá automaticamente fazer o redeploy

3. Teste as rotas após o deploy:
   - `https://seu-app.vercel.app/productivity`
   - `https://seu-app.vercel.app/dashboard`
   - `https://seu-app.vercel.app/tags`
   - `https://seu-app.vercel.app/config`

### 5. Verificação

Após o deploy, todas as rotas devem funcionar corretamente sem erro 404.

## Observações

- O arquivo `_redirects` existente é usado pelo Netlify, não pela Vercel
- A Vercel requer o arquivo `vercel.json` para configurações de roteamento
- A configuração implementada é específica para SPAs com React Router