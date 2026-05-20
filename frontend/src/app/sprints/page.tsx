"use client"

import { useQuery } from "@tanstack/react-query"
import api from "@/lib/api"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Plus, CheckCircle2, Clock } from "lucide-react"
import { format } from "date-fns"

export default function SprintsPage() {
  const { data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await api.get("/projects")
      return res.data
    }
  })

  // For simplicity, we just show sprints for all projects here
  // In a real app, you'd select a project first
  const { data: issues } = useQuery({
    queryKey: ["issues"],
    queryFn: async () => {
      const res = await api.get("/issues")
      return res.data
    }
  })

  const backlogIssues = issues?.filter((i: any) => !i.sprintId) || []

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Sprint Planning</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create Sprint
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-semibold flex items-center">
            <Clock className="mr-2 h-5 w-5 text-blue-500" />
            Active & Upcoming Sprints
          </h2>
          {/* Mock Active Sprint */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Sprint 1: Foundation</CardTitle>
                  <p className="text-sm text-slate-500 mt-1 flex items-center">
                    <Calendar className="mr-1 h-3 w-3" />
                    May 20 - Jun 3 (2 weeks)
                  </p>
                </div>
                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded font-bold">ACTIVE</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 text-sm mt-2">
                <div className="flex flex-col">
                  <span className="text-slate-500">Progress</span>
                  <span className="font-bold">45%</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-500">Issues</span>
                  <span className="font-bold">12</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-500">Points</span>
                  <span className="font-bold">34</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold flex items-center">
            <CheckCircle2 className="mr-2 h-5 w-5 text-slate-400" />
            Backlog ({backlogIssues.length})
          </h2>
          <div className="space-y-3">
            {backlogIssues.map((issue: any) => (
              <Card key={issue.id} className="p-3 hover:border-primary transition-colors cursor-pointer">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold text-slate-500">
                    {issue.project?.key}-{issue.id.split('-')[0]}
                  </span>
                </div>
                <p className="text-sm font-medium mt-1">{issue.title}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
