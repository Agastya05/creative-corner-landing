export interface Artist {
  slug: string;
  name: string;
  city: string;
  movement: string;
  job_title: string;
  nationality: string;
  bio_paragraphs: string[];
  stats: { based_in: string; practice: string; exhibitions: string; years_active: string };
  education: Array<{ degree: string; school: string; year: string }>;
  accolades: Array<{ name: string; category: string; year: string }>;
  exhibitions_solo: Array<{ name: string; venue: string; date: string }>;
  exhibitions_group: Array<{ name: string; venue: string; date: string }>;
  theme: { bg: string; text: string; cream: string; accent: string };
  images: { hero_bg: string; portrait: string; studio_wide: string; studio_hands: string; studio_flatlay: string };
  seo: { title: string; description: string; keywords: string; og_title: string; og_description: string };
  studio_quote: string;
  studio_quote_author: string;
  artwork_for_sale_title: string;
  artwork_for_sale_subtitle: string;
}

export interface Artwork {
  id: string;
  name: string;
  medium: string;
  price: number;
  palette: [string, string];
  image_url: string | null;
}

export interface ArtistAPI {
  getArtistBySlug(slug: string): Promise<Artist>;
  getArtworksByArtist(slug: string): Promise<Artwork[]>;
}