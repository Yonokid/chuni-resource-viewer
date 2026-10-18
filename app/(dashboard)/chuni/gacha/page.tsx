"use client";
import React, { Fragment } from "react";
import { Divider, List, ListItemAvatar, ListItemButton, ListItemText } from "@mui/material";
import DataList, { BaseData } from "@/app/Components/Data";
import { getBaseUrl } from "@/app/utils/global";

export interface Gacha extends BaseData {
  disableFlag: boolean;
  ceilingNum: number;
  ceilingType: number;
  gachaType: number;
  gachaPickup: number;
  rarity: Record<string, { Ratio: number; Change: number; Pickup: number }>;
  cards: { id: number; weight: number; pickup: number }[];
  priority: number;
  imageFile: string;
  imageSmallFile: string;
}

const Gachas = () => {
  return (
    <DataList<Gacha>
      endpoint={`${getBaseUrl("chuni", "gacha/gacha.json")}`}
      render={(data) => (
        <List>
          {data.map((item: Gacha) => (
            <Fragment key={item.id}>
              <ListItemButton component="a" href={`/chuni/gacha/${item.id}`}>
                {item.imageSmallFile && (
                  <ListItemAvatar sx={{ minWidth: 0, mr: 2 }}>
                    <img src={getBaseUrl("chuni", `gacha/${item.imageSmallFile}`)} alt="" width={160} />
                  </ListItemAvatar>
                )}
                <ListItemText primary={item.name} secondary={`${item.cards.length} cards`} />
              </ListItemButton>
              <Divider />
            </Fragment>
          ))}
        </List>
      )}
    />
  );
};

export default Gachas;
