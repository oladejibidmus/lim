"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { BarChart3, Mail, Users, Settings, HelpCircle, Home, Workflow, ChevronLeft, ChevronRight } from "lucide-react"

interface SidebarProps {
  currentPage: string
  onPageChange: (page: string) => void
}

const navigation = [
  { name: "Dashboard", href: "dashboard", icon: Home },
  { name: "Campaigns", href: "campaigns", icon: Mail },
  { name: "Sequences", href: "sequences", icon: Workflow },
  { name: "Contacts", href: "contacts", icon: Users },
  { name: "Analytics", href: "analytics", icon: BarChart3 },
  { name: "Settings", href: "settings", icon: Settings },
  { name: "Help", href: "help", icon: HelpCircle },
]

export function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div
      className={cn(
        "bg-white border-r border-gray-200 flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-orange-800">
              <Mail className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">EmailFlow</span>
          </div>
        )}
        <Button variant="ghost" size="sm" onClick={() => setCollapsed(!collapsed)} className="p-1.5">
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => (
          <Button
            key={item.name}
            variant={currentPage === item.href ? "default" : "ghost"}
            className={cn("w-full justify-start", collapsed ? "px-2" : "px-3")}
            size={collapsed ? "sm" : "default"}
            onClick={() => onPageChange(item.href)}
          >
            <item.icon className={cn("h-4 w-4 text-orange-700", collapsed ? "" : "mr-3")} />
            {!collapsed && <span>{item.name}</span>}
          </Button>
        ))}
      </nav>
    </div>
  )
}
