"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImageUpload } from "@/components/ui/image-upload"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import type { Plant } from "@/lib/types"

interface PlantFormProps {
  plant?: Plant
  isEditing?: boolean
}

export function PlantForm({ plant, isEditing = false }: PlantFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: plant?.name || "",
    species: plant?.species || "",
    purchase_date: plant?.purchase_date || "",
    image_url: plant?.image_url || "",
    water_amount: plant?.water_amount || 250,
    water_frequency: plant?.water_frequency || 7,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (
      !formData.name.trim() ||
      !formData.species.trim() ||
      !formData.water_amount ||
      !formData.water_frequency ||
      !formData.purchase_date.trim() ||
      !formData.image_url.trim()
    ) {
      setError("Tous les champs marqués d'un * sont obligatoires")
      setIsLoading(false)
      return
    }

    try {
      const url = isEditing && plant ? `/api/plants/${plant.id}` : "/api/plants"
      const method = isEditing ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          purchase_date: formData.purchase_date || null,
          image_url: formData.image_url || null,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Une erreur s'est produite")
      }

      router.push("/dashboard")
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Une erreur s'est produite")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Link>
          </Button>
          <CardTitle>{isEditing ? "Modifier la plante" : "Nouvelle plante"}</CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nom de la plante *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="ex: Mon Monstera"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="species">Espèce *</Label>
              <Input
                id="species"
                value={formData.species}
                onChange={(e) => handleChange("species", e.target.value)}
                placeholder="ex: Monstera Deliciosa"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="purchase_date">Date d'achat *</Label>
            <Input
              id="purchase_date"
              type="date"
              value={formData.purchase_date}
              onChange={(e) => handleChange("purchase_date", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <ImageUpload
              value={formData.image_url}
              onChange={(value) => handleChange("image_url", value)}
              disabled={isLoading}
              required={true}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="water_amount">Quantité d'eau (ml) *</Label>
              <Input
                id="water_amount"
                type="number"
                min="1"
                value={formData.water_amount}
                onChange={(e) => handleChange("water_amount", Number.parseInt(e.target.value) || 250)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="water_frequency">Fréquence d'arrosage (jours) *</Label>
              <Input
                id="water_frequency"
                type="number"
                min="1"
                value={formData.water_frequency}
                onChange={(e) => handleChange("water_frequency", Number.parseInt(e.target.value) || 7)}
                required
              />
            </div>
          </div>

          {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}

          <div className="flex space-x-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Enregistrement..." : isEditing ? "Mettre à jour" : "Ajouter la plante"}
            </Button>
            <Button asChild type="button" variant="outline">
              <Link href="/dashboard">Annuler</Link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
