"use client";
import { Present } from "../page";
import DataDetail from "@/app/Components/DataDetail";
import AssetLink from "@/app/Components/AssetLink";
import { getBaseUrl } from "@/app/utils/global";
import { Fragment } from "react";
import { Typography, Table, TableBody, TableRow, TableCell } from "@mui/material";

const PresentPage = () => {
  return (
    <DataDetail
      endpoint={`${getBaseUrl("chuni", "present/present.json")}`}
      render={(present: Present) => (
        <Fragment>
          <Typography variant="h4">{present.name}</Typography>
          <Typography variant="subtitle1" sx={{ marginBottom: 2 }}>
            {present.messageText}
          </Typography>
          <Table sx={{ maxWidth: 800 }}>
            <TableBody>
              <TableRow>
                <TableCell style={{ fontWeight: 600 }}>ID</TableCell>
                <TableCell align="right">{present.id}</TableCell>
              </TableRow>
              {present.gamePoint > 0 && (
                <TableRow>
                  <TableCell style={{ fontWeight: 600 }}>Game Points</TableCell>
                  <TableCell align="right">{present.gamePoint}</TableCell>
                </TableRow>
              )}
              {present.ticket && (
                <TableRow>
                  <TableCell style={{ fontWeight: 600 }}>Ticket</TableCell>
                  <TableCell align="right">
                    <AssetLink type="ticket" asset={present.ticket} />
                  </TableCell>
                </TableRow>
              )}
              {present.chara && (
                <TableRow>
                  <TableCell style={{ fontWeight: 600 }}>Character</TableCell>
                  <TableCell align="right">
                    <AssetLink type="chara" asset={present.chara} />
                  </TableCell>
                </TableRow>
              )}
              {present.skill && (
                <TableRow>
                  <TableCell style={{ fontWeight: 600 }}>Skill</TableCell>
                  <TableCell align="right">
                    <AssetLink type="skill" asset={present.skill} />
                  </TableCell>
                </TableRow>
              )}
              {present.trophy && (
                <TableRow>
                  <TableCell style={{ fontWeight: 600 }}>Trophy</TableCell>
                  <TableCell align="right">
                    <AssetLink type="trophy" asset={present.trophy} />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Fragment>
      )}
    />
  );
};

export default PresentPage;
