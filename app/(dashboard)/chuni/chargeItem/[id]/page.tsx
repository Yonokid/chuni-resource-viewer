"use client";
import { ChargeItem } from "../page";
import DataDetail from "@/app/Components/DataDetail";
import { getBaseUrl } from "@/app/utils/global";
import { Fragment } from "react";
import { Link, Typography, Table, TableBody, TableRow, TableCell } from "@mui/material";

const ChargeItemPage = () => {
  return (
    <DataDetail
      endpoint={`${getBaseUrl("chuni", "chargeItem/chargeItem.json")}`}
      render={(item: ChargeItem) => (
        <Fragment>
          <Typography variant="h4" sx={{ marginBottom: 2 }}>{item.name}</Typography>
          <Table sx={{ maxWidth: 800 }}>
            <TableBody>
              <TableRow>
                <TableCell style={{ fontWeight: 600 }}>ID</TableCell>
                <TableCell align="right">{item.id}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ fontWeight: 600 }}>Ticket</TableCell>
                <TableCell align="right">
                  <Link href={`/chuni/ticket/${item.ticketId}`}>{item.ticketId}</Link>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ fontWeight: 600 }}>Quantity</TableCell>
                <TableCell align="right">{item.itemNum}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ fontWeight: 600 }}>Expires (days)</TableCell>
                <TableCell align="right">{item.expirationDays}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ fontWeight: 600 }}>Force use</TableCell>
                <TableCell align="right">{item.forceUse ? "Yes" : "No"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ fontWeight: 600 }}>Selling appeal</TableCell>
                <TableCell align="right">{item.sellingAppeal ? "Yes" : "No"}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Fragment>
      )}
    />
  );
};

export default ChargeItemPage;
