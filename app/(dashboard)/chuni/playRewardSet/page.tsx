"use client";
import React, { Fragment } from "react";
import { Divider, List, ListItemButton, ListItemText } from "@mui/material";
import DataList, { BaseData } from "@/app/Components/Data";
import { AssetRef } from "@/app/Components/AssetLink";
import { getBaseUrl } from "@/app/utils/global";

export interface PlayRewardSet extends BaseData {
  playRewards: (AssetRef | null)[];
}

const PlayRewardSets = () => {
  return (
    <DataList<PlayRewardSet>
      endpoint={`${getBaseUrl("chuni", "playRewardSet/playRewardSet.json")}`}
      render={(data) => (
        <List>
          {data.map((item: PlayRewardSet) => (
            <Fragment key={item.id}>
              <ListItemButton component="a" href={`/chuni/playRewardSet/${item.id}`}>
                <ListItemText primary={item.name} secondary={`${item.playRewards.length} rewards`} />
              </ListItemButton>
              <Divider />
            </Fragment>
          ))}
        </List>
      )}
    />
  );
};

export default PlayRewardSets;
