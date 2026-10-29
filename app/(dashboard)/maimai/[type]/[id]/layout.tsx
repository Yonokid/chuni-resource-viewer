import { embed } from "@/app/utils/embed";

export const generateMetadata = async (props: { params: Promise<{ type: string; id: string }> }) => {
  const { type } = await props.params;
  return embed("maimai", type, (i) => ({ image: i.image && `${type}/${i.image}` }))(props);
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
