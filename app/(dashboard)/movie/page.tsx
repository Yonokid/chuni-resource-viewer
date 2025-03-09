"use client";
import React, { Fragment } from "react";
import { Divider, List, ListItemButton, ListItemText } from "@mui/material";
import DataList, { BaseData } from "@/app/Components/Data";
import { getVersion, getAbsolutePath } from "@/app/utils/global";
import { SERVER_URL } from "@/app/layout";

export interface Movie extends BaseData {
  filename: string;
  mp4name: string;
}

const directory = getAbsolutePath(`../${getVersion()}/movie`);
const Movies = () => {
  return (
    <DataList<Movie>
      endpoint={`${SERVER_URL}/${directory}/movie.json`}
      render={(data) => (
        <List>
          {data.map((item: BaseData, index: number) => (
            <Fragment key={index}>
              <ListItemButton component="a" href={`movie/${item.id}`}>
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

export default Movies;
