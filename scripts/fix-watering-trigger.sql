-- Script pour corriger et tester la fonction d'arrosage

-- 1. Supprimer l'ancien trigger et la fonction
DROP TRIGGER IF EXISTS on_watering_recorded ON public.watering_history;
DROP FUNCTION IF EXISTS public.update_next_watering();

-- 2. Recréer la fonction corrigée
CREATE OR REPLACE FUNCTION public.update_next_watering()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  plant_frequency INTEGER;
BEGIN
  -- Get the plant's water frequency
  SELECT water_frequency INTO plant_frequency 
  FROM public.plants 
  WHERE id = NEW.plant_id;
  
  -- Check if plant_frequency is valid
  IF plant_frequency IS NULL OR plant_frequency <= 0 THEN
    RAISE EXCEPTION 'Invalid water frequency for plant %: %', NEW.plant_id, plant_frequency;
  END IF;
  
  -- Update the plant's last_watered and next_watering dates
  UPDATE public.plants 
  SET 
    last_watered = NEW.watered_at,
    next_watering = NEW.watered_at + (plant_frequency || ' days')::INTERVAL,
    updated_at = NOW()
  WHERE id = NEW.plant_id;
  
  -- Log the update
  RAISE NOTICE 'Updated plant %: last_watered=%, next_watering=%', 
    NEW.plant_id, NEW.watered_at, NEW.watered_at + (plant_frequency || ' days')::INTERVAL;
  
  RETURN NEW;
END;
$$;

-- 3. Recréer le trigger
CREATE TRIGGER on_watering_recorded
  AFTER INSERT ON public.watering_history
  FOR EACH ROW
  EXECUTE FUNCTION public.update_next_watering();

-- 4. Test de la fonction (optionnel - à exécuter manuellement)
-- SELECT public.update_next_watering_test();

-- 5. Vérifier que le trigger est bien créé
SELECT 
  trigger_name, 
  event_manipulation, 
  action_timing, 
  action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_watering_recorded';
