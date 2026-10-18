"use client";
import { AvatarAccessoryGacha } from "../page";
import DataDetail from "@/app/Components/DataDetail";
import AssetLink from "@/app/Components/AssetLink";
import InfoTable from "@/app/Components/InfoTable";
import { getBaseUrl } from "@/app/utils/global";
import { Fragment } from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";

const AvatarAccessoryGachaPage = () => {
  return (
    <DataDetail
      endpoint={`${getBaseUrl("chuni", "avatarAccessoryGacha/avatarAccessoryGacha.json")}`}
      render={(gacha: AvatarAccessoryGacha) => {
        const total = gacha.items.reduce((sum, item) => sum + item.weight, 0);
        return (
          <Fragment>
            <Typography variant="h4" sx={{ marginBottom: 2 }}>
              {gacha.name}
            </Typography>
            <InfoTable rows={[["ID", gacha.id], ["Default pool", gacha.isDefault ? "Yes" : null]]} />
            <Table sx={{ maxWidth: 800, marginTop: 2 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Item</TableCell>
                  <TableCell align="right">Weight</TableCell>
                  <TableCell align="right">Chance</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {gacha.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <AssetLink type="avatarAccessory" asset={item.avatarAccessory} />
                    </TableCell>
                    <TableCell align="right">{item.weight}</TableCell>
                    <TableCell align="right">{total ? `${((item.weight / total) * 100).toFixed(1)}%` : "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Fragment>
        );
      }}
    />
  );
};

export default AvatarAccessoryGachaPage;
