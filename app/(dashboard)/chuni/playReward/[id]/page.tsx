"use client";
import { PlayReward } from "../page";
import DataDetail from "@/app/Components/DataDetail";
import AssetLink from "@/app/Components/AssetLink";
import InfoTable from "@/app/Components/InfoTable";
import { getBaseUrl } from "@/app/utils/global";
import { Fragment } from "react";
import { Typography } from "@mui/material";

const PlayRewardPage = () => {
  return (
    <DataDetail
      endpoint={`${getBaseUrl("chuni", "playReward/playReward.json")}`}
      render={(item: PlayReward) => (
        <Fragment>
          <Typography variant="h4" sx={{ marginBottom: 2 }}>
            {item.name}
          </Typography>
          <InfoTable
            rows={[
              ["ID", item.id],
              ["Reward", <AssetLink key="reward" type="reward" asset={item.reward} />],
              ["Points needed", item.point],
              ["Pick up", item.isPickUpReward ? "Yes" : "No"],
            ]}
          />
        </Fragment>
      )}
    />
  );
};

export default PlayRewardPage;
