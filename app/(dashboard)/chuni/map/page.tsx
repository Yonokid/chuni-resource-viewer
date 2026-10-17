"use client";
import React, { Fragment } from "react";
import { Divider, List, ListItemButton, ListItemText } from "@mui/material";
import DataList, { BaseData } from "@/app/Components/Data";
import { AssetRef } from "@/app/Components/AssetLink";
import { getBaseUrl } from "@/app/utils/global";

export interface MapAreaInfo {
  mapArea: AssetRef | null;
  ddsMap: AssetRef | null;
  music: AssetRef | null;
  chara: AssetRef | null;
  skill: AssetRef | null;
  trophy: AssetRef | null;
  normalGauge: AssetRef | null;
  challengeGauge: AssetRef | null;
  challengeRating: { advanced: number; expert: number; master: number };
}

export interface Map extends BaseData {
  ddsMapId: string;
  ddsMapName: string;
  mapType?: number;
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
