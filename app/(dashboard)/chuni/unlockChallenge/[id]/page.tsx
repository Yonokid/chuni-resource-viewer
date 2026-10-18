"use client";
import { UnlockChallenge } from "../page";
import DataDetail from "@/app/Components/DataDetail";
import { getBaseUrl } from "@/app/utils/global";
import { Fragment } from "react";
import { Link, Typography, Table, TableBody, TableRow, TableCell } from "@mui/material";

const UnlockChallengePage = () => {
  return (
    <DataDetail
      endpoint={`${getBaseUrl("chuni", "unlockChallenge/unlockChallenge.json")}`}
      render={(item: UnlockChallenge) => (
        <Fragment>
          <Typography variant="h4" sx={{ marginBottom: 2 }}>{item.name}</Typography>
          <Table sx={{ maxWidth: 800 }}>
            <TableBody>
              <TableRow>
                <TableCell style={{ fontWeight: 600 }}>ID</TableCell>
                <TableCell align="right">{item.id}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ fontWeight: 600 }}>Disabled</TableCell>
                <TableCell align="right">{item.disableFlag ? "Yes" : "No"}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          {item.musics.map((m, i) => (
            <Fragment key={i}>
              <Typography variant="h6" sx={{ marginTop: 3 }}>
                {m.music ? <Link href={`/chuni/music/${m.music.id}`}>{m.music.name}</Link> : "Unknown song"}
              </Typography>
              <Table sx={{ maxWidth: 800 }}>
                <TableBody>
                  <TableRow>
                    <TableCell style={{ fontWeight: 600 }}>Courses</TableCell>
                    <TableCell align="right">
                      {m.courses.map((c) => c && (
                        <div key={c.id}><Link href={`/chuni/course/${c.id}`}>{c.name}</Link></div>
                      ))}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ fontWeight: 600 }}>Rewards</TableCell>
                    <TableCell align="right">
                      {m.rewards.map((r) => r.reward && (
                        <div key={r.reward.id}><Link href={`/chuni/reward/${r.reward.id}`}>{r.reward.name}</Link> ×{r.num}</div>
                      ))}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Fragment>
          ))}
        </Fragment>
      )}
    />
  );
};

export default UnlockChallengePage;
