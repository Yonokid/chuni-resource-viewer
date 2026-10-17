"use client";
import { Shop } from "../page";
import DataDetail from "@/app/Components/DataDetail";
import AssetLink from "@/app/Components/AssetLink";
import { getBaseUrl } from "@/app/utils/global";
import { Fragment } from "react";
import { Typography, Table, TableBody, TableRow, TableCell } from "@mui/material";

const ShopPage = () => {
  return (
    <DataDetail
      endpoint={`${getBaseUrl("chuni", "shop/shop.json")}`}
      render={(shop: Shop) => (
        <Fragment>
          <Typography variant="h4">{shop.name}</Typography>
          {shop.explainText && (
            <Typography variant="subtitle1" sx={{ marginBottom: 2 }}>
              {shop.explainText}
            </Typography>
          )}
          <Table sx={{ maxWidth: 800 }}>
            <TableBody>
              <TableRow>
                <TableCell style={{ fontWeight: 600 }}>ID</TableCell>
                <TableCell align="right">{shop.id}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ fontWeight: 600 }}>Category</TableCell>
                <TableCell align="right">{shop.saleCategoryName}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ fontWeight: 600 }}>Price</TableCell>
                <TableCell align="right">{shop.price}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ fontWeight: 600 }}>Available</TableCell>
                <TableCell align="right">{shop.closeFlag ? "Closed" : "Open"}</TableCell>
              </TableRow>
              {shop.music && (
                <TableRow>
                  <TableCell style={{ fontWeight: 600 }}>Grants Music</TableCell>
                  <TableCell align="right">
                    <AssetLink type="music" asset={shop.music} />
                  </TableCell>
                </TableRow>
              )}
              {shop.ticket && (
                <TableRow>
                  <TableCell style={{ fontWeight: 600 }}>Grants Ticket</TableCell>
                  <TableCell align="right">
                    <AssetLink type="ticket" asset={shop.ticket} />
                  </TableCell>
                </TableRow>
              )}
              {shop.openCondition?.useCondition && (
                <TableRow>
                  <TableCell style={{ fontWeight: 600 }}>Only During Event</TableCell>
                  <TableCell align="right">
                    {shop.openCondition.events.map((e) => (
                      <AssetLink key={e.id} type="event" asset={e} />
                    ))}
                  </TableCell>
                </TableRow>
              )}
              {shop.skill && (
                <TableRow>
                  <TableCell style={{ fontWeight: 600 }}>Grants Skill</TableCell>
                  <TableCell align="right">
                    <AssetLink type="skill" asset={shop.skill} />
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

export default ShopPage;
