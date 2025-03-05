import { TubelightNavbar } from "@/components/ui/tubelight-navbar"
import { Clock, Star, CheckCircle, Share, Settings, Home } from "lucide-react"

// In your layout component
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const navItems = [
    {
      name: "Início",
      url: "/",
      icon: Home,
    },
    {
      name: "Tarefas",
      url: "/tarefas",
      icon: Clock,
    },
    {
      name: "Matriz",
      url: "/matriz",
      icon: Star,
    },
    {
      name: "Concluídas",
      url: "/concluidas",
      icon: CheckCircle,
    },
    {
      name: "Compartilhar",
      url: "/compartilhar",
      icon: Share,
    },
    {
      name: "Config",
      url: "/config",
      icon: Settings,
    },
  ]

  return (
    <html lang="pt-BR">
      <body className={cn("min-h-screen bg-background antialiased", fontSans.variable)}>
        {children}
        <TubelightNavbar items={navItems} />
      </body>
    </html>
  )
}