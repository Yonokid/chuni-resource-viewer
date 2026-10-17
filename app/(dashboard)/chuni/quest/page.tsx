"use client";
import React, { Fragment } from "react";
import { Divider, List, ListItemButton, ListItemText } from "@mui/material";
import DataList, { BaseData } from "@/app/Components/Data";
import { AssetRef } from "@/app/Components/AssetLink";
import { getBaseUrl } from "@/app/utils/global";

export interface QuestReward {
  sumRank: number;
  trophy: AssetRef | null;
  namePlate: AssetRef | null;
  rewards: AssetRef[];
}

export interface Quest extends BaseData {
  disableFlag: boolean;
  charaWorks: AssetRef[];
  charas: AssetRef[];
  priority: number;
  rewards: QuestReward[];
}

const Quests = () => {
  return (
    <DataList<Quest>
      endpoint={`${getBaseUrl("chuni", "quest/quest.json")}`}
      render={(data) => (
        <List>
          {data.map((item: Quest) => (
            <Fragment key={item.id}>
              <ListItemButton component="a" href={`/chuni/quest/${item.id}`}>
                <ListItemText primary={item.name} />
              </ListItemButton>
              <Divider />
            </Fragment>
          ))}
        </List>
      )}
    />
  );
};

export default Quests;
