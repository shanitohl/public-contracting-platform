"use client"

import type React from "react"
import { BookOpen, AlertTriangle, Info, CheckCircle, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface FormattedResponseProps {
  content: string
}

export default function FormattedResponse({ content }: FormattedResponseProps) {
  // Limpiamos las referencias como 【22:0†source】
  const cleanedContent = content.replace(/【\d+:\d+†[^】]+】/g, "")

  // Detectamos el tipo de contenido para aplicar estilos específicos
  const isLegalNorm = content.includes("Reglamento") || content.includes("Ley") || content.includes("Directiva")
  const isWarning = content.includes("advertencia") || content.includes("precaución") || content.includes("atención")
  const isAdvice = content.includes("recomendación") || content.includes("sugerencia") || content.includes("consejo")

  // Determinamos la clase CSS basada en el tipo de contenido
  const contentTypeClass = isLegalNorm ? "legal-norm" : isWarning ? "warning" : isAdvice ? "advice" : ""

  // Determinamos el icono basado en el tipo de contenido
  const ContentIcon = isLegalNorm ? BookOpen : isWarning ? AlertTriangle : isAdvice ? Info : CheckCircle

  // Convertimos los \n en saltos de línea reales
  const contentParts = cleanedContent.split("\\n")

  // Procesamos cada línea del contenido
  const formattedContent = contentParts.map((line, index) => {
    // Procesamos listas numeradas (1., 2., etc.)
    if (/^\d+\.\s/.test(line)) {
      const [number, ...rest] = line.split(/\s(.+)/)
      return (
        <div key={index} className="flex gap-2 my-3 animate-fadeIn">
          <span className="font-bold text-zinc-800 dark:text-zinc-200 transition-colors duration-200">{number}</span>
          <span>{processBoldText(rest.join(" "))}</span>
        </div>
      )
    }

    // Procesamos el texto normal
    return (
      <p
        key={index}
        className={`${index > 0 ? "mt-3" : ""} animate-fadeIn`}
        style={{ animationDelay: `${index * 50}ms` }}
      >
        {processBoldText(line)}
      </p>
    )
  })

  // Función para copiar el texto al portapapeles
  const copyToClipboard = () => {
    navigator.clipboard.writeText(cleanedContent)
  }

  return (
    <div className={`formatted-response ${contentTypeClass}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <ContentIcon className="h-5 w-5 text-zinc-600 dark:text-zinc-300 transition-colors duration-200" />
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-colors duration-200">
            {isLegalNorm
              ? "Normativa Legal"
              : isWarning
                ? "Advertencia Importante"
                : isAdvice
                  ? "Recomendación"
                  : "Información"}
          </span>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors duration-200"
                onClick={copyToClipboard}
              >
                <Copy className="h-4 w-4" />
                <span className="sr-only">Copiar texto</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Copiar texto</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      {formattedContent}
    </div>
  )
}

// Función para procesar texto en negrita y términos clave
function processBoldText(text: string): React.ReactNode {
  if (!text) return null

  // Lista de términos legales clave para destacar
  const legalTerms = [
    "contratación pública",
    "licitación",
    "adjudicación",
    "OSCE",
    "contratista",
    "entidad",
    "obra",
    "servicio",
    "bien",
    "consultoría",
    "ampliación de plazo",
    "adicional",
    "penalidad",
    "garantía",
    "bases",
    "términos de referencia",
    "expediente técnico",
  ]

  // Primero procesamos el texto en negrita
  const processedText = text
  if (text.includes("**")) {
    const parts = text.split(/(\*\*.*?\*\*)/g)
    return parts.map((part, index) => {
      // Si es un texto en negrita, lo envolvemos en un <strong>
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong
            key={index}
            className="font-semibold text-zinc-900 dark:text-zinc-100 bg-zinc-200/50 dark:bg-zinc-700/50 px-1 rounded transition-colors duration-200"
          >
            {part.slice(2, -2)}
          </strong>
        )
      }

      // Para el texto normal, buscamos términos legales para destacar
      return <span key={index}>{highlightLegalTerms(part, legalTerms, index)}</span>
    })
  }

  // Si no hay texto en negrita, solo buscamos términos legales
  return highlightLegalTerms(text, legalTerms, 0)
}

// Función para destacar términos legales
function highlightLegalTerms(text: string, terms: string[], baseIndex: number): React.ReactNode {
  const result = text
  const elements: React.ReactNode[] = []
  let lastIndex = 0

  // Creamos una expresión regular para buscar todos los términos
  const termsRegex = new RegExp(`\\b(${terms.join("|")})\\b`, "gi")
  let match

  // Buscamos todas las coincidencias
  while ((match = termsRegex.exec(text)) !== null) {
    // Añadimos el texto antes del término
    if (match.index > lastIndex) {
      elements.push(<span key={`${baseIndex}-${lastIndex}`}>{text.substring(lastIndex, match.index)}</span>)
    }

    // Añadimos el término destacado
    elements.push(
      <TooltipProvider key={`${baseIndex}-${match.index}`}>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="text-zinc-700 dark:text-zinc-300 font-medium cursor-help border-b border-dashed border-zinc-500 dark:border-zinc-400 transition-colors duration-200">
              {match[0]}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">Término legal relevante</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    )

    lastIndex = match.index + match[0].length
  }

  // Añadimos el texto restante
  if (lastIndex < text.length) {
    elements.push(<span key={`${baseIndex}-${lastIndex}`}>{text.substring(lastIndex)}</span>)
  }

  return elements.length > 0 ? elements : text
}

