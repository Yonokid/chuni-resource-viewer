"use client";
import DataList, { BaseData } from "@/app/Components/Data";
import FitText from "@/app/Components/FitText";
import { getAbsolutePath, getVersion } from "@/app/utils/global";
import { Box, Grid2, Skeleton } from "@mui/material";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { Fragment, useState } from "react";

interface Chart {
  difficulty: number;
  level: number;
}
export interface Song extends BaseData {
  sortName: string;
  artistName: string;
  genreName: string;
  charts: Chart[];
}

const SkeletonGrid = (count: number) => {
  const rows = [];
  for (let i = 0; i < 3; i++) {
    const row = [];
    for (let j = 0; j < 3; j++) {
      row.push(
        <div key={`${i}-${j}`} style={{ margin: "8px" }}>
          <Skeleton variant="rectangular" width={300} height={280} />
        </div>,
      );
    }
    rows.push(
      <div key={i} style={{ display: "flex" }}>
        {row}
      </div>,
    );
  }
  return <div>{rows}</div>;
};

interface MediaProps {
  loading?: boolean;
}

const directory = getAbsolutePath(`../${getVersion()}/music`);
const SongCards = (props: MediaProps) => {
  const { loading = false } = props;
  const server_url = process.env.NEXT_PUBLIC_SERVER_URL;
  return (
    <DataList<Song>
      endpoint={`${server_url}/${directory}/music.json`}
      skeleton={SkeletonGrid}
      render={(data) => (
        <Fragment>
          {data &&
            data.map((item: Song, index: number) => (
              <Grid2 key={index}>
                <Link
                  href={`music/${item.id.padStart(4, "0")}`}
                  style={{ textDecoration: "none" }}
                >
                  <Card sx={{ width: 300 }}>
                    <CardActionArea>
                      <CardContent sx={{ padding: 0 }}>
                        <>
                          {loading ? (
                            <Skeleton
                              variant="rectangular"
                              sx={{ height: 175, width: "100%" }}
                            />
                          ) : (
                            <CardMedia
                              component="img"
                              sx={{ maxHeight: 175 }}
                              image={`${server_url}/${directory}/CHU_UI_Jacket_${item.id.padStart(4, "0")}.webp`}
                              alt={item.name}
                            />
                          )}
                        </>
                        <Box sx={{ margin: 2 }}>
                          <FitText text={item.name} maxFontSize="1.5rem" />
                          <FitText
                            text={item.artistName}
                            variant="h6"
                            color="textSecondary"
                            maxFontSize="1rem"
                          />
                          <Typography variant="button" color="textSecondary">
                            {item.genreName}
                          </Typography>
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Link>
              </Grid2>
            ))}
        </Fragment>
      )}
    />
  );
};

export default function MusicPage() {
  return (
    <>
      <Grid2 container spacing={2}>
        <SongCards />
      </Grid2>
    </>
  );
}
