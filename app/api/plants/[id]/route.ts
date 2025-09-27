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
  const { id } = params
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { name, species, water_frequency, water_amount, image_url } = body

  const { data: plant, error: plantError } = await supabase
    .from("plants")
    .update({
      name,
      species,
      water_frequency,
      water_amount,
      image_url,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", data.user.id)
    .select()
    .single()

  if (plantError) {
    return NextResponse.json({ error: plantError.message }, { status: 500 })
  }

  return NextResponse.json(plant)
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
