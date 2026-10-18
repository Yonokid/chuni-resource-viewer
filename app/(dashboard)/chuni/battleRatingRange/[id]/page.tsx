"use client";
import { BattleRatingRange } from "../page";
import DataDetail from "@/app/Components/DataDetail";
import InfoTable from "@/app/Components/InfoTable";
import { getBaseUrl, level } from "@/app/utils/global";
import { Fragment } from "react";
import { Typography } from "@mui/material";

const BattleRatingRangePage = () => {
  return (
    <DataDetail
      endpoint={`${getBaseUrl("chuni", "battleRatingRange/battleRatingRange.json")}`}
      render={(item: BattleRatingRange) => (
        <Fragment>
          <Typography variant="h4" sx={{ marginBottom: 2 }}>
            {item.name}
          </Typography>
          <InfoTable
            rows={[
              ["ID", item.id],
              ["Min battle rating", item.minBattleRating],
              ["Song level", `${level(item.minMusicLevel)} - ${level(item.maxMusicLevel)}`],
              ["CPU can pick (per difficulty slot)", item.selectableByCPU.map((b) => (b ? "Yes" : "No")).join(", ")],
            ]}
          />
        </Fragment>
      )}
    />
  );
};

export default BattleRatingRangePage;
