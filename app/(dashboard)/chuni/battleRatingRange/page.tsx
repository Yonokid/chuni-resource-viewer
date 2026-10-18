"use client";
import React, { Fragment } from "react";
import { Divider, List, ListItemButton, ListItemText } from "@mui/material";
import DataList, { BaseData } from "@/app/Components/Data";
import { getBaseUrl } from "@/app/utils/global";

export interface BattleRatingRange extends BaseData {
  minBattleRating: number;
  minMusicLevel: number;
  maxMusicLevel: number;
  selectableByCPU: boolean[];
}

export const level = (n: number) => (n / 10).toFixed(1);

const BattleRatingRanges = () => {
  return (
    <DataList<BattleRatingRange>
      endpoint={`${getBaseUrl("chuni", "battleRatingRange/battleRatingRange.json")}`}
      render={(data) => (
        <List>
          {data.map((item: BattleRatingRange) => (
            <Fragment key={item.id}>
              <ListItemButton component="a" href={`/chuni/battleRatingRange/${item.id}`}>
                <ListItemText
                  primary={item.name}
                  secondary={`Rating ${item.minBattleRating}+, Lv ${level(item.minMusicLevel)} - ${level(item.maxMusicLevel)}`}
                />
              </ListItemButton>
              <Divider />
            </Fragment>
          ))}
        </List>
      )}
    />
  );
};

export default BattleRatingRanges;
