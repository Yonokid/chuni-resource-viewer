"use client";
import { Box } from "@mui/material";
import MaimaiTitle from "@/app/Components/MaimaiTitle";
import { ItemDetail } from "../../common";
import { Title } from "../page";

export default function TitlePage() {
  return (
    <ItemDetail<Title> type="title">
      {(title) => (
        <Box sx={{ mb: 2 }}>
          <MaimaiTitle item={title} />
        </Box>
      )}
    </ItemDetail>
  );
}
