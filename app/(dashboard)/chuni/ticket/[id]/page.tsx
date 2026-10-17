"use client";
import { Ticket } from "../page";
import DataDetail from "@/app/Components/DataDetail";
import { getBaseUrl } from "@/app/utils/global";
import { intLabel, useEnums } from "@/app/utils/enums";
import { Fragment } from "react";
import { Typography, Table, TableBody, TableRow, TableCell } from "@mui/material";

const TicketPage = () => {
  const enums = useEnums();
  return (
    <DataDetail
      endpoint={`${getBaseUrl("chuni", "ticket/ticket.json")}`}
      render={(ticket: Ticket) => (
        <Fragment>
          <Typography variant="h4">{ticket.name}</Typography>
          <Typography variant="subtitle1" sx={{ marginBottom: 2, whiteSpace: "pre-line" }}>
            {ticket.explainText}
          </Typography>
          <Table sx={{ maxWidth: 800 }}>
            <TableBody>
              <TableRow>
                <TableCell style={{ fontWeight: 600 }}>ID</TableCell>
                <TableCell align="right">{ticket.id}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ fontWeight: 600 }}>Type</TableCell>
                <TableCell align="right">{intLabel(enums, "ticket.type", ticket.type)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ fontWeight: 600 }}>Max Stock</TableCell>
                <TableCell align="right">{ticket.stockMaxNum}</TableCell>
              </TableRow>
              {ticket.valueDayRaw > 0 && (
                <TableRow>
                  <TableCell style={{ fontWeight: 600 }}>Duration (days)</TableCell>
                  <TableCell align="right">{ticket.valueDayRaw}</TableCell>
                </TableRow>
              )}
              {ticket.valueUseRaw > 0 && (
                <TableRow>
                  <TableCell style={{ fontWeight: 600 }}>Uses</TableCell>
                  <TableCell align="right">{ticket.valueUseRaw}</TableCell>
                </TableRow>
              )}
              {ticket.valueBoostRaw > 0 && (
                <TableRow>
                  <TableCell style={{ fontWeight: 600 }}>Boost</TableCell>
                  <TableCell align="right">{ticket.valueBoostRaw}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Fragment>
      )}
    />
  );
};

export default TicketPage;
