import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Vérifier le type de fichier
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 })
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 })
    }

    // Créer un nom de fichier unique
    const fileExt = file.name.split('.').pop()
    const fileName = `${data.user.id}/${Date.now()}.${fileExt}`
    
    // Convertir le fichier en buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload vers Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('plant-images')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false
      })

    if (uploadError) {
      console.error("Upload error:", uploadError)
      return NextResponse.json({ error: "Upload failed" }, { status: 500 })
    }

    // Obtenir l'URL publique
    const { data: { publicUrl } } = supabase.storage
      .from('plant-images')
      .getPublicUrl(fileName)

    return NextResponse.json({ 
      url: publicUrl,
      path: uploadData.path 
    })

  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
