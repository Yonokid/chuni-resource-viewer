"use client";
import { Duel } from "../page";
import DataDetail from "@/app/Components/DataDetail";
import AssetLink from "@/app/Components/AssetLink";
import { getBaseUrl } from "@/app/utils/global";
import { Fragment } from "react";
import { Typography, Table, TableBody, TableHead, TableRow, TableCell } from "@mui/material";

const DuelPage = () => {
  return (
    <DataDetail
      endpoint={`${getBaseUrl("chuni", "duel/duel.json")}`}
      render={(duel: Duel) => (
        <Fragment>
          <Typography variant="h4">{duel.name}</Typography>
          {duel.explainText && (
            <Typography variant="subtitle1" sx={{ marginBottom: 2, whiteSpace: "pre-line" }}>
              {duel.explainText}
            </Typography>
          )}
          <Table sx={{ maxWidth: 800 }}>
            <TableHead>
              <TableRow>
                <TableCell style={{ fontWeight: 600 }}>Round</TableCell>
                <TableCell style={{ fontWeight: 600 }}>Opponent</TableCell>
                <TableCell style={{ fontWeight: 600 }}>Target</TableCell>
                <TableCell style={{ fontWeight: 600 }} align="right">Reward</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {duel.rounds.map((round, i) => (
                <TableRow key={i}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>
                    <AssetLink type="chara" asset={round.chara} />
                  </TableCell>
                  <TableCell>{round.targetValue.toLocaleString()}</TableCell>
                  <TableCell align="right">
                    <AssetLink type="reward" asset={round.reward} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Fragment>
      )}
    />
  );
};

export default DuelPage;
