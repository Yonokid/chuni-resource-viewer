"use client";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import { Grid, Box, Skeleton, Chip } from "@mui/material";
import React, { Fragment } from "react";
import DataList, { BaseData } from "@/app/Components/Data";
import FitText from "@/app/Components/FitText";
import { AssetRef } from "@/app/Components/AssetLink";
import { getBaseUrl } from "@/app/utils/global";
import Link from "next/link";

export interface CharaRank {
  index: number;
  type?: number;
  skill?: AssetRef;
  skillSeed?: AssetRef; // 2.00+: seed item granted at this rank
  flavorText?: string;
}

export interface Chara extends BaseData {
  illustratorName: string;
  works: string;
  flavorText: string[];
  firstSkill: string | null; // dropped in 2.00
  skillId: string | null;
  rareType: number;
  addImages: (AssetRef & { image?: AssetRef; rank?: number })[];
  ranks: CharaRank[];
  releaseTagName?: string;
  explainText?: string;
  defaultHave?: boolean;
}

const SkeletonGrid = (count: number) => {
  const rows = [];
  for (let i = 0; i < 3; i++) {
    const row = [];
    for (let j = 0; j < 4; j++) {
      row.push(
        <div key={`${i}-${j}`} style={{ margin: "8px" }}>
          <Skeleton variant="rectangular" sx={{ width: { xs: "calc(100vw - 48px)", sm: 256 } }} height={275} />
        </div>,
      );
    }
    rows.push(
      <div key={i} style={{ display: "flex", flexWrap: "wrap" }}>
        {row}
      </div>,
    );
  }
  return <div>{rows}</div>;
};

const CharaCards = () => {
  return (
    <DataList<Chara>
      endpoint={getBaseUrl("chuni", "chara/chara.json")}
      skeleton={SkeletonGrid}
      sorts={{ Illustrator: (a, b) => a.illustratorName.localeCompare(b.illustratorName), Rarity: (a, b) => a.rareType - b.rareType }}
      render={(data) => (
        <Fragment>
          {data &&
            data.map((item: Chara, index: number) => (
              <Grid key={index} size={{ xs: 12, sm: "auto" }}>
                <Link
                  href={`chara/${item.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <Card sx={{ width: { xs: "100%", sm: 256 } }}>
                    <CardActionArea>
                      <CardContent sx={{ padding: 0 }}>
                        <Box sx={{ position: "relative" }}>
                          <CardMedia
                            component="img"
                            sx={{ maxHeight: 175 }}
                            image={getBaseUrl(
                              "chuni",
                              `chara/CHU_UI_Character_${(item.id / 10).toString().padStart(4, "0")}_00_02.webp`,
                            )}
                            alt={item.name}
                          />
                          {item.rareType === 1 && (
                            <Chip
                              size="small"
                              color="warning"
                              label="Rare"
                              sx={{ position: "absolute", top: 8, right: 8 }}
                            />
                          )}
                        </Box>
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
              </Grid>
            ))}
        </Fragment>
      )}
    />
  );
};

export default function CharaPage() {
  return (
    <>
      <Grid container spacing={2}>
        <CharaCards />
      </Grid>
    </>
  );
}
