import type { Metadata } from "next";
import { headers } from "next/headers";
import { SERVER_URL, gameVersions } from "./global";

type Embed = { image?: string; video?: string };

// Server-side link previews (Discord etc.). Crawlers have no localStorage, so version comes from ?v= (via middleware) or the newest.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function embed(game: string, type: string, media?: (item: any) => Embed) {
  return async ({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> => {
    const { id } = await params;
    const versions = Object.keys(gameVersions[game]);
    const v = (await headers()).get("x-version") ?? "";
    const base = `${SERVER_URL}/${game}/${versions.includes(v) ? v : versions.at(-1)}`;
    const items = await fetch(`${base}/${type}/${type}.json`, { next: { revalidate: 3600 } })
      .then((r) => r.json())
      .catch(() => []);
    const item = items.find((i: { id: number }) => i.id === parseInt(id, 10));
    if (!item) return {};

    const { image, video } = media?.(item) ?? {};
    const description = item.explainText || undefined;
    return {
      title: item.name,
      description,
      openGraph: {
        title: item.name,
        description,
        type: video ? "video.other" : "website",
        images: image && `${base}/${image}`,
        videos: video && [
          { url: `${base}/${video}`, secureUrl: `${base}/${video}`, type: "video/mp4", width: 1920, height: 1080 },
        ],
      },
      twitter: { card: image ? "summary_large_image" : "summary" },
    };
  };
}
