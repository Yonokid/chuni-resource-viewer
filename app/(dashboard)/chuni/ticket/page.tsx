"use client";
import React, { Fragment } from "react";
import { Divider, List, ListItemButton, ListItemText } from "@mui/material";
import DataList, { BaseData } from "@/app/Components/Data";
import { getBaseUrl } from "@/app/utils/global";

export interface Ticket extends BaseData {
  type: number;
  stockMaxNum: number;
  explainText: string;
  valueDay: number;
  valueDayRaw: number;
  valueUse: number;
  valueUseRaw: number;
  valueBoost: number;
  valueBoostRaw: number;
  priority: number;
}

const Tickets = () => {
  return (
    <DataList<Ticket>
      endpoint={`${getBaseUrl("chuni", "ticket/ticket.json")}`}
      render={(data) => (
        <List>
          {data.map((item: Ticket, index: number) => (
            <Fragment key={index}>
              <ListItemButton component="a" href={`/chuni/ticket/${item.id}`}>
                <ListItemText primary={item.name} secondary={item.explainText} />
              </ListItemButton>
              <Divider />
            </Fragment>
          ))}
        </List>
      )}
    />
  );
};

export default Tickets;
