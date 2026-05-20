"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/api"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Plus, MoreHorizontal } from "lucide-react"

const COLUMNS = [
  { id: "TODO", title: "To Do" },
  { id: "IN_PROGRESS", title: "In Progress" },
  { id: "IN_REVIEW", title: "In Review" },
  { id: "DONE", title: "Done" },
]

export default function IssuesPage() {
  const queryClient = useQueryClient()
  const { data: issues, isLoading } = useQuery({
    queryKey: ["issues"],
    queryFn: async () => {
      const res = await api.get("/issues")
      return res.data
    }
  })

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      return api.put(`/issues/${id}`, { status })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] })
    }
  })

  const onDragEnd = (result: any) => {
    if (!result.destination) return
    const { draggableId, destination } = result
    updateStatusMutation.mutate({ id: draggableId, status: destination.droppableId })
  }

  if (isLoading) return <div>Loading board...</div>

  return (
    <div className="space-y-8 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Issues Board</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> New Issue
        </Button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex-1 flex gap-6 overflow-x-auto pb-4">
          {COLUMNS.map((column) => (
            <div key={column.id} className="w-80 flex-shrink-0 flex flex-col bg-slate-100/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-slate-700">{column.title}</h2>
                <span className="text-xs bg-white px-2 py-0.5 rounded border">
                  {issues?.filter((i: any) => i.status === column.id).length || 0}
                </span>
              </div>

              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="flex-1 space-y-3 min-h-[200px]"
                  >
                    {issues?.filter((i: any) => i.status === column.id).map((issue: any, index: number) => (
                      <Draggable key={issue.id} draggableId={issue.id} index={index}>
                        {(provided) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-white hover:shadow-md transition-shadow"
                          >
                            <CardContent className="p-4 space-y-3">
                              <div className="flex justify-between items-start">
                                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                                  {issue.project?.key}-{issue.id.split('-')[0]}
                                </span>
                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </div>
                              <p className="text-sm font-medium leading-tight">{issue.title}</p>
                              <div className="flex items-center justify-between mt-4">
                                <div className="flex -space-x-2">
                                  {issue.assignee ? (
                                    <div className="h-6 w-6 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px]">
                                      {issue.assignee.firstName?.[0]}{issue.assignee.lastName?.[0]}
                                    </div>
                                  ) : (
                                    <div className="h-6 w-6 rounded-full bg-slate-100 border-2 border-white border-dashed" />
                                  )}
                                </div>
                                <span className={cn(
                                  "text-[10px] px-1.5 py-0.5 rounded font-bold uppercase",
                                  issue.priority === "URGENT" ? "bg-red-100 text-red-700" :
                                  issue.priority === "HIGH" ? "bg-orange-100 text-orange-700" :
                                  "bg-slate-100 text-slate-700"
                                )}>
                                  {issue.priority}
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
