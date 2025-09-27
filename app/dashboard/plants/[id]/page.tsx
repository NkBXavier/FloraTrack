import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PlantDetails } from "@/components/plants/plant-details"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

export default async function PlantDetailsPage({ params }: { params: Promise<{ id: string }> }) {
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

  // Fetch watering history
  const { data: wateringHistory } = await supabase
    .from("watering_history")
    .select("*")
    .eq("plant_id", id)
    .eq("user_id", data.user.id)
    .order("watered_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={data.user} />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <PlantDetails plant={plant} wateringHistory={wateringHistory || []} />
        </div>
      </main>
    </div>
  )
}
