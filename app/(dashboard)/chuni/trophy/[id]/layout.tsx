import { embed } from "@/app/utils/embed";

export const generateMetadata = embed("chuni", "trophy", (t) => ({ image: t.image && `trophy/${t.image}` }));

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
