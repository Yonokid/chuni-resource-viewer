"use client";
import React, { Fragment } from "react";
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

export interface Present extends BaseData {
  messageText: string;
  gamePoint: number;
  ticket: AssetRef | null;
  chara: AssetRef | null;
  skill: AssetRef | null;
  trophy: AssetRef | null;
}

const grantLabel = (item: Present): string | null => {
  if (item.gamePoint > 0) return `${item.gamePoint} pt`;
  return item.ticket?.name ?? item.chara?.name ?? item.skill?.name ?? item.trophy?.name ?? null;
};

const Presents = () => {
  return (
    <DataList<Present>
      endpoint={`${getBaseUrl("chuni", "present/present.json")}`}
      render={(data) => (
        <List>
          {data.map((item: Present, index: number) => {
            const grant = grantLabel(item);
            return (
              <Fragment key={index}>
                <ListItemButton component="a" href={`present/${item.id}`}>
                  <ListItemText primary={item.name} secondary={item.messageText} />
                  {grant && (
                    <Stack direction="row">
                      <Chip size="small" label={grant} />
                    </Stack>
                  )}
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

export default Presents;
