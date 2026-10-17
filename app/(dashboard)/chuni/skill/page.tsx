"use client";
import React, { Fragment } from "react";
import {
  Avatar,
  Divider,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Chip,
  Stack,
} from "@mui/material";
import DataList, { BaseData } from "@/app/Components/Data";
import { AssetRef } from "@/app/Components/AssetLink";
import { getBaseUrl } from "@/app/utils/global";
import { spriteUrl } from "@/app/utils/enums";

export interface Skill extends BaseData {
  category: number;
  rareType: number;
  counterType: number;
  maxLv: number;
  useLimit: boolean;
  useNum: number;
  price: number;
  targetCharas: AssetRef[];
  explainText: string[];
  forceLv?: number;
  growthUseNum?: number;
  defaultHave?: boolean;
  chgInvalidColor?: boolean;
  substances?: Substance[];
}

/** One skill effect; `kind` names the effect block, the rest are that block's fields (see docs/xml/skill.md). */
export interface Substance {
  type: number;
  kind: string;
  skillIconType: number;
  [field: string]: unknown;
}

const Skills = () => {
  return (
    <DataList<Skill>
      endpoint={`${getBaseUrl("chuni", "skill/skill.json")}`}
      sorts={{ "Max level": (a, b) => a.maxLv - b.maxLv, Rarity: (a, b) => a.rareType - b.rareType, Category: (a, b) => a.category - b.category }}
      render={(data) => (
        <List>
          {data.map((item: Skill, index: number) => (
            <Fragment key={index}>
              <ListItemButton component="a" href={`skill/${item.id}`}>
                <ListItemAvatar>
                  <Avatar
                    variant="square"
                    src={spriteUrl("skillCategory", item.category)}
                    alt={`Category ${item.category}`}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={item.name}
                  secondary={
                    item.targetCharas.length > 0
                      ? item.targetCharas.map((c) => c.name).join(", ")
                      : undefined
                  }
                />
                <Stack direction="row" spacing={1}>
                  {item.rareType === 1 && (
                    <Chip size="small" color="warning" label="Rare" />
                  )}
                  <Chip size="small" label={`Lv.${item.maxLv}`} />
                </Stack>
              </ListItemButton>
              <Divider />
            </Fragment>
          ))}
        </List>
      )}
    />
  );
};

export default Skills;
