import { createServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

export const getArtistBySlug = createServerFn({ method: "GET" })
  .inputValidator((data) => z.object({ slug: z.string() }).parse(data))
  .handler(async ({ data }) => {
    const { data: artist, error } = await supabase
      .from("artists")
      .select("*")
      .eq("slug", data.slug)
      .eq("is_published", true)
      .single();

    if (error || !artist) {
      throw new Error("Artist not found");
    }
    return artist;
  });

export const getArtworksByArtist = createServerFn({ method: "GET" })
  .inputValidator((data) => z.object({ slug: z.string() }).parse(data))
  .handler(async ({ data }) => {
    const { data: artist } = await supabase
      .from("artists")
      .select("id")
      .eq("slug", data.slug)
      .eq("is_published", true)
      .single();

    if (!artist) {
      throw new Error("Artist not found");
    }

    const { data: artworks, error } = await supabase
      .from("artworks")
      .select("*")
      .eq("artist_id", artist.id)
      .eq("is_sold", false)
      .order("sort_order", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }
    return artworks ?? [];
  });
