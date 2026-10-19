"use client";
import { dialogText, EmoteScript } from "../page";
import DataDetail from "@/app/Components/DataDetail";
import InfoTable from "@/app/Components/InfoTable";
import { getBaseUrl } from "@/app/utils/global";
import { Box, Paper, Stack, Typography } from "@mui/material";

const EmoteScriptPage = () => {
  return (
    <DataDetail
      endpoint={`${getBaseUrl("chuni", "emoteScript/emoteScript.json")}`}
      render={(script: EmoteScript) => {
        const slots = script.timelines.filter((t) => t.main.some(Boolean) || t.diff.some(Boolean));
        return (
          <Stack spacing={3}>
            <Box>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
                {script.name}
              </Typography>
              <Typography color="text.secondary">#{script.id}</Typography>
            </Box>

            {script.textDialog && (
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography sx={{ whiteSpace: "pre-line" }}>{dialogText(script.textDialog)}</Typography>
              </Paper>
            )}

            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="h6">Details</Typography>
              <InfoTable
                rows={[
                  ["Duration (ms)", script.msecNext],
                  ["Voice cue", script.cue],
                  ["Delay (ms)", script.msecDelay],
                  ["Script offset", script.emoteScriptOffset],
                ]}
              />
            </Paper>

            {slots.length > 0 && (
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="h6">Timelines</Typography>
                <InfoTable
                  rows={slots.map((t, i): [string, string] => [
                    `Slot ${i} (+${t.offset})`,
                    `main ${t.main.join("/")}, diff ${t.diff.join("/")}`,
                  ])}
                />
              </Paper>
            )}
          </Stack>
        );
      }}
    />
  );
};

export default EmoteScriptPage;
