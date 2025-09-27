-- Add location column to plants table
ALTER TABLE public.plants ADD COLUMN IF NOT EXISTS location TEXT;
