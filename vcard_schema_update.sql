-- Update vcards table to add products and gallery JSONB columns
ALTER TABLE public.vcards 
ADD COLUMN IF NOT EXISTS products JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS gallery JSONB DEFAULT '[]'::jsonb;
