"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, FolderKanban, Ticket, Users, Settings, LogOut, Clock, Briefcase } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/store/useAuthStore"
import { NotificationCenter } from "./notifications"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Projects", href: "/projects", icon: FolderKanban },
  { name: "Sprints", href: "/sprints", icon: Calendar },
  { name: "Issues", href: "/issues", icon: Ticket },
  { name: "Releases", href: "/releases", icon: Tag },
  { name: "Clients", href: "/clients", icon: Briefcase },
  { name: "Reports", href: "/reports", icon: LayoutDashboard },
  { name: "Time Tracking", href: "/time", icon: Clock },
  { name: "Team", href: "/team", icon: Users },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const logout = useAuthStore((state) => state.logout)

  return (
    <div className="flex h-full w-64 flex-col border-r bg-white">
      <div className="flex h-16 items-center justify-between border-b px-6">
        <span className="text-xl font-bold text-primary">WhiteLabel Ops</span>
        <NotificationCenter />
      </div>
      <nav className="flex-1 space-y-1 px-4 py-4">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center rounded-md px-3 py-2 text-sm font-medium",
                isActive
                  ? "bg-primary text-white"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 h-5 w-5 flex-shrink-0",
                  isActive ? "text-white" : "text-slate-400 group-hover:text-slate-500"
                )}
              />
              {item.name}
            </Link>
          )
        })}
      </nav>
      <div className="border-t p-4">
        <button
          onClick={() => logout()}
          className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
        >
          <LogOut className="mr-3 h-5 w-5 text-slate-400" />
          Logout
        </button>
      </div>
    </div>
  )
}
