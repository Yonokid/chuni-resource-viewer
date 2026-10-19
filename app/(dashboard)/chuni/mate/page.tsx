"use client";
import React, { Fragment } from "react";
import { Divider, List, ListItemAvatar, ListItemButton, ListItemText } from "@mui/material";
import DataList, { BaseData } from "@/app/Components/Data";
import { AssetRef } from "@/app/Components/AssetLink";
import { getBaseUrl } from "@/app/utils/global";

export interface MateReward {
  id: number;
  level: number;
  reward: AssetRef | null;
}

export interface MateAction {
  id: number;
  actionType: number;
  emote: string;
  isVoice: boolean;
  isLipSync: boolean;
  isSpecialMotion: boolean;
  isEmoteEndReset: boolean;
  msecEmoteEnd: number;
  cueId: number;
  lipSync: string;
}

export interface Mate extends BaseData {
  disableFlag: boolean;
  defaultHave: boolean;
  emoteFile: string;
  imageFile: string;
  image: string;
  chara: AssetRef | null;
  ddsIllust: AssetRef | null;
  systemVoiceId: number;
  rewards: MateReward[];
  actions: MateAction[];
}

const Mates = () => {
  return (
    <DataList<Mate>
      endpoint={`${getBaseUrl("chuni", "mate/mate.json")}`}
      render={(data) => (
        <List>
          {data.map((item: Mate) => (
            <Fragment key={item.id}>
              <ListItemButton component="a" href={`/chuni/mate/${item.id}`}>
                <ListItemAvatar sx={{ minWidth: 0, mr: 2 }}>
                  <img src={getBaseUrl("chuni", `mate/${item.image}`)} alt="" width={96} />
                </ListItemAvatar>
                <ListItemText primary={item.name} secondary={item.chara?.name} />
              </ListItemButton>
              <Divider />
            </Fragment>
          ))}
        </List>
      )}
    />
  );
};

export default Mates;
