"use client";
import React, { Fragment } from "react";
import { Divider, List, ListItemButton, ListItemText } from "@mui/material";
import DataList, { BaseData } from "@/app/Components/Data";
import { AssetRef } from "@/app/Components/AssetLink";
import { getBaseUrl } from "@/app/utils/global";

export interface DuelRound {
  chara: AssetRef | null;
  charaImage: string;
  charaVoice: AssetRef | null;
  background: AssetRef | null;
  reward: AssetRef | null;
  targetValue: number;
  progressType: number;
  resolution: number;
}

export interface Duel extends BaseData {
  disableFlag: boolean;
  explainText: string;
  priority: number;
  rounds: DuelRound[];
}

const Duels = () => {
  return (
    <DataList<Duel>
      endpoint={`${getBaseUrl("chuni", "duel/duel.json")}`}
      render={(data) => (
        <List>
          {data.map((item: Duel, index: number) => (
            <Fragment key={index}>
              <ListItemButton component="a" href={`/chuni/duel/${item.id}`}>
                <ListItemText primary={item.name} secondary={`${item.rounds.length} rounds`} />
              </ListItemButton>
              <Divider />
            </Fragment>
          ))}
        </List>
      )}
    />
  );
};

export default Duels;
