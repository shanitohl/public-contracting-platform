import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TermsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Términos Legales y Políticas de Privacidad</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h3 className="text-xl font-medium">1. Términos de Uso</h3>
            <p className="mt-2 text-muted-foreground">
              Al acceder y utilizar la plataforma InterpretaLex, usted acepta cumplir con estos términos y condiciones
              de uso. La plataforma está diseñada para proporcionar información y asesoramiento general sobre
              contratación pública en Perú, pero no sustituye el asesoramiento legal profesional.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-medium">2. Limitación de Responsabilidad</h3>
            <p className="mt-2 text-muted-foreground">
              La información proporcionada por InterpretaLex se ofrece de buena fe y se basa en la interpretación de las
              leyes y regulaciones vigentes. Sin embargo, no garantizamos la exactitud, integridad o actualidad de la
              información. El usuario asume toda la responsabilidad por las decisiones tomadas en base a la información
              proporcionada.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-medium">3. Política de Privacidad</h3>
            <p className="mt-2 text-muted-foreground">
              Recopilamos y procesamos datos personales de acuerdo con la Ley de Protección de Datos Personales de Perú.
              La información que nos proporciona se utiliza exclusivamente para mejorar nuestros servicios y
              personalizar su experiencia. No compartimos sus datos con terceros sin su consentimiento explícito.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-medium">4. Propiedad Intelectual</h3>
            <p className="mt-2 text-muted-foreground">
              Todo el contenido de InterpretaLex, incluyendo textos, gráficos, logotipos, iconos y software, está
              protegido por derechos de autor y otras leyes de propiedad intelectual. No está permitida la reproducción,
              distribución o modificación de este contenido sin autorización previa.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-medium">5. Modificaciones</h3>
            <p className="mt-2 text-muted-foreground">
              Nos reservamos el derecho de modificar estos términos y políticas en cualquier momento. Los cambios
              entrarán en vigor inmediatamente después de su publicación en la plataforma. El uso continuado de
              InterpretaLex después de dichos cambios constituye su aceptación de los mismos.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  )
}

