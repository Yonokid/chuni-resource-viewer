"use client";
import React, { Fragment } from "react";
import { Divider, List, ListItemButton, ListItemText, Chip } from "@mui/material";
import DataList, { BaseData } from "@/app/Components/Data";
import { AssetRef } from "@/app/Components/AssetLink";
import { getBaseUrl } from "@/app/utils/global";

interface Grid {
  index: number;
  displayType: number;
  type: number;
  gamePoint: number;
  ticket: AssetRef | null;
}

export interface MapArea extends BaseData {
  grids: Grid[];
}

const MapAreas = () => {
  return (
    <DataList<MapArea>
      endpoint={`${getBaseUrl("chuni", "mapArea/mapArea.json")}`}
      render={(data) => (
        <List>
          {data.map((item: MapArea, index: number) => (
            <Fragment key={index}>
              <ListItemButton component="a" href={`mapArea/${item.id}`}>
                <ListItemText primary={item.name} />
                <Chip size="small" label={`${item.grids.length} tiles`} />
              </ListItemButton>
              <Divider />
            </Fragment>
          ))}
        </List>
      )}
    />
  );
};

export default MapAreas;
