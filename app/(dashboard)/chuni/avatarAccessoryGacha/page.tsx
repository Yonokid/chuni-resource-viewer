"use client";
import React, { Fragment } from "react";
import { Divider, List, ListItemButton, ListItemText } from "@mui/material";
import DataList, { BaseData } from "@/app/Components/Data";
import { AssetRef } from "@/app/Components/AssetLink";
import { getBaseUrl } from "@/app/utils/global";

export interface AvatarAccessoryGacha extends BaseData {
  disableFlag: boolean;
  isDefault: boolean;
  items: { avatarAccessory: AssetRef | null; weight: number }[];
}

const AvatarAccessoryGachas = () => {
  return (
    <DataList<AvatarAccessoryGacha>
      endpoint={`${getBaseUrl("chuni", "avatarAccessoryGacha/avatarAccessoryGacha.json")}`}
      render={(data) => (
        <List>
          {data.map((item: AvatarAccessoryGacha) => (
            <Fragment key={item.id}>
              <ListItemButton component="a" href={`/chuni/avatarAccessoryGacha/${item.id}`}>
                <ListItemText primary={item.name} secondary={`${item.items.length} items`} />
              </ListItemButton>
              <Divider />
            </Fragment>
          ))}
        </List>
      )}
    />
  );
};

export default AvatarAccessoryGachas;
