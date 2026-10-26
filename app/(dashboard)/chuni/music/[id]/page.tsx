"use client";
import { Song } from "../page";
import Image from "next/image";
import { useState, useEffect, ChangeEvent, SyntheticEvent } from "react";
import DataDetail from "@/app/Components/DataDetail";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import { Fragment } from "react";
import {
  Grid,
  Typography,
  Paper,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Box,
  Tab,
  Tabs,
  Chip,
  TextField,
  Button,
} from "@mui/material";
import { TabContext, TabPanel } from "@mui/lab";
import { getBaseUrl } from "@/app/utils/global";
import AudioPlayer from "./AudioPlayer";
import AssetLink from "@/app/Components/AssetLink";
import InfoTable from "@/app/Components/InfoTable";
import { tableName, useEnums } from "@/app/utils/enums";

const difficulties: string[] = [
  "BASIC",
  "ADVANCED",
  "EXPERT",
  "MASTER",
  "WORLD'S END",
  "ULTIMA",
];

// Static chart from chuni.chart: one wide image of 4-bar columns, read left to right, plus a .json of where each
// bar line sits so a measure range can be cut out of it. Charts not rendered yet hide themselves.
type ChartLayout = { ext: string; columns: { x: number; bars: [number, number][] }[] };
const COL_W = 200; // chuni.chart column pitch
const LABEL_W = 50; // bar numbers sit in the 50 px left of each column
const PAD = 14; // keeps the bottom bar number and note caps on the cut edge
const TOP_CUT = 4; // past the 3 px half-height of a note cap
const CHART_BG = "#2b2a5c";

const ChartImage = ({ file }: { file: string }) => {
  const stem = file.replace(/\.c2s$/, "");
  const [layout, setLayout] = useState<ChartLayout | null>(null);
  const [failed, setFailed] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  useEffect(() => {
    fetch(getBaseUrl("chuni", `music/charts/${stem}.json`))
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setLayout, () => setFailed(true));
  }, [stem]);
  if (failed || !layout) return null;

  const src = getBaseUrl("chuni", `music/charts/${stem}.${layout.ext}`);
  const bars = layout.columns.flatMap((c) => c.bars.slice(0, -1).map(([b]) => b));
  const [first, last] = [bars[0], bars[bars.length - 1]];
  const lo = Math.max(Number(from) || first, first);
  const hi = Math.min(Number(to) || last, last);
  const ranged = from !== "" || to !== "";
  // each column's slice of [lo, hi]: from the bar line under lo up to the one above hi
  const slices = layout.columns.flatMap(({ x, bars }) => {
    const i = bars.findIndex(([b]) => b >= lo);
    const j = bars.findIndex(([b]) => b > hi);
    if (i < 0 || i === bars.length - 1 || j === 0) return [];
    const bottom = bars[i][1];
    const top = bars[j < 0 ? bars.length - 1 : j][1];
    // cut just under the top line: it and the notes on it belong to the next bar
    return bottom > top ? [{ x, top: top + TOP_CUT, height: bottom - top - TOP_CUT + PAD }] : [];
  });

  return (
    <Box sx={{ mt: 2, width: "100%" }}>
      <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap", mb: 1 }}>
        <Typography variant="body2">Measures</Typography>
        <TextField size="small" type="number" label="From" placeholder={String(first)} value={from}
          onChange={(e) => setFrom(e.target.value)} sx={{ width: 100 }} />
        <TextField size="small" type="number" label="To" placeholder={String(last)} value={to}
          onChange={(e) => setTo(e.target.value)} sx={{ width: 100 }} />
        {ranged && <Button size="small" onClick={() => { setFrom(""); setTo(""); }}>Show all</Button>}
      </Box>
      <Box sx={{ maxWidth: "100%", overflowX: "auto", bgcolor: CHART_BG, borderRadius: 1 }}>
        {ranged ? (
          <Box sx={{ display: "flex", alignItems: "flex-end", width: "max-content", pr: 6 }}>
            {slices.map(({ x, top, height }) => (
              <Box key={x} role="img" aria-label={`Chart ${stem}, measures ${lo}-${hi}`} sx={{
                width: COL_W, height, flex: "none", position: "relative",
                background: `url("${src}") no-repeat ${LABEL_W - x}px ${-top}px`,
              }}>
                {/* rest of the next bar's number, centred on the line just cut */}
                <Box sx={{ position: "absolute", top: 0, left: 0, width: LABEL_W, height: 6, bgcolor: CHART_BG }} />
              </Box>
            ))}
          </Box>
        ) : (
          <img src={src} alt={`Chart ${stem}`} loading="lazy" style={{ display: "block" }} />
        )}
      </Box>
    </Box>
  );
};

const SongPage = () => {
  const [audioType, setAudioType] = useState("pre");
  const [value, setValue] = useState("3");
  const enums = useEnums();

  const handleChange = (event: SyntheticEvent, difficulty: string) => {
    setValue(difficulty);
  };

  const handleAudioTypeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAudioType(event.target.value as "normal" | "pre");
  };

  const getAudioSrc = (song: Song) => {
    const id = song.id;
    // 2.00+ songs have no preview clip
    const hasPreview = (song.previewEndTime ?? 0) > (song.previewStartTime ?? 0);
    return audioType === "normal" || !hasPreview
      ? getBaseUrl("chuni", `music/music${id.toString().padStart(4, "0")}.mp3`)
      : getBaseUrl(
          "chuni",
          `music/music${id.toString().padStart(4, "0")}_pre.mp3`,
        );
  };

  return (
    <DataDetail
      endpoint={getBaseUrl("chuni", "music/music.json")}
      render={(song: Song) => (
        <Fragment>
          <Typography variant="h4">{song.name}</Typography>
          <Typography variant="subtitle1">{song.artistName}</Typography>
          {song.firstLock && <Chip size="small" label="Locked until first play" />}
          <Grid
            container
            direction="column"
            spacing={2}
            sx={{
              justifyContent: "center",
              alignItems: "center",
              padding: { xs: 1, sm: 4 },
            }}
          >
            <Image
              src={getBaseUrl(
                "chuni",
                `music/CHU_UI_Jacket_${song.id.toString().padStart(4, "0")}.webp`,
              )}
              alt="Jacket"
              width="400"
              height="400"
              style={{ maxWidth: "100%", height: "auto" }}
            ></Image>
            <Grid
              container
              direction="column"
              spacing={2}
              sx={{
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Paper sx={{ width: "100%", maxWidth: 800 }}>
                <Grid
                  container
                  spacing={2}
                  sx={{
                    justifyContent: "center",
                    alignItems: "center",
                    px: 1,
                  }}
                >
                  <Typography>Audio:</Typography>
                  {(song.previewEndTime ?? 0) > (song.previewStartTime ?? 0) && (
                  <FormControl component="fieldset">
                    <RadioGroup
                      aria-label="audio-version"
                      name="audio-version"
                      value={audioType}
                      onChange={handleAudioTypeChange}
                      row // to make radio buttons horizontal
                    >
                      <FormControlLabel
                        value="pre"
                        control={<Radio />}
                        label="Short Version"
                      />
                      <FormControlLabel
                        value="normal"
                        control={<Radio />}
                        label="Long Version"
                      />
                    </RadioGroup>
                  </FormControl>
                  )}
                </Grid>
              </Paper>
              <Box sx={{ width: "100%", maxWidth: 800 }}>
                <AudioPlayer src={getAudioSrc(song)}></AudioPlayer>
              </Box>
              <Table sx={{ width: "100%", maxWidth: 800, "& td": { overflowWrap: "anywhere" } }}>
                <TableBody>
                  <TableRow>
                    <TableCell style={{ fontWeight: 600 }}>ID</TableCell>
                    <TableCell align="right">{song.id}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ fontWeight: 600 }}>Title</TableCell>
                    <TableCell align="right">{song.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ fontWeight: 600 }}>
                      Sorted Name
                    </TableCell>
                    <TableCell align="right">{song.sortName}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ fontWeight: 600 }}>Artist</TableCell>
                    <TableCell align="right">{song.artistName}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ fontWeight: 600 }}>Genre</TableCell>
                    <TableCell align="right">
                      {song.genres?.map((g) => g.name).join(", ") ?? song.genreName}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <InfoTable
                rows={[
                  ["Label", song.musicLabel && tableName(enums, "musicLabel", song.musicLabel)],
                  ["Stage", song.stage && <AssetLink type="stage" asset={song.stage} />],
                  ["Copyright", song.rightsInfo && song.rightsInfo.id > 0 && song.rightsInfo.name],
                  ["Release", song.releaseTagName],
                  ["Special Song", song.exType ? `Yes (exType ${song.exType})` : null],
                ]}
              />
            </Grid>
          </Grid>
          <Typography variant="h5">Difficulties</Typography>
          <Grid
            container
            direction="column"
            spacing={2}
            sx={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TabContext value={value}>
              <Paper sx={{ maxWidth: "100%" }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  variant="scrollable"
                  scrollButtons
                >
                  {song.charts.map((elem, idx) => (
                    <Tab
                      key={`diffi-info-tab-${idx}`}
                      label={
                        (elem.difficultyName ?? difficulties[elem.difficulty]) +
                        (elem.worldsEndTag ? ` (${elem.worldsEndTag})` : "")
                      }
                      value={String(idx)}
                    />
                  ))}
                </Tabs>
              </Paper>
              {song.charts.map((elem, idx) => (
                <TabPanel key={`diffi-panel-${idx}`} value={String(idx)} sx={{ px: { xs: 0, sm: 3 }, width: "100%", maxWidth: "100%" }}>
                  <Box sx={{ width: "100%", maxWidth: 800, mx: "auto" }}>
                    <InfoTable
                      rows={[
                        elem.stars
                          ? ["Difficulty", "☆".repeat(elem.stars)]
                          : ["Level", elem.level],
                        ["Chart Designer", elem.notesDesigner],
                        ["Default BPM", elem.defaultBpm || null],
                        ["Chart File", elem.file],
                      ]}
                    />
                  </Box>
                  {elem.file && <ChartImage file={elem.file} />}
                </TabPanel>
              ))}
            </TabContext>
          </Grid>
        </Fragment>
      )}
    />
  );
};

export default SongPage;
