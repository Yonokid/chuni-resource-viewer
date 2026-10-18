import { embed } from "@/app/utils/embed";

export const generateMetadata = embed("chuni", "chara", (c) => ({
  image: `chara/CHU_UI_Character_${(c.id / 10).toString().padStart(4, "0")}_00_00.webp`,
}));

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
