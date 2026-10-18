"use client";
import React, { Fragment } from "react";
import { Divider, List, ListItemButton, ListItemText } from "@mui/material";
import DataList, { BaseData } from "@/app/Components/Data";
import { AssetRef } from "@/app/Components/AssetLink";
import { getBaseUrl } from "@/app/utils/global";

export interface PlayReward extends BaseData {
  type: number;
  reward: AssetRef | null;
  point: number;
  isPickUpReward: boolean;
}

const PlayRewards = () => {
  return (
    <DataList<PlayReward>
      endpoint={`${getBaseUrl("chuni", "playReward/playReward.json")}`}
      render={(data) => (
        <List>
          {data.map((item: PlayReward) => (
            <Fragment key={item.id}>
              <ListItemButton component="a" href={`/chuni/playReward/${item.id}`}>
                <ListItemText primary={item.name} secondary={`${item.reward?.name ?? ""} (${item.point} pts)`} />
              </ListItemButton>
              <Divider />
            </Fragment>
          ))}
        </List>
      )}
    />
  );
};

export default PlayRewards;
