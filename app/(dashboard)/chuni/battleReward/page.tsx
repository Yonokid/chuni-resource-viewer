"use client";
import React, { Fragment } from "react";
import { Divider, List, ListItemButton, ListItemText } from "@mui/material";
import DataList, { BaseData } from "@/app/Components/Data";
import { AssetRef } from "@/app/Components/AssetLink";
import { getBaseUrl } from "@/app/utils/global";

export interface BattleReward extends BaseData {
  reward: AssetRef | null;
  playCount: number;
  priority: number;
}

const BattleRewards = () => {
  return (
    <DataList<BattleReward>
      endpoint={`${getBaseUrl("chuni", "battleReward/battleReward.json")}`}
      render={(data) => (
        <List>
          {data.map((item: BattleReward) => (
            <Fragment key={item.id}>
              <ListItemButton component="a" href={`/chuni/battleReward/${item.id}`}>
                <ListItemText primary={item.name} secondary={`${item.reward?.name ?? ""} (${item.playCount} battles)`} />
              </ListItemButton>
              <Divider />
            </Fragment>
          ))}
        </List>
      )}
    />
  );
};

export default BattleRewards;
