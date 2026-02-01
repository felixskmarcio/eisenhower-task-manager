# Auditoria de Design - Login (AuthPage.tsx)

## Resumo Executivo
Esta auditoria analisa a conformidade da página de autenticação (`AuthPage.tsx`) com os princípios de design do projeto Eisenwower Task Manager. A análise foca em Cores, Tipografia, Layout e Consistência de Componentes.

**Status Geral**: Alto nível de conformidade, com algumas inconsistências menores em componentes de interface e valores arbitrários de layout.

---

## 1. Paleta de Cores e Acessibilidade

### Pontos Positivos
*   **Uso de Tokens**: A página utiliza extensivamente tokens semânticos (`bg-background`, `text-foreground`, `text-muted-foreground`, `border-border`) em vez de cores hexadecimais hardcoded.
*   **Tema Primário**: O gradiente de fundo (`from-primary via-primary/90`) respeita a cor primária do tema ativo (Dracula, Nord, etc.).
*   **Modo Escuro**: Classes condicionais (`isDarkTheme`) e uso de opacidade (`bg-white/10`) garantem compatibilidade com temas claros e escuros.

### Inconsistências Identificadas
*   **Ícone do Google**: O SVG do Google usa cores hexadecimais (`#FFC107`, etc.).
    *   *Avaliação*: **Aceitável**. Marcas de terceiros devem manter sua identidade oficial.
*   **Valores de Opacidade**: Uso de `primary/90` e `primary/80`.
    *   *Recomendação*: Verificar se o design system possui tokens de estado como `primary-hover` ou `primary-focus` em vez de manipular a opacidade manualmente.

---

## 2. Tipografia

### Pontos Positivos
*   **Hierarquia**: Uso claro de `text-4xl/5xl` para títulos, `text-2xl` para subtítulos e `text-sm` para corpo e labels.
*   **Família de Fontes**: Herança da fonte do corpo (Inter/Roboto via Tailwind), sem sobrescritas manuais.

### Inconsistências Identificadas
*   Nenhuma violação grave encontrada (sem uso de `text-[17px]`).

---

## 3. Layout e Espaçamento

### Pontos Positivos
*   **Responsividade**: Uso de breakpoints (`lg:flex`, `xl:px-20`) para layout adaptativo.
*   **Espaçamento Uniforme**: Uso de escala padrão Tailwind (`py-2.5`, `px-4`, `gap-4`).

### Inconsistências Identificadas
*   **Valores Arbitrários (Magic Numbers)**:
    *   `w-[500px] h-[500px]` (Linha 179): Elemento decorativo de desfoque. Recomenda-se mover para uma classe utilitária se reutilizado.
    *   `sm:max-w-[420px]` (Linha 620): Largura do modal de recuperação de senha. Deveria seguir o padrão de larguras de modal (ex: `max-w-md` que é 28rem/448px, ou `max-w-sm` 24rem/384px).

---

## 4. Componentes e Estrutura

### Pontos Positivos
*   **Uso de `Button`**: Ações principais e secundárias usam o componente `Button` encapsulado.
*   **Formulários**: Uso correto de `react-hook-form` com abstrações de `Form`, `FormControl`, `FormLabel`.

### Inconsistências Identificadas
*   **Abas de Login/Cadastro (Linhas 268-289)**:
    *   **Problema**: Implementadas como elementos `<button>` nativos HTML, apenas com classes utilitárias.
    *   **Impacto**: Perda de consistência com os estados de foco, animações e padronização do componente `Button`.
    *   **Recomendação**: Substituir por componentes `Tabs` do shadcn/ui ou utilizar o componente `Button` com `variant="ghost"` ou `variant="secondary"`.
*   **SVG Inline**: O ícone do Google é um bloco SVG grande e direto no código.
    *   **Recomendação**: Extrair para um componente `GoogleIcon` ou `Icons.google`.

---

## Recomendações Prioritárias

1.  **Refatorar Abas**: Substituir os `<button>` das abas por componentes `Button` ou o padrão `Tabs` do sistema.
2.  **Padronizar Modal**: Alterar `sm:max-w-[420px]` para `sm:max-w-md` (448px) para alinhamento com o grid.
3.  **Extrair Ícones**: Mover o SVG do Google para um arquivo de ícones.

