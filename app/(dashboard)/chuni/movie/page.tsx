"use client";
import React, { Fragment } from "react";
import { Divider, List, ListItemButton, ListItemText } from "@mui/material";
import DataList, { BaseData } from "@/app/Components/Data";
import { getBaseUrl } from "@/app/utils/global";

export interface Movie extends BaseData {
  filename: string;
  mp4name: string;
}

const Movies = () => {
  return (
    <DataList<Movie>
      endpoint={getBaseUrl("chuni", "movie/movie.json")}
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
