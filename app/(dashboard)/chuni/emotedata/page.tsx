"use client";
import React, { Fragment } from "react";
import { Divider, List, ListItemButton, ListItemText } from "@mui/material";
import DataList, { BaseData } from "@/app/Components/Data";
import { getBaseUrl } from "@/app/utils/global";

export interface EmoteData extends BaseData {
  file: string;
  texture: string;
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

export default EmoteCharacters;
