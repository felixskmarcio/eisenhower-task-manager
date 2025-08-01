
import { useTheme } from "../../contexts/ThemeContext"
import { Toaster as Sonner } from "sonner"
import { cn } from "../../utils/classNames"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { currentTheme } = useTheme()
  
  // Mapear o tema da aplicação para o tema do sonner (light ou dark)
  const sonnerTheme = currentTheme === 'dark' || 
                      currentTheme === 'dracula' || 
                      currentTheme === 'night' || 
                      currentTheme === 'forest' ||
                      currentTheme === 'halloween' ||
                      currentTheme === 'luxury' ||
                      currentTheme === 'black' ||
                      currentTheme === 'abyss' ? 'dark' : 'light'

  return (
    <Sonner
      theme={sonnerTheme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
