"use client";
import React, { Fragment } from "react";
import { Divider, List, ListItemButton, ListItemText } from "@mui/material";
import DataList, { BaseData } from "@/app/Components/Data";
import { getBaseUrl } from "@/app/utils/global";

export interface Stage extends BaseData {}

const Stages = () => {
  return (
    <DataList<BaseData>
      endpoint={`${getBaseUrl("chuni", "stage/stage.json")}`}
      render={(data) => (
        <List>
          {data.map((item: BaseData, index: number) => (
            <Fragment key={index}>
              <ListItemButton component="a" href={`stage/${item.id}`}>
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

export default Stages;
