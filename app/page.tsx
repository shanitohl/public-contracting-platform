"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { LogOut, Menu, AlertCircle, Sun, Moon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { createThread } from "@/lib/api"
import { useTheme } from "next-themes"
import Sidebar from "@/components/sidebar"
import ChatInterface from "@/components/chat-interface"
import { useAuth } from "@/components/auth-provider"

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeChat, setActiveChat] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [authError, setAuthError] = useState(false) // Cambiado a false para que el chat funcione por defecto
  const { user, logout } = useAuth()

  // After mounting, we can access the theme
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Check if there's a thread ID in localStorage
    const savedThreadId = localStorage.getItem("currentThreadId")
    if (savedThreadId) {
      setActiveChat(savedThreadId)
    } else {
      // Si no hay un thread activo, creamos uno nuevo
      handleNewChat()
    }
  }, [])

  const handleNewChat = async () => {
    try {
      setIsLoading(true)
      const response = await createThread()
      if (response.success && response.data) {
        const newThreadId = response.data.id
        localStorage.setItem("currentThreadId", newThreadId)
        setActiveChat(newThreadId)
      }
    } catch (err) {
      console.error("Error creating new chat:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRetryAuth = () => {
    // Simular reintento de autenticación
    setAuthError(false)
  }

  // Función para alternar entre modo claro y oscuro
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  // Si no hay usuario, la redirección se maneja en el AuthProvider

  return (
    <div className="flex h-screen bg-white dark:bg-zinc-900 transition-colors duration-200">
      {/* Sidebar para desktop */}
      <div className="hidden md:block md:w-64 md:flex-shrink-0 border-r border-zinc-200 dark:border-zinc-800">
        <Sidebar activeChat={activeChat} setActiveChat={setActiveChat} />
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col h-screen">
        {/* Header */}
        <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-4 py-3 flex justify-between items-center sticky top-0 z-10 transition-colors duration-200">
          <div className="flex items-center">
            {/* Botón del menú móvil con Sheet */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden mr-2">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64">
                <Sidebar
                  activeChat={activeChat}
                  setActiveChat={setActiveChat}
                  onSelectChat={() => setIsMobileMenuOpen(false)}
                />
              </SheetContent>
            </Sheet>
            <h1 className="text-xl font-bold text-zinc-800 dark:text-white">InterpretaLex</h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Botón para alternar entre modo claro y oscuro */}
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="h-8 w-8"
                aria-label={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            )}

            <Button variant="ghost" size="sm" asChild>
              <a href="/dashboard">Dashboard</a>
            </Button>

            <div className="flex items-center gap-2 ml-2">
              <Avatar className="h-8 w-8 bg-zinc-200 dark:bg-zinc-700">
                {user?.image ? (
                  <AvatarImage src={user.image} alt={user.name} />
                ) : (
                  <AvatarFallback className="text-zinc-800 dark:text-zinc-200">
                    {user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                )}
              </Avatar>
              <Button variant="ghost" size="sm" className="hidden sm:flex" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Salir
              </Button>
            </div>
          </div>
        </header>

        {/* Contenido del chat - Ahora ocupa todo el espacio disponible */}
        <main className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-zinc-900 transition-colors duration-200">
          {authError ? (
            <div className="p-4 max-w-4xl mx-auto space-y-4 w-full">
              {/* Tarjeta de información de configuración */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Información de configuración:</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 pt-0 text-sm">
                  <div>
                    <span className="font-medium">API URL:</span> https://v0-backend-de-intrepreta-lex-ai.vercel.app/
                  </div>
                  <div>
                    <span className="font-medium">API Key:</span> api_k..._test
                  </div>
                  <div>
                    <span className="font-medium">Estado de autenticación:</span> Fallido
                  </div>
                </CardContent>
              </Card>

              {/* Tarjeta de error de autenticación */}
              <Card className="border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-900/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center text-red-600 dark:text-red-400">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    Error de autenticación
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 pt-0 text-sm">
                  <p>Error al verificar autenticación: NetworkError when attempting to fetch resource.</p>
                  <div className="pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-200 hover:bg-red-100 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20"
                      onClick={handleRetryAuth}
                    >
                      Reintentar autenticación
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="flex-1 flex flex-col h-full">
              {/* Componente de chat existente - Ahora ocupa todo el espacio disponible */}
              <div className="flex-1 flex flex-col h-full p-4">
                <ChatInterface key={activeChat} threadId={activeChat} />
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 p-2 text-center text-xs text-zinc-500 dark:text-zinc-400 transition-colors duration-200">
          <p>© 2025 InterpretaLex - Plataforma de Asesoría en Contratación Pública del Perú</p>
        </footer>
      </div>
    </div>
  )
}

