import { embed } from "@/app/utils/embed";

export const generateMetadata = embed("chuni", "movie", (m) => ({ video: `movie/${m.mp4name}` }));

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
