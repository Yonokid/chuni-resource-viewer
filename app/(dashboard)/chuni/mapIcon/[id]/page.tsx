"use client";
import { MapIcon } from "../page";
import DataDetail from "@/app/Components/DataDetail";
import { getBaseUrl } from "@/app/utils/global";
import { Fragment } from "react";
import { Box, Typography, Table, TableBody, TableRow, TableCell } from "@mui/material";

const MapIconPage = () => {
  return (
    <DataDetail
      endpoint={`${getBaseUrl("chuni", "mapIcon/mapIcon.json")}`}
      render={(item: MapIcon) => (
        <Fragment>
          <Box sx={{ mb: 2 }}>
            <img src={getBaseUrl("chuni", `mapIcon/${item.image}`)} alt="" width={240} />
          </Box>
          <Typography variant="h4">{item.name}</Typography>
          <Typography variant="subtitle1" sx={{ marginBottom: 2, whiteSpace: "pre-line" }}>
            {item.explainText}
          </Typography>
          <Table sx={{ maxWidth: 800 }}>
            <TableBody>
              <TableRow>
                <TableCell style={{ fontWeight: 600 }}>ID</TableCell>
                <TableCell align="right">{item.id}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ fontWeight: 600 }}>Works</TableCell>
                <TableCell align="right">{item.works?.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ fontWeight: 600 }}>Owned by default</TableCell>
                <TableCell align="right">{item.defaultHave ? "Yes" : "No"}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Fragment>
      )}
    />
  );
};

export default MapIconPage;
