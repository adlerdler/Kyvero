-- =====================================================
-- Kyvero / Portfolio & Analytics Console Supabase Schema
-- =====================================================
-- Run this SQL script in your Supabase SQL Editor to set up tables.

-- 1. Profiles Table (Stores user profile, bio, avatars, social links)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  github TEXT,
  twitter TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Projects Table (Stores portfolio items and showcase projects)
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  github_url TEXT,
  live_url TEXT,
  tags TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Blog Posts Table (Stores articles & tech notes)
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  summary TEXT,
  content TEXT NOT NULL,
  cover_url TEXT,
  tags TEXT[] DEFAULT '{}',
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Visitor Heatmap Logs Table (Stores 181-day daily visitor activity logs)
CREATE TABLE IF NOT EXISTS public.visitor_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date_str DATE UNIQUE NOT NULL,
  visits INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Geo Nodes Table (Stores global visitor traffic radar nodes)
CREATE TABLE IF NOT EXISTS public.geo_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  city TEXT NOT NULL,
  lat FLOAT NOT NULL,
  lng FLOAT NOT NULL,
  visits INTEGER DEFAULT 0 NOT NULL,
  status TEXT DEFAULT 'active' NOT NULL
);

-- =====================================================
-- Enable Row Level Security (RLS) & Security Policies
-- =====================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visitor_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.geo_nodes ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Allow public read access on profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow public read access on projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Allow public read access on blog_posts" ON public.blog_posts FOR SELECT USING (true);
CREATE POLICY "Allow public read access on visitor_logs" ON public.visitor_logs FOR SELECT USING (true);
CREATE POLICY "Allow public read access on geo_nodes" ON public.geo_nodes FOR SELECT USING (true);

-- Authenticated admin write policies
CREATE POLICY "Allow authenticated write access on profiles" ON public.profiles FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated write access on projects" ON public.projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated write access on blog_posts" ON public.blog_posts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated write access on visitor_logs" ON public.visitor_logs FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated write access on geo_nodes" ON public.geo_nodes FOR ALL USING (auth.role() = 'authenticated');
