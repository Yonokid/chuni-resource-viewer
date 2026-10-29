"use client";
import { useParams } from "next/navigation";
import { ItemList } from "../common";

/** Tables without a page of their own (icon, plate, card, event, ...): image + name list. */
export default function MaiTypePage() {
  const { type } = useParams<{ type: string }>();
  return <ItemList type={type} imageWidth={type === "plate" ? 240 : 64} />;
}
