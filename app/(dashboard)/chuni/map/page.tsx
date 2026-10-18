"use client";
import React, { Fragment } from "react";
import { Divider, List, ListItemButton, ListItemText } from "@mui/material";
import DataList, { BaseData } from "@/app/Components/Data";
import { AssetRef } from "@/app/Components/AssetLink";
import { getBaseUrl } from "@/app/utils/global";

export interface GaugeRef extends AssetRef {
  fumens?: { difficulty: number; normGauge: number; maxGauge: number }[];
}

// a Reward.xml record merged into the reference
export interface MapReward extends AssetRef {
  icon?: string | null; // skill category, name plate or ticket image, relative to the version folder
  type?: number;
  gamePoint?: number;
  ticket?: AssetRef | null;
  trophy?: AssetRef | null;
  chara?: AssetRef | null;
  skill?: AssetRef | null;
  namePlate?: AssetRef | null;
  music?: AssetRef | null;
}

export interface MapGrid {
  index: number;
  displayType: number;
  type: number;
  gamePoint?: number;
  ticket?: AssetRef | null;
  reward?: MapReward | null;
}

export interface MapBonusSubstance {
  type: number;
  kind: string;
  point: number;
  target: AssetRef | null;
}

export interface MapBonus {
  id: number;
  name: string;
  substances: MapBonusSubstance[];
}

export interface MapAreaInfo {
  mapArea: AssetRef | null;
  ddsMap: AssetRef | null;
  music: AssetRef | null;
  reward?: MapReward | null;
  chara: AssetRef | null;
  skill: AssetRef | null;
  trophy: AssetRef | null;
  normalGauge?: GaugeRef | null;
  challengeGauge?: GaugeRef | null;
  gauge?: GaugeRef | null; // 2.00+: one gauge per area
  challengeRating?: { advanced: number; expert: number; master: number };
  pageIndex?: number;
  grids?: MapGrid[];
  bonus?: MapBonus | null;
}

export interface Map extends BaseData {
  ddsMapId: string;
  ddsMapName: string;
  mapType?: number;
  category?: AssetRef | null;
  stopMapArea?: AssetRef | null;
  stopUnlockEvent?: AssetRef | null;
  areas?: MapAreaInfo[];
}

const Maps = () => {
  return (
    <DataList<Map>
      endpoint={`${getBaseUrl("chuni", "map/map.json")}`}
      render={(data) => (
        <List>
          {data.map((item: Map, index: number) => (
            <Fragment key={index}>
              <ListItemButton component="a" href={`map/${item.id}`}>
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

export default Maps;
