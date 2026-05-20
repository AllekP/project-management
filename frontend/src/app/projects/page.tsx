"use client"

import { useQuery } from "@tanstack/react-query"
import api from "@/lib/api"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Briefcase } from "lucide-react"

export default function ProjectsPage() {
  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await api.get("/projects")
      return res.data
    }
  })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> New Project
        </Button>
      </div>

      {isLoading ? (
        <div>Loading projects...</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects?.map((project: any) => (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <Card className="hover:border-primary transition-colors cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-bold">{project.name}</CardTitle>
                  <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded">{project.key}</span>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground flex items-center">
                    <Briefcase className="mr-2 h-4 w-4" />
                    {project.client?.name}
                  </div>
                  <p className="mt-2 text-sm line-clamp-2">{project.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
          {projects?.length === 0 && <div className="col-span-full text-center py-12 text-slate-500">No projects found. Create your first one!</div>}
        </div>
      )}
    </div>
  )
}
