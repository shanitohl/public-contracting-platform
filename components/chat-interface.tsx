"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Send, Bot, PaperclipIcon } from "lucide-react"
import { sendChatMessage } from "@/lib/api"
import FormattedResponse from "./formatted-response"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { AlertTriangle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
}

interface ChatInterfaceProps {
  threadId: string | null
}

// Preguntas predefinidas
const DEFAULT_QUESTIONS = [
  "¿Cuáles son los requisitos para participar en una licitación pública?",
  "¿Qué plazos debo considerar para presentar una impugnación?",
  "¿Cuáles son las causales de nulidad en un proceso de contratación?",
]

export default function ChatInterface({ threadId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isTyping, setIsTyping] = useState(false)
  const [questionCount, setQuestionCount] = useState(0)

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  // Cargar el contador de preguntas del localStorage al iniciar
  useEffect(() => {
    const today = new Date().toLocaleDateString()
    const savedCount = localStorage.getItem(`questionCount_${today}`)
    if (savedCount) {
      setQuestionCount(Number.parseInt(savedCount, 10))
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !threadId || isLoading) return

    await sendMessage(input)
  }

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || !threadId || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setError(null)
    setIsTyping(true)

    // Incrementar el contador de preguntas y guardarlo en localStorage
    const newCount = questionCount + 1
    setQuestionCount(newCount)
    const today = new Date().toLocaleDateString()
    localStorage.setItem(`questionCount_${today}`, newCount.toString())

    try {
      const response = await sendChatMessage(threadId, messageText)

      // Process the streaming response
      let fullResponse = ""
      let messageId = ""

      // Parse the response and accumulate the text
      response.split("\n").forEach((line) => {
        if (line.startsWith("5:")) {
          // Extract message ID
          try {
            const data = JSON.parse(line.substring(2))
            messageId = data.messageId || ""
          } catch (e) {
            console.error("Error parsing message ID:", e)
          }
        } else if (line.startsWith("0:")) {
          // Extract message content
          const content = line.substring(2).replace(/^"|"$/g, "")
          fullResponse += content
        }
      })

      // Add the assistant's message to the chat
      if (fullResponse) {
        const assistantMessage: Message = {
          id: messageId || Date.now().toString(),
          role: "assistant",
          content: fullResponse,
        }
        setMessages((prev) => [...prev, assistantMessage])
      }
    } catch (err) {
      setError("Error al enviar el mensaje")
      console.error(err)
    } finally {
      setIsLoading(false)
      setIsTyping(false)
    }
  }

  // Función para determinar si un mensaje necesita formato especial
  const needsFormatting = (content: string): boolean => {
    return (
      content.includes("\\n") || // Contiene saltos de línea
      content.includes("**") || // Contiene texto en negrita
      content.includes("【") || // Contiene referencias
      /^\d+\.\s/.test(content.split("\\n")[0]) // Comienza con lista numerada
    )
  }

  // Función para manejar el clic en una pregunta predefinida
  const handleQuestionClick = (question: string) => {
    sendMessage(question)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-zinc-500 dark:text-zinc-400 transition-colors duration-200 py-12">
            <div className="bg-zinc-100 dark:bg-zinc-800 p-6 rounded-full mb-4 transition-colors duration-200">
              <Bot className="h-12 w-12 text-zinc-600 dark:text-zinc-300 transition-colors duration-200" />
            </div>
            <h3 className="text-lg font-medium text-zinc-800 dark:text-zinc-200 transition-colors duration-200">
              ¡Hola! Soy tu asistente virtual especializado en contratación pública peruana.
            </h3>
            <p className="mt-2 max-w-md text-zinc-600 dark:text-zinc-400 transition-colors duration-200">
              ¿En qué puedo ayudarte hoy?
            </p>

            {/* Preguntas predefinidas en cards horizontales */}
            <div className="mt-8 w-full max-w-4xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {DEFAULT_QUESTIONS.map((question, index) => (
                  <Card
                    key={index}
                    className="cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                    onClick={() => handleQuestionClick(question)}
                  >
                    <CardContent className="p-4">
                      <p className="text-sm text-zinc-800 dark:text-zinc-200">{question}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 animate-slideIn ${
                  message.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <Avatar
                  className={`${message.role === "user" ? "bg-zinc-800 dark:bg-zinc-200" : "bg-zinc-200 dark:bg-zinc-700"} h-8 w-8 transition-colors duration-200`}
                >
                  <AvatarFallback
                    className={`${message.role === "user" ? "text-white dark:text-zinc-800" : "text-zinc-800 dark:text-zinc-200"} transition-colors duration-200`}
                  >
                    {message.role === "user" ? "U" : "A"}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`max-w-[80%] rounded-lg p-4 shadow-sm ${
                    message.role === "user"
                      ? "bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-800 rounded-tr-none"
                      : "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 rounded-tl-none"
                  } transition-colors duration-200`}
                >
                  {message.role === "assistant" && needsFormatting(message.content) ? (
                    <FormattedResponse content={message.content} />
                  ) : (
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-start gap-3">
                <Avatar className="bg-zinc-200 dark:bg-zinc-700 h-8 w-8 transition-colors duration-200">
                  <AvatarFallback className="text-zinc-800 dark:text-zinc-200 transition-colors duration-200">
                    A
                  </AvatarFallback>
                </Avatar>
                <div className="max-w-[80%] rounded-lg p-4 bg-zinc-100 dark:bg-zinc-800 rounded-tl-none shadow-sm transition-colors duration-200">
                  <div className="typing-indicator">
                    <span className="bg-zinc-400 dark:bg-zinc-400 transition-colors duration-200"></span>
                    <span className="bg-zinc-400 dark:bg-zinc-400 transition-colors duration-200"></span>
                    <span className="bg-zinc-400 dark:bg-zinc-400 transition-colors duration-200"></span>
                  </div>
                </div>
              </div>
            )}
            {error && (
              <div className="flex justify-center">
                <div className="max-w-[80%] rounded-lg p-3 bg-red-100 dark:bg-red-900/10 text-red-800 dark:text-red-200 shadow-sm transition-colors duration-200">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    {error}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input de mensaje */}
      <div className="sticky bottom-0 bg-white dark:bg-zinc-900 pt-2 transition-colors duration-200">
        <form onSubmit={handleSubmit} className="relative">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu consulta sobre contratación pública..."
            disabled={isLoading || !threadId}
            className="pr-20 bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-600 focus-visible:ring-zinc-500 transition-colors duration-200"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" disabled={isLoading || !threadId}>
              <PaperclipIcon className="h-4 w-4" />
            </Button>
            <Button
              type="submit"
              size="icon"
              className="h-8 w-8 bg-zinc-800 hover:bg-zinc-700 dark:bg-zinc-200 dark:hover:bg-zinc-300 dark:text-zinc-800"
              disabled={isLoading || !input.trim() || !threadId}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </form>

        {/* Contador de preguntas realizadas hoy */}
        <div className="mt-3 text-center text-sm text-zinc-500 dark:text-zinc-400">
          <p>{questionCount} consultas realizadas hoy</p>
        </div>
      </div>
    </div>
  )
}

