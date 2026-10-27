"use client";
import React, { Fragment } from "react";
import { Divider, List, ListItemButton, ListItemText } from "@mui/material";
import DataList, { BaseData } from "@/app/Components/Data";
import { AssetRef } from "@/app/Components/AssetLink";
import { getBaseUrl } from "@/app/utils/global";
import { getUnlocked } from "@/app/utils/unlocks";
import AnimatedTitle from "../../../Components/AnimatedTitle";

export interface Condition {
  type: number;
  events?: AssetRef[];
  genres?: string[];
  musics?: AssetRef[];
  music?: AssetRef;
  musicDifficulty?: string;
  scoreRank?: string;
  fullCombo?: boolean;
  fullChain?: boolean;
  allJustice?: boolean;
  masterUnderAll?: boolean;
  gameOver?: boolean;
  memberNum?: number;
  missNum?: number;
  playNum?: number;
  memberOtherTrophy?: AssetRef;
  playerRebirthCount?: number;
  playerLv?: number;
  playerRating?: number;
  totalGamePoint?: number;
  anyCharaRankMax?: boolean;
  charaTargetRank?: number;
  anySkillLvMax?: boolean;
  haveTrophies?: AssetRef[];
  japanRegion?: string;
  japanRegionPlayNum?: number;
}

/** Event gating shared by trophies and shop items (docs/xml/_shared.md#opencondition-trophy-shop). */
export interface OpenCondition {
  useCondition: boolean;
  forceHide?: boolean;
  events: AssetRef[];
}

export interface Trophy extends BaseData {
  explainText: string;
  rareType: number;
  defaultHave: boolean;
  conditions: Condition[];
  openCondition?: OpenCondition;
}

const Trophies = () => {
  const unlocked = getUnlocked("trophy");
  return (
    <DataList<Trophy>
      endpoint={`${getBaseUrl("chuni", "trophy/trophy.json")}`}
      sorts={{ Rarity: (a, b) => a.rareType - b.rareType }}
      render={(data) => (
        <List>
          {data.map((item: Trophy, index: number) => (
            <Fragment key={index}>
              <ListItemButton component="a" href={`trophy/${item.id}`} selected={unlocked.has(item.id)} sx={{ flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "stretch", sm: "center" } }}>
                <ListItemText>
                  <AnimatedTitle key={item.id} item={item} />
                </ListItemText>
                <ListItemText
                  sx={{ textAlign: { xs: "left", sm: "right" }, flex: { xs: "1 1 auto", sm: "0 0 45%" } }}
                  primary={item.explainText}
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

export default Trophies;
