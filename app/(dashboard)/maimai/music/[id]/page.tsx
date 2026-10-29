"use client";
import { Box, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import AudioPlayer from "../../../chuni/music/[id]/AudioPlayer";
import InfoTable from "@/app/Components/InfoTable";
import DataDetail from "@/app/Components/DataDetail";
import { Ref, asset, isDX, table } from "../../common";
import { Song } from "../page";

const DIFFICULTIES = ["BASIC", "ADVANCED", "EXPERT", "MASTER", "Re:MASTER", "UTAGE"];
const level = (n: { level: number; levelDecimal: number }) => `${n.level}${n.levelDecimal >= 7 ? "+" : ""} (${n.level}.${n.levelDecimal})`;

export default function SongPage() {
  return (
    <DataDetail<Song>
      endpoint={table("music")}
      render={(song) => (
        <>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
            {song.jacket && <img src={asset("music", song.jacket)} alt="" width={300} style={{ maxWidth: "100%" }} />}
            <Box>
              <Typography variant="h4">{song.name}</Typography>
              <Typography variant="h6" color="textSecondary">{song.artistName.str}</Typography>
              {song.rights && <img src={asset("music", song.rights)} alt="" style={{ maxWidth: "100%", marginTop: 8 }} />}
            </Box>
          </Box>
          {song.audio && <AudioPlayer src={asset("music", song.audio)} />}
          <Table sx={{ maxWidth: 800, my: 2 }}>
            <TableHead>
              <TableRow>
                <TableCell>Difficulty</TableCell>
                <TableCell>Level</TableCell>
                <TableCell>Designer</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {song.notesData.map((n, i) =>
                n.level > 0 && (
                  <TableRow key={i}>
                    <TableCell>{DIFFICULTIES[i] ?? i}</TableCell>
                    <TableCell>{level(n)}</TableCell>
                    <TableCell>{n.notesDesigner.str}</TableCell>
                  </TableRow>
                ),
              )}
            </TableBody>
          </Table>
          <InfoTable
            rows={[
              ["ID", song.id],
              ["Chart type", isDX(song) ? "DX" : "Standard"],
              ["Genre", song.genreName.str],
              ["BPM", song.bpm],
              ["Added in", song.AddVersion.str],
              ["Release", song.releaseTagName],
              ["Unlock event", <Ref key="e" field="eventName" value={song.eventName as never} />],
              ["Sort name", song.sortName],
            ]}
          />
          {song.movie && (
            <Box sx={{ mt: 2 }}>
              <video controls preload="none" style={{ maxWidth: "100%", width: 800 }} src={asset("music", song.movie)} />
            </Box>
          )}
        </>
      )}
    />
  );
}
