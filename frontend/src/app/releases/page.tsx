"use client"

import { useQuery } from "@tanstack/react-query"
import api from "@/lib/api"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tag, Plus, Rocket, CheckCircle2 } from "lucide-react"
import { format } from "date-fns"

export default function ReleasesPage() {
  const { data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await api.get("/projects")
      return res.data
    }
  })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Release Management</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create Release
        </Button>
      </div>

      <div className="space-y-6">
        {projects?.map((project: any) => (
          <div key={project.id} className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center">
              <Rocket className="mr-2 h-5 w-5 text-purple-500" />
              {project.name} Releases
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* Mock Releases */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">v1.2.0</CardTitle>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">RELEASED</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 mb-4">Core engine updates and performance fixes.</p>
                  <div className="flex items-center text-xs text-slate-500">
                    <Tag className="mr-1 h-3 w-3" />
                    Released on May 15, 2024
                  </div>
                </CardContent>
              </Card>
              <Card className="border-dashed border-2">
                <CardHeader className="pb-2 text-slate-400">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">v1.3.0-rc.1</CardTitle>
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">PENDING</span>
                  </div>
                </CardHeader>
                <CardContent className="text-slate-400">
                  <p className="text-sm mb-4">Feature: Reporting module integration.</p>
                  <div className="flex items-center text-xs">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Targeting Jun 1, 2024
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
