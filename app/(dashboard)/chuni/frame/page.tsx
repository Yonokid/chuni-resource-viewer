"use client";
import React, { Fragment } from "react";
import { Divider, List, ListItemAvatar, ListItemButton, ListItemText } from "@mui/material";
import DataList, { BaseData } from "@/app/Components/Data";
import { getBaseUrl } from "@/app/utils/global";

export interface Frame extends BaseData {
  disableFlag: boolean;
  sortName: string;
  defaultHave: boolean;
  explainText: string;
  priority: number;
  image: string;
}

const Frames = () => {
  return (
    <DataList<Frame>
      endpoint={`${getBaseUrl("chuni", "frame/frame.json")}`}
      render={(data) => (
        <List>
          {data.map((item: Frame) => (
            <Fragment key={item.id}>
              <ListItemButton component="a" href={`/chuni/frame/${item.id}`}>
                <ListItemAvatar sx={{ minWidth: 0, mr: 2 }}>
                  <img src={getBaseUrl("chuni", `frame/${item.image}`)} alt="" width={96} />
                </ListItemAvatar>
                <ListItemText primary={item.name} secondary={item.explainText} />
              </ListItemButton>
              <Divider />
            </Fragment>
          ))}
        </List>
      )}
    />
  );
};

export default Frames;
