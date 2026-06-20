const PRIYA = {
  slug: "priya-desai",
  name: "Priya Desai",
  city: "Mumbai, India",
  movement: "Abstract Expressionism",
  job_title: "Abstract Expressionist Painter",
  nationality: "Indian",
  bio_paragraphs: [
    "<strong>Priya Desai</strong> is a Mumbai-based contemporary abstract expressionist painter whose work investigates the <em>interplay between color, form and emotion</em>. Drawing on the visual heritage of South Asia and the language of post-war abstraction, she builds compositions that feel both deeply personal and openly inviting.",
    "After completing her <strong>MFA in Contemporary Art</strong> at the Mumbai Institute of Art, Priya spent close to a decade working across oil, acrylic and mixed media, refining a signature vocabulary of saturated color fields, gestural mark-making and quiet negative space.",
    "Her paintings have been exhibited at leading galleries across India and Asia, and have been featured in publications focused on emerging voices in <strong>contemporary Indian abstract art</strong>. Through her ongoing series and studio practice, Priya continues to push abstraction as a language for memory, place and feeling.",
  ],
  stats: { based_in: "Mumbai, IN", practice: "Abstract", exhibitions: "14+", years_active: "9" },
  education: [
    { degree: "MFA, Contemporary Art", school: "Mumbai Institute of Art", year: "2016" },
    {
      degree: "Diploma, Abstract Expressionism",
      school: "Asian Institute of Fine Arts",
      year: "2014",
    },
    { degree: "Professional Artist Development", school: "Kala Bhavan Institute", year: "2013" },
  ],
  accolades: [
    { name: "Contemporary Art Innovation Prize", category: "Abstract Expressionism", year: "2024" },
    { name: "Young Visionary Award", category: "Color & Form", year: "2023" },
    { name: "Emerging Painter Grant", category: "National Arts Council", year: "2021" },
  ],
  exhibitions_solo: [
    { name: "Color Language", venue: "Gallerie Arts Mumbai", date: "Mar – May 2024" },
    { name: "Abstract Dialogues", venue: "Modern Art Space, Delhi", date: "Jul – Sep 2023" },
  ],
  exhibitions_group: [
    {
      name: "New Horizons in Contemporary Art",
      venue: "National Center for the Arts",
      date: "Jan – Mar 2024",
    },
    {
      name: "Emerging Abstract Artists",
      venue: "Asia Pacific Art Gallery",
      date: "Jun – Aug 2023",
    },
  ],
  theme: {
    bg: "var(--ochre)",
    text: "var(--ink)",
    cream: "var(--cream)",
    accent: "var(--ochre-deep)",
  },
  images: {
    hero_bg: "/artist-hero-bg.jpg",
    portrait: "/priya-portrait.jpg",
    studio_wide: "/studio-wide.jpg",
    studio_hands: "/studio-hands.jpg",
    studio_flatlay: "/studio-flatlay.jpg",
  },
  seo: {
    title: "Priya Desai — Abstract Expressionist Painter, Mumbai | AR.02",
    description:
      "Discover Priya Desai, Mumbai-based abstract expressionist painter exploring color, form and emotion. Explore her biography, exhibitions, education and studio practice.",
    keywords:
      "Priya Desai, abstract expressionist painter, Mumbai contemporary artist, Indian abstract art, Color Language exhibition",
    og_title: "Priya Desai — Abstract Expressionist Painter",
    og_description:
      "Bold color, dynamic composition and emotional intensity from Mumbai-based painter Priya Desai.",
  },
  studio_quote:
    "The studio is the only place where colour stops being decoration and starts being a language.",
  studio_quote_author: "Priya Desai",
  artwork_for_sale_title: "Artwork for Sale",
  artwork_for_sale_subtitle: "Original Pieces · Priya Desai",
};

const PALETTES = [
  ["#C2410C", "#1F2937"],
  ["#0F3460", "#E94560"],
  ["#7C2D12", "#FBBF24"],
  ["#064E3B", "#A7F3D0"],
  ["#312E81", "#F472B6"],
  ["#7F1D1D", "#FDE68A"],
  ["#1E3A8A", "#FCA5A5"],
  ["#365314", "#FDE047"],
  ["#831843", "#FBCFE8"],
  ["#134E4A", "#F0FDFA"],
];
const MEDIUMS = ["Mixed Media", "Acrylic", "Oil on Canvas", "Watercolor", "Ink & Gouache"];

const ARTWORKS = Array.from({ length: 50 }, (_, i) => ({
  id: `mock-artwork-${i + 1}`,
  name: "Chromatic Harmony",
  medium: MEDIUMS[i % MEDIUMS.length],
  price: 19000 + ((i * 1373) % 21000),
  palette: PALETTES[Math.floor(i / 5) % PALETTES.length],
  image_url: null,
}));

const ARTISTS = { [PRIYA.slug]: PRIYA };
const ARTWORKS_BY_SLUG = { [PRIYA.slug]: ARTWORKS };

export const mockAdapter = {
  async getArtistBySlug(slug) {
    const a = ARTISTS[slug];
    if (!a) throw new Error(`Artist not found: ${slug}`);
    return a;
  },
  async getArtworksByArtist(slug) {
    return ARTWORKS_BY_SLUG[slug] ?? [];
  },
};
