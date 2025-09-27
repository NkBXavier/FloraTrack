-- Create profiles table for user management
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- Create plants table
CREATE TABLE IF NOT EXISTS public.plants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  species TEXT NOT NULL,
  purchase_date DATE,
  image_url TEXT,
  water_amount INTEGER NOT NULL DEFAULT 250, -- in ml
  water_frequency INTEGER NOT NULL DEFAULT 7, -- in days
  last_watered TIMESTAMP WITH TIME ZONE,
  next_watering TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on plants
ALTER TABLE public.plants ENABLE ROW LEVEL SECURITY;

-- Plants policies
CREATE POLICY "plants_select_own" ON public.plants FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "plants_insert_own" ON public.plants FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "plants_update_own" ON public.plants FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "plants_delete_own" ON public.plants FOR DELETE USING (auth.uid() = user_id);

-- Create watering_history table
CREATE TABLE IF NOT EXISTS public.watering_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plant_id UUID NOT NULL REFERENCES public.plants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  watered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  amount INTEGER NOT NULL, -- in ml
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on watering_history
ALTER TABLE public.watering_history ENABLE ROW LEVEL SECURITY;

-- Watering history policies
CREATE POLICY "watering_history_select_own" ON public.watering_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "watering_history_insert_own" ON public.watering_history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "watering_history_update_own" ON public.watering_history FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "watering_history_delete_own" ON public.watering_history FOR DELETE USING (auth.uid() = user_id);

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plant_id UUID NOT NULL REFERENCES public.plants(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'watering_reminder',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  scheduled_for TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Notifications policies
CREATE POLICY "notifications_select_own" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notifications_insert_own" ON public.notifications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "notifications_update_own" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "notifications_delete_own" ON public.notifications FOR DELETE USING (auth.uid() = user_id);
