"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

export default function TestDatabasePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const [envCheck, setEnvCheck] = useState<any>(null)

  const checkEnvironmentVariables = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    setEnvCheck({
      url: supabaseUrl ? "✅ Présent" : "❌ Manquant",
      anonKey: supabaseAnonKey ? "✅ Présent" : "❌ Manquant",
      urlValue: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : "Non défini",
      anonKeyValue: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : "Non défini"
    })
  }

  const testSupabaseConnection = async () => {
    setIsLoading(true)
    const supabase = createClient()
    const testResults: any[] = []

    try {
      // Test 1: Connexion de base
      testResults.push({
        test: "Connexion Supabase",
        status: "loading",
        message: "Test en cours..."
      })
      setResults([...testResults])

      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        testResults[0] = {
          test: "Connexion Supabase",
          status: "error",
          message: `Erreur: ${sessionError.message}`
        }
      } else {
        testResults[0] = {
          test: "Connexion Supabase",
          status: "success",
          message: "Connexion réussie"
        }
      }

      // Test 2: Authentification
      testResults.push({
        test: "Authentification",
        status: "loading",
        message: "Test en cours..."
      })
      setResults([...testResults])

      const { data: userData, error: userError } = await supabase.auth.getUser()
      
      if (userError) {
        testResults[1] = {
          test: "Authentification",
          status: "error",
          message: `Erreur: ${userError.message}`
        }
      } else {
        testResults[1] = {
          test: "Authentification",
          status: "success",
          message: userData.user ? `Utilisateur connecté: ${userData.user.email}` : "Aucun utilisateur connecté"
        }
      }

      // Test 3: Lecture des plantes
      testResults.push({
        test: "Lecture des plantes",
        status: "loading",
        message: "Test en cours..."
      })
      setResults([...testResults])

      const { data: plantsData, error: plantsError } = await supabase
        .from("plants")
        .select("id, name, species")
        .limit(5)

      if (plantsError) {
        testResults[2] = {
          test: "Lecture des plantes",
          status: "error",
          message: `Erreur: ${plantsError.message}`
        }
      } else {
        testResults[2] = {
          test: "Lecture des plantes",
          status: "success",
          message: `${plantsData?.length || 0} plantes trouvées`
        }
      }

      // Test 4: Lecture des profils
      testResults.push({
        test: "Lecture des profils",
        status: "loading",
        message: "Test en cours..."
      })
      setResults([...testResults])

      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, email, full_name")
        .limit(5)

      if (profilesError) {
        testResults[3] = {
          test: "Lecture des profils",
          status: "error",
          message: `Erreur: ${profilesError.message}`
        }
      } else {
        testResults[3] = {
          test: "Lecture des profils",
          status: "success",
          message: `${profilesData?.length || 0} profils trouvés`
        }
      }

    } catch (error) {
      testResults.push({
        test: "Erreur générale",
        status: "error",
        message: `Erreur inattendue: ${error instanceof Error ? error.message : "Erreur inconnue"}`
      })
    }

    setResults(testResults)
    setIsLoading(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "loading":
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Test de Connexion Base de Données</h1>
          <p className="text-muted-foreground mt-2">
            Page de diagnostic pour vérifier la connexion à Supabase en production
          </p>
        </div>

        {/* Variables d'environnement */}
        <Card>
          <CardHeader>
            <CardTitle>Variables d'Environnement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={checkEnvironmentVariables} variant="outline">
              Vérifier les variables d'environnement
            </Button>
            
            {envCheck && (
              <div className="space-y-2">
                <Alert>
                  <AlertDescription>
                    <div className="space-y-1">
                      <div>NEXT_PUBLIC_SUPABASE_URL: {envCheck.url}</div>
                      <div>NEXT_PUBLIC_SUPABASE_ANON_KEY: {envCheck.anonKey}</div>
                      <div className="text-xs text-muted-foreground mt-2">
                        URL: {envCheck.urlValue}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Clé: {envCheck.anonKeyValue}
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tests de connexion */}
        <Card>
          <CardHeader>
            <CardTitle>Tests de Connexion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={testSupabaseConnection} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Test en cours...
                </>
              ) : (
                "Lancer les tests de connexion"
              )}
            </Button>

            {results.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold">Résultats des tests:</h3>
                {results.map((result, index) => (
                  <Alert key={index}>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(result.status)}
                      <div>
                        <div className="font-medium">{result.test}</div>
                        <div className="text-sm text-muted-foreground">{result.message}</div>
                      </div>
                    </div>
                  </Alert>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>1. Variables d'environnement:</strong> Vérifiez que NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY sont bien configurées dans Vercel.</p>
              <p><strong>2. Tests de connexion:</strong> Lancez les tests pour vérifier chaque étape de la connexion.</p>
              <p><strong>3. En cas d'erreur:</strong> Vérifiez les logs Vercel et la configuration Supabase.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
