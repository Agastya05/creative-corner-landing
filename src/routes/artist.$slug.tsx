import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getArtistBySlug, getArtworksByArtist } from "@/lib/artist.functions";

/* ---------- Query options ---------- */
function artistQueryOptions(slug: string) {
  return {
    queryKey: ["artist", slug],
    queryFn: () => getArtistBySlug({ data: { slug } }),
  };
}

function artworksQueryOptions(slug: string) {
  return {
    queryKey: ["artworks", slug],
    queryFn: () => getArtworksByArtist({ data: { slug } }),
  };
}

/* ---------- Route ---------- */
export const Route = createFileRoute("/artist/$slug")({
  head: ({ params }) => {
    const name = params.slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    return {
      meta: [
        { title: `${name} — Artist` },
        { name: "description", content: `Discover ${name}, contemporary artist. Explore biography, exhibitions, education and studio practice.` },
        { property: "og:title", content: `${name} — Artist` },
        { property: "og:description", content: `Explore the work and studio practice of ${name}.` },
        { property: "og:type", content: "profile" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  loader: async ({ params, context }) => {
    const artist = await context.queryClient.ensureQueryData(
      artistQueryOptions(params.slug)
    );
    const artworks = await context.queryClient.ensureQueryData(
      artworksQueryOptions(params.slug)
    );
    return { artist, artworks };
  },
  component: ArtistPage,
});

/* ---------- Types ---------- */
type Artist = {
  slug: string;
  name: string;
  city: string;
  movement: string;
  job_title: string;
  nationality: string;
  bio_paragraphs: string[];
  stats: Record<string, string>;
  education: Array<{ degree: string; school: string; year: string }>;
  accolades: Array<{ name: string; category: string; year: string }>;
  exhibitions_solo: Array<{ name: string; venue: string; date: string }>;
  exhibitions_group: Array<{ name: string; venue: string; date: string }>;
  theme: Record<string, string>;
  images: Record<string, string>;
  seo: Record<string, string>;
  studio_quote: string;
  studio_quote_author: string;
  artwork_for_sale_title: string;
  artwork_for_sale_subtitle: string;
};

type Artwork = {
  id: string;
  name: string;
  medium: string;
  price: number;
  palette: string[];
  image_url: string | null;
};

/* ---------- Page ---------- */
function ArtistPage() {
  const { slug } = Route.useParams();
  const { data: artist } = useSuspenseQuery(artistQueryOptions(slug));
  const { data: artworks } = useSuspenseQuery(artworksQueryOptions(slug));

  const a = artist as unknown as Artist;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: a.name,
    jobTitle: a.job_title,
    nationality: a.nationality,
    birthPlace: { "@type": "Place", name: a.city },
    worksFor: { "@type": "Organization", name: "Independent Studio Practice" },
    knowsAbout: [a.movement, "Contemporary Art", "Color Theory", "Mixed Media Painting"],
    alumniOf: a.education.map((e) => ({
      "@type": "CollegeOrUniversity",
      name: e.school,
    })),
    award: a.accolades.map((ac) => `${ac.name} (${ac.year})`),
    address: { "@type": "PostalAddress", addressLocality: a.city.split(",")[0], addressCountry: "IN" },
  };

  return (
    <main className="min-h-screen" style={{ background: a.theme.bg || "var(--ochre)", color: a.theme.text || "var(--ink)" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero artist={a} />
      <Information artist={a} />
      <Studio artist={a} />
      <Exhibitions artist={a} />
      <ArtworkForSale artist={a} artworks={artworks as Artwork[]} />
    </main>
  );
}

/* ---------- HERO ---------- */
function Hero({ artist }: { artist: Artist }) {
  const imgs = artist.images;
  return (
    <header className="relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center opacity-90 mix-blend-multiply"
        style={{ backgroundImage: `url(${imgs.hero_bg})` }}
      />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-b from-transparent to-[var(--ochre)]" />

      <div className="relative overflow-hidden border-y border-black/10 py-3 text-[0.7rem] tracking-[0.4em] uppercase text-cream/90">
        <div className="flex animate-[marquee_30s_linear_infinite] gap-12 whitespace-nowrap">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="flex items-center gap-12 text-white/90">
              <span>{artist.name}</span> · <span>{artist.movement}</span> · <span>{artist.city}</span> ·
            </span>
          ))}
        </div>
      </div>

      <div className="relative grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-10 px-8 py-20 md:py-28">
        <div className="hidden md:block" />

        <div className="flex flex-col items-center text-center">
          <div className="rounded-full p-2 ring-1 ring-cream/70">
            <img
              src={imgs.portrait}
              alt={`Portrait of ${artist.name}, ${artist.job_title.toLowerCase()}`}
              width={220}
              height={220}
              className="h-44 w-44 rounded-full object-cover md:h-56 md:w-56"
            />
          </div>
          <h1 className="mt-6 font-display text-5xl md:text-6xl text-cream">
            {artist.name}
          </h1>
          <p className="mt-2 text-xs tracking-[0.4em] uppercase text-cream/80">
            {artist.city}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3 text-[0.7rem] tracking-[0.3em] uppercase text-cream">
            <span className="border border-cream/70 px-5 py-2.5">{artist.movement}</span>
            <span className="border border-cream/70 px-5 py-2.5">{artist.artwork_for_sale_subtitle}</span>
          </div>

          <div className="mt-12 text-cream/60">◆</div>
          <p className="mt-4 text-[0.7rem] tracking-[0.4em] uppercase text-cream/80">
            About the Artist
          </p>
          <p className="mt-6 max-w-2xl font-italic italic text-xl md:text-2xl leading-relaxed text-cream">
            {artist.name} creates stunning abstract compositions that blend traditional and contemporary techniques. Her work explores the interplay between color, form, and emotion.
          </p>
        </div>

        <div aria-hidden className="hidden md:block" />
      </div>
    </header>
  );
}

/* ---------- INFORMATION ---------- */
function Information({ artist }: { artist: Artist }) {
  return (
    <section
      aria-labelledby="bio-heading"
      className="relative mx-auto max-w-6xl px-6 py-24 md:py-32"
      itemScope
      itemType="https://schema.org/Person"
    >
      <meta itemProp="name" content={artist.name} />
      <meta itemProp="jobTitle" content={artist.job_title} />

      <div className="grid gap-16 md:grid-cols-[1.4fr_1fr]">
        <article>
          <p className="text-[0.7rem] tracking-[0.4em] uppercase opacity-60">Biography</p>
          <h2 id="bio-heading" className="mt-3 font-display text-4xl md:text-5xl">
            About {artist.name}
          </h2>
          <div className="mt-4 h-px w-24 opacity-40" style={{ background: artist.theme.text }} />

          <div className="mt-8 space-y-5 text-[0.95rem] leading-[1.85] opacity-85" itemProp="description">
            {artist.bio_paragraphs.map((p, i) => (
              <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
            ))}
          </div>

          <dl className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4 border-y border-black/15 py-6">
            <Stat label="Based in" value={artist.stats.based_in || ""} />
            <Stat label="Practice" value={artist.stats.practice || ""} />
            <Stat label="Exhibitions" value={artist.stats.exhibitions || ""} />
            <Stat label="Years Active" value={artist.stats.years_active || ""} />
          </dl>
        </article>

        <aside className="space-y-12">
          <div>
            <h3 className="font-display text-2xl">Education</h3>
            <div className="mt-2 h-px w-12 opacity-40" style={{ background: artist.theme.text }} />
            <ul className="mt-6 space-y-5">
              {artist.education.map((e) => (
                <li
                  key={e.degree}
                  className="border-l-2 border-black/30 pl-4"
                  itemScope
                  itemType="https://schema.org/EducationalOccupationalCredential"
                >
                  <p className="text-sm font-bold tracking-wide" itemProp="credentialCategory">{e.degree}</p>
                  <p className="text-xs opacity-70" itemProp="recognizedBy">{e.school}</p>
                  <p className="text-[0.65rem] tracking-[0.3em] uppercase opacity-50 mt-1">{e.year}</p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-2xl">Accolades &amp; Recognition</h3>
            <div className="mt-2 h-px w-12 opacity-40" style={{ background: artist.theme.text }} />
            <ul className="mt-6 space-y-4">
              {artist.accolades.map((a) => (
                <li key={a.name} className="flex gap-3" itemProp="award">
                  <span aria-hidden className="mt-1" style={{ color: "var(--ochre-deep)" }}>★</span>
                  <div>
                    <p className="text-sm font-bold">{a.name}</p>
                    <p className="text-xs opacity-70">{a.category} · {a.year}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[0.65rem] tracking-[0.3em] uppercase opacity-60">{label}</dt>
      <dd className="mt-2 font-display text-2xl">{value}</dd>
    </div>
  );
}

/* ---------- STUDIO ---------- */
function Studio({ artist }: { artist: Artist }) {
  const imgs = artist.images;
  return (
    <section aria-labelledby="studio-heading" className="relative bg-[var(--ink)] text-cream">
      <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="grid gap-10 md:grid-cols-[1fr_auto_1fr] md:items-end">
          <p className="text-[0.7rem] tracking-[0.4em] uppercase text-[var(--ochre)]">Inside the Studio</p>
          <h2 id="studio-heading" className="font-display text-5xl md:text-7xl text-cream text-center">
            Where the<br />
            <span className="italic font-italic text-[var(--ochre)]">work happens</span>
          </h2>
          <p className="text-sm leading-relaxed text-cream/70 md:text-right">
            A look at the daily rituals, palettes and unfinished canvases that shape {artist.name.split(" ")[0]}&rsquo;s practice.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-12 gap-4 md:gap-6">
          <figure className="col-span-12 md:col-span-8 group relative overflow-hidden">
            <img
              src={imgs.studio_wide}
              alt={`${artist.name}'s painting studio with abstract canvases on the wall and easel in progress`}
              loading="lazy"
              className="h-[28rem] w-full object-cover transition-transform duration-700 group-hover:scale-105 md:h-[34rem]"
            />
            <figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <p className="text-[0.65rem] tracking-[0.4em] uppercase text-[var(--ochre)]">01 — The Space</p>
              <p className="mt-1 font-display text-2xl text-cream">North-light studio, Bandra</p>
            </figcaption>
          </figure>

          <figure className="col-span-6 md:col-span-4 group relative overflow-hidden">
            <img
              src={imgs.studio_hands}
              alt="Hands mixing thick blue and yellow oil paint on a wooden palette with a palette knife"
              loading="lazy"
              className="h-64 w-full object-cover transition-transform duration-700 group-hover:scale-105 md:h-[16.5rem]"
            />
            <figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <p className="text-[0.6rem] tracking-[0.4em] uppercase text-[var(--ochre)]">02 — The Hand</p>
            </figcaption>
          </figure>

          <figure className="col-span-6 md:col-span-4 group relative overflow-hidden">
            <img
              src={imgs.studio_flatlay}
              alt="Overhead view of color swatches, iPad sketches and brushes on the studio desk"
              loading="lazy"
              className="h-64 w-full object-cover transition-transform duration-700 group-hover:scale-105 md:h-[16.5rem]"
            />
            <figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <p className="text-[0.6rem] tracking-[0.4em] uppercase text-[var(--ochre)]">03 — The Palette</p>
            </figcaption>
          </figure>
        </div>

        <blockquote className="mx-auto mt-20 max-w-3xl text-center">
          <p className="font-italic italic text-2xl md:text-3xl leading-relaxed text-cream">
            &ldquo;{artist.studio_quote}&rdquo;
          </p>
          <footer className="mt-6 text-[0.7rem] tracking-[0.4em] uppercase text-[var(--ochre)]">
            — {artist.studio_quote_author}
          </footer>
        </blockquote>
      </div>
    </section>
  );
}

/* ---------- EXHIBITIONS ---------- */
function Exhibitions({ artist }: { artist: Artist }) {
  return (
    <section aria-labelledby="exhibitions-heading" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <h2 id="exhibitions-heading" className="font-display text-5xl">Exhibitions</h2>

      <div className="mt-16 grid gap-16 md:grid-cols-2">
        <ExhibitionList title="Solo Exhibitions" items={artist.exhibitions_solo} />
        <ExhibitionList title="Group Exhibitions" items={artist.exhibitions_group} />
      </div>
    </section>
  );
}

function ExhibitionList({
  title,
  items,
}: {
  title: string;
  items: Array<{ name: string; venue: string; date: string }>;
}) {
  return (
    <div>
      <h3 className="font-display text-2xl">{title}</h3>
      <div className="mt-2 h-px w-12 bg-black/40" />
      <ul className="mt-8 space-y-8">
        {items.map((e) => (
          <li
            key={e.name}
            className="border-l-2 border-black/30 pl-5"
            itemScope
            itemType="https://schema.org/ExhibitionEvent"
          >
            <p className="font-bold" itemProp="name">{e.name}</p>
            <p className="text-sm opacity-70" itemProp="location">{e.venue}</p>
            <p className="mt-1 text-[0.65rem] tracking-[0.3em] uppercase opacity-55">{e.date}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- ARTWORK FOR SALE ---------- */
function ArtworkForSale({ artist, artworks }: { artist: Artist; artworks: Artwork[] }) {
  const [expanded, setExpanded] = useState(false);
  const items = expanded ? artworks : artworks.slice(0, 5);

  return (
    <section aria-labelledby="shop-heading" className="bg-[var(--cream)] text-[var(--ink)]">
      <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="text-center">
          <p className="text-[0.7rem] tracking-[0.4em] uppercase text-[var(--ochre-deep)]">Collection</p>
          <h2 id="shop-heading" className="mt-4 font-display text-5xl md:text-7xl text-[var(--ink)]">
            {artist.artwork_for_sale_title.split(" ").slice(0, -1).join(" ")}{" "}
            <span className="italic text-[var(--ochre-deep)]">{artist.artwork_for_sale_title.split(" ").pop()}</span>
          </h2>
          <p className="mt-3 text-[0.7rem] tracking-[0.4em] uppercase opacity-60">{artist.artwork_for_sale_subtitle}</p>
        </div>

        <ul className="mt-16 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {items.map((a) => (
            <li key={a.id} className="group flex flex-col">
              <div
                className="relative aspect-[3/4] w-full overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${a.palette[0]} 0%, ${a.palette[1]} 100%)`,
                }}
                role="img"
                aria-label={`${a.name} — ${a.medium}`}
              >
                <div
                  aria-hidden
                  className="absolute inset-0 mix-blend-overlay opacity-60"
                  style={{
                    background:
                      "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.5), transparent 50%), radial-gradient(circle at 70% 80%, rgba(0,0,0,0.4), transparent 55%)",
                  }}
                />
                <button
                  type="button"
                  className="absolute bottom-3 right-3 bg-[var(--ink)] px-4 py-2 text-[0.6rem] tracking-[0.3em] uppercase text-[var(--cream)] opacity-0 transition group-hover:opacity-100"
                >
                  View
                </button>
              </div>
              <div className="mt-4">
                <h3 className="font-display italic text-lg text-[var(--ink)]">{a.name}</h3>
                <p className="mt-1 text-[0.6rem] tracking-[0.3em] uppercase text-[var(--ochre-deep)]">{a.medium}</p>
                <p className="mt-2 font-display text-sm text-[var(--ink)]">₹{a.price.toLocaleString("en-IN")}</p>
              </div>
            </li>
          ))}
        </ul>

        {artworks.length > 5 && (
          <div className="mt-16 flex justify-center">
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              className="bg-[var(--ink)] px-10 py-5 text-[0.7rem] tracking-[0.4em] uppercase text-[var(--cream)] transition hover:bg-[var(--ochre-deep)]"
            >
              {expanded ? "Show Less" : "Explore Full Collection"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
