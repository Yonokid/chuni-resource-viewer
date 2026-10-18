"use client";
import { PlayRewardSet } from "../page";
import DataDetail from "@/app/Components/DataDetail";
import AssetLink from "@/app/Components/AssetLink";
import { getBaseUrl } from "@/app/utils/global";
import { Fragment } from "react";
import { List, ListItem, Typography } from "@mui/material";

const PlayRewardSetPage = () => {
  return (
    <DataDetail
      endpoint={`${getBaseUrl("chuni", "playRewardSet/playRewardSet.json")}`}
      render={(item: PlayRewardSet) => (
        <Fragment>
          <Typography variant="h4">{item.name}</Typography>
          <Typography color="text.secondary" sx={{ marginBottom: 2 }}>
            #{item.id}
          </Typography>
          <List sx={{ maxWidth: 800 }}>
            {item.playRewards.map((reward) =>
              reward ? (
                <ListItem key={reward.id}>
                  <AssetLink type="playReward" asset={reward} />
                </ListItem>
              ) : null,
            )}
          </List>
        </Fragment>
      )}
    />
  );
};

export default PlayRewardSetPage;
