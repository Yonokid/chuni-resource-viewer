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
  Grid2,
  Typography,
  Paper,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Box,
  Tab,
  Tabs,
} from "@mui/material";
import { TabContext, TabPanel } from "@mui/lab";
import { getVersion, getAbsolutePath } from "@/app/utils/global";
import AudioPlayer from "./AudioPlayer";
import { SERVER_URL } from "@/app/utils/global";

const difficulties: string[] = [
  "BASIC",
  "ADVANCED",
  "EXPERT",
  "MASTER",
  "WORLD'S END",
  "ULTIMA",
];

const directory = getAbsolutePath(`../${getVersion()}/music`);
const SongPage = () => {
  const [audioType, setAudioType] = useState("pre");
  const [value, setValue] = useState("3");

  const handleChange = (event: SyntheticEvent, difficulty: string) => {
    setValue(difficulty);
  };

  const handleAudioTypeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAudioType(event.target.value as "normal" | "pre");
  };

  const getAudioSrc = (id: string) => {
    return audioType === "normal"
      ? `${SERVER_URL}/${directory}/music${id.padStart(4, "0")}.mp3`
      : `${SERVER_URL}/${directory}/music${id.padStart(4, "0")}_pre.mp3`;
  };

  return (
    <DataDetail
      endpoint={`${directory}/music.json`}
      render={(song: Song) => (
        <Fragment>
          <Typography variant="h4">{song.name}</Typography>
          <Typography variant="subtitle1">{song.artistName}</Typography>
          <Grid2
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
              src={`${SERVER_URL}/${directory}/CHU_UI_Jacket_${song.id.padStart(4, "0")}.webp`}
              alt="Jacket"
              width="400"
              height="400"
            ></Image>
            <Grid2
              container
              direction="column"
              spacing={2}
              sx={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Paper>
                <Grid2
                  container
                  spacing={2}
                  sx={{
                    justifyContent: "center",
                    alignItems: "center",
                    minWidth: 800,
                  }}
                >
                  <Typography>Audio:</Typography>
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
                </Grid2>
              </Paper>
              <Box sx={{ minWidth: 800 }}>
                <AudioPlayer src={getAudioSrc(song.id)}></AudioPlayer>
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
                    <TableCell align="right">{song.genreName}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Grid2>
          </Grid2>
          <Typography variant="h5">Difficulties</Typography>
          <Grid2
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
                      label={difficulties[elem.difficulty]}
                      value={String(idx)}
                    />
                  ))}
                </Tabs>
              </Paper>
              {song.charts.map((elem, idx) => (
                <TabPanel key={`diffi-panel-${idx}`} value={String(idx)}>
                  <Table sx={{ minWidth: 800 }}>
                    <TableBody>
                      <TableRow>
                        <TableCell style={{ fontWeight: 600 }}>Level</TableCell>
                        <TableCell align="right">{elem.level}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TabPanel>
              ))}
            </TabContext>
          </Grid2>
        </Fragment>
      )}
    />
  );
};

export default SongPage;
