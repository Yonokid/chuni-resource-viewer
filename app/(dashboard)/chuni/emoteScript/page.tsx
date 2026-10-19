"use client";
import React, { Fragment } from "react";
import { Divider, List, ListItemButton, ListItemText } from "@mui/material";
import DataList, { BaseData } from "@/app/Components/Data";
import { getBaseUrl } from "@/app/utils/global";

export interface EmoteTimelineSlot {
  offset: number;
  main: [number, number];
  diff: [number, number];
}

export interface EmoteScript extends BaseData {
  msecNext: number;
  timelines: EmoteTimelineSlot[];
  msecDelay?: number;
  cue?: number;
  emoteScriptOffset?: number;
  emoteScriptButton?: number;
  isChangeDialog?: number;
  textDialog?: string;
}

// $n is the game's line break inside dialog text
export const dialogText = (text?: string) => (text ?? "").replaceAll("$n", "\n");

const EmoteScripts = () => {
  return (
    <DataList<EmoteScript>
      endpoint={`${getBaseUrl("chuni", "emoteScript/emoteScript.json")}`}
      render={(data) => (
        <List>
          {data.map((item: EmoteScript) => (
            <Fragment key={item.id}>
              <ListItemButton component="a" href={`/chuni/emoteScript/${item.id}`}>
                <ListItemText
                  primary={item.name}
                  secondary={dialogText(item.textDialog)}
                  slotProps={{ secondary: { sx: { whiteSpace: "pre-line" } } }}
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

export default EmoteScripts;
