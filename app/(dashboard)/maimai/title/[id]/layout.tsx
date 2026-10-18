import { embed } from "@/app/utils/embed";

export const generateMetadata = embed("maimai", "title");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
