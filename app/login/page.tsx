"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import { FcGoogle } from "react-icons/fc"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Aquí iría la llamada a la API para login con email/password
      // Por ahora, simulamos un login exitoso después de 1 segundo
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simulamos un login exitoso
      localStorage.setItem("user", JSON.stringify({ email, name: email.split("@")[0] }))
      router.push("/")
    } catch (err) {
      setError("Error al iniciar sesión. Por favor, inténtalo de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  // Modificar la función handleGoogleLogin para redirigir al backend
  const handleGoogleLogin = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Redirigir al endpoint del backend que inicia el flujo OAuth
      window.location.href = "http://localhost:3001/api/auth/google/login"
    } catch (err) {
      setError("Error al iniciar sesión con Google. Por favor, inténtalo de nuevo.")
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">InterpretaLex</CardTitle>
          <CardDescription>
            Inicia sesión para acceder a la plataforma de asesoría en contratación pública
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/10 text-red-800 dark:text-red-200 p-3 rounded-md text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <Button
            variant="outline"
            className="w-full flex items-center gap-2 h-10"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <FcGoogle className="h-5 w-5" />
            <span>Continuar con Google</span>
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-zinc-300 dark:border-zinc-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-zinc-900 px-2 text-zinc-500 dark:text-zinc-400">O continúa con</span>
            </div>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
                <Button variant="link" className="h-auto p-0 text-xs">
                  ¿Olvidaste tu contraseña?
                </Button>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 text-center text-sm text-zinc-600 dark:text-zinc-400">
          <div>
            ¿No tienes una cuenta?{" "}
            <Button variant="link" className="h-auto p-0" onClick={() => router.push("/register")}>
              Regístrate
            </Button>
          </div>
          <div className="text-xs">
            Al iniciar sesión, aceptas nuestros{" "}
            <Button variant="link" className="h-auto p-0 text-xs" onClick={() => router.push("/terms")}>
              términos y condiciones
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

