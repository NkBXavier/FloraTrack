import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, Droplets, Bell, Calendar } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Leaf className="h-12 w-12 text-primary mr-3" />
            <h1 className="text-4xl font-bold text-balance">GreenTrack</h1>
          </div>
          <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
            Prenez soin de vos plantes d'intérieur avec notre système intelligent de suivi et de rappels d'arrosage
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="text-center">
            <CardHeader>
              <Leaf className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">Gestion des Plantes</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Ajoutez et gérez toutes vos plantes avec leurs informations détaillées</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Droplets className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">Suivi d'Arrosage</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Enregistrez chaque arrosage et consultez l'historique complet</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Bell className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">Rappels Intelligents</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Recevez des notifications personnalisées pour chaque plante</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">Planification</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Organisez vos soins selon les besoins spécifiques de chaque plante</CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Commencez dès maintenant</CardTitle>
              <CardDescription>Créez votre compte et commencez à prendre soin de vos plantes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="w-full" size="lg">
                <Link href="/auth/sign-up">Créer un compte</Link>
              </Button>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/auth/login">Se connecter</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
