const API_URL = "http://localhost:3001/api"; //"https://v0-backend-de-intrepreta-lex-ai.vercel.app/api"
const API_KEY = "your-api-secret-key"

type ThreadResponse = {
  success: boolean
  data?: {
    id: string
    createdAt: string
    metadata: Record<string, any>
  }
  error?: string
}

export async function createThread(): Promise<ThreadResponse> {
  try {
    const response = await fetch(`${API_URL}/assistant/threads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
      body: JSON.stringify({
        message: "Hola",
        jsonResponse: false,
      }),
    })

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error creating thread:", error)
    return { success: false, error: "Error al crear el hilo de conversación" }
  }
}

export async function sendChatMessage(threadId: string, message: string): Promise<string> {
  try {
    const response = await fetch(`${API_URL}/assistant/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
      body: JSON.stringify({
        threadId,
        message,
        jsonResponse: false,
      }),
    })

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }

    const text = await response.text()
    return text
  } catch (error) {
    console.error("Error sending chat message:", error)
    throw error
  }
}

