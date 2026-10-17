import React from "react";
import { Table, TableBody, TableRow, TableCell } from "@mui/material";

/** Two-column label/value table. Rows whose value is null, undefined, false or "" are skipped. */
const InfoTable = ({ rows, maxWidth = 800 }: { rows: [string, React.ReactNode][]; maxWidth?: number }) => (
  <Table sx={{ maxWidth }}>
    <TableBody>
      {rows
        .filter(([, value]) => value !== null && value !== undefined && value !== false && value !== "")
        .map(([label, value]) => (
          <TableRow key={label}>
            <TableCell style={{ fontWeight: 600 }}>{label}</TableCell>
            <TableCell align="right">{value}</TableCell>
          </TableRow>
        ))}
    </TableBody>
  </Table>
);

export default InfoTable;
