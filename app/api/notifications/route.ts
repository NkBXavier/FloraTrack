import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
  }

  try {
    // Get all notifications for the user
    const { data: notifications, error } = await supabase
      .from("notifications")
      .select(
        `
        *,
        plants (name, species)
      `,
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ notifications })
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération des notifications" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { plant_id, type, title, message, scheduled_for } = body

    const { data: notification, error } = await supabase
      .from("notifications")
      .insert([
        {
          user_id: user.id,
          plant_id,
          type,
          title,
          message,
          scheduled_for,
        },
      ])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ notification })
  } catch (error) {
    console.error("Error creating notification:", error)
    return NextResponse.json({ error: "Erreur lors de la création de la notification" }, { status: 500 })
  }
}
