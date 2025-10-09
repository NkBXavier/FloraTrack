import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: plant, error: plantError } = await supabase
    .from("plants")
    .select("*")
    .eq("id", id)
    .eq("user_id", data.user.id)
    .single()

  if (plantError) {
    return NextResponse.json({ error: plantError.message }, { status: 500 })
  }

  return NextResponse.json(plant)
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const supabase = await createClient()

    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let body
    try {
      body = await request.json()
    } catch (parseError) {
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 })
    }

    const { name, species, water_frequency, water_amount, image_url, purchase_date } = body

  // Récupérer la plante actuelle pour comparer les changements
  const { data: currentPlant, error: fetchError } = await supabase
    .from("plants")
    .select("*")
    .eq("id", id)
    .eq("user_id", data.user.id)
    .single()

  if (fetchError || !currentPlant) {
    return NextResponse.json({ error: "Plant not found" }, { status: 404 })
  }

  // Construire l'objet de mise à jour avec seulement les champs fournis
  const updateData: any = {
    updated_at: new Date().toISOString(),
  }

  // Ajouter seulement les champs qui sont fournis et non vides
  if (name !== undefined && name.trim()) updateData.name = name.trim()
  if (species !== undefined && species.trim()) updateData.species = species.trim()
  if (water_frequency !== undefined && water_frequency > 0) updateData.water_frequency = water_frequency
  if (water_amount !== undefined && water_amount > 0) updateData.water_amount = water_amount
  if (image_url !== undefined) updateData.image_url = image_url || null
  if (purchase_date !== undefined) updateData.purchase_date = purchase_date || null

  // Si la fréquence d'arrosage a changé et qu'il y a un dernier arrosage, recalculer next_watering
  const frequencyChanged = water_frequency !== undefined && water_frequency !== currentPlant.water_frequency
  if (frequencyChanged && currentPlant.last_watered) {
    const lastWateredDate = new Date(currentPlant.last_watered)
    const newNextWatering = new Date(lastWateredDate)
    newNextWatering.setDate(lastWateredDate.getDate() + water_frequency)
    updateData.next_watering = newNextWatering.toISOString()
  } else if (frequencyChanged && !currentPlant.last_watered) {
    // Si pas de dernier arrosage, calculer à partir d'aujourd'hui
    const nextWatering = new Date()
    nextWatering.setDate(nextWatering.getDate() + water_frequency)
    updateData.next_watering = nextWatering.toISOString()
  }

    const { data: plant, error: plantError } = await supabase
      .from("plants")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", data.user.id)
      .select()
      .single()

    if (plantError) {
      console.error('Database error:', plantError)
      return NextResponse.json({ error: plantError.message }, { status: 500 })
    }

    console.log('Plant updated successfully:', { id, frequencyChanged, newFrequency: water_frequency, nextWatering: updateData.next_watering })
    return NextResponse.json(plant)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ 
      error: "Internal server error", 
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { error: deleteError } = await supabase.from("plants").delete().eq("id", id).eq("user_id", data.user.id)

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
