import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: plants, error: plantsError } = await supabase
    .from("plants")
    .select("*")
    .eq("user_id", data.user.id)
    .order("created_at", { ascending: false })

  if (plantsError) {
    return NextResponse.json({ error: plantsError.message }, { status: 500 })
  }

  return NextResponse.json(plants)
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { name, species, water_frequency, water_amount, engrais_amount, engrais_frequency, image_url } = body

  // Calculate next watering date
  const nextWatering = new Date()
  nextWatering.setDate(nextWatering.getDate() + water_frequency)

  // Calculate next engrais date
  const nextEngrais = new Date()
  nextEngrais.setDate(nextEngrais.getDate() + engrais_frequency)

  const { data: plant, error: plantError } = await supabase
    .from("plants")
    .insert({
      user_id: data.user.id,
      name,
      species,
      water_frequency,
      water_amount,
      engrais_frequency,
      engrais_amount,
      image_url,
      next_watering: nextWatering.toISOString(),
      next_engrais: nextEngrais.toISOString(),
    })
    .select()
    .single()

  if (plantError) {
    return NextResponse.json({ error: plantError.message }, { status: 500 })
  }

  return NextResponse.json(plant)
}
