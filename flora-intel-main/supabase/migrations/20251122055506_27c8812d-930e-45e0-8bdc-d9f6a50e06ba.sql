-- Create plant_analyses table to store image captures and AI analysis results
CREATE TABLE IF NOT EXISTS public.plant_analyses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  image_url TEXT NOT NULL,
  analysis_result JSONB NOT NULL,
  disease_detected TEXT,
  severity TEXT,
  recommendations TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.plant_analyses ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own plant analyses" 
ON public.plant_analyses 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own plant analyses" 
ON public.plant_analyses 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own plant analyses" 
ON public.plant_analyses 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_plant_analyses_user_id ON public.plant_analyses(user_id);
CREATE INDEX idx_plant_analyses_created_at ON public.plant_analyses(created_at DESC);

-- Create storage bucket for plant images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'plant-images', 
  'plant-images', 
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for plant images
CREATE POLICY "Users can upload their own plant images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'plant-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own plant images" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'plant-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Public can view plant images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'plant-images');

CREATE POLICY "Users can delete their own plant images" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'plant-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);