"use client";
import React, { Fragment } from "react";
import { Divider, List, ListItemButton, ListItemText } from "@mui/material";
import DataList, { BaseData } from "@/app/Components/Data";
import { getBaseUrl } from "@/app/utils/global";

interface Ref {
  id: number;
  name: string;
}

export interface UnlockChallenge extends BaseData {
  disableFlag: boolean;
  musics: {
    music: Ref | null;
    rewards: { reward: Ref | null; num: number }[];
    courses: (Ref | null)[];
  }[];
}

const UnlockChallenges = () => {
  return (
    <DataList<UnlockChallenge>
      endpoint={`${getBaseUrl("chuni", "unlockChallenge/unlockChallenge.json")}`}
      render={(data) => (
        <List>
          {data.map((item: UnlockChallenge, index: number) => (
            <Fragment key={index}>
              <ListItemButton component="a" href={`/chuni/unlockChallenge/${item.id}`}>
                <ListItemText primary={item.name} secondary={`${item.musics.length} song(s)`} />
              </ListItemButton>
              <Divider />
            </Fragment>
          ))}
        </List>
      )}
    />
  );
};

export default UnlockChallenges;
