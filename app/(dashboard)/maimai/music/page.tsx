"use client";
import Link from "next/link";
import { Box, Card, CardActionArea, CardMedia, Grid, Typography } from "@mui/material";
import DataList from "@/app/Components/Data";
import FitText from "@/app/Components/FitText";
import { MaiItem, StringID, asset, table } from "../common";

export interface Notes {
  file: { path: string };
  level: number;
  levelDecimal: number;
  notesDesigner: StringID;
  musicLevelID: number;
}

export interface Song extends MaiItem {
  sortName: string;
  artistName: StringID;
  genreName: StringID;
  AddVersion: StringID;
  bpm: number;
  notesData: Notes[];
  jacket?: string | null;
  rights?: string | null;
  audio?: string | null;
  movie?: string | null;
}

/** ids 10000-19999 are the DX (でらっくす) charts of a song. */
export const isDX = (s: Song) => s.id >= 10000 && s.id < 20000;

// Stable references so DataList's memos don't rerun every render.
const filters = {
  Genre: (s: Song) => [s.genreName.str],
  "Added in": (s: Song) => [s.AddVersion.str],
  Type: (s: Song) => [isDX(s) ? "DX" : "Standard"],
};
const sorts = {
  Artist: (a: Song, b: Song) => a.artistName.str.localeCompare(b.artistName.str),
  "Sort name": (a: Song, b: Song) => a.sortName.localeCompare(b.sortName),
  BPM: (a: Song, b: Song) => a.bpm - b.bpm,
};

export default function MusicPage() {
  return (
    <Grid container spacing={2}>
      <DataList<Song>
        endpoint={table("music")}
        filters={filters}
        sorts={sorts}
        render={(data) =>
          data.map((song) => (
            <Grid key={song.id} size={{ xs: 12, sm: "auto" }}>
              <Link href={`/maimai/music/${song.id}`} style={{ textDecoration: "none" }}>
                <Card sx={{ width: { xs: "100%", sm: 300 } }}>
                  <CardActionArea>
                    {song.jacket && <CardMedia component="img" sx={{ height: 175, objectFit: "contain" }} image={asset("music", song.jacket)} alt={song.name} />}
                    <Box sx={{ m: 2 }}>
                      <FitText text={song.name} maxFontSize="1.5rem" />
                      <FitText text={song.artistName.str} variant="h6" color="textSecondary" maxFontSize="1rem" />
                      <Typography variant="button" color="textSecondary">
                        {song.genreName.str} · {isDX(song) ? "DX" : "STD"}
                      </Typography>
                    </Box>
                  </CardActionArea>
                </Card>
              </Link>
            </Grid>
          ))
        }
      />
    </Grid>
  );
}
