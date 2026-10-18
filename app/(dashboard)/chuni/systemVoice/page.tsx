"use client";
import React, { Fragment } from "react";
import { Divider, List, ListItemAvatar, ListItemButton, ListItemText } from "@mui/material";
import DataList, { BaseData } from "@/app/Components/Data";
import { AssetRef } from "@/app/Components/AssetLink";
import { getBaseUrl } from "@/app/utils/global";

export interface SystemVoice extends BaseData {
  disableFlag: boolean;
  works: AssetRef | null;
  cue: AssetRef | null;
  audio?: string;
  explainText: string;
  defaultHave: boolean;
  priority: number;
  image: string;
}

const SystemVoices = () => {
  return (
    <DataList<SystemVoice>
      endpoint={`${getBaseUrl("chuni", "systemVoice/systemVoice.json")}`}
      render={(data) => (
        <List>
          {data.map((item: SystemVoice, index: number) => (
            <Fragment key={index}>
              <ListItemButton component="a" href={`/chuni/systemVoice/${item.id}`}>
                <ListItemAvatar sx={{ minWidth: 0, mr: 2 }}>
                  <img src={getBaseUrl("chuni", `systemVoice/${item.image}`)} alt="" width={96} />
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

export default SystemVoices;
