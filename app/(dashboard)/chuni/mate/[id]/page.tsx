"use client";
import { useState } from "react";
import { Mate, MateAction } from "../page";
import EmotePlayer, { useEmote } from "@/app/Components/emote/EmotePlayer";
import DataDetail from "@/app/Components/DataDetail";
import AssetLink from "@/app/Components/AssetLink";
import { getBaseUrl } from "@/app/utils/global";
import { Fragment } from "react";
import { Box, FormControl, InputLabel, MenuItem, Paper, Select, Typography, Table, TableBody, TableRow, TableCell } from "@mui/material";

const IDLE = "待01"; // looping base pose every action plays over
const IDLE_NAVI = "Navi00通常待機00"; // the default (no mate) model is Navi
const SPECIAL = "専01"; // extra timeline of special-motion actions

const Viewer = ({ mate }: { mate: Mate }) => {
  const { renderer } = useEmote(mate.emote, "mate");
  const [actionId, setActionId] = useState(0);
  const labels = new Set(renderer?.timelines().map((t) => t.label));
  const action: MateAction | undefined = mate.actions.find((a) => a.id === actionId);
  const diffs = action ? [action.emote, ...(action.isSpecialMotion ? [SPECIAL] : [])].filter((l) => labels.has(l)) : [];
  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        E-mote
      </Typography>
      <FormControl size="small" sx={{ minWidth: 280, mb: 2 }}>
        <InputLabel>Action</InputLabel>
        <Select label="Action" value={actionId} onChange={(e) => setActionId(Number(e.target.value))}>
          <MenuItem value={0}>Idle</MenuItem>
          {mate.actions.map((a) => (
            <MenuItem key={a.id} value={a.id}>
              {`${a.actionType} · ${a.emote}${a.isVoice ? " · voice" : ""}${a.isSpecialMotion ? " · special" : ""}`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Paper variant="outlined" sx={{ p: 2, display: "block", width: "fit-content" }}>
        <EmotePlayer chara={mate.emote} dir="mate" main={labels.has(IDLE) ? IDLE : IDLE_NAVI} diffs={diffs} height={640} />
      </Paper>
    </Box>
  );
};

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
          {item.emote && <Viewer mate={item} />}
        </Fragment>
      )}
    />
  );
};

export default MatePage;
