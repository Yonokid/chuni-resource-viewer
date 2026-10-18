"use client";
import React, { Fragment } from "react";
import { Divider, List, ListItemButton, ListItemText } from "@mui/material";
import DataList, { BaseData } from "@/app/Components/Data";
import { AssetRef } from "@/app/Components/AssetLink";
import { getBaseUrl } from "@/app/utils/global";

export interface TeamPresentPreset extends BaseData {
  disableFlag: boolean;
  presents: (AssetRef | null)[];
}

const TeamPresentPresets = () => {
  return (
    <DataList<TeamPresentPreset>
      endpoint={`${getBaseUrl("chuni", "teamPresentPreset/teamPresentPreset.json")}`}
      render={(data) => (
        <List>
          {data.map((item: TeamPresentPreset) => (
            <Fragment key={item.id}>
              <ListItemButton component="a" href={`/chuni/teamPresentPreset/${item.id}`}>
                <ListItemText primary={item.name} secondary={`${item.presents.length} rewards`} />
              </ListItemButton>
              <Divider />
            </Fragment>
          ))}
        </List>
      )}
    />
  );
};

export default TeamPresentPresets;
