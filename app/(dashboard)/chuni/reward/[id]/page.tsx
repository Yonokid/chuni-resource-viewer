"use client";
import { Reward } from "../page";
import AssetLink from "@/app/Components/AssetLink";
import DataDetail from "@/app/Components/DataDetail";
import { getBaseUrl } from "@/app/utils/global";
import { intLabel, useEnums } from "@/app/utils/enums";
import { Fragment } from "react";
import { Typography, Table, TableBody, TableRow, TableCell } from "@mui/material";

const RewardPage = () => {
  const enums = useEnums();
  return (
    <DataDetail
      endpoint={`${getBaseUrl("chuni", "reward/reward.json")}`}
      render={(reward: Reward) => (
        <Fragment>
          <Typography variant="h4" sx={{ marginBottom: 2 }}>{reward.name}</Typography>
          <Table sx={{ maxWidth: 800 }}>
            <TableBody>
              <TableRow>
                <TableCell style={{ fontWeight: 600 }}>ID</TableCell>
                <TableCell align="right">{reward.id}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ fontWeight: 600 }}>Type</TableCell>
                <TableCell align="right">{intLabel(enums, "reward.type", reward.type)}</TableCell>
              </TableRow>
              {reward.gamePoint > 0 && (
                <TableRow>
                  <TableCell style={{ fontWeight: 600 }}>Game points</TableCell>
                  <TableCell align="right">{reward.gamePoint}</TableCell>
                </TableRow>
              )}
              {(["ticket", "trophy", "chara", "skill", "skillSeed", "namePlate", "music", "mapIcon", "systemVoice", "avatarAccessory", "frame"] as const).map(
                (key) =>
                  reward[key] && (
                    <TableRow key={key}>
                      <TableCell style={{ fontWeight: 600 }}>{key}</TableCell>
                      <TableCell align="right">
                        <AssetLink type={key === "skillSeed" ? "skill" : key} asset={reward[key]} />
                        {key === "skillSeed" && reward.skillSeedCount ? ` ×${reward.skillSeedCount}` : ""}
                      </TableCell>
                    </TableRow>
                  )
              )}
            </TableBody>
          </Table>
        </Fragment>
      )}
    />
  );
};

export default RewardPage;
