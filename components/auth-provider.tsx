"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

type User = {
  id?: string
  name: string
  email: string
  image?: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("authToken")
      const storedUser = localStorage.getItem("user")

      if (token) {
        try {
          // Verificar si el token es válido
          const response = await fetch("https://tu-backend-api.com/api/auth/verify", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (response.ok) {
            const data = await response.json()
            if (data.valid) {
              setUser(data.user)
            } else {
              // Token inválido, limpiar datos
              localStorage.removeItem("authToken")
              localStorage.removeItem("user")
              setUser(null)
            }
          } else {
            // Error en la verificación, limpiar datos
            localStorage.removeItem("authToken")
            localStorage.removeItem("user")
            setUser(null)
          }
        } catch (error) {
          console.error("Error al verificar token:", error)
          // En caso de error, usar los datos almacenados localmente
          if (storedUser) {
            setUser(JSON.parse(storedUser))
          }
        }
      } else if (storedUser) {
        // No hay token pero sí hay datos de usuario
        setUser(JSON.parse(storedUser))
      }

      setIsLoading(false)
    }

    verifyToken()
  }, [router])

  useEffect(() => {
    // Redirigir a login si no hay usuario y no estamos en páginas públicas
    if (!isLoading && !user && !isPublicRoute(pathname)) {
      router.push("/login")
    }
  }, [user, isLoading, pathname, router])

  // Modificar la función login para manejar tokens JWT
  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Llamada a la API para login
      const response = await fetch("https://tu-backend-api.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error("Error al iniciar sesión")
      }

      const data = await response.json()

      // Guardar el token JWT
      localStorage.setItem("authToken", data.token)

      // Guardar datos del usuario
      setUser(data.user)
      localStorage.setItem("user", JSON.stringify(data.user))

      router.push("/")
    } catch (error) {
      console.error("Error de login:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithGoogle = async () => {
    // En una implementación real, esto redireccionaría al flujo de OAuth
    window.location.href = "/api/auth/google"
  }

  // Modificar la función logout para invalidar el token
  const logout = async () => {
    try {
      const token = localStorage.getItem("authToken")

      if (token) {
        // Llamar al endpoint de logout en el backend
        await fetch("https://tu-backend-api.com/api/auth/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    } finally {
      // Limpiar datos locales independientemente de la respuesta del servidor
      localStorage.removeItem("authToken")
      localStorage.removeItem("user")
      setUser(null)
      router.push("/login")
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, loginWithGoogle, logout }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider")
  }
  return context
}

// Función para determinar si una ruta es pública
function isPublicRoute(pathname: string) {
  const publicRoutes = ["/login", "/register", "/terms", "/privacy"]
  return publicRoutes.includes(pathname)
}

