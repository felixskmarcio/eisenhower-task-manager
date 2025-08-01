
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
}

interface NavBarProps {
  items: NavItem[]
  className?: string
}

export function NavBar({ items, className }: NavBarProps) {
  const location = useLocation()
  const [activeTab, setActiveTab] = useState("")
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Set active tab based on current path
    const currentItem = items.find(item => location.pathname === item.url || location.pathname.startsWith(`${item.url}/`))
    if (currentItem) {
      setActiveTab(currentItem.name)
    } else {
      setActiveTab(items[0].name)
    }
  }, [location.pathname, items])

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={cn(
        "fixed bottom-0 sm:bottom-auto sm:top-0 left-1/2 -translate-x-1/2 z-50 mb-6 sm:mt-6 sm:mb-0",
        className,
      )}
    >
      <motion.div
        className="flex items-center gap-2 sm:gap-3 bg-background/80 border border-border/50 backdrop-blur-xl py-1.5 px-2 rounded-full shadow-lg"
        initial={false}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.name

          return (
            <Link
              key={item.name}
              to={item.url}
              onClick={() => setActiveTab(item.name)}
              className={cn(
                "relative cursor-pointer text-sm font-medium px-4 sm:px-6 py-2.5 rounded-full transition-all duration-300",
                "text-foreground/70 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2",
                isActive ? "text-primary font-semibold" : "hover:bg-muted/50",
              )}
              role="button"
              aria-current={isActive ? "page" : undefined}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: isActive ? 1 : 0.9 }}
                className="flex items-center gap-2"
              >
                <Icon 
                  size={isMobile ? 20 : 18} 
                  strokeWidth={isActive ? 2.5 : 2} 
                  className={cn(
                    "transition-all duration-300",
                    isActive && "text-primary"
                  )}
                />
                <span className={cn(
                  "hidden md:inline transition-all",
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
              {isActive && (
                <motion.div
                  layoutId="active"
                  className="absolute bottom-0 left-0 right-0 w-full h-0.5 bg-primary"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              {isActive && (
                <motion.div
                  layoutId="hover"
                  className="absolute bottom-0 left-0 right-0 w-full h-0.5 bg-primary"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
            </Link>
          )
        })}
      </motion.div>
    </motion.div>
  )
}
