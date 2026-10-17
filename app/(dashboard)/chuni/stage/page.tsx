"use client";
import React, { Fragment } from "react";
import { Divider, List, ListItemButton, ListItemText, Chip } from "@mui/material";
import DataList, { BaseData } from "@/app/Components/Data";
import { getBaseUrl } from "@/app/utils/global";

export interface Stage extends BaseData {
  releaseTagName: string;
  notesFieldLine: string;
  notesFieldFile: string;
  baseFile: string;
  objectFile: string;
  textures: string[];
  models?: string[];
}

const Stages = () => {
  return (
    <DataList<Stage>
      endpoint={`${getBaseUrl("chuni", "stage/stage.json")}`}
      sorts={{ Release: (a, b) => a.releaseTagName.localeCompare(b.releaseTagName) }}
      render={(data) => (
        <List>
          {data.map((item: Stage, index: number) => (
            <Fragment key={index}>
              <ListItemButton component="a" href={`stage/${item.id}`}>
                <ListItemText primary={item.name} secondary={item.releaseTagName} />
                {item.notesFieldLine && (
                  <Chip size="small" label={item.notesFieldLine} />
                )}
              </ListItemButton>
              <Divider />
            </Fragment>
          ))}
        </List>
      )}
    />
  );
};

export default Stages;
