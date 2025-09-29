"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Bug, CheckCircle, XCircle, AlertTriangle } from "lucide-react"

interface ImageDebugProps {
  imageUrl?: string
  plantName?: string
}

export function ImageDebug({ imageUrl, plantName }: ImageDebugProps) {
  const [testResults, setTestResults] = useState<{
    urlValid: boolean
    accessible: boolean
    type: string
    size?: number
    error?: string
  } | null>(null)
  const [isTesting, setIsTesting] = useState(false)

  const testImage = async () => {
    if (!imageUrl) return

    setIsTesting(true)
    setTestResults(null)

    try {
      // Test 1: URL valide
      const urlValid = imageUrl.startsWith('http') || imageUrl.startsWith('data:') || imageUrl.startsWith('/')
      
      // Test 2: Accessibilité
      let accessible = false
      let type = 'unknown'
      let size: number | undefined
      let error: string | undefined

      if (imageUrl.startsWith('data:')) {
        // Image base64
        accessible = true
        type = 'base64'
        size = imageUrl.length
      } else if (imageUrl.startsWith('http')) {
        // Image externe
        try {
          const response = await fetch(imageUrl, { method: 'HEAD' })
          accessible = response.ok
          type = response.headers.get('content-type') || 'unknown'
          size = parseInt(response.headers.get('content-length') || '0')
        } catch (err) {
          accessible = false
          error = err instanceof Error ? err.message : 'Erreur inconnue'
        }
      } else if (imageUrl.startsWith('/')) {
        // Image locale
        accessible = true
        type = 'local'
      }

      setTestResults({
        urlValid,
        accessible,
        type,
        size,
        error
      })
    } catch (error) {
      setTestResults({
        urlValid: false,
        accessible: false,
        type: 'error',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      })
    } finally {
      setIsTesting(false)
    }
  }

  if (!imageUrl) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Aucune image configurée pour cette plante
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bug className="h-5 w-5" />
          Diagnostic d'image
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">URL de l'image :</h4>
          <code className="text-xs bg-muted p-2 rounded block break-all">
            {imageUrl}
          </code>
        </div>

        <Button 
          onClick={testImage} 
          disabled={isTesting}
          variant="outline"
          size="sm"
        >
          {isTesting ? "Test en cours..." : "Tester l'image"}
        </Button>

        {testResults && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-medium">URL valide :</span>
              {testResults.urlValid ? (
                <Badge variant="default" className="bg-green-500">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Oui
                </Badge>
              ) : (
                <Badge variant="destructive">
                  <XCircle className="h-3 w-3 mr-1" />
                  Non
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="font-medium">Accessible :</span>
              {testResults.accessible ? (
                <Badge variant="default" className="bg-green-500">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Oui
                </Badge>
              ) : (
                <Badge variant="destructive">
                  <XCircle className="h-3 w-3 mr-1" />
                  Non
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="font-medium">Type :</span>
              <Badge variant="secondary">{testResults.type}</Badge>
            </div>

            {testResults.size && (
              <div className="flex items-center gap-2">
                <span className="font-medium">Taille :</span>
                <Badge variant="secondary">
                  {testResults.size > 1024 * 1024 
                    ? `${(testResults.size / (1024 * 1024)).toFixed(1)} MB`
                    : `${(testResults.size / 1024).toFixed(1)} KB`
                  }
                </Badge>
              </div>
            )}

            {testResults.error && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  Erreur : {testResults.error}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        <div className="pt-4 border-t">
          <h4 className="font-medium mb-2">Aperçu :</h4>
          <div className="w-full h-32 bg-muted rounded-lg overflow-hidden">
            <img 
              src={imageUrl} 
              alt={plantName || "Test image"}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
                e.currentTarget.nextElementSibling?.classList.remove('hidden')
              }}
            />
            <div className="hidden w-full h-full flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <XCircle className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">Image non accessible</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
