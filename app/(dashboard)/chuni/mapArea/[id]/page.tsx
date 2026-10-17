"use client";
import { MapArea } from "../page";
import DataDetail from "@/app/Components/DataDetail";
import AssetLink from "@/app/Components/AssetLink";
import { getBaseUrl } from "@/app/utils/global";
import { intLabel, useEnums } from "@/app/utils/enums";
import { Fragment } from "react";
import {
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";

const MapAreaPage = () => {
  const enums = useEnums();
  return (
    <DataDetail
      endpoint={`${getBaseUrl("chuni", "mapArea/mapArea.json")}`}
      render={(mapArea: MapArea) => {
        const grids = [...mapArea.grids].sort((a, b) => a.index - b.index);
        return (
          <Fragment>
            <Typography variant="h4">{mapArea.name}</Typography>
            <Typography variant="subtitle1" sx={{ marginBottom: 2 }}>
              {grids.length} tiles
            </Typography>
            <Table sx={{ maxWidth: 800 }}>
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: 600 }}>Index</TableCell>
                  <TableCell style={{ fontWeight: 600 }}>Type</TableCell>
                  <TableCell align="right" style={{ fontWeight: 600 }}>
                    Points
                  </TableCell>
                  <TableCell align="right" style={{ fontWeight: 600 }}>
                    Ticket
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {grids.map((grid) => (
                  <TableRow key={grid.index}>
                    <TableCell>{grid.index}</TableCell>
                    <TableCell>{intLabel(enums, "mapArea.grid.type", grid.type)}</TableCell>
                    <TableCell align="right">{grid.gamePoint || "—"}</TableCell>
                    <TableCell align="right">
                      {grid.ticket ? <AssetLink type="ticket" asset={grid.ticket} /> : "—"}
                    </TableCell>
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

export default MapAreaPage;
