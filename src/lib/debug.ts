/**
 * ERRO DO TOASTVIEWPORT
 * 
 * Error: VM12345:1 Uncaught TypeError: Cannot read properties of null (reading 'appendChild')
 *    at appendChildToContainer (react-dom.development.js:8529)
 *    at commitUpdate (react-dom.development.js:10154)
 *    at completeWork (react-dom.development.js:19566)
 *    at completeUnitOfWork (react-dom.development.js:23234)
 *    at performUnitOfWork (react-dom.development.js:22755)
 *    at workLoopSync (react-dom.development.js:22694)
 *    at renderRootSync (react-dom.development.js:22656)
 *    at performConcurrentWorkOnRoot (react-dom.development.js:27857)
 *    at workLoop (scheduler.development.js:266)
 *    at flushWork (scheduler.development.js:239)
 * 
 * Detalhes técnicos:
 * 
 * O problema está relacionado com o componente Radix UI Toast/ToastViewport
 * Erro quando tenta renderizar o ToastViewport no DOM:
 * <ol tabindex="-1" data-lov-id="src\components\ui\toaster.tsx:30:6" data-lov-name="ToastViewport" data-component-path="src\components\ui\toaster.tsx" data-component-line="30" data-component-file="toaster.tsx" data-component-name="ToastViewport" data-component-content="%7B%7D" class="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]"></ol>
 * 
 * Tente as seguintes soluções:
 * 
 * 1. Verificar a importação do ToastViewport:
 *    - No arquivo src/components/ui/toaster.tsx deve importar de '@/components/ui/toast'
 *    - Verifique se o arquivo toast.tsx existe e está implementado corretamente
 * 
 * 2. Verificar a importação do useToast:
 *    - Deve vir de '@/hooks/use-toast' e não de '@/components/ui/use-toast'
 * 
 * 3. Problemas de tipagem:
 *    - Verifique se as props do componente Toast estão corretas
 *    - Verifique o tipo ToastProps no arquivo de definição
 * 
 * 4. Na ordem de renderização:
 *    - ToastProvider deve envolver ToastViewport
 *    - As propriedades passadas para ToastViewport devem ser válidas
 */

export const debugErrors = {
  toastViewportError: `
    Error: VM12345:1 Uncaught TypeError: Cannot read properties of null (reading 'appendChild')
    Error quando tenta renderizar o ToastViewport no DOM:
    <ol tabindex="-1" data-lov-id="src\\components\\ui\\toaster.tsx:30:6" data-lov-name="ToastViewport" data-component-path="src\\components\\ui\\toaster.tsx" data-component-line="30" data-component-file="toaster.tsx" data-component-name="ToastViewport" data-component-content="%7B%7D" class="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]"></ol>
  `,
  
  circularDependencyError: `
    Error: Module dependency cycle detected:
    src/components/ui/use-toast.ts -> 
    src/hooks/use-toast.ts -> 
    src/components/ui/toast.tsx -> 
    src/components/ui/use-toast.ts
  `,
  
  radixUIPortalError: `
    Error: Portal container not found. Ensure the portal container is mounted before the portal element.
    at createPortal (react-dom.development.js:14456)
    at Viewport (toast.tsx:18)
    at Toaster (toaster.tsx:29)
  `,
  
  supabaseUuidError: `
    Erro na sincronização
    Erro ao inserir: invalid input syntax for type uuid: "4".
    Verifique o formato das tarefas.
  `
};

// Função para copiar o erro para a área de transferência
export function copyErrorToClipboard(errorKey: keyof typeof debugErrors): void {
  const errorText = debugErrors[errorKey];
  navigator.clipboard.writeText(errorText)
    .then(() => {
      console.log('Erro copiado para a área de transferência');
    })
    .catch(err => {
      console.error('Falha ao copiar o erro:', err);
    });
}

// Componente de botão para copiar erro
export interface CopyErrorButtonProps {
  errorKey: keyof typeof debugErrors;
  buttonText?: string;
  className?: string;
}

// Uso com React:
// <button 
//   onClick={() => copyErrorToClipboard('supabaseUuidError')}
//   className="px-3 py-1 bg-blue-500 text-white rounded"
// >
//   Copiar Erro
// </button> 