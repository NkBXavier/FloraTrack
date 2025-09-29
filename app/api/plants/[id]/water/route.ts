import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    console.log("Watering plant with ID:", id)
    
    const supabase = await createClient()

    // Get the authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error("Authentication error:", authError)
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    console.log("User authenticated:", user.id)

    // Get the plant to ensure it belongs to the user
    const { data: plant, error: plantError } = await supabase
      .from("plants")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()

    if (plantError) {
      console.error("Plant fetch error:", plantError)
      return NextResponse.json({ error: "Erreur lors de la récupération de la plante" }, { status: 500 })
    }

    if (!plant) {
      console.error("Plant not found for user:", user.id, "plant ID:", id)
      return NextResponse.json({ error: "Plante non trouvée" }, { status: 404 })
    }

    console.log("Plant found:", plant.name, "Water amount:", plant.water_amount)

    // Record the watering with current timestamp and default values
    const wateringData = {
      plant_id: plant.id,
      user_id: user.id,
      amount: plant.water_amount,
      watered_at: new Date().toISOString(),
    }

    console.log("Inserting watering record:", wateringData)

    const { data: wateringRecord, error: wateringError } = await supabase
      .from("watering_history")
      .insert([wateringData])
      .select()
      .single()

    if (wateringError) {
      console.error("Watering insert error:", wateringError)
      return NextResponse.json({ 
        error: "Erreur lors de l'enregistrement de l'arrosage",
        details: wateringError.message 
      }, { status: 500 })
    }

    console.log("Watering record created:", wateringRecord)

    // Verify that the plant was updated by the trigger
    const { data: updatedPlant, error: updateError } = await supabase
      .from("plants")
      .select("last_watered, next_watering")
      .eq("id", plant.id)
      .single()

    if (updateError) {
      console.error("Plant update verification error:", updateError)
    } else {
      console.log("Plant updated - Last watered:", updatedPlant.last_watered, "Next watering:", updatedPlant.next_watering)
    }

    return NextResponse.json({ 
      success: true, 
      watering: wateringRecord,
      plant: updatedPlant 
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ 
      error: "Erreur interne du serveur",
      details: error instanceof Error ? error.message : "Erreur inconnue"
    }, { status: 500 })
  }
}
