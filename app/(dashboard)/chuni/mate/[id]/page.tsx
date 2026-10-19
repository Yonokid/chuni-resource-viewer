"use client";
import { Mate } from "../page";
import DataDetail from "@/app/Components/DataDetail";
import AssetLink from "@/app/Components/AssetLink";
import { getBaseUrl } from "@/app/utils/global";
import { Fragment } from "react";
import { Box, Typography, Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material";

const MatePage = () => {
  return (
    <DataDetail
      endpoint={`${getBaseUrl("chuni", "mate/mate.json")}`}
      render={(item: Mate) => (
        <Fragment>
          <Box sx={{ mb: 2 }}>
            <img src={getBaseUrl("chuni", `mate/${item.image}`)} alt="" width={240} />
          </Box>
          <Typography variant="h4" sx={{ mb: 2 }}>
            {item.name}
          </Typography>
          <Table sx={{ maxWidth: 800 }}>
            <TableBody>
              <TableRow>
                <TableCell style={{ fontWeight: 600 }}>ID</TableCell>
                <TableCell align="right">{item.id}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ fontWeight: 600 }}>Character</TableCell>
                <TableCell align="right">
                  <AssetLink type="chara" asset={item.chara} />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ fontWeight: 600 }}>Owned by default</TableCell>
                <TableCell align="right">{item.defaultHave ? "Yes" : "No"}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          {item.rewards.length > 0 && (
            <Fragment>
              <Typography variant="h6" sx={{ mt: 3 }}>
                Level rewards
              </Typography>
              <Table sx={{ maxWidth: 800 }}>
                <TableBody>
                  {item.rewards.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell style={{ fontWeight: 600 }}>Lv. {r.level}</TableCell>
                      <TableCell align="right">
                        <AssetLink type="reward" asset={r.reward} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Fragment>
          )}
          {item.actions.length > 0 && (
            <Fragment>
              <Typography variant="h6" sx={{ mt: 3 }}>
                Actions
              </Typography>
              <Table sx={{ maxWidth: 800 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Emote</TableCell>
                    <TableCell>Voice</TableCell>
                    <TableCell>Special</TableCell>
                    <TableCell align="right">Cue</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {item.actions.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell>{a.id}</TableCell>
                      <TableCell>{a.actionType}</TableCell>
                      <TableCell>{a.emote}</TableCell>
                      <TableCell>{a.isVoice ? "Yes" : "No"}</TableCell>
                      <TableCell>{a.isSpecialMotion ? "Yes" : "No"}</TableCell>
                      <TableCell align="right">{a.cueId}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Fragment>
          )}
        </Fragment>
      )}
    />
  );
};

export default MatePage;
