"use client";
import React, { Fragment } from "react";
import { Divider, List, ListItemAvatar, ListItemButton, ListItemText } from "@mui/material";
import DataList, { BaseData } from "@/app/Components/Data";
import { AssetRef } from "@/app/Components/AssetLink";
import { getBaseUrl } from "@/app/utils/global";

export interface MapIcon extends BaseData {
  disableFlag: boolean;
  works: AssetRef | null;
  explainText: string;
  defaultHave: boolean;
  priority: number;
  image: string;
}

const MapIcons = () => {
  return (
    <DataList<MapIcon>
      endpoint={`${getBaseUrl("chuni", "mapIcon/mapIcon.json")}`}
      render={(data) => (
        <List>
          {data.map((item: MapIcon, index: number) => (
            <Fragment key={index}>
              <ListItemButton component="a" href={`/chuni/mapIcon/${item.id}`}>
                <ListItemAvatar sx={{ minWidth: 0, mr: 2 }}>
                  <img src={getBaseUrl("chuni", `mapIcon/${item.image}`)} alt="" width={96} />
                </ListItemAvatar>
                <ListItemText primary={item.name} secondary={item.explainText} sx={{ whiteSpace: "pre-line" }} />
              </ListItemButton>
              <Divider />
            </Fragment>
          ))}
        </List>
      )}
    />
  );
};

export default MapIcons;
