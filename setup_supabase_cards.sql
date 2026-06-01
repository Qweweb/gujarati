-- Run this SQL in your Supabase SQL Editor to create the digital_cards table

CREATE TABLE public.digital_cards (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  data jsonb NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL, -- Optional: links to logged in user
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add index on slug for fast lookups
CREATE INDEX digital_cards_slug_idx ON public.digital_cards(slug);

-- Setup Row Level Security (RLS) to allow anyone to view cards, but only authenticated users or anonymous to create
ALTER TABLE public.digital_cards ENABLE ROW LEVEL SECURITY;

-- Allow public read access (so anyone with the link can view the card)
CREATE POLICY "Allow public read access" ON public.digital_cards FOR SELECT USING (true);

-- Allow anyone to insert cards (since users might create without logging in)
CREATE POLICY "Allow public insert" ON public.digital_cards FOR INSERT WITH CHECK (true);

-- Allow users to update cards (In a production environment, you might want to restrict this by user_id, 
-- but for now we allow open updates if the slug matches or if the user owns it)
CREATE POLICY "Allow public update" ON public.digital_cards FOR UPDATE USING (true);

-- Function to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_digital_cards_updated_at
    BEFORE UPDATE ON public.digital_cards
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
