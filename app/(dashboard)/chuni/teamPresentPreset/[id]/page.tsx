"use client";
import { TeamPresentPreset } from "../page";
import DataDetail from "@/app/Components/DataDetail";
import AssetLink from "@/app/Components/AssetLink";
import { getBaseUrl } from "@/app/utils/global";
import { Fragment } from "react";
import { List, ListItem, Typography } from "@mui/material";

const TeamPresentPresetPage = () => {
  return (
    <DataDetail
      endpoint={`${getBaseUrl("chuni", "teamPresentPreset/teamPresentPreset.json")}`}
      render={(item: TeamPresentPreset) => (
        <Fragment>
          <Typography variant="h4">{item.name}</Typography>
          <Typography color="text.secondary" sx={{ marginBottom: 2 }}>
            #{item.id}
          </Typography>
          <List sx={{ maxWidth: 800 }}>
            {item.presents.map((present, index) => (
              <ListItem key={index}>
                <AssetLink type="teamPresent" asset={present} />
              </ListItem>
            ))}
          </List>
        </Fragment>
      )}
    />
  );
};

export default TeamPresentPresetPage;
