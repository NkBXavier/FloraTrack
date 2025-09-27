import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PlantForm } from "@/components/plants/plant-form"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

export default async function NewPlantPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={data.user} />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Ajouter une nouvelle plante</h1>
            <p className="text-muted-foreground mt-2">
              Remplissez les informations de votre plante pour commencer le suivi
            </p>
          </div>

          <PlantForm />
        </div>
      </main>
    </div>
  )
}
