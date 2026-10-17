"use client";
import React, { Fragment } from "react";
import { Divider, List, ListItemButton, ListItemText } from "@mui/material";
import DataList, { BaseData } from "@/app/Components/Data";
import { getBaseUrl } from "@/app/utils/global";

export interface ChargeItem extends BaseData {
  type: number;
  expirationDays: number;
  itemNum: number;
  consumeType: number;
  forceUse: boolean;
  sellingAppeal: boolean;
  ticketId: number;
}

const ChargeItems = () => {
  return (
    <DataList<ChargeItem>
      endpoint={`${getBaseUrl("chuni", "chargeItem/chargeItem.json")}`}
      render={(data) => (
        <List>
          {data.map((item: ChargeItem, index: number) => (
            <Fragment key={index}>
              <ListItemButton component="a" href={`/chuni/chargeItem/${item.id}`}>
                <ListItemText primary={item.name} secondary={`×${item.itemNum}, expires after ${item.expirationDays} days`} />
              </ListItemButton>
              <Divider />
            </Fragment>
          ))}
        </List>
      )}
    />
  );
};

export default ChargeItems;
