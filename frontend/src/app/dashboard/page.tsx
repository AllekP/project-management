"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import api from "@/lib/api"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function DashboardPage() {
  const { data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await api.get("/projects")
      return res.data
    }
  })

  const { data: issues } = useQuery({
    queryKey: ["issues"],
    queryFn: async () => {
      const res = await api.get("/issues")
      return res.data
    }
  })

  const stats = [
    { title: "Total Projects", value: projects?.length || 0 },
    { title: "Active Issues", value: issues?.filter((i: any) => i.status !== "DONE").length || 0 },
    { title: "Completed Sprints", value: 12 }, // Mock
    { title: "Total Time Logged", value: "156h" }, // Mock
  ]

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Issue Status Distribution</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: "Todo", count: issues?.filter((i: any) => i.status === "TODO").length || 0 },
                { name: "In Progress", count: issues?.filter((i: any) => i.status === "IN_PROGRESS").length || 0 },
                { name: "In Review", count: issues?.filter((i: any) => i.status === "IN_REVIEW").length || 0 },
                { name: "Done", count: issues?.filter((i: any) => i.status === "DONE").length || 0 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
