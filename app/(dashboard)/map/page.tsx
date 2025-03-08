"use client";
import React, { Fragment } from "react";
import { Divider, List, ListItemButton, ListItemText } from "@mui/material";
import DataList, { BaseData } from "@/app/Components/Data";
import { getVersion, getAbsolutePath } from "@/app/utils/global";

export interface Map extends BaseData {
  ddsMapId: string;
  ddsMapName: string;
}

const directory = getAbsolutePath(`../${getVersion()}/map`);
const Maps = () => {
  return (
    <DataList<Map>
      endpoint={`${directory}/map.json`}
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
