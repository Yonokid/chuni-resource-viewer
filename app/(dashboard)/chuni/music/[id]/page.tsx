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
              padding: 4,
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
            ></Image>
            <Grid
              container
              direction="column"
              spacing={2}
              sx={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Paper>
                <Grid
                  container
                  spacing={2}
                  sx={{
                    justifyContent: "center",
                    alignItems: "center",
                    minWidth: 800,
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
              <Box sx={{ minWidth: 800 }}>
                <AudioPlayer src={getAudioSrc(song)}></AudioPlayer>
              </Box>
              <Table sx={{ minWidth: 800 }}>
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
              <Paper>
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
                <TabPanel key={`diffi-panel-${idx}`} value={String(idx)}>
                  <Box sx={{ minWidth: 800 }}>
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
