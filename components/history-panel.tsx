"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, Trash2 } from "lucide-react"

type HistoryItem = {
  id: string
  title: string
  date: string
  messageCount: number
}

export default function HistoryPanel() {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading history data
    setTimeout(() => {
      const mockHistory: HistoryItem[] = [
        {
          id: "1",
          title: "Consulta sobre procesos de selección",
          date: "30/03/2025",
          messageCount: 8,
        },
        {
          id: "2",
          title: "Requisitos para contratación directa",
          date: "29/03/2025",
          messageCount: 5,
        },
        {
          id: "3",
          title: "Plazos en licitaciones públicas",
          date: "28/03/2025",
          messageCount: 12,
        },
      ]
      setHistory(mockHistory)
      setIsLoading(false)
    }, 1000)
  }, [])

  const handleDeleteHistory = (id: string) => {
    setHistory(history.filter((item) => item.id !== id))
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle>Historial de Consultas</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : history.length > 0 ? (
          <div className="space-y-4">
            {history.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.date} • {item.messageCount} mensajes
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteHistory(item.id)}>
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">No hay consultas en tu historial</div>
        )}
      </CardContent>
    </Card>
  )
}

