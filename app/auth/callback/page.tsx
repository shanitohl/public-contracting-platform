"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const token = searchParams.get("token")

    if (token) {
      // Almacenar el token en localStorage o en una cookie segura
      localStorage.setItem("authToken", token)

      // Obtener información del usuario usando el token
      fetch("https://tu-backend-api.com/api/auth/verify", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.valid) {
            // Guardar información del usuario
            localStorage.setItem("user", JSON.stringify(data.user))
            // Redirigir a la página principal
            router.push("/")
          } else {
            // Manejar error de token inválido
            router.push("/login?error=invalid_token")
          }
        })
        .catch(() => {
          router.push("/login?error=server_error")
        })
    } else {
      router.push("/login?error=no_token")
    }
  }, [router, searchParams])

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2 text-zinc-800 dark:text-zinc-200">Autenticando...</h2>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      </div>
    </div>
  )
}

