import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    console.log("Engrais plant with ID:", id)
    
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
      return NextResponse.json(
        { error: "Erreur lors de la récupération de la plante" },
        { status: 500 }
      )
    }

    if (!plant) {
      console.error("Plant not found for user:", user.id, "plant ID:", id)
      return NextResponse.json({ error: "Plante non trouvée" }, { status: 404 })
    }

    console.log(
      "Plant found:",
      plant.name,
      "Engrais amount:",
      plant.engrais_amount
    )

    // Record the engrais with current timestamp
    const engraisData = {
      plant_id: plant.id,
      user_id: user.id,
      amount: plant.engrais_amount,
      engrais_at: new Date().toISOString(),
    }

    console.log("Inserting engrais record:", engraisData)

    const { data: engraisRecord, error: engraisError } = await supabase
      .from("engrais_history")
      .insert([engraisData])
      .select()
      .single()

    if (engraisError) {
      console.error("Engrais insert error:", engraisError)
      return NextResponse.json(
        {
          error: "Erreur lors de l'enregistrement de la pulvérisation",
          details: engraisError.message,
        },
        { status: 500 }
      )
    }

    console.log("Engrais record created:", engraisRecord)

    // Verify that the plant was updated by the trigger
    const { data: updatedPlant, error: updateError } = await supabase
      .from("plants")
      .select("last_engrais, next_engrais")
      .eq("id", plant.id)
      .single()

    if (updateError) {
      console.error("Plant update verification error:", updateError)
    } else {
      console.log(
        "Plant updated - Last engrais:",
        updatedPlant.last_engrais,
        "Next engrais:",
        updatedPlant.next_engrais
      )
    }

    return NextResponse.json({
      success: true,
      engrais: engraisRecord,
      plant: updatedPlant,
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      {
        error: "Erreur interne du serveur",
        details: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    )
  }
}
