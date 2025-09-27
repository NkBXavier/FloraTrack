"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Droplets, Edit, Calendar, TrendingUp } from "lucide-react"
import Link from "next/link"
import type { Plant, WateringHistory } from "@/lib/types"

interface PlantDetailsProps {
  plant: Plant
  wateringHistory: WateringHistory[]
}

export function PlantDetails({ plant, wateringHistory }: PlantDetailsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const isOverdue = (nextWatering: string | null) => {
    if (!nextWatering) return false
    return new Date(nextWatering) <= new Date()
  }

  const getDaysUntilWatering = (nextWatering: string | null) => {
    if (!nextWatering) return null
    const days = Math.ceil((new Date(nextWatering).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    return days
  }

  const needsWater = isOverdue(plant.next_watering)
  const daysUntilWatering = getDaysUntilWatering(plant.next_watering)

  // Calculate statistics
  const totalWaterings = wateringHistory.length
  const totalWaterUsed = wateringHistory.reduce((sum, watering) => sum + watering.amount, 0)
  const averageAmount = totalWaterings > 0 ? Math.round(totalWaterUsed / totalWaterings) : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{plant.name}</h1>
            <p className="text-muted-foreground">{plant.species}</p>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button asChild variant="outline" className="bg-transparent">
            <Link href={`/dashboard/plants/${plant.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Plant Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations de la plante</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {plant.image_url && (
                <div className="aspect-video rounded-lg bg-muted overflow-hidden">
                  <img
                    src={plant.image_url || "/placeholder.svg"}
                    alt={plant.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-2">Détails</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Espèce:</span>
                      <span>{plant.species}</span>
                    </div>
                    {plant.purchase_date && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date d'achat:</span>
                        <span>{formatDate(plant.purchase_date)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ajoutée le:</span>
                      <span>{formatDate(plant.created_at)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Besoins en eau</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Quantité:</span>
                      <span>{plant.water_amount} ml</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fréquence:</span>
                      <span>Tous les {plant.water_frequency} jours</span>
                    </div>
                    {plant.last_watered && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Dernier arrosage:</span>
                        <span>{formatDate(plant.last_watered)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {plant.notes && (
                <div>
                  <h4 className="font-medium mb-2">Notes</h4>
                  <p className="text-sm text-muted-foreground">{plant.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Watering History */}
          <Card>
            <CardHeader>
              <CardTitle>Historique d'arrosage</CardTitle>
            </CardHeader>
            <CardContent>
              {wateringHistory.length === 0 ? (
                <div className="text-center py-8">
                  <Droplets className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Aucun arrosage enregistré pour cette plante</p>
                  <Button asChild className="mt-4">
                    <Link href={`/dashboard/plants/${plant.id}/water`}>Premier arrosage</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {wateringHistory.map((watering) => (
                    <div key={watering.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Droplets className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">{watering.amount} ml</p>
                          <p className="text-sm text-muted-foreground">{formatDateTime(watering.watered_at)}</p>
                        </div>
                      </div>
                      {watering.notes && (
                        <div className="text-sm text-muted-foreground max-w-xs">
                          <p className="truncate">{watering.notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Statut d'arrosage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {plant.next_watering ? (
                <div className="text-center">
                  {needsWater ? (
                    <Badge variant="destructive" className="text-sm px-4 py-2">
                      À arroser maintenant
                    </Badge>
                  ) : daysUntilWatering !== null ? (
                    <Badge variant="secondary" className="text-sm px-4 py-2">
                      Dans {daysUntilWatering} jour{daysUntilWatering > 1 ? "s" : ""}
                    </Badge>
                  ) : null}
                  <p className="text-sm text-muted-foreground mt-2">
                    Prochain arrosage: {formatDate(plant.next_watering)}
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <Badge variant="outline" className="text-sm px-4 py-2">
                    Non planifié
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-2">Aucun arrosage programmé</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Statistiques</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Total arrosages</span>
                </div>
                <span className="font-medium">{totalWaterings}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Droplets className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Eau totale</span>
                </div>
                <span className="font-medium">{totalWaterUsed} ml</span>
              </div>

              {totalWaterings > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Moyenne</span>
                  </div>
                  <span className="font-medium">{averageAmount} ml</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
