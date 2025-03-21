"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Link, useLocation } from "react-router-dom"
import { LucideIcon } from "lucide-react"
import { cn } from "@/utils/classNames"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface TubelightNavbarProps {
  items: NavItem[]
  className?: string
}

export function TubelightNavbar({ items, className }: TubelightNavbarProps) {
  const location = useLocation()
  const [activeTab, setActiveTab] = useState("")

  useEffect(() => {
    const currentItem = items.find(item => location.pathname === item.url || location.pathname.startsWith(`${item.url}/`))
    setActiveTab(currentItem ? currentItem.name : items[0].name)
  }, [location.pathname, items])

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-6 sm:top-4 sm:bottom-auto sm:pt-0 sm:pb-0 sm:mb-0",
        className,
      )}
    >
      <div className="flex items-center gap-2 sm:gap-3 bg-background/80 border border-border/50 backdrop-blur-xl py-1.5 px-2 rounded-full shadow-lg">
        {items
          .filter(item => item.name !== "Tarefas" && item.name !== "Concluídas")
          .map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.name

            return (
              <Link
                key={item.name}
                to={item.url}
                onClick={() => setActiveTab(item.name)}
                className={cn(
                  "relative cursor-pointer text-xs sm:text-sm font-medium px-2 sm:px-4 py-2 sm:py-2.5 rounded-full transition-all duration-300",
                  "text-foreground/70 hover:text-primary",
                  isActive ? "text-primary" : "hover:bg-muted/50",
                )}
              >
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: isActive ? 1 : 0.9 }}
                  className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2"
                >
                  <Icon 
                    size={18} 
                    strokeWidth={isActive ? 2.5 : 2} 
                    className={cn(
                      "transition-all duration-300",
                      isActive && "text-primary"
                    )}
                  />
                  <span className={cn(
                    "text-[10px] sm:text-xs transition-all",
                    isActive ? "font-semibold" : "font-medium"
                  )}>
                    {item.name}
                  </span>
                </motion.div>
                
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 w-full bg-primary/10 rounded-full -z-10"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 350,
                      damping: 30,
                    }}
                  >
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-10 h-1 bg-primary rounded-t-full">
                      <div className="absolute w-16 h-6 bg-primary/20 rounded-full blur-md -top-2 -left-3" />
                      <div className="absolute w-10 h-6 bg-primary/30 rounded-full blur-md -top-1 -left-0" />
                      <div className="absolute w-6 h-4 bg-primary/40 rounded-full blur-sm top-0 left-2" />
                    </div>
                  </motion.div>
                )}
              </Link>
            )
          })}
      </div>
    </motion.div>
  )
}
