"use client";
import React, { Fragment } from "react";
import { Divider, List, ListItemButton, ListItemText } from "@mui/material";
import DataList, { BaseData } from "@/app/Components/Data";
import { getBaseUrl } from "@/app/utils/global";
import AnimatedTitle from "../../../Components/AnimatedTitle";

export interface Title extends BaseData {
  normText: string;
  rareType: number;
  param: number;
  unlock_category: string;
  unlock_type: string;
}

const Trophies = () => {
  return (
    <DataList<Title>
      endpoint={`${getBaseUrl("maimai", "title/title.json")}`}
      render={(data) => (
        <List>
          {data.map((item: Title, index: number) => (
            <Fragment key={index}>
              <ListItemButton component="a" href={`title/${item.id}`}>
                <ListItemText>
                  <AnimatedTitle key={item.id} item={item} />
                </ListItemText>
                <ListItemText
                  sx={{ textAlign: "right", flex: "0 0 45%" }}
                  primary={item.normText}
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
