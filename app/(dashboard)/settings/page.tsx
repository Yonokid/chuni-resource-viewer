"use client";
import * as React from "react";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Typography,
  Grid2,
} from "@mui/material";
import { gameVersions, getVersion, setVersion } from "@/app/utils/global";
import { Fragment, useState } from "react";

function GameVersionSelector({ game }: { game: string }) {
  const versions = gameVersions[game];
  const [selectedVersion, setSelectedVersion] = useState<string>(
    getVersion(game),
  );
  return (
    <FormControl component="fieldset" style={{ margin: "1% 0" }}>
      <FormLabel>Game Version</FormLabel>
      <RadioGroup
        value={selectedVersion}
        onChange={(event) => {
          setVersion(game, event.target.value);
          setSelectedVersion(event.target.value);
          window.location.reload();
        }}
        row
      >
        {Object.entries(versions).map(([version, name]) => (
          <FormControlLabel
            key={version}
            value={version}
            control={<Radio />}
            label={name}
          />
        ))}
      </RadioGroup>
      <Typography>Selected Version: {selectedVersion}</Typography>
    </FormControl>
  );
}

export default function SettingsPage() {
  return (
    <Fragment>
      <Grid2 container direction="column" spacing={4}>
        {Object.keys(gameVersions).map((game) => (
          <Grid2 key={game}>
            <Typography variant="h6" gutterBottom>
              {game.charAt(0).toUpperCase() + game.slice(1)}
            </Typography>
            <GameVersionSelector game={game} />
          </Grid2>
        ))}
      </Grid2>
    </Fragment>
  );
}
