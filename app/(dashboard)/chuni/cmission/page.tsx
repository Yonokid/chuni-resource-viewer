"use client";
import React, { Fragment } from "react";
import { Divider, List, ListItemAvatar, ListItemButton, ListItemText } from "@mui/material";
import DataList, { BaseData } from "@/app/Components/Data";
import { AssetRef } from "@/app/Components/AssetLink";
import { getBaseUrl } from "@/app/utils/global";
import { charaImage } from "./charaImage";

export interface CMissionRound {
  reward: AssetRef | null;
  targetValue: number;
  isLoop: boolean;
  isPickup: boolean;
}

export interface CMissionStage {
  stage: number;
  pos: number;
  loop: number;
  info: AssetRef | null;
  border: number;
  point: number;
}

export interface CMission extends BaseData {
  netOpen: AssetRef | null;
  disableFlag: boolean;
  explainText: string;
  chara: AssetRef | null;
  priority: number;
  rounds: CMissionRound[];
  stages: CMissionStage[];
}

const Missions = () => {
  return (
    <DataList<CMission>
      endpoint={`${getBaseUrl("chuni", "cmission/cmission.json")}`}
      render={(data) => (
        <List>
          {data.map((item: CMission) => (
            <Fragment key={item.id}>
              <ListItemButton component="a" href={`/chuni/cmission/${item.id}`}>
                {item.chara && (
                  <ListItemAvatar>
                    <img src={charaImage(item.chara)} alt="" width={56} height={56} style={{ objectFit: "cover", objectPosition: "top" }} />
                  </ListItemAvatar>
                )}
                <ListItemText primary={item.name} secondary={`${item.rounds.length} rewards, ${item.stages.length} tasks`} />
              </ListItemButton>
              <Divider />
            </Fragment>
          ))}
        </List>
      )}
    />
  );
};

export default Missions;
