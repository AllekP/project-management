"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/api"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data: notifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await api.get("/notifications")
      return res.data
    },
    refetchInterval: 30000 // Poll every minute
  })

  const markReadMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.put(`/notifications/${id}/read`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    }
  })

  const unreadCount = notifications?.filter((n: any) => !n.read).length || 0

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border-2 border-white" />
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-md border bg-white shadow-lg z-50">
          <div className="p-4 border-b">
            <h3 className="font-semibold text-sm">Notifications</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications?.length === 0 ? (
              <div className="p-4 text-center text-sm text-slate-500">No notifications</div>
            ) : (
              notifications?.map((n: any) => (
                <div
                  key={n.id}
                  className={cn(
                    "p-4 border-b last:border-0 hover:bg-slate-50 cursor-pointer transition-colors",
                    !n.read && "bg-blue-50/50"
                  )}
                  onClick={() => markReadMutation.mutate(n.id)}
                >
                  <p className="text-sm font-medium">{n.title}</p>
                  <p className="text-xs text-slate-600 mt-1">{n.message}</p>
                  <p className="text-[10px] text-slate-400 mt-2">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
