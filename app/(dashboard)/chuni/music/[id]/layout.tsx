import { embed } from "@/app/utils/embed";

export const generateMetadata = embed("chuni", "music", (s) => ({
  image: `music/CHU_UI_Jacket_${s.id.toString().padStart(4, "0")}.webp`,
}));

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
