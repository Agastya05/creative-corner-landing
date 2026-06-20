import { createFileRoute } from "@tanstack/react-router";
import ArtistPage from "@/pages/ArtistPage";

/**
 * Thin TanStack route shell.
 * All real logic lives in `src/pages/ArtistPage.tsx` (plain React).
 * When migrating to plain Vite + React Router, replace this file with:
 *   <Route path="/artist/:slug" element={<ArtistRoute />} />
 * where ArtistRoute reads the slug from `useParams()` and renders <ArtistPage />.
 */
export const Route = createFileRoute("/artist/$slug")({
  head: ({ params }) => {
    const name = params.slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    return {
      meta: [
        { title: `${name} — Artist` },
        {
          name: "description",
          content: `Discover ${name}, contemporary artist. Explore biography, exhibitions, education and studio practice.`,
        },
        { property: "og:title", content: `${name} — Artist` },
        { property: "og:description", content: `Explore the work and studio practice of ${name}.` },
        { property: "og:type", content: "profile" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { slug } = Route.useParams();
  return <ArtistPage slug={slug} />;
}
