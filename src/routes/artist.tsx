import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import portrait from "@/assets/priya-portrait.jpg";
import heroBg from "@/assets/artist-hero-bg.jpg";
import studioWide from "@/assets/studio-wide.jpg";
import studioFlatlay from "@/assets/studio-flatlay.jpg";
import studioHands from "@/assets/studio-hands.jpg";

const ARTIST = {
  name: "Priya Desai",
  city: "Mumbai, India",
  movement: "Abstract Expressionism",
  artworks: 5,
  index: "AR.02",
  total: "06",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: ARTIST.name,
  jobTitle: "Abstract Expressionist Painter",
  nationality: "Indian",
  birthPlace: { "@type": "Place", name: "Mumbai, India" },
  worksFor: { "@type": "Organization", name: "Independent Studio Practice" },
  knowsAbout: [
    "Abstract Expressionism",
    "Contemporary Indian Art",
    "Color Theory",
    "Mixed Media Painting",
  ],
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "Mumbai Institute of Art" },
    { "@type": "CollegeOrUniversity", name: "Asian Institute of Fine Arts" },
  ],
  award: [
    "Contemporary Art Innovation Prize 2024",
    "Young Visionary Award 2023",
  ],
  address: { "@type": "PostalAddress", addressLocality: "Mumbai", addressCountry: "IN" },
};

export const Route = createFileRoute("/artist")({
  head: () => ({
    meta: [
      { title: "Priya Desai — Abstract Expressionist Painter, Mumbai | AR.02" },
      {
        name: "description",
        content:
          "Discover Priya Desai, Mumbai-based abstract expressionist painter exploring color, form and emotion. Explore her biography, exhibitions, education and studio practice.",
      },
      { name: "keywords", content: "Priya Desai, abstract expressionist painter, Mumbai contemporary artist, Indian abstract art, Color Language exhibition" },
      { property: "og:title", content: "Priya Desai — Abstract Expressionist Painter" },
      { property: "og:description", content: "Bold color, dynamic composition and emotional intensity from Mumbai-based painter Priya Desai." },
      { property: "og:type", content: "profile" },
      { property: "og:image", content: portrait },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: portrait },
    ],
  }),
  component: ArtistPage,
});

function ArtistPage() {
  return (
    <main className="min-h-screen bg-[var(--ochre)] text-[var(--ink)] font-mono">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <Information />
      <Studio />
      <Exhibitions />
      <ArtworkForSale />
    </main>
  );
}

/* -------------------------- HERO (unchanged structure) -------------------------- */
function Hero() {
  return (
    <header className="relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center opacity-90 mix-blend-multiply"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-b from-transparent to-[var(--ochre)]" />

      <div className="relative overflow-hidden border-y border-black/10 py-3 text-[0.7rem] tracking-[0.4em] uppercase text-cream/90">
        <div className="flex animate-[marquee_30s_linear_infinite] gap-12 whitespace-nowrap">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="flex items-center gap-12 text-white/90">
              <span>{ARTIST.name}</span> · <span>{ARTIST.index}</span> ·{" "}
              <span>{ARTIST.movement}</span> · <span>{ARTIST.city}</span> ·
            </span>
          ))}
        </div>
      </div>

      <div className="relative grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-10 px-8 py-20 md:py-28">
        <div className="hidden md:block">
          <div className="font-display text-[6rem] leading-none text-cream drop-shadow-lg">
            {ARTIST.index}
          </div>
          <div className="font-display italic text-2xl text-cream/80">/{ARTIST.total}</div>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="rounded-full p-2 ring-1 ring-cream/70">
            <img
              src={portrait}
              alt={`Portrait of ${ARTIST.name}, abstract expressionist painter`}
              width={220}
              height={220}
              className="h-44 w-44 rounded-full object-cover md:h-56 md:w-56"
            />
          </div>
          <h1 className="mt-6 font-display text-5xl md:text-6xl text-cream">
            {ARTIST.name}
          </h1>
          <p className="mt-2 text-xs tracking-[0.4em] uppercase text-cream/80">
            {ARTIST.city}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3 text-[0.7rem] tracking-[0.3em] uppercase text-cream">
            <span className="border border-cream/70 px-5 py-2.5">{ARTIST.movement}</span>
            <span className="border border-cream/70 px-5 py-2.5">
              {ARTIST.artworks} Artworks
            </span>
          </div>

          <div className="mt-12 text-cream/60">◆</div>
          <p className="mt-4 text-[0.7rem] tracking-[0.4em] uppercase text-cream/80">
            About the Artist
          </p>
          <p className="mt-6 max-w-2xl font-italic italic text-xl md:text-2xl leading-relaxed text-cream">
            Priya Desai creates stunning abstract compositions that blend
            traditional and contemporary techniques. Her work explores the
            interplay between color, form, and emotion.
          </p>
        </div>

        <div aria-hidden className="hidden md:block" />
      </div>
    </header>
  );
}

/* ---------------------- INFORMATION (SEO revamp) ---------------------- */
function Information() {
  return (
    <section
      aria-labelledby="bio-heading"
      className="relative mx-auto max-w-6xl px-6 py-24 md:py-32"
      itemScope
      itemType="https://schema.org/Person"
    >
      <meta itemProp="name" content={ARTIST.name} />
      <meta itemProp="jobTitle" content="Abstract Expressionist Painter" />

      <div className="grid gap-16 md:grid-cols-[1.4fr_1fr]">
        {/* Biography */}
        <article>
          <p className="text-[0.7rem] tracking-[0.4em] uppercase text-[var(--ink)]/60">
            Biography
          </p>
          <h2
            id="bio-heading"
            className="mt-3 font-display text-4xl md:text-5xl text-[var(--ink)]"
          >
            About {ARTIST.name}
          </h2>
          <div className="mt-4 h-px w-24 bg-[var(--ink)]/40" />

          <div
            className="mt-8 space-y-5 text-[0.95rem] leading-[1.85] text-[var(--ink)]/85"
            itemProp="description"
          >
            <p>
              <strong>Priya Desai</strong> is a Mumbai-based contemporary
              abstract expressionist painter whose work investigates the
              <em> interplay between color, form and emotion</em>. Drawing on
              the visual heritage of South Asia and the language of
              post-war abstraction, she builds compositions that feel both
              deeply personal and openly inviting.
            </p>
            <p>
              After completing her <strong>MFA in Contemporary Art</strong> at the
              Mumbai Institute of Art, Priya spent close to a decade working
              across oil, acrylic and mixed media, refining a signature
              vocabulary of saturated color fields, gestural mark-making and
              quiet negative space.
            </p>
            <p>
              Her paintings have been exhibited at leading galleries across
              India and Asia, and have been featured in publications focused
              on emerging voices in <strong>contemporary Indian abstract art</strong>.
              Through her ongoing series and studio practice, Priya continues
              to push abstraction as a language for memory, place and feeling.
            </p>
          </div>

          <dl className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4 border-y border-[var(--ink)]/15 py-6">
            <Stat label="Based in" value="Mumbai, IN" />
            <Stat label="Practice" value="Abstract" />
            <Stat label="Exhibitions" value="14+" />
            <Stat label="Years Active" value="9" />
          </dl>
        </article>

        {/* Education + Accolades */}
        <aside className="space-y-12">
          <div>
            <h3 className="font-display text-2xl text-[var(--ink)]">Education</h3>
            <div className="mt-2 h-px w-12 bg-[var(--ink)]/40" />
            <ul className="mt-6 space-y-5">
              {[
                { degree: "MFA, Contemporary Art", school: "Mumbai Institute of Art", year: "2016" },
                { degree: "Diploma, Abstract Expressionism", school: "Asian Institute of Fine Arts", year: "2014" },
                { degree: "Professional Artist Development", school: "Kala Bhavan Institute", year: "2013" },
              ].map((e) => (
                <li
                  key={e.degree}
                  className="border-l-2 border-[var(--ink)]/30 pl-4"
                  itemScope
                  itemType="https://schema.org/EducationalOccupationalCredential"
                >
                  <p className="text-sm font-bold tracking-wide" itemProp="credentialCategory">
                    {e.degree}
                  </p>
                  <p className="text-xs text-[var(--ink)]/70" itemProp="recognizedBy">
                    {e.school}
                  </p>
                  <p className="text-[0.65rem] tracking-[0.3em] uppercase text-[var(--ink)]/50 mt-1">
                    {e.year}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-2xl text-[var(--ink)]">
              Accolades &amp; Recognition
            </h3>
            <div className="mt-2 h-px w-12 bg-[var(--ink)]/40" />
            <ul className="mt-6 space-y-4">
              {[
                { name: "Contemporary Art Innovation Prize", cat: "Abstract Expressionism", year: "2024" },
                { name: "Young Visionary Award", cat: "Color & Form", year: "2023" },
                { name: "Emerging Painter Grant", cat: "National Arts Council", year: "2021" },
              ].map((a) => (
                <li key={a.name} className="flex gap-3" itemProp="award">
                  <span aria-hidden className="mt-1 text-[var(--ochre-deep)]">★</span>
                  <div>
                    <p className="text-sm font-bold">{a.name}</p>
                    <p className="text-xs text-[var(--ink)]/70">
                      {a.cat} · {a.year}
                    </p>
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
      <dt className="text-[0.65rem] tracking-[0.3em] uppercase text-[var(--ink)]/60">
        {label}
      </dt>
      <dd className="mt-2 font-display text-2xl text-[var(--ink)]">{value}</dd>
    </div>
  );
}

/* ---------------------- STUDIO (revamped) ---------------------- */
function Studio() {
  return (
    <section
      aria-labelledby="studio-heading"
      className="relative bg-[var(--ink)] text-cream"
    >
      <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="grid gap-10 md:grid-cols-[1fr_auto_1fr] md:items-end">
          <p className="text-[0.7rem] tracking-[0.4em] uppercase text-[var(--ochre)]">
            Inside the Studio
          </p>
          <h2
            id="studio-heading"
            className="font-display text-5xl md:text-7xl text-cream text-center"
          >
            Where the<br />
            <span className="italic font-italic text-[var(--ochre)]">work happens</span>
          </h2>
          <p className="text-sm leading-relaxed text-cream/70 md:text-right">
            A look at the daily rituals, palettes and unfinished canvases that
            shape Priya's practice.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-12 gap-4 md:gap-6">
          <figure className="col-span-12 md:col-span-8 group relative overflow-hidden">
            <img
              src={studioWide}
              alt="Priya Desai's painting studio with abstract canvases on the wall and easel in progress"
              loading="lazy"
              className="h-[28rem] w-full object-cover transition-transform duration-700 group-hover:scale-105 md:h-[34rem]"
            />
            <figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <p className="text-[0.65rem] tracking-[0.4em] uppercase text-[var(--ochre)]">
                01 — The Space
              </p>
              <p className="mt-1 font-display text-2xl text-cream">
                North-light studio, Bandra
              </p>
            </figcaption>
          </figure>

          <figure className="col-span-6 md:col-span-4 group relative overflow-hidden">
            <img
              src={studioHands}
              alt="Hands mixing thick blue and yellow oil paint on a wooden palette with a palette knife"
              loading="lazy"
              className="h-64 w-full object-cover transition-transform duration-700 group-hover:scale-105 md:h-[16.5rem]"
            />
            <figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <p className="text-[0.6rem] tracking-[0.4em] uppercase text-[var(--ochre)]">
                02 — The Hand
              </p>
            </figcaption>
          </figure>

          <figure className="col-span-6 md:col-span-4 group relative overflow-hidden">
            <img
              src={studioFlatlay}
              alt="Overhead view of color swatches, iPad sketches and brushes on Priya Desai's studio desk"
              loading="lazy"
              className="h-64 w-full object-cover transition-transform duration-700 group-hover:scale-105 md:h-[16.5rem]"
            />
            <figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <p className="text-[0.6rem] tracking-[0.4em] uppercase text-[var(--ochre)]">
                03 — The Palette
              </p>
            </figcaption>
          </figure>
        </div>

        <blockquote className="mx-auto mt-20 max-w-3xl text-center">
          <p className="font-italic italic text-2xl md:text-3xl leading-relaxed text-cream">
            "The studio is the only place where colour stops being decoration
            and starts being a language."
          </p>
          <footer className="mt-6 text-[0.7rem] tracking-[0.4em] uppercase text-[var(--ochre)]">
            — Priya Desai
          </footer>
        </blockquote>
      </div>
    </section>
  );
}

/* ---------------------- EXHIBITIONS ---------------------- */
function Exhibitions() {
  const solo = [
    { name: "Color Language", venue: "Gallerie Arts Mumbai", date: "Mar – May 2024" },
    { name: "Abstract Dialogues", venue: "Modern Art Space, Delhi", date: "Jul – Sep 2023" },
  ];
  const group = [
    { name: "New Horizons in Contemporary Art", venue: "National Center for the Arts", date: "Jan – Mar 2024" },
    { name: "Emerging Abstract Artists", venue: "Asia Pacific Art Gallery", date: "Jun – Aug 2023" },
  ];

  return (
    <section
      aria-labelledby="exhibitions-heading"
      className="mx-auto max-w-6xl px-6 py-24 md:py-32"
    >
      <h2
        id="exhibitions-heading"
        className="font-display text-5xl text-[var(--ink)]"
      >
        Exhibitions
      </h2>

      <div className="mt-16 grid gap-16 md:grid-cols-2">
        <ExhibitionList title="Solo Exhibitions" items={solo} />
        <ExhibitionList title="Group Exhibitions" items={group} />
      </div>
    </section>
  );
}

function ExhibitionList({
  title,
  items,
}: {
  title: string;
  items: { name: string; venue: string; date: string }[];
}) {
  return (
    <div>
      <h3 className="font-display text-2xl text-[var(--ink)]">{title}</h3>
      <div className="mt-2 h-px w-12 bg-[var(--ink)]/40" />
      <ul className="mt-8 space-y-8">
        {items.map((e) => (
          <li
            key={e.name}
            className="border-l-2 border-[var(--ink)]/30 pl-5"
            itemScope
            itemType="https://schema.org/ExhibitionEvent"
          >
            <p className="font-bold text-[var(--ink)]" itemProp="name">
              {e.name}
            </p>
            <p className="text-sm text-[var(--ink)]/70" itemProp="location">
              {e.venue}
            </p>
            <p className="mt-1 text-[0.65rem] tracking-[0.3em] uppercase text-[var(--ink)]/55">
              {e.date}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
