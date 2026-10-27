"use client";
import React, { Fragment } from "react";
import { Divider, List, ListItemAvatar, ListItemButton, ListItemText } from "@mui/material";
import DataList, { BaseData } from "@/app/Components/Data";
import { getBaseUrl } from "@/app/utils/global";
import { getUnlocked } from "@/app/utils/unlocks";
import NamePlateImage from "@/app/Components/NamePlateImage";

export interface NamePlate extends BaseData {
  explainText: string;
  defaultHave: boolean;
  priority: number;
  image: string;
}

const NamePlates = () => {
  const unlocked = getUnlocked("namePlate");
  return (
    <DataList<NamePlate>
      endpoint={`${getBaseUrl("chuni", "namePlate/namePlate.json")}`}
      render={(data) => (
        <List>
          {data.map((item: NamePlate, index: number) => (
            <Fragment key={index}>
              <ListItemButton component="a" href={`/chuni/namePlate/${item.id}`} selected={unlocked.has(item.id)}>
                <ListItemAvatar sx={{ minWidth: 0, mr: 2 }}>
                  <NamePlateImage plate={item} width={160} />
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
