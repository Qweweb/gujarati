-- Create vcards table
CREATE TABLE IF NOT EXISTS public.vcards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    slug TEXT UNIQUE NOT NULL,
    profile_image TEXT,
    cover_image TEXT,
    name TEXT NOT NULL,
    job_title TEXT,
    company TEXT,
    bio TEXT,
    theme_id TEXT DEFAULT 'modern',
    theme_colors JSONB,
    social_links JSONB DEFAULT '[]'::jsonb,
    contact_details JSONB DEFAULT '[]'::jsonb,
    status BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id) -- 1 user 1 card restriction at DB level
);

-- Create vcard_analytics table
CREATE TABLE IF NOT EXISTS public.vcard_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vcard_id UUID NOT NULL REFERENCES public.vcards(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL, -- 'view', 'click_whatsapp', 'click_phone', 'click_email', 'click_social', 'download_vcf'
    target_data TEXT, -- e.g., the URL or phone number that was clicked
    visitor_session TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Set up Row Level Security (RLS) for vcards
ALTER TABLE public.vcards ENABLE ROW LEVEL SECURITY;

-- Anyone can view a public vcard
CREATE POLICY "Public profiles are viewable by everyone." 
ON public.vcards FOR SELECT 
USING (status = true);

-- Users can insert their own vcard
CREATE POLICY "Users can insert their own vcard." 
ON public.vcards FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can update their own vcard
CREATE POLICY "Users can update own vcard." 
ON public.vcards FOR UPDATE 
USING (auth.uid() = user_id);

-- Users can delete their own vcard
CREATE POLICY "Users can delete own vcard." 
ON public.vcards FOR DELETE 
USING (auth.uid() = user_id);

-- Set up Row Level Security (RLS) for vcard_analytics
ALTER TABLE public.vcard_analytics ENABLE ROW LEVEL SECURITY;

-- Anyone can insert an analytics event (unauthenticated tracking)
CREATE POLICY "Anyone can insert analytics." 
ON public.vcard_analytics FOR INSERT 
WITH CHECK (true);

-- Only the owner of the vcard can view its analytics
CREATE POLICY "Users can view analytics for their own vcards." 
ON public.vcard_analytics FOR SELECT 
USING (
    vcard_id IN (
        SELECT id FROM public.vcards WHERE user_id = auth.uid()
    )
);
