"use client";
import React, { Fragment } from "react";
import { OpenCondition } from "../trophy/page";
import {
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Chip,
  Stack,
} from "@mui/material";
import DataList, { BaseData } from "@/app/Components/Data";
import { AssetRef } from "@/app/Components/AssetLink";
import { getBaseUrl } from "@/app/utils/global";

export interface Shop extends BaseData {
  closeFlag: boolean;
  explainText: string;
  price: number;
  saleCategoryName: string;
  priority: number;
  substanceType: number;
  music: AssetRef | null;
  ticket: AssetRef | null;
  skill: AssetRef | null;
  openCondition?: OpenCondition;
}

const grantLabel = (item: Shop): string | null =>
  item.music?.name ?? item.ticket?.name ?? item.skill?.name ?? null;

const Shops = () => {
  return (
    <DataList<Shop>
      endpoint={`${getBaseUrl("chuni", "shop/shop.json")}`}
      render={(data) => (
        <List>
          {data.map((item: Shop, index: number) => {
            const grant = grantLabel(item);
            return (
              <Fragment key={index}>
                <ListItemButton component="a" href={`shop/${item.id}`}>
                  <ListItemText primary={item.name} secondary={item.saleCategoryName} />
                  <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                    {grant && <Chip size="small" label={grant} />}
                    <Chip size="small" color="primary" label={item.price} />
                  </Stack>
                </ListItemButton>
                <Divider />
              </Fragment>
            );
          })}
        </List>
      )}
    />
  );
};

export default Shops;
