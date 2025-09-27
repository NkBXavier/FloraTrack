import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { PlantGrid } from "@/components/dashboard/plant-grid"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Fetch user's plants
  const { data: plants } = await supabase
    .from("plants")
    .select("*")
    .eq("user_id", data.user.id)
    .order("created_at", { ascending: false })

  // Fetch recent watering history
  const { data: recentWaterings } = await supabase
    .from("watering_history")
    .select(`
      *,
      plants (name, species)
    `)
    .eq("user_id", data.user.id)
    .order("watered_at", { ascending: false })
    .limit(5)

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={data.user} />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <DashboardStats plants={plants || []} recentWaterings={recentWaterings || []} />
          <PlantGrid plants={plants || []} />
        </div>
      </main>
    </div>
  )
}
