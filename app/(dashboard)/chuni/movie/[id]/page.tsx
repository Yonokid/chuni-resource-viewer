import type { Metadata } from "next";
import { SERVER_URL, gameVersions } from "@/app/utils/global";
import type { Movie } from "../page";
import MovieView from "./MovieView";

// Crawlers (Discord etc.) have no localStorage, so version comes from ?v= or defaults to the first one.
export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ v?: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const { v } = await searchParams;
  const base = `${SERVER_URL}/chuni/${v ?? Object.keys(gameVersions.chuni)[0]}/movie`;
  const movies: Movie[] = await fetch(`${base}/movie.json`)
    .then((r) => r.json())
    .catch(() => []);
  const movie = movies.find((m) => m.id === parseInt(id, 10));
  if (!movie) return {};

  const video = `${base}/${movie.mp4name}`;
  return {
    title: movie.name,
    openGraph: {
      title: movie.name,
      type: "video.other",
      videos: [{ url: video, secureUrl: video, type: "video/mp4", width: 1920, height: 1080 }],
    },
  };
}

export default function MoviePage() {
  return <MovieView />;
}
