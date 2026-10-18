import { embed } from "@/app/utils/embed";

export const generateMetadata = embed("chuni", "ticket", (t) => ({ image: `sprites/ticketType_${t.type}.webp` }));

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
