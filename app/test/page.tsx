import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf } from "lucide-react"

export default function TestPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Leaf className="h-8 w-8 text-primary mr-2" />
            <h1 className="text-3xl font-bold">Test Page - GreenTrack</h1>
          </div>
          <p className="text-muted-foreground">Cette page teste que tous les composants fonctionnent correctement</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Composants UI</CardTitle>
              <CardDescription>Test des composants de base</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button>Bouton Principal</Button>
              <Button variant="outline">Bouton Outline</Button>
              <Button variant="secondary">Bouton Secondaire</Button>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm">Zone avec background muted</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Couleurs</CardTitle>
              <CardDescription>Test de la palette de couleurs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="h-8 bg-primary rounded flex items-center px-3">
                <span className="text-primary-foreground text-sm">Primary</span>
              </div>
              <div className="h-8 bg-secondary rounded flex items-center px-3">
                <span className="text-secondary-foreground text-sm">Secondary</span>
              </div>
              <div className="h-8 bg-accent rounded flex items-center px-3">
                <span className="text-accent-foreground text-sm">Accent</span>
              </div>
              <div className="h-8 bg-muted rounded flex items-center px-3">
                <span className="text-muted-foreground text-sm">Muted</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Si vous voyez cette page correctement, l'application fonctionne ! 🎉
          </p>
        </div>
      </div>
    </div>
  )
}
