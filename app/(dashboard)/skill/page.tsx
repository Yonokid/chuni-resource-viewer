"use client";
import React, { Fragment } from "react";
import { Divider, List, ListItemButton, ListItemText } from "@mui/material";
import DataList, { BaseData } from "@/app/Components/Data";
import { getVersion, getAbsolutePath } from "@/app/utils/global";
import { SERVER_URL } from "@/app/layout";

export interface Skill extends BaseData {}

const directory = getAbsolutePath(`../${getVersion()}/skill`);
const Skills = () => {
  return (
    <DataList<BaseData>
      endpoint={`${SERVER_URL}/${directory}/skill.json`}
      render={(data) => (
        <List>
          {data.map((item: BaseData, index: number) => (
            <Fragment key={index}>
              <ListItemButton component="a" href={`skill/${item.id}`}>
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

export default Skills;
