"use client";
import React, { Fragment } from "react";
import { Divider, List, ListItemButton, ListItemText } from "@mui/material";
import DataList, { BaseData } from "@/app/Components/Data";
import { getBaseUrl } from "@/app/utils/global";

export interface EmoteData extends BaseData {
  title?: string;
  file: string;
  textures?: string[];
}

const EmoteCharacters = () => {
  return (
    <DataList<EmoteData>
      endpoint={`${getBaseUrl("chuni", "emotedata/emotedata.json")}`}
      render={(data) => (
        <List>
          {data.map((item: EmoteData) => (
            <Fragment key={item.id}>
              <ListItemButton component="a" href={`/chuni/emotedata/${item.id}`}>
                <ListItemText primary={item.title ?? item.name} />
              </ListItemButton>
              <Divider />
            </Fragment>
          ))}
        </List>
      )}
    />
  );
};

export default EmoteCharacters;
