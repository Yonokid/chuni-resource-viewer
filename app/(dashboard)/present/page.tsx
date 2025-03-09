"use client";
import React, { Fragment } from "react";
import { Divider, List, ListItemButton, ListItemText } from "@mui/material";
import DataList, { BaseData } from "@/app/Components/Data";
import { getVersion, getAbsolutePath } from "@/app/utils/global";
import { SERVER_URL } from "@/app/layout";

export interface Present extends BaseData {
  messageText: string;
}

const directory = getAbsolutePath(`../${getVersion()}/present`);
const Presents = () => {
  return (
    <DataList<Present>
      endpoint={`${SERVER_URL}/${directory}/present.json`}
      render={(data) => (
        <List>
          {data.map((item: Present, index: number) => (
            <Fragment key={index}>
              <ListItemButton component="a" href={`present/${item.id}`}>
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

export default Presents;
