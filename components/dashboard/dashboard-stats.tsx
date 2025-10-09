import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, Droplets, Calendar, TrendingUp } from "lucide-react"
import type { Plant, WateringHistory } from "@/lib/types"

interface DashboardStatsProps {
  plants: Plant[]
  recentWaterings: (WateringHistory & { plants: { name: string; species: string } })[]
}

export function DashboardStats({ plants, recentWaterings }: DashboardStatsProps) {
  // --- Calculs des statistiques principales ---
  const totalPlants = plants.length

  const plantsNeedingWater = plants.filter(
    (plant) => plant.next_watering && new Date(plant.next_watering) <= new Date()
  ).length

  const plantsNeedingEngrais = plants.filter(
    (plant) => plant.next_engrais && new Date(plant.next_engrais) <= new Date()
  ).length

  const totalWaterings = recentWaterings.length

  const averageWateringFrequency =
    plants.length > 0
      ? Math.round(plants.reduce((sum, p) => sum + p.water_frequency, 0) / plants.length)
      : 0

  // --- Affichage ---
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* 🪴 Total des plantes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total des plantes</CardTitle>
          <Leaf className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold text-primary">{totalPlants}</div>
            <p className="text-xs text-muted-foreground">
              {totalPlants === 0
                ? "Ajoutez votre première plante"
                : "plantes dans votre collection"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 💧 Plantes à arroser */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">À arroser</CardTitle>
          <Droplets className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold text-chart-1">{plantsNeedingWater}</div>
            <p className="text-xs text-muted-foreground">
              {plantsNeedingWater === 0
                ? "Toutes vos plantes sont hydratées"
                : "plantes ont besoin d'eau"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 📈 Récents arrosages */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Récents</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold text-chart-2">{totalWaterings}</div>
            <p className="text-xs text-muted-foreground">arrosages cette semaine</p>
          </div>
        </CardContent>
      </Card>

      {/* 📅 Fréquence moyenne */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Fréquence moyenne</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold text-chart-3">{averageWateringFrequency}</div>
            <p className="text-xs text-muted-foreground">jours entre les arrosages</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
