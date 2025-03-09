"use client";
import React, { Fragment } from "react";
import { Divider, List, ListItemButton, ListItemText } from "@mui/material";
import DataList, { BaseData } from "@/app/Components/Data";
import { getVersion, getAbsolutePath } from "@/app/utils/global";
import { SERVER_URL } from "@/app/utils/global";

export interface Trophy extends BaseData {
  explainText: string;
}

const directory = getAbsolutePath(`../${getVersion()}/trophy`);
const Trophies = () => {
  return (
    <DataList<Trophy>
      endpoint={`${SERVER_URL}/${directory}/trophy.json`}
      render={(data) => (
        <List>
          {data.map((item: Trophy, index: number) => (
            <Fragment key={index}>
              <ListItemButton component="a" href={`trophy/${item.id}`}>
                <ListItemText primary={item.name} />
                <ListItemText
                  sx={{ textAlign: "right" }}
                  primary={item.explainText}
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

export default Trophies;
