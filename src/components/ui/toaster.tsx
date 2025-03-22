import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

// Mensagem de erro para identificação do problema:
/* 
Error: El-7053: <ToastViewport /> was rendered, but no <Toast /> components were found.
This could happen if you have an incorrect import order, or you are rendering the wrong component.
Make sure you have imported 'ToastViewport' from the correct package and check your component hierarchy.

Stack trace:
  at ToastViewport (react-dom.development.js:12345)
  at Toaster (toaster.tsx:29)
  at ErrorBoundary (ErrorBoundary.tsx:122)
  at App (App.tsx:28)
*/

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
