"use client"

import { useQuery } from "@tanstack/react-query"
import api from "@/lib/api"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Globe, Package } from "lucide-react"

export default function ClientsPage() {
  const { data: clients, isLoading } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const res = await api.get("/clients")
      return res.data
    }
  })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Clients</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> New Client
        </Button>
      </div>

      {isLoading ? (
        <div>Loading clients...</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {clients?.map((client: any) => (
            <Card key={client.id}>
              <CardHeader>
                <CardTitle>{client.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center text-sm text-slate-600">
                  <Package className="mr-2 h-4 w-4" />
                  {client.apps?.length || 0} Products
                </div>
                <div className="space-y-2">
                  {client.apps?.map((app: any) => (
                    <div key={app.id} className="text-xs bg-slate-100 px-2 py-1 rounded flex items-center">
                      <Globe className="mr-2 h-3 w-3" />
                      {app.name}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
          {clients?.length === 0 && <div className="col-span-full text-center py-12 text-slate-500">No clients yet.</div>}
        </div>
      )}
    </div>
  )
}
