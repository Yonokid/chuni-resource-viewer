"use client";
import React, { Fragment } from "react";
import { Divider, List, ListItemButton, ListItemText } from "@mui/material";
import DataList, { BaseData } from "@/app/Components/Data";
import { getVersion, getAbsolutePath } from "@/app/utils/global";
import { SERVER_URL } from "@/app/utils/global";

export interface Ticket extends BaseData {
  explainText: string;
}

const directory = getAbsolutePath(`../${getVersion()}/ticket`);
const Tickets = () => {
  return (
    <DataList<Ticket>
      endpoint={`${SERVER_URL}/${directory}/ticket.json`}
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
