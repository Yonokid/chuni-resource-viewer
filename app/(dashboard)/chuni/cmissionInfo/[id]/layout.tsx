import { embed } from "@/app/utils/embed";

export const generateMetadata = embed("chuni", "cmissionInfo", (m) => ({ image: `sprites/missionIcon_${m.iconType}.webp` }));

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
