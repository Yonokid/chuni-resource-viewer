import { embed } from "@/app/utils/embed";

export const generateMetadata = embed("chuni", "map", (m) => ({ image: `map/${m.ddsMapName}` }));

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
