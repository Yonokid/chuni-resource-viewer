"use client";
import { useParams } from "next/navigation";
import { Box } from "@mui/material";
import { ItemDetail, MaiItem, asset } from "../../common";

export default function MaiItemPage() {
  const { type } = useParams<{ type: string }>();
  return (
    <ItemDetail<MaiItem> type={type}>
      {(item) =>
        Array.isArray(item.bases) && ( // cardType: the card art per effect
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
            {(item.bases as string[]).map((b) => <img key={b} src={asset(type, b)} alt="" width={128} />)}
          </Box>
        )
      }
    </ItemDetail>
  );
}
