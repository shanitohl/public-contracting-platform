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

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Aquí iría la llamada a la API para registro
      // Por ahora, simulamos un registro exitoso después de 1 segundo
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simulamos un registro exitoso
      router.push("/login?registered=true")
    } catch (err) {
      setError("Error al registrar la cuenta. Por favor, inténtalo de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  // Modificar la función handleGoogleRegister para redirigir al backend
  const handleGoogleRegister = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Redirigir al endpoint del backend que inicia el flujo OAuth
      window.location.href = "https://tu-backend-api.com/api/auth/google/login"
    } catch (err) {
      setError("Error al registrarse con Google. Por favor, inténtalo de nuevo.")
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Crear una cuenta</CardTitle>
          <CardDescription>Regístrate para acceder a InterpretaLex</CardDescription>
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
            onClick={handleGoogleRegister}
            disabled={isLoading}
          >
            <FcGoogle className="h-5 w-5" />
            <span>Registrarse con Google</span>
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-zinc-300 dark:border-zinc-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-zinc-900 px-2 text-zinc-500 dark:text-zinc-400">O regístrate con</span>
            </div>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo</Label>
              <Input
                id="name"
                placeholder="Tu nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
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
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Registrando..." : "Registrarse"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 text-center text-sm text-zinc-600 dark:text-zinc-400">
          <div>
            ¿Ya tienes una cuenta?{" "}
            <Button variant="link" className="h-auto p-0" onClick={() => router.push("/login")}>
              Inicia sesión
            </Button>
          </div>
          <div className="text-xs">
            Al registrarte, aceptas nuestros{" "}
            <Button variant="link" className="h-auto p-0 text-xs" onClick={() => router.push("/terms")}>
              términos y condiciones
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

