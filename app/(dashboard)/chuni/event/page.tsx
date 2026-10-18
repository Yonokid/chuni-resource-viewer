"use client";
import React, { Fragment } from "react";
import { Divider, List, ListItemButton, ListItemText } from "@mui/material";
import DataList, { BaseData } from "@/app/Components/Data";
import { AssetRef } from "@/app/Components/AssetLink";
import Image from "next/image";
import { getBaseUrl } from "@/app/utils/global";

/** What the event does; `kind` names the active block (docs/xml/event.md). */
export interface EventSubstance {
  type: number;
  kind: string;
  value?: number;
  informationType?: number;
  text?: string;
  image?: string;
  movie?: AssetRef | null;
  tagText?: string;
  map?: AssetRef | null;
  musics?: AssetRef[];
  firstMovie?: AssetRef | null;
  secondMovie?: AssetRef | null;
  quests?: AssetRef[];
  duel?: AssetRef | null;
  mapFilter?: AssetRef | null;
  rights?: AssetRef[]; // kind rightsInfo (2.00+)
  battleReward?: AssetRef | null; // kind battleReward (2.00+)
}

export interface Event extends BaseData {
  ddsBannerId: string;
  eventBannerName: string;
  ddsBannerName: string;
  text?: string;
  periodDispType?: number;
  alwaysOpen?: boolean;
  substance?: EventSubstance;
}

const Events = () => {
  return (
    <DataList<Event>
      endpoint={getBaseUrl("chuni", "event/event.json")}
      render={(data) => (
        <List>
          {data.map((item: Event, index: number) => (
            <Fragment key={index}>
              <ListItemButton component="a" href={`event/${item.id}`}>
                <ListItemText primary={item.name} />
                <Image
                  src={getBaseUrl("chuni", `event/${item.ddsBannerName}`)}
                  alt=" "
                  width={640}
                  height={112}
                ></Image>
              </ListItemButton>
              <Divider />
            </Fragment>
          ))}
        </List>
      )}
    />
  );
};

export default Events;
