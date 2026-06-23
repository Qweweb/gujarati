-- Create post_reactions table
CREATE TABLE IF NOT EXISTS public.post_reactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    user_phone TEXT NOT NULL,
    reaction_type TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE(post_id, user_phone) -- A user can only have one reaction per post
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.post_reactions ENABLE ROW LEVEL SECURITY;

-- Anyone can read reactions
CREATE POLICY "Reactions are viewable by everyone" 
ON public.post_reactions FOR SELECT 
USING (true);

-- Anyone can insert reactions
CREATE POLICY "Anyone can insert reactions" 
ON public.post_reactions FOR INSERT 
WITH CHECK (true);

-- Anyone can update reactions
CREATE POLICY "Anyone can update reactions" 
ON public.post_reactions FOR UPDATE 
USING (true);

-- Anyone can delete reactions
CREATE POLICY "Anyone can delete reactions" 
ON public.post_reactions FOR DELETE 
USING (true);
