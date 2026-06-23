-- Run this in Supabase SQL Editor
ALTER TABLE public.vcards 
ADD COLUMN IF NOT EXISTS business_hours JSONB DEFAULT '{"monday":"09:00 AM - 06:00 PM","tuesday":"09:00 AM - 06:00 PM","wednesday":"09:00 AM - 06:00 PM","thursday":"09:00 AM - 06:00 PM","friday":"09:00 AM - 06:00 PM","saturday":"09:00 AM - 02:00 PM","sunday":"Closed"}'::jsonb,
ADD COLUMN IF NOT EXISTS testimonials JSONB DEFAULT '[]'::jsonb;
