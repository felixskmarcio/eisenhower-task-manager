"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Link, useLocation } from "react-router-dom"
import { LucideIcon } from "lucide-react"
import { cn } from "../../utils/classNames"

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
  priority?: number; // Prioridade para exibição em telas pequenas (maior = mais importante)
}

interface TubelightNavbarProps {
  items: NavItem[]
  className?: string
}

export function TubelightNavbar({ items, className }: TubelightNavbarProps) {
  const location = useLocation()
  const [activeTab, setActiveTab] = useState("")
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }
    
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    const currentItem = items.find(item => location.pathname === item.url || location.pathname.startsWith(`${item.url}/`))
    setActiveTab(currentItem ? currentItem.name : items[0].name)
  }, [location.pathname, items])

  // Definir prioridades para os itens que não têm uma definida
  const itemsWithPriority = items.map(item => ({
    ...item,
    priority: item.priority || 
             (item.name === "Início" ? 100 : 
              item.name === "Dashboard" ? 90 : 
              item.name === "Tarefas" ? 80 : 
              item.name === "Concluídas" ? 70 : 
              item.name === "Tags" ? 60 : 
              item.name === "Configurações" ? 50 : 0)
  }))

  // Filtrar itens baseado no tamanho da tela
  const visibleItems = itemsWithPriority
    .sort((a, b) => b.priority! - a.priority!) // Ordenar por prioridade (maior primeiro)
    .slice(0, windowWidth < 640 ? 4 : items.length) // Limitar a 4 itens em telas pequenas

  return (
    <div className={cn(
      "flex justify-center z-40 bg-transparent",
      className,
    )}>
      <div className="flex items-center gap-1 sm:gap-2 bg-background/95 border border-border/40 backdrop-blur-xl py-1 px-1.5 rounded-full shadow-lg">
        {visibleItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.name

          return (
            <Link
              key={item.name}
              to={item.url}
              onClick={() => setActiveTab(item.name)}
              className={cn(
                "relative cursor-pointer text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 rounded-full transition-all duration-300",
                "text-foreground/70 hover:text-primary",
                isActive ? "text-primary" : "hover:bg-muted/50",
              )}
            >
              <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
                <Icon 
                  size={18} 
                  strokeWidth={isActive ? 2.5 : 2} 
                  className={cn(
                    "transition-all duration-300",
                    isActive && "text-primary"
                  )}
                />
                <span className={cn(
                  "text-[9px] sm:text-xs transition-all hidden sm:block",
                  isActive ? "font-semibold" : "font-medium"
                )}>
                  {item.name}
                </span>
              </div>
              
              {isActive && (
                <div className="absolute inset-0 w-full bg-primary/10 rounded-full -z-10">
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-10 h-1 bg-primary rounded-t-full">
                    <div className="absolute w-16 h-6 bg-primary/20 rounded-full blur-md -top-2 -left-3" />
                    <div className="absolute w-10 h-6 bg-primary/30 rounded-full blur-md -top-1 -left-0" />
                    <div className="absolute w-6 h-4 bg-primary/40 rounded-full blur-sm top-0 left-2" />
                  </div>
                </div>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
