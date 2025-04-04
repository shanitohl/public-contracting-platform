"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MessageSquare, Plus, Settings } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { createThread } from "@/lib/api"

interface SidebarProps {
  activeChat: string | null
  setActiveChat: (chatId: string | null) => void
  onSelectChat?: () => void
}

type ChatItem = {
  id: string
  title: string
  icon?: React.ReactNode
}

export default function Sidebar({ activeChat, setActiveChat, onSelectChat }: SidebarProps) {
  const [isLoading, setIsLoading] = useState(false)

  // Datos simulados para las categorías
  const todayChats: ChatItem[] = [
    { id: "1", title: "Requisitos de licitación municipal" },
    { id: "2", title: "Plazos para impugnaciones" },
    { id: "3", title: "Garantías en contratos públicos" },
  ]

  const yesterdayChats: ChatItem[] = [
    { id: "4", title: "Documentos para registro de proveedores" },
    { id: "5", title: "Penalidades por incumplimiento" },
    { id: "6", title: "Criterios de evaluación en licitaciones" },
  ]

  const olderChats: ChatItem[] = [
    { id: "7", title: "Bases estandarizadas" },
    { id: "8", title: "Procedimientos especiales" },
    { id: "9", title: "Contrataciones directas" },
    { id: "10", title: "Recursos de apelación" },
  ]

  const handleNewChat = async () => {
    try {
      setIsLoading(true)
      const response = await createThread()
      if (response.success && response.data) {
        const newThreadId = response.data.id
        localStorage.setItem("currentThreadId", newThreadId)
        setActiveChat(newThreadId)
        window.location.reload()
      }
    } catch (err) {
      console.error("Error creating new chat:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectChat = (chatId: string) => {
    setActiveChat(chatId)
    localStorage.setItem("currentThreadId", chatId)
    if (onSelectChat) onSelectChat()
  }

  // Componente para renderizar una categoría de chats
  const ChatCategory = ({ title, items }: { title: string; items: ChatItem[] }) => (
    <div className="mb-4">
      <h3 className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1 px-3">{title}</h3>
      <div className="space-y-0.5">
        {items.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            className={`w-full justify-start text-left h-auto py-1.5 px-3 ${
              activeChat === item.id
                ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                : "text-zinc-700 dark:text-zinc-300"
            }`}
            onClick={() => handleSelectChat(item.id)}
          >
            <div className="flex items-center gap-2 w-full">
              <MessageSquare className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{item.title}</span>
            </div>
          </Button>
        ))}
      </div>
    </div>
  )

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900 transition-colors duration-200">
      <div className="p-3">
        <Button
          variant="outline"
          className="w-full justify-start bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 transition-colors duration-200"
          onClick={handleNewChat}
          disabled={isLoading}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nueva consulta
        </Button>
      </div>

      <ScrollArea className="flex-1 px-3">
        <ChatCategory title="Hoy" items={todayChats} />
        <ChatCategory title="Ayer" items={yesterdayChats} />
        <ChatCategory title="Anteriores" items={olderChats} />
      </ScrollArea>

      <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 mt-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
              <span className="text-sm font-medium">JP</span>
            </div>
            <div>
              <p className="text-sm font-medium">Juan Pérez</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Plan Gratuito</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

