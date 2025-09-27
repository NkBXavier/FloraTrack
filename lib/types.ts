export interface Plant {
  id: string
  user_id: string
  name: string
  species: string
  purchase_date?: string
  image_url?: string
  water_amount: number // in ml
  water_frequency: number // in days
  last_watered?: string
  next_watering?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  email: string
  full_name?: string
  created_at: string
  updated_at: string
}

export interface WateringHistory {
  id: string
  plant_id: string
  user_id: string
  watered_at: string
  amount: number // in ml
  notes?: string
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  plant_id: string
  type: string
  title: string
  message: string
  is_read: boolean
  scheduled_for?: string
  created_at: string
}
