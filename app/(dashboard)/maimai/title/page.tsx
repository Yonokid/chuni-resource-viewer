"use client";
import React, { Fragment } from "react";
import { Divider, List, ListItemButton, ListItemText } from "@mui/material";
import DataList from "@/app/Components/Data";
import MaimaiTitle from "@/app/Components/MaimaiTitle";
import { MaiItem, table } from "../common";

export interface Title extends MaiItem {
  normText: string;
  rareType: string; // Normal, Bronze, Silver, Gold, Rainbow
  relConds: Record<string, unknown>[];
}

// Stable reference so DataList's memo doesn't rerun every render.
const filters = {
  Rarity: (t: Title) => [t.rareType],
  Requirement: (t: Title) => (t.relConds.length ? t.relConds.map((c) => String(c.kind)) : ["None"]),
};

export default function Titles() {
  return (
    <DataList<Title>
      endpoint={table("title")}
      filters={filters}
      render={(data) => (
        <List>
          {data.map((item) => (
            <Fragment key={item.id}>
              <ListItemButton
                component="a"
                href={`/maimai/title/${item.id}`}
                sx={{ flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "stretch", sm: "center" } }}
              >
                <ListItemText>
                  <MaimaiTitle item={item} />
                </ListItemText>
                <ListItemText
                  sx={{ textAlign: { xs: "left", sm: "right" }, flex: { xs: "1 1 auto", sm: "0 0 45%" } }}
                  primary={item.normText}
                />
              </ListItemButton>
              <Divider />
            </Fragment>
          ))}
        </List>
      )}
    />
  );
}
