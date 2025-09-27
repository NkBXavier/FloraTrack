"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Upload, X, ImageIcon } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
  value?: string
  onChange: (value: string) => void
  disabled?: boolean
  required?: boolean
}

export function ImageUpload({ value, onChange, disabled, required }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Vérifier le type de fichier
    if (!file.type.startsWith("image/")) {
      alert("Veuillez sélectionner un fichier image")
      return
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Le fichier est trop volumineux (max 5MB)")
      return
    }

    setIsUploading(true)

    try {
      // Créer une URL temporaire pour l'aperçu
      const imageUrl = URL.createObjectURL(file)
      onChange(imageUrl)
    } catch (error) {
      console.error("Erreur lors du traitement de l'image:", error)
      alert("Erreur lors du traitement de l'image")
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = () => {
    onChange("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      <Label>Image de la plante{required && " *"}</Label>

      {value ? (
        <div className="relative">
          <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-dashed border-border">
            <Image src={value || "/placeholder.svg"} alt="Aperçu de la plante" fill className="object-cover" />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={handleRemove}
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className={`w-full h-48 rounded-lg border-2 border-dashed transition-colors cursor-pointer flex flex-col items-center justify-center text-muted-foreground hover:text-primary ${
            required && !value ? "border-red-300 hover:border-red-400" : "border-border hover:border-primary/50"
          }`}
          onClick={handleClick}
        >
          <ImageIcon className="h-12 w-12 mb-4" />
          <p className="text-sm font-medium mb-2">Cliquez pour ajouter une image</p>
          <p className="text-xs">PNG, JPG, JPEG jusqu'à 5MB</p>
          {required && <p className="text-xs text-red-500 mt-1">Image obligatoire</p>}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
        required={required}
      />

      {!value && (
        <Button
          type="button"
          variant="outline"
          onClick={handleClick}
          disabled={disabled || isUploading}
          className="w-full bg-transparent"
        >
          <Upload className="h-4 w-4 mr-2" />
          {isUploading ? "Traitement..." : "Choisir une image"}
        </Button>
      )}
    </div>
  )
}
