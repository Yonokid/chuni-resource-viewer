"use client";
import React, { Fragment } from "react";
import { Box, Divider, List, ListItemAvatar, ListItemButton, ListItemText } from "@mui/material";
import DataList, { BaseData } from "@/app/Components/Data";
import { getBaseUrl } from "@/app/utils/global";
import { spriteUrl } from "@/app/utils/enums";

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

export const TicketBanner = ({ ticket, width }: { ticket: Ticket; width: number }) => (
  <Box sx={{ position: "relative", width, flexShrink: 0, lineHeight: 0, "&:has(img[hidden])": { display: "none" } }}>
    <img src={spriteUrl("ticketType", ticket.type)} alt="" style={{ width: "100%" }} onError={(e) => (e.currentTarget.hidden = true)} />
    {ticket.name.includes("プレゼント") && (
      <img src={spriteUrl("ticketPresent", 0)} alt="Present" style={{ position: "absolute", top: 0, right: 0, width: "23%" }} />
    )}
  </Box>
);

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
