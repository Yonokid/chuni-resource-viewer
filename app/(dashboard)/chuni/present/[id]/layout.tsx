import { embed } from "@/app/utils/embed";

export const generateMetadata = embed("chuni", "present");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
