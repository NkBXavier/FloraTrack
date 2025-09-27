import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient()

  try {
    // Get all plants that need watering (next_watering is today or in the past)
    const { data: plants, error } = await supabase
      .from("plants")
      .select("*")
      .lte("next_watering", new Date().toISOString())
      .not("next_watering", "is", null)

    if (error) throw error

    const notifications = []

    for (const plant of plants || []) {
      // Check if we already have a recent notification for this plant
      const { data: existingNotification } = await supabase
        .from("notifications")
        .select("id")
        .eq("plant_id", plant.id)
        .eq("type", "watering_reminder")
        .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours
        .single()

      if (!existingNotification) {
        // Create a new notification
        const { data: notification, error: notificationError } = await supabase
          .from("notifications")
          .insert([
            {
              user_id: plant.user_id,
              plant_id: plant.id,
              type: "watering_reminder",
              title: `Temps d'arroser ${plant.name}`,
              message: `Il est temps d'arroser votre ${plant.name} (${plant.species}) !`,
              scheduled_for: new Date().toISOString(),
            },
          ])
          .select()
          .single()

        if (!notificationError && notification) {
          notifications.push(notification)
        }
      }
    }

    return NextResponse.json({
      message: `${notifications.length} notifications créées`,
      notifications,
    })
  } catch (error) {
    console.error("Error checking watering schedule:", error)
    return NextResponse.json({ error: "Erreur lors de la vérification des arrosages" }, { status: 500 })
  }
}
