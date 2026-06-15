INSERT INTO public.artists (
  slug, name, city, movement, job_title, nationality, bio_paragraphs, stats, education, accolades, exhibitions_solo, exhibitions_group, theme, images, seo, studio_quote, studio_quote_author, artwork_for_sale_title, artwork_for_sale_subtitle
) VALUES (
  'priya-desai',
  'Priya Desai',
  'Mumbai, India',
  'Abstract Expressionism',
  'Abstract Expressionist Painter',
  'Indian',
  '[
    "<strong>Priya Desai</strong> is a Mumbai-based contemporary abstract expressionist painter whose work investigates the <em>interplay between color, form and emotion</em>. Drawing on the visual heritage of South Asia and the language of post-war abstraction, she builds compositions that feel both deeply personal and openly inviting.",
    "After completing her <strong>MFA in Contemporary Art</strong> at the Mumbai Institute of Art, Priya spent close to a decade working across oil, acrylic and mixed media, refining a signature vocabulary of saturated color fields, gestural mark-making and quiet negative space.",
    "Her paintings have been exhibited at leading galleries across India and Asia, and have been featured in publications focused on emerging voices in <strong>contemporary Indian abstract art</strong>. Through her ongoing series and studio practice, Priya continues to push abstraction as a language for memory, place and feeling."
  ]'::jsonb,
  '{"based_in": "Mumbai, IN", "practice": "Abstract", "exhibitions": "14+", "years_active": "9"}'::jsonb,
  '[
    {"degree": "MFA, Contemporary Art", "school": "Mumbai Institute of Art", "year": "2016"},
    {"degree": "Diploma, Abstract Expressionism", "school": "Asian Institute of Fine Arts", "year": "2014"},
    {"degree": "Professional Artist Development", "school": "Kala Bhavan Institute", "year": "2013"}
  ]'::jsonb,
  '[
    {"name": "Contemporary Art Innovation Prize", "category": "Abstract Expressionism", "year": "2024"},
    {"name": "Young Visionary Award", "category": "Color & Form", "year": "2023"},
    {"name": "Emerging Painter Grant", "category": "National Arts Council", "year": "2021"}
  ]'::jsonb,
  '[
    {"name": "Color Language", "venue": "Gallerie Arts Mumbai", "date": "Mar – May 2024"},
    {"name": "Abstract Dialogues", "venue": "Modern Art Space, Delhi", "date": "Jul – Sep 2023"}
  ]'::jsonb,
  '[
    {"name": "New Horizons in Contemporary Art", "venue": "National Center for the Arts", "date": "Jan – Mar 2024"},
    {"name": "Emerging Abstract Artists", "venue": "Asia Pacific Art Gallery", "date": "Jun – Aug 2023"}
  ]'::jsonb,
  '{"bg": "var(--ochre)", "text": "var(--ink)", "accent": "var(--ochre-deep)", "cream": "var(--cream)"}'::jsonb,
  '{"portrait": "/priya-portrait.jpg", "hero_bg": "/artist-hero-bg.jpg", "studio_wide": "/studio-wide.jpg", "studio_flatlay": "/studio-flatlay.jpg", "studio_hands": "/studio-hands.jpg"}'::jsonb,
  '{
    "title": "Priya Desai — Abstract Expressionist Painter, Mumbai | AR.02",
    "description": "Discover Priya Desai, Mumbai-based abstract expressionist painter exploring color, form and emotion. Explore her biography, exhibitions, education and studio practice.",
    "keywords": "Priya Desai, abstract expressionist painter, Mumbai contemporary artist, Indian abstract art, Color Language exhibition",
    "og_title": "Priya Desai — Abstract Expressionist Painter",
    "og_description": "Bold color, dynamic composition and emotional intensity from Mumbai-based painter Priya Desai."
  }'::jsonb,
  'The studio is the only place where colour stops being decoration and starts being a language.',
  'Priya Desai',
  'Artwork for Sale',
  'Original Pieces · Priya Desai'
);