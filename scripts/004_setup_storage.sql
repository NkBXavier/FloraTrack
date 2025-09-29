-- Create storage bucket for plant images
INSERT INTO storage.buckets (id, name, public)
VALUES ('plant-images', 'plant-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for the storage bucket
CREATE POLICY "plant_images_select" ON storage.objects
FOR SELECT USING (bucket_id = 'plant-images');

CREATE POLICY "plant_images_insert" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'plant-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "plant_images_update" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'plant-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "plant_images_delete" ON storage.objects
FOR DELETE USING (
  bucket_id = 'plant-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
