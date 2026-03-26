"use client";
import React, { Fragment } from "react";
import { Divider, List, ListItemButton, ListItemText } from "@mui/material";
import DataList, { BaseData } from "@/app/Components/Data";
import { getBaseUrl } from "@/app/utils/global";

export interface Ticket extends BaseData {
  explainText: string;
}

const Tickets = () => {
  return (
    <DataList<Ticket>
      endpoint={`${getBaseUrl("chuni", "ticket/ticket.json")}`}
      render={(data) => (
        <List>
          {data.map((item: Ticket, index: number) => (
            <Fragment key={index}>
              <ListItemButton component="a" href={`/ticket/${item.id}`}>
                <ListItemText primary={item.name} />
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
