"use client";
import React, { Fragment } from "react";
import { Divider, List, ListItemButton, ListItemText } from "@mui/material";
import DataList, { BaseData } from "@/app/Components/Data";
import Image from "next/image";
import { getBaseUrl } from "@/app/utils/global";

export interface Event extends BaseData {
  ddsBannerId: string;
  eventBannerName: string;
  ddsBannerName: string;
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
