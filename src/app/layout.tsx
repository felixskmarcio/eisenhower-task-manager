// Layout component imports removed as they're not needed here

// In your layout component
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Navigation items removed as they're not needed here

  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-background antialiased">
        {children}
      </body>
    </html>
  )
}