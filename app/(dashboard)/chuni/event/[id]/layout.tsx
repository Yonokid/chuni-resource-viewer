import { embed } from "@/app/utils/embed";

export const generateMetadata = embed("chuni", "event", (e) => ({ image: `event/${e.eventBannerName}.webp` }));

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
