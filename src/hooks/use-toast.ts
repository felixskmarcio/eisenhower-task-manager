import * as React from "react"
import { toast as sonnerToast } from "sonner"

// Definição simplificada dos tipos para o toast
export type ToastProps = {
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  variant?: "default" | "destructive"
}

// Wrapper para a função toast do sonner
function toast(props: ToastProps) {
  const { title, description, action, variant } = props
  
  return sonnerToast(title as string, {
    description: description,
    action: action ? {
      label: typeof action === 'string' ? action : 'Action',
      onClick: () => {}
    } : undefined,
    className: variant === "destructive" ? "destructive" : undefined
  })
}

// Hook para manter compatibilidade com código existente
function useToast() {
  return {
    toast,
    dismiss: sonnerToast.dismiss
  }
}

export { useToast, toast }
