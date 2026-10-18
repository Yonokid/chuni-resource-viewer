import { embed } from "@/app/utils/embed";

export const generateMetadata = embed("chuni", "namePlate", (p) => ({ image: `namePlate/${p.image}` }));

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
