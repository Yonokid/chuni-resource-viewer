"use client";
import { BattleReward } from "../page";
import DataDetail from "@/app/Components/DataDetail";
import AssetLink from "@/app/Components/AssetLink";
import InfoTable from "@/app/Components/InfoTable";
import { getBaseUrl } from "@/app/utils/global";
import { Fragment } from "react";
import { Typography } from "@mui/material";

const BattleRewardPage = () => {
  return (
    <DataDetail
      endpoint={`${getBaseUrl("chuni", "battleReward/battleReward.json")}`}
      render={(item: BattleReward) => (
        <Fragment>
          <Typography variant="h4" sx={{ marginBottom: 2 }}>
            {item.name}
          </Typography>
          <InfoTable
            rows={[
              ["ID", item.id],
              ["Reward", <AssetLink key="reward" type="reward" asset={item.reward} />],
              ["Battles needed", item.playCount],
            ]}
          />
        </Fragment>
      )}
    />
  );
};

export default BattleRewardPage;
