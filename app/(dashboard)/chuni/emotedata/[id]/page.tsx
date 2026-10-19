"use client";
import { useState } from "react";
import { EmoteData } from "../page";
import DataDetail from "@/app/Components/DataDetail";
import EmotePlayer, { useEmote } from "@/app/Components/emote/EmotePlayer";
import { getBaseUrl } from "@/app/utils/global";
import { Box, FormControl, InputLabel, MenuItem, Paper, Select, Stack, Typography } from "@mui/material";

const Viewer = ({ chara }: { chara: "yuni" | "navi" }) => {
  const { renderer } = useEmote(chara);
  const [main, setMain] = useState("");
  const [diff, setDiff] = useState("");
  const timelines = renderer?.timelines() ?? [];
  const mains = timelines.filter((t) => !t.diff);
  const diffs = timelines.filter((t) => t.diff);
  const initial = mains.find((t) => t.label.endsWith("通常待機00"))?.label ?? mains[0]?.label ?? "";
  const picker = (label: string, value: string, set: (v: string) => void, items: string[], none?: string) => (
    <FormControl size="small" sx={{ minWidth: 220 }}>
      <InputLabel>{label}</InputLabel>
      <Select label={label} value={value} onChange={(e) => set(e.target.value)}>
        {none !== undefined && <MenuItem value="">{none}</MenuItem>}
        {items.map((l) => (
          <MenuItem key={l} value={l}>
            {l}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap", gap: 1 }}>
        {picker("Motion", main || initial, setMain, mains.map((t) => t.label))}
        {picker("Overlay", diff, setDiff, diffs.map((t) => t.label), "None")}
      </Stack>
      <Paper variant="outlined" sx={{ p: 2, display: "inline-block", alignSelf: "flex-start" }}>
        <EmotePlayer chara={chara} main={main || initial} diffs={diff ? [diff] : []} height={640} />
      </Paper>
      <Typography variant="body2" color="text.secondary">
        Pose renderer only: no mesh deformation, masks or physics yet.
      </Typography>
    </Stack>
  );
};

const EmoteDataPage = () => {
  return (
    <DataDetail
      endpoint={`${getBaseUrl("chuni", "emotedata/emotedata.json")}`}
      render={(item: EmoteData) => (
        <Stack spacing={3}>
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
              {item.name}
            </Typography>
          </Box>
          <Viewer chara={item.name as "yuni" | "navi"} />
        </Stack>
      )}
    />
  );
};

export default EmoteDataPage;
