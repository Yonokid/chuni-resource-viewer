"use client";
import React, { Fragment } from "react";
import { Divider, List, ListItemAvatar, ListItemButton, ListItemText } from "@mui/material";
import DataList, { BaseData } from "@/app/Components/Data";
import { getBaseUrl } from "@/app/utils/global";
import { spriteUrl } from "@/app/utils/enums";

export interface CMissionInfo extends BaseData {
  disableFlag: boolean;
  explainText: string;
  iconType: number;
  unitType: number;
  priority: number;
  conditions: Record<string, unknown>[];
}

const MissionTasks = () => {
  return (
    <DataList<CMissionInfo>
      endpoint={`${getBaseUrl("chuni", "cmissionInfo/cmissionInfo.json")}`}
      render={(data) => (
        <List>
          {data.map((item: CMissionInfo) => (
            <Fragment key={item.id}>
              <ListItemButton component="a" href={`/chuni/cmissionInfo/${item.id}`}>
                <ListItemAvatar>
                  <img src={spriteUrl("missionIcon", item.iconType)} alt="" width={48} height={48} />
                </ListItemAvatar>
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

export default MissionTasks;
