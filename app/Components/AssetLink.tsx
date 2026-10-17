import Link from "next/link";

export interface AssetRef {
  id: number;
  name: string;
}

interface AssetLinkProps {
  type: string;
  asset: AssetRef | null | undefined;
}

const AssetLink = ({ type, asset }: AssetLinkProps) => {
  if (!asset) return null;
  return <Link href={`/chuni/${type}/${asset.id}`}>{asset.name}</Link>;
};

export default AssetLink;
