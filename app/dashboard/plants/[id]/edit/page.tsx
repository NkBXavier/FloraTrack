import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PlantForm } from "@/components/plants/plant-form"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

export default async function EditPlantPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Fetch the plant
  const { data: plant } = await supabase.from("plants").select("*").eq("id", id).eq("user_id", data.user.id).single()

  if (!plant) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={data.user} />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Modifier {plant.name}</h1>
            <p className="text-muted-foreground mt-2">Mettez à jour les informations de votre plante</p>
          </div>

          <PlantForm plant={plant} isEditing={true} />
        </div>
      </main>
    </div>
  )
}
