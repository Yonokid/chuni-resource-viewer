"use client";
import React, { Fragment } from "react";
import { Divider, List, ListItemAvatar, ListItemButton, ListItemText } from "@mui/material";
import DataList, { BaseData } from "@/app/Components/Data";
import { getBaseUrl } from "@/app/utils/global";

export interface NamePlate extends BaseData {
  explainText: string;
  defaultHave: boolean;
  priority: number;
  image: string;
}

export const namePlateImage = (plate: NamePlate) => getBaseUrl("chuni", `namePlate/${plate.image}`);

const NamePlates = () => {
  return (
    <DataList<NamePlate>
      endpoint={`${getBaseUrl("chuni", "namePlate/namePlate.json")}`}
      render={(data) => (
        <List>
          {data.map((item: NamePlate, index: number) => (
            <Fragment key={index}>
              <ListItemButton component="a" href={`/chuni/namePlate/${item.id}`}>
                <ListItemAvatar sx={{ minWidth: 0, mr: 2 }}>
                  <img src={namePlateImage(item)} alt="" width={160} />
                </ListItemAvatar>
                <ListItemText primary={item.name} secondary={item.explainText} sx={{ whiteSpace: "pre-line" }} />
              </ListItemButton>
              <Divider />
            </Fragment>
          ))}
        </List>
      )}
    />
  );
};

export default NamePlates;
