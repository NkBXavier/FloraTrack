import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Get the authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    // Get the plant to ensure it belongs to the user
    const { data: plant, error: plantError } = await supabase
      .from("plants")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()

    if (plantError || !plant) {
      return NextResponse.json({ error: "Plante non trouvée" }, { status: 404 })
    }

    // Record the watering with current timestamp and default values
    const { error: wateringError } = await supabase.from("watering_history").insert([
      {
        plant_id: plant.id,
        user_id: user.id,
        amount: plant.water_amount,
        notes: null,
        watered_at: new Date().toISOString(),
      },
    ])

    if (wateringError) {
      console.error("Watering error:", wateringError)
      return NextResponse.json({ error: "Erreur lors de l'enregistrement de l'arrosage" }, { status: 500 })
    }

    // The trigger will automatically update the plant's next_watering date
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
