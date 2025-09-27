-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', '')
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to update next_watering date when plant is watered
CREATE OR REPLACE FUNCTION public.update_next_watering()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Update the plant's last_watered and next_watering dates
  UPDATE public.plants 
  SET 
    last_watered = NEW.watered_at,
    next_watering = NEW.watered_at + (water_frequency || ' days')::INTERVAL,
    updated_at = NOW()
  WHERE id = NEW.plant_id;
  
  RETURN NEW;
END;
$$;

-- Trigger to update next watering date
DROP TRIGGER IF EXISTS on_watering_recorded ON public.watering_history;
CREATE TRIGGER on_watering_recorded
  AFTER INSERT ON public.watering_history
  FOR EACH ROW
  EXECUTE FUNCTION public.update_next_watering();

-- Function to create watering notifications
CREATE OR REPLACE FUNCTION public.create_watering_notification(
  p_user_id UUID,
  p_plant_id UUID,
  p_plant_name TEXT,
  p_scheduled_for TIMESTAMP WITH TIME ZONE
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO public.notifications (user_id, plant_id, type, title, message, scheduled_for)
  VALUES (
    p_user_id,
    p_plant_id,
    'watering_reminder',
    'Temps d''arroser ' || p_plant_name,
    'Il est temps d''arroser votre ' || p_plant_name || ' !',
    p_scheduled_for
  )
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$;
