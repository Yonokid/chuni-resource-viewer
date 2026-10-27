"use client";
import React, { Fragment } from "react";
import { Divider, List, ListItemAvatar, ListItemButton, ListItemText } from "@mui/material";
import DataList, { BaseData } from "@/app/Components/Data";
import { getBaseUrl } from "@/app/utils/global";
import { getUnlocked } from "@/app/utils/unlocks";
import { intLabel, useEnums } from "@/app/utils/enums";

export interface AvatarAccessory extends BaseData {
  disableFlag: boolean;
  sortName: string;
  category: number;
  layerIndex: number;
  defaultHave: boolean;
  explainText: string;
  priority: number;
  image: string;
}

const AvatarAccessories = () => {
  const enums = useEnums();
  const unlocked = getUnlocked("avatarAccessory");
  return (
    <DataList<AvatarAccessory>
      endpoint={`${getBaseUrl("chuni", "avatarAccessory/avatarAccessory.json")}`}
      render={(data) => (
        <List>
          {data.map((item: AvatarAccessory) => (
            <Fragment key={item.id}>
              <ListItemButton component="a" href={`/chuni/avatarAccessory/${item.id}`} selected={unlocked.has(item.id)}>
                <ListItemAvatar sx={{ minWidth: 0, mr: 2 }}>
                  <img src={getBaseUrl("chuni", `avatarAccessory/${item.image}`)} alt="" width={64} />
                </ListItemAvatar>
                <ListItemText primary={item.name} secondary={intLabel(enums, "avatarAccessory.category", item.category)} />
              </ListItemButton>
              <Divider />
            </Fragment>
          ))}
        </List>
      )}
    />
  );
};

export default AvatarAccessories;
