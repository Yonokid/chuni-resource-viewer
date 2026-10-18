"use client";
import React, { Fragment } from "react";
import { Divider, List, ListItemButton, ListItemText } from "@mui/material";
import DataList, { BaseData } from "@/app/Components/Data";
import { AssetRef } from "@/app/Components/AssetLink";
import { getBaseUrl } from "@/app/utils/global";

export interface TeamPresent extends BaseData {
  disableFlag: boolean;
  present: AssetRef | null;
  itemNum: number;
  needTeamPoint: number;
  category: number;
}

const TeamPresents = () => {
  return (
    <DataList<TeamPresent>
      endpoint={`${getBaseUrl("chuni", "teamPresent/teamPresent.json")}`}
      render={(data) => (
        <List>
          {data.map((item: TeamPresent) => (
            <Fragment key={item.id}>
              <ListItemButton component="a" href={`/chuni/teamPresent/${item.id}`}>
                <ListItemText primary={item.name} secondary={`${item.needTeamPoint} team points`} />
              </ListItemButton>
              <Divider />
            </Fragment>
          ))}
        </List>
      )}
    />
  );
};

export default TeamPresents;
