"use client";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import { Grid2, Box, Skeleton } from "@mui/material";
import React, { Fragment } from "react";
import DataList, { BaseData } from "@/app/Components/Data";
import FitText from "@/app/Components/FitText";
import { getVersion, getAbsolutePath } from "@/app/utils/global";
import Link from "next/link";
import { SERVER_URL } from "@/app/layout";

export interface Chara extends BaseData {
  illustratorName: string;
  works: string;
  flavorText: string[];
  firstSkill: string;
  skillId: string;
}

const SkeletonGrid = (count: number) => {
  const rows = [];
  for (let i = 0; i < 3; i++) {
    const row = [];
    for (let j = 0; j < 4; j++) {
      row.push(
        <div key={`${i}-${j}`} style={{ margin: "8px" }}>
          <Skeleton variant="rectangular" width={256} height={275} />
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

const directory = getAbsolutePath(`../${getVersion()}/chara`);
const CharaCards = () => {
  return (
    <DataList<Chara>
      endpoint={`${SERVER_URL}/${directory}/chara.json`}
      skeleton={SkeletonGrid}
      render={(data) => (
        <Fragment>
          {data &&
            data.map((item: Chara, index: number) => (
              <Grid2 key={index}>
                <Link
                  href={`chara/${item.id.padStart(4, "0")}`}
                  style={{ textDecoration: "none" }}
                >
                  <Card sx={{ width: 256 }}>
                    <CardActionArea>
                      <CardContent sx={{ padding: 0 }}>
                        <CardMedia
                          component="img"
                          sx={{ maxHeight: 175 }}
                          image={`${SERVER_URL}/chara/CHU_UI_Character_${(parseInt(item.id, 10) / 10).toString().padStart(4, "0")}_00_02.webp`}
                          alt={item.name}
                        />
                        <Box sx={{ margin: 2 }}>
                          <FitText text={item.name} maxFontSize="1.5rem" />
                          <FitText
                            text={item.illustratorName}
                            variant="h6"
                            color="textSecondary"
                            maxFontSize="1rem"
                          />
                          <FitText
                            text={item.works}
                            variant="button"
                            color="textSecondary"
                            maxFontSize="0.8rem"
                          ></FitText>
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

export default function CharaPage() {
  return (
    <>
      <Grid2 container spacing={2}>
        <CharaCards />
      </Grid2>
    </>
  );
}
