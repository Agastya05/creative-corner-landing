CREATE TABLE public.artists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  movement TEXT NOT NULL,
  job_title TEXT NOT NULL DEFAULT 'Artist',
  nationality TEXT,
  bio_paragraphs JSONB NOT NULL DEFAULT '[]'::jsonb,
  stats JSONB NOT NULL DEFAULT '{}'::jsonb,
  education JSONB NOT NULL DEFAULT '[]'::jsonb,
  accolades JSONB NOT NULL DEFAULT '[]'::jsonb,
  exhibitions_solo JSONB NOT NULL DEFAULT '[]'::jsonb,
  exhibitions_group JSONB NOT NULL DEFAULT '[]'::jsonb,
  theme JSONB NOT NULL DEFAULT '{}'::jsonb,
  images JSONB NOT NULL DEFAULT '{}'::jsonb,
  seo JSONB NOT NULL DEFAULT '{}'::jsonb,
  studio_quote TEXT,
  studio_quote_author TEXT,
  artwork_for_sale_title TEXT DEFAULT 'Artwork for Sale',
  artwork_for_sale_subtitle TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT ON public.artists TO anon;
GRANT SELECT ON public.artists TO authenticated;
GRANT ALL ON public.artists TO service_role;

ALTER TABLE public.artists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Artists are publicly readable" ON public.artists FOR SELECT USING (is_published = true);

CREATE TABLE public.artworks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  artist_id UUID NOT NULL REFERENCES public.artists(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  medium TEXT NOT NULL,
  price INTEGER NOT NULL,
  palette JSONB NOT NULL DEFAULT '["#C2410C", "#1F2937"]'::jsonb,
  image_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_sold BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT ON public.artworks TO anon;
GRANT SELECT ON public.artworks TO authenticated;
GRANT ALL ON public.artworks TO service_role;

ALTER TABLE public.artworks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Artworks are publicly readable" ON public.artworks FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.artists a
    WHERE a.id = artist_id AND a.is_published = true
  )
);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_artists_updated_at BEFORE UPDATE ON public.artists
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();