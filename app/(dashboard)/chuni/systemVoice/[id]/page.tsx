"use client";
import { SystemVoice } from "../page";
import DataDetail from "@/app/Components/DataDetail";
import { getBaseUrl } from "@/app/utils/global";
import { Fragment } from "react";
import { Box, Typography, Table, TableBody, TableRow, TableCell } from "@mui/material";

const SystemVoicePage = () => {
  return (
    <DataDetail
      endpoint={`${getBaseUrl("chuni", "systemVoice/systemVoice.json")}`}
      render={(item: SystemVoice) => (
        <Fragment>
          <Box sx={{ mb: 2 }}>
            <img src={getBaseUrl("chuni", `systemVoice/${item.image}`)} alt="" width={240} />
          </Box>
          <Typography variant="h4">{item.name}</Typography>
          <Typography variant="subtitle1" sx={{ marginBottom: 2, whiteSpace: "pre-line" }}>
            {item.explainText}
          </Typography>
          {item.audio && <audio controls src={getBaseUrl("chuni", `systemVoice/${item.audio}`)} style={{ marginBottom: 16 }} />}
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

export default SystemVoicePage;
