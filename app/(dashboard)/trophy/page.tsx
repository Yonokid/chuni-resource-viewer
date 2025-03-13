"use client";
import React, { Fragment } from "react";
import { Divider, List, ListItemButton, ListItemText } from "@mui/material";
import DataList, { BaseData } from "@/app/Components/Data";
import { getVersion, getAbsolutePath } from "@/app/utils/global";
import { SERVER_URL } from "@/app/utils/global";
import AnimatedTitle from "../../Components/AnimatedTitle";

export interface Trophy extends BaseData {
  explainText: string;
  rareType: string;
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
                <ListItemText>
                  <AnimatedTitle key={item.id} item={item} />
                </ListItemText>
                <ListItemText
                  sx={{ textAlign: "right", flex: "0 0 45%" }}
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
