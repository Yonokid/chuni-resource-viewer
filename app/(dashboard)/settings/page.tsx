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
import { gameVersion, getVersion, setVersion } from "@/app/utils/global";
import { Fragment, useState } from "react";

export default function SettingsPage() {
  const [selectedVersion, setSelectedVersion] = useState<string>(
    Object.keys(gameVersion)[0] || "",
  );
  return (
    <Fragment>
      <Grid2 container>
        <Grid2>
          <FormControl component="fieldset" style={{ margin: "1% 0" }}>
            <FormLabel>Game Version</FormLabel>
            <RadioGroup
              value={getVersion()}
              onChange={(event) => {
                setVersion(event.target.value);
                setSelectedVersion(event.target.value);
                window.location.reload();
              }}
              row
            >
              {Object.entries(gameVersion).map(([gameVersion, name]) => (
                <FormControlLabel
                  key={gameVersion}
                  value={gameVersion}
                  control={<Radio />}
                  label={name}
                />
              ))}
            </RadioGroup>
          </FormControl>
          <Typography>Selected Version: {selectedVersion}</Typography>
        </Grid2>
      </Grid2>
    </Fragment>
  );
}
