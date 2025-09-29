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
      // Essayer d'abord l'upload vers Supabase Storage
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        // Upload réussi vers Supabase
        const { url } = await response.json()
        onChange(url)
      } else {
        // Fallback: utiliser une URL de données base64
        console.warn("Upload vers Supabase échoué, utilisation du fallback base64")
        const reader = new FileReader()
        reader.onload = (event) => {
          const base64Url = event.target?.result as string
          onChange(base64Url)
        }
        reader.readAsDataURL(file)
      }
    } catch (error) {
      console.error("Erreur lors du traitement de l'image:", error)
      
      // Fallback en cas d'erreur
      try {
        const reader = new FileReader()
        reader.onload = (event) => {
          const base64Url = event.target?.result as string
          onChange(base64Url)
        }
        reader.readAsDataURL(file)
      } catch (fallbackError) {
        alert("Erreur lors du traitement de l'image")
      }
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
            <Image 
              src={value || "/placeholder.svg"} 
              alt="Aperçu de la plante" 
              fill 
              className="object-cover"
              unoptimized={value?.startsWith('data:')}
              onError={(e) => {
                console.error('Erreur de chargement de l\'aperçu:', value)
                e.currentTarget.src = "/placeholder.svg"
              }}
            />
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                  <p className="text-sm">Traitement...</p>
                </div>
              </div>
            )}
          </div>
          <div className="absolute top-2 right-2 flex gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleClick}
              disabled={disabled || isUploading}
            >
              <Upload className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleRemove}
              disabled={disabled}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
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

      {/* Bouton pour changer l'image quand une image existe déjà */}
      {value && (
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClick}
            disabled={disabled || isUploading}
            className="flex-1"
          >
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? "Traitement..." : "Changer l'image"}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleRemove}
            disabled={disabled}
          >
            <X className="h-4 w-4 mr-2" />
            Supprimer
          </Button>
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

    </div>
  )
}
