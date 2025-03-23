import * as React from "react"
import { toast as sonnerToast, Toast as SonnerToast } from "sonner"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"
import { cn } from "@/utils/classNames"

// Re-exportações e redirecionamentos para compatibilidade
// Este arquivo agora serve apenas como uma camada de compatibilidade para código existente
// que ainda pode estar usando os componentes Toast antigos

// Estilo de toast para manter coerência com o design system
const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-80 data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive:
          "destructive group border-destructive bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

// Componentes de compatibilidade
export const ToastProvider = React.Fragment
// Implementamos ToastViewport como um componente vazio para evitar problemas com createPortal
export const ToastViewport = () => null
export const Toast = SonnerToast
export const ToastTitle = ({ children }: { children: React.ReactNode }) => children
export const ToastDescription = ({ children }: { children: React.ReactNode }) => children
export const ToastClose = () => null
export const ToastAction = ({ children }: { children: React.ReactNode }) => children

// Tipos para compatibilidade
export type ToastProps = React.ComponentPropsWithoutRef<typeof SonnerToast>
export type ToastActionElement = React.ReactElement
