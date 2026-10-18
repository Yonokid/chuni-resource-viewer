"use client";
import React, { Fragment } from "react";
import { Divider, List, ListItemButton, ListItemText } from "@mui/material";
import DataList, { BaseData } from "@/app/Components/Data";
import { AssetRef } from "@/app/Components/AssetLink";
import { getBaseUrl } from "@/app/utils/global";
import { intLabel, useEnums } from "@/app/utils/enums";

export interface Reward extends BaseData {
  type: number;
  gamePoint: number;
  ticket: AssetRef | null;
  trophy: AssetRef | null;
  chara: AssetRef | null;
  skill: AssetRef | null;
  namePlate: AssetRef | null;
  music: AssetRef | null;
  mapIcon: AssetRef | null;
  systemVoice: AssetRef | null;
}

const Rewards = () => {
  const enums = useEnums();
  return (
    <DataList<Reward>
      endpoint={`${getBaseUrl("chuni", "reward/reward.json")}`}
      render={(data) => (
        <List>
          {data.map((item: Reward, index: number) => (
            <Fragment key={index}>
              <ListItemButton component="a" href={`/chuni/reward/${item.id}`}>
                <ListItemText primary={item.name} secondary={intLabel(enums, "reward.type", item.type)} />
              </ListItemButton>
              <Divider />
            </Fragment>
          ))}
        </List>
      )}
    />
  );
};

export default Rewards;
