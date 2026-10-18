"use client";
import React, { Fragment } from "react";
import { Divider, List, ListItemButton, ListItemText } from "@mui/material";
import DataList, { BaseData } from "@/app/Components/Data";
import { getBaseUrl } from "@/app/utils/global";

export interface SymbolChat extends BaseData {
  disableFlag: boolean;
  sortName: string;
  text: string;
  balloonId: number;
  scenes: number[];
  defaultHave: boolean;
  explainText: string;
  priority: number;
}

const SymbolChats = () => {
  return (
    <DataList<SymbolChat>
      endpoint={`${getBaseUrl("chuni", "symbolChat/symbolChat.json")}`}
      render={(data) => (
        <List>
          {data.map((item: SymbolChat) => (
            <Fragment key={item.id}>
              <ListItemButton component="a" href={`/chuni/symbolChat/${item.id}`}>
                <ListItemText primary={item.name} secondary={item.explainText !== "-" ? item.explainText : null} />
              </ListItemButton>
              <Divider />
            </Fragment>
          ))}
        </List>
      )}
    />
  );
};

export default SymbolChats;
