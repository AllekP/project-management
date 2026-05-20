"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { useAuthStore } from "@/store/useAuthStore"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function GenericLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const token = useAuthStore((state) => state.token)
  const router = useRouter()

  useEffect(() => {
    if (!token) {
      router.push("/login")
    }
  }, [token, router])

  if (!token) return null

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  )
}
