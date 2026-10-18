"use client";
import React, { Fragment } from "react";
import { Divider, List, ListItemButton, ListItemText } from "@mui/material";
import DataList, { BaseData } from "@/app/Components/Data";
import { getBaseUrl } from "@/app/utils/global";

export interface DailyBonus extends BaseData {
  text: string;
  effects: { [block: string]: { [key: string]: number } };
}

const DailyBonuses = () => {
  return (
    <DataList<DailyBonus>
      endpoint={`${getBaseUrl("chuni", "dailyBonus/dailyBonus.json")}`}
      render={(data) => (
        <List>
          {data.map((item: DailyBonus) => (
            <Fragment key={item.id}>
              <ListItemButton component="a" href={`/chuni/dailyBonus/${item.id}`}>
                <ListItemText primary={item.name} secondary={item.text} />
              </ListItemButton>
              <Divider />
            </Fragment>
          ))}
        </List>
      )}
    />
  );
};

export default DailyBonuses;
