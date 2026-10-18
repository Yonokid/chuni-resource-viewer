import { embed } from "@/app/utils/embed";

export const generateMetadata = embed("chuni", "cmission", (m) => ({
  image: m.chara && `chara/CHU_UI_Character_${(m.chara.id / 10).toString().padStart(4, "0")}_00_00.webp`,
}));

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
