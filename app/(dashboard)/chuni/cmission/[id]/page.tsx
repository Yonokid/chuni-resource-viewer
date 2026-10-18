"use client";
import { CMission, charaImage } from "../page";
import DataDetail from "@/app/Components/DataDetail";
import AssetLink from "@/app/Components/AssetLink";
import { getBaseUrl } from "@/app/utils/global";
import { Fragment } from "react";
import { Box, Chip, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";

const MissionPage = () => {
  return (
    <DataDetail
      endpoint={`${getBaseUrl("chuni", "cmission/cmission.json")}`}
      render={(item: CMission) => {
        const stages = [...new Set(item.stages.map((s) => s.stage))].sort((a, b) => a - b);
        return (
          <Fragment>
            {item.chara && <img src={charaImage(item.chara)} alt="" height={160} style={{ float: "right" }} />}
            <Typography variant="h4">{item.name}</Typography>
            <Typography color="text.secondary" sx={{ marginBottom: 2 }}>
              #{item.id}
            </Typography>
            {item.explainText && <Typography sx={{ marginBottom: 2, whiteSpace: "pre-line" }}>{item.explainText}</Typography>}

            <Typography variant="h6">Rewards</Typography>
            <Table size="small" sx={{ maxWidth: 800, marginBottom: 3 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Points</TableCell>
                  <TableCell>Reward</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {item.rounds.map((round, i) => (
                  <TableRow key={i}>
                    <TableCell>{round.targetValue}</TableCell>
                    <TableCell>
                      <AssetLink type="reward" asset={round.reward} />
                    </TableCell>
                    <TableCell align="right">
                      {round.isPickup && <Chip size="small" color="primary" label="Pickup" sx={{ mr: 1 }} />}
                      {round.isLoop && <Chip size="small" label="Repeats" />}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Typography variant="h6">Tasks</Typography>
            {stages.map((stage) => (
              <Box key={stage} sx={{ maxWidth: 800, marginBottom: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Stage {stage + 1}
                  {item.stages.some((s) => s.stage === stage && s.loop) && " (repeats)"}
                </Typography>
                <Table size="small">
                  <TableBody>
                    {item.stages
                      .filter((s) => s.stage === stage)
                      .sort((a, b) => a.pos - b.pos)
                      .map((s) => (
                        <TableRow key={s.pos}>
                          <TableCell>
                            <AssetLink type="cmissionInfo" asset={s.info} />
                          </TableCell>
                          <TableCell align="right">×{s.border}</TableCell>
                          <TableCell align="right">{s.point} pts</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </Box>
            ))}
          </Fragment>
        );
      }}
    />
  );
};

export default MissionPage;
