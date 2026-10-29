import { embed } from "@/app/utils/embed";

export const generateMetadata = embed("maimai", "music", (s) => ({ image: s.jacket && `music/${s.jacket}` }));

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
