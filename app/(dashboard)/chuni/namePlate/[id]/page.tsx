"use client";
import { NamePlate, namePlateImage } from "../page";
import DataDetail from "@/app/Components/DataDetail";
import { getBaseUrl } from "@/app/utils/global";
import { Fragment } from "react";
import { Box, Typography, Table, TableBody, TableRow, TableCell } from "@mui/material";

const NamePlatePage = () => {
  return (
    <DataDetail
      endpoint={`${getBaseUrl("chuni", "namePlate/namePlate.json")}`}
      render={(plate: NamePlate) => (
        <Fragment>
          <Box sx={{ mb: 2 }}>
            <img src={namePlateImage(plate)} alt="" width={320} />
          </Box>
          <Typography variant="h4">{plate.name}</Typography>
          <Typography variant="subtitle1" sx={{ marginBottom: 2, whiteSpace: "pre-line" }}>
            {plate.explainText}
          </Typography>
          <Table sx={{ maxWidth: 800 }}>
            <TableBody>
              <TableRow>
                <TableCell style={{ fontWeight: 600 }}>ID</TableCell>
                <TableCell align="right">{plate.id}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ fontWeight: 600 }}>Owned by default</TableCell>
                <TableCell align="right">{plate.defaultHave ? "Yes" : "No"}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Fragment>
      )}
    />
  );
};

export default NamePlatePage;
