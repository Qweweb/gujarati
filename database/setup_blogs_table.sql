-- SQL Migration for Blogs Table
CREATE TABLE IF NOT EXISTS public.blogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    cover_image TEXT,
    category TEXT DEFAULT 'જનરલ',
    author TEXT DEFAULT 'ગુજરાતી ટીમ',
    views INT DEFAULT 0,
    likes INT DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Clean up existing policies if re-run
DROP POLICY IF EXISTS "Allow public read blogs" ON public.blogs;
DROP POLICY IF EXISTS "Allow public insert blogs" ON public.blogs;
DROP POLICY IF EXISTS "Allow public update blogs" ON public.blogs;
DROP POLICY IF EXISTS "Allow public delete blogs" ON public.blogs;

-- Allow public read access to all published blogs
CREATE POLICY "Allow public read blogs" 
ON public.blogs 
FOR SELECT 
USING (true);

-- Allow public insert/update/delete for admin operations
CREATE POLICY "Allow public insert blogs" 
ON public.blogs 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public update blogs" 
ON public.blogs 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow public delete blogs" 
ON public.blogs 
FOR DELETE 
USING (true);
