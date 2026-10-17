"use client";
import React, { Fragment } from "react";
import { Divider, List, ListItemAvatar, ListItemButton, ListItemText } from "@mui/material";
import DataList, { BaseData } from "@/app/Components/Data";
import { getBaseUrl } from "@/app/utils/global";
import TicketBanner from "@/app/Components/TicketBanner";

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
  valueMultipleRaw?: number;
  valuePlusRaw?: number;
  addRankLimit?: number;
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
                <ListItemAvatar sx={{ minWidth: 0, mr: 2 }}>
                  <TicketBanner ticket={item} width={120} />
                </ListItemAvatar>
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
