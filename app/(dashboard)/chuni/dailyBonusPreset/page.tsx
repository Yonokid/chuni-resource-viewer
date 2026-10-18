"use client";
import React, { Fragment } from "react";
import { Divider, List, ListItemButton, ListItemText } from "@mui/material";
import DataList, { BaseData } from "@/app/Components/Data";
import { AssetRef } from "@/app/Components/AssetLink";
import { getBaseUrl } from "@/app/utils/global";

export interface DailyBonusPreset extends BaseData {
  dailyBonuses: AssetRef[];
}

const DailyBonusPresets = () => {
  return (
    <DataList<DailyBonusPreset>
      endpoint={`${getBaseUrl("chuni", "dailyBonusPreset/dailyBonusPreset.json")}`}
      render={(data) => (
        <List>
          {data.map((item: DailyBonusPreset) => (
            <Fragment key={item.id}>
              <ListItemButton component="a" href={`/chuni/dailyBonusPreset/${item.id}`}>
                <ListItemText primary={item.name} secondary={`${item.dailyBonuses.length} bonuses`} />
              </ListItemButton>
              <Divider />
            </Fragment>
          ))}
        </List>
      )}
    />
  );
};

export default DailyBonusPresets;
