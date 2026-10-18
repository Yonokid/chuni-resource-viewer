"use client";
import { Gacha } from "../page";
import DataDetail from "@/app/Components/DataDetail";
import InfoTable from "@/app/Components/InfoTable";
import { getBaseUrl } from "@/app/utils/global";
import { Fragment } from "react";
import { Box, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";

const GachaPage = () => {
  return (
    <DataDetail
      endpoint={`${getBaseUrl("chuni", "gacha/gacha.json")}`}
      render={(gacha: Gacha) => (
        <Fragment>
          {gacha.imageFile && (
            <Box sx={{ mb: 2 }}>
              <img src={getBaseUrl("chuni", `gacha/${gacha.imageFile}`)} alt="" style={{ maxWidth: "100%" }} />
            </Box>
          )}
          <Typography variant="h4" sx={{ marginBottom: 2 }}>
            {gacha.name}
          </Typography>
          <InfoTable
            rows={[
              ["ID", gacha.id],
              ["Ceiling", gacha.ceilingNum || null],
              ["Ceiling type", gacha.ceilingType],
              ["Gacha type", gacha.gachaType],
              ["Pickup", gacha.gachaPickup || null],
            ]}
          />
          <Table sx={{ maxWidth: 800, marginTop: 2 }}>
            <TableHead>
              <TableRow>
                <TableCell>Rarity</TableCell>
                <TableCell align="right">Ratio (/1000)</TableCell>
                <TableCell align="right">Change</TableCell>
                <TableCell align="right">Pickup</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(gacha.rarity).map(([rarity, r]) => (
                <TableRow key={rarity}>
                  <TableCell>{rarity}</TableCell>
                  <TableCell align="right">{r.Ratio}</TableCell>
                  <TableCell align="right">{r.Change}</TableCell>
                  <TableCell align="right">{r.Pickup}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Table sx={{ maxWidth: 800, marginTop: 2 }}>
            <TableHead>
              <TableRow>
                <TableCell>Card</TableCell>
                <TableCell align="right">Weight</TableCell>
                <TableCell align="right">Pickup</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {gacha.cards.map((card) => (
                <TableRow key={card.id}>
                  <TableCell>{card.id}</TableCell>
                  <TableCell align="right">{card.weight}</TableCell>
                  <TableCell align="right">{card.pickup ? "Yes" : null}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Fragment>
      )}
    />
  );
};

export default GachaPage;
