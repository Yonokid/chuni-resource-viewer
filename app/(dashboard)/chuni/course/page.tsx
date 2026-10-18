"use client";
import React, { Fragment } from "react";
import { Divider, List, ListItemButton, ListItemText } from "@mui/material";
import DataList, { BaseData } from "@/app/Components/Data";
import { AssetRef } from "@/app/Components/AssetLink";
import { getBaseUrl } from "@/app/utils/global";

export interface CourseInfo {
  type: number;
  kind: "selectMusic" | "selectLevel";
  music?: AssetRef | null;
  difficulty?: AssetRef | null;
  fromLevel?: AssetRef;
}

export interface CourseRule extends AssetRef {
  explain: string;
  life: number;
  recoveryLife: number;
  clearLife: number;
  damageMiss: number;
  damageAttack: number;
  damageJustice: number;
  damageJusticeCritical: number;
}

export interface Course extends BaseData {
  disableFlag: boolean;
  difficulty: AssetRef;
  category?: number;
  rule: (AssetRef & Partial<CourseRule>) | null;  // courseRule is embedded when the version has it
  reward: AssetRef | null;
  reward2nd?: AssetRef | null;
  priority: number;
  infos: CourseInfo[];
}

const Courses = () => {
  return (
    <DataList<Course>
      endpoint={`${getBaseUrl("chuni", "course/course.json")}`}
      render={(data) => (
        <List>
          {data.map((item: Course, index: number) => (
            <Fragment key={index}>
              <ListItemButton component="a" href={`/chuni/course/${item.id}`}>
                <ListItemText primary={item.name} secondary={item.difficulty.name} />
              </ListItemButton>
              <Divider />
            </Fragment>
          ))}
        </List>
      )}
    />
  );
};

export default Courses;
