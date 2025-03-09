"use client";
import React, { Fragment } from "react";
import { Divider, List, ListItemButton, ListItemText } from "@mui/material";
import DataList, { BaseData } from "@/app/Components/Data";
import Image from "next/image";
import { getVersion, getAbsolutePath } from "@/app/utils/global";
import { SERVER_URL } from "@/app/utils/global";

export interface Event extends BaseData {
  ddsBannerId: string;
  eventBannerName: string;
  ddsBannerName: string;
}

const directory = getAbsolutePath(`../${getVersion()}/event`);
const Events = () => {
  return (
    <DataList<Event>
      endpoint={`${SERVER_URL}/${directory}/event.json`}
      render={(data) => (
        <List>
          {data.map((item: Event, index: number) => (
            <Fragment key={index}>
              <ListItemButton component="a" href={`event/${item.id}`}>
                <ListItemText primary={item.name} />
                <Image
                  src={`${SERVER_URL}/${directory}/${item.ddsBannerName}`}
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
