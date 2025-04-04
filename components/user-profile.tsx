"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { User, MessageSquare, Clock, CreditCard } from "lucide-react"

export default function UserProfile() {
  const [user] = useState({
    name: "Usuario Demo",
    email: "usuario@ejemplo.com",
    plan: "Básico",
    interactionsLeft: 45,
    totalInteractions: 100,
    memberSince: "15/03/2025",
  })

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Perfil de Usuario</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
          <div className="bg-primary/10 p-6 rounded-full">
            <User className="h-12 w-12 text-primary" />
          </div>
          <div className="text-center sm:text-left">
            <h3 className="text-xl font-medium">{user.name}</h3>
            <p className="text-muted-foreground">{user.email}</p>
            <div className="mt-2">
              <Badge variant="outline" className="bg-primary/10 text-primary">
                Plan {user.plan}
              </Badge>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Interacciones disponibles</span>
              <span className="text-sm font-medium">
                {user.interactionsLeft}/{user.totalInteractions}
              </span>
            </div>
            <Progress value={(user.interactionsLeft / user.totalInteractions) * 100} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 rounded-lg border">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Miembro desde</p>
                <p className="font-medium">{user.memberSince}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg border">
              <MessageSquare className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Consultas realizadas</p>
                <p className="font-medium">{user.totalInteractions - user.interactionsLeft}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <Button className="w-full sm:w-auto">
            <CreditCard className="h-4 w-4 mr-2" />
            Actualizar Plan
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

