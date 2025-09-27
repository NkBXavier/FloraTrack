import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, Droplets, Calendar, TrendingUp } from "lucide-react"
import type { Plant, WateringHistory } from "@/lib/types"

interface DashboardStatsProps {
  plants: Plant[]
  recentWaterings: (WateringHistory & { plants: { name: string; species: string } })[]
}

export function DashboardStats({ plants, recentWaterings }: DashboardStatsProps) {
  const totalPlants = plants.length
  const plantsNeedingWater = plants.filter((plant) => {
    if (!plant.next_watering) return false
    return new Date(plant.next_watering) <= new Date()
  }).length

  const totalWaterings = recentWaterings.length
  const averageWateringFrequency =
    plants.length > 0 ? Math.round(plants.reduce((sum, plant) => sum + plant.water_frequency, 0) / plants.length) : 0

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total des plantes</CardTitle>
          <Leaf className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{totalPlants}</div>
          <p className="text-xs text-muted-foreground">
            {totalPlants === 0 ? "Ajoutez votre première plante" : "plantes dans votre collection"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">À arroser</CardTitle>
          <Droplets className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-chart-1">{plantsNeedingWater}</div>
          <p className="text-xs text-muted-foreground">
            {plantsNeedingWater === 0 ? "Toutes vos plantes sont hydratées" : "plantes ont besoin d'eau"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Arrosages récents</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-chart-2">{totalWaterings}</div>
          <p className="text-xs text-muted-foreground">cette semaine</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Fréquence moyenne</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-chart-3">{averageWateringFrequency}</div>
          <p className="text-xs text-muted-foreground">jours entre les arrosages</p>
        </CardContent>
      </Card>
    </div>
  )
}
