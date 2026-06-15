WITH artist_row AS (
  SELECT id FROM public.artists WHERE slug = 'priya-desai' LIMIT 1
),
palettes(p) AS (
  SELECT * FROM unnest(ARRAY[
    '["#C2410C", "#1F2937"]'::jsonb, '["#0F3460", "#E94560"]'::jsonb,
    '["#7C2D12", "#FBBF24"]'::jsonb, '["#064E3B", "#A7F3D0"]'::jsonb,
    '["#312E81", "#F472B6"]'::jsonb, '["#7F1D1D", "#FDE68A"]'::jsonb,
    '["#1E3A8A", "#FCA5A5"]'::jsonb, '["#365314", "#FDE047"]'::jsonb,
    '["#581C87", "#FB7185"]'::jsonb, '["#9A3412", "#FECACA"]'::jsonb
  ])
),
mediums(m) AS (
  SELECT * FROM unnest(ARRAY['Mixed Media','Acrylic','Oil on Canvas','Watercolor','Ink & Gouache'])
),
names(n) AS (
  SELECT * FROM unnest(ARRAY[
    'Chromatic Harmony','Color Cascade','Abstract Dreams','Geometric Bliss','Vibrant Energy',
    'Monsoon Memory','Saffron Drift','Indigo Tide','Ember Field','Quiet Bloom',
    'Velvet Static','Marigold Hours','Crimson Loop','Pale Horizon','Inner Weather',
    'Mira''s Garden','Echo Chamber','Salt & Gold','Bandra Light','After Rain',
    'Brass Sun','Soft Riot','Slow River','Heat Map','Paper Sky',
    'Folded Light','Quiet Noise','Tilted Room','Pink Static','Long Afternoon',
    'Borrowed Blue','Open Window','Half Moon','Untitled No. 7','Untitled No. 12',
    'Untitled No. 19','First Light','Last Light','Studio Floor','Held Breath',
    'Soft Architecture','Conversation','Two Reds','Three Blues','Field Notes',
    'Migration','Citrine','Ferment','Ochre Study','Closing Tide'
  ])
)
INSERT INTO public.artworks (artist_id, name, medium, price, palette, sort_order)
SELECT 
  a.id,
  n.n,
  m.m,
  18000 + ((row_number() OVER ()) * 1373) % 22000,
  p.p,
  (row_number() OVER ()) - 1
FROM artist_row a
CROSS JOIN names n
CROSS JOIN mediums m
CROSS JOIN palettes p
LIMIT 50;