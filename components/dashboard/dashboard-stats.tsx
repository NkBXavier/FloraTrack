import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, Droplets, Calendar, TrendingUp } from "lucide-react"
import type { Plant, WateringHistory, EngraisHistory } from "@/lib/types"

interface DashboardStatsProps {
  plants: Plant[]
  recentWaterings: (WateringHistory & { plants: { name: string; species: string } })[]
  recentEngrais: (EngraisHistory & { plants: { name: string; species: string } })[]
}

export function DashboardStats({ plants, recentWaterings, recentEngrais }: DashboardStatsProps) {
  const totalPlants = plants.length
  const plantsNeedingWater = plants.filter((plant) => {
    if (!plant.next_watering) return false
    return new Date(plant.next_watering) <= new Date()
  }).length

  const plantsNeedingEngrais = plants.filter((plant) => {
    if (!plant.next_engrais) return false
    return new Date(plant.next_engrais) <= new Date()
  }).length

  const totalWaterings = recentWaterings.length
  const totalEngrais = recentEngrais.length

  const averageWateringFrequency =
    plants.length > 0 ? Math.round(plants.reduce((sum, plant) => sum + plant.water_frequency, 0) / plants.length) : 0
  const averageEngraisFrequency =
    plants.length > 0 ? Math.round(plants.reduce((sum, plant) => sum + plant.engrais_frequency, 0) / plants.length) : 0

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
          <div className="flex items-center gap-6">
            {/* Bloc Hydratation */}
            <div className="flex flex-col items-center">
              <div className="text-2xl font-bold text-chart-1">{plantsNeedingWater}</div>
              <p className="text-xs text-muted-foreground">
                {plantsNeedingWater === 0
                  ? "Toutes vos plantes sont hydratées"
                  : "plantes ont besoin d'eau"}
              </p>
            </div>

            {/* Bloc Engrais */}
            <div className="flex flex-col items-center">
              <div className="text-2xl font-bold text-chart-1">{plantsNeedingEngrais}</div>
              <p className="text-xs text-muted-foreground">
                {plantsNeedingEngrais === 0
                  ? "Toutes vos plantes sont approvisionnées en engrais"
                  : "plantes ont besoin d'engrais"}
              </p>
            </div>
          </div>
        </CardContent>

      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Récents</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-8 justify-center">
            <div className="flex flex-col items-center text-center">
              <div className="text-2xl font-bold text-chart-2">Arrosage</div>
              <div className="text-2xl font-bold text-chart-2">{totalWaterings}</div>
              <p className="text-xs text-muted-foreground">cette semaine</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="text-2xl font-bold text-chart-2">Pulvérisation</div>
              <div className="text-2xl font-bold text-chart-2">{totalEngrais}</div>
              <p className="text-xs text-muted-foreground">cette semaine</p>
            </div>
          </div>
        </CardContent>

      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Fréquence moyenne</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex justify-center gap-12">
            {/* Fréquence arrosage */}
            <div className="flex flex-col items-center text-center">
              <div className="text-2xl font-bold text-chart-3">{averageWateringFrequency}</div>
              <p className="text-xs text-muted-foreground mt-1">jours entre les arrosages</p>
            </div>

            {/* Fréquence engrais */}
            <div className="flex flex-col items-center text-center">
              <div className="text-2xl font-bold text-chart-3">{averageEngraisFrequency}</div>
              <p className="text-xs text-muted-foreground mt-1">jours entre les pulvérisations</p>
            </div>
          </div>
        </CardContent>

      </Card>
    </div>
  )
}
