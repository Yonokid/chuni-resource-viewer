"use client";
import { EmoteScript } from "../page";
import { dialogText } from "@/app/Components/emote/dialogText";
import DataDetail from "@/app/Components/DataDetail";
import InfoTable from "@/app/Components/InfoTable";
import { getBaseUrl } from "@/app/utils/global";
import { Box, Paper, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import EmotePlayer from "@/app/Components/emote/EmotePlayer";

interface Named {
  id: number;
  name: string;
  timeline: string;
}

// timeline id -> label inside the .emtbytes (0 is "none")
const useTimelines = (type: "emoteTimelineMain" | "emoteTimelineDiff") => {
  const [names, setNames] = useState<Map<number, string>>(new Map());
  useEffect(() => {
    fetch(getBaseUrl("chuni", `${type}/${type}.json`))
      .then((r) => r.json())
      .then((items: Named[]) => setNames(new Map(items.map((i) => [i.id, i.timeline]))))
      .catch(() => {});
  }, [type]);
  return names;
};

const EmoteScriptPage = () => {
  const mains = useTimelines("emoteTimelineMain");
  const diffs = useTimelines("emoteTimelineDiff");
  const label = (names: Map<number, string>, id: number) => (id ? `${names.get(id) ?? "?"} (#${id})` : "-");
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
                    `main ${t.main.map((id) => label(mains, id)).join(" / ")}; diff ${t.diff.map((id) => label(diffs, id)).join(" / ")}`,
                  ])}
                />
              </Paper>
            )}

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              {([0, 1] as const).map((c) => {
                // slot order: later slots override (main = body motion, diff = face/effect overlay)
                const mainId = [...slots].reverse().find((t) => t.main[c])?.main[c];
                const diffId = [...slots].reverse().find((t) => t.diff[c])?.diff[c];
                const main = mainId ? mains.get(mainId) : undefined;
                if (!main) return null;
                const chara = main.startsWith("Navi") ? "navi" : "yuni";
                return (
                  <Paper key={c} variant="outlined" sx={{ p: 1 }}>
                    <EmotePlayer chara={chara} main={main} diffs={diffId && diffs.get(diffId) ? [diffs.get(diffId)!] : []} height={420} />
                  </Paper>
                );
              })}
            </Box>

            <Box>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Character atlases
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {["yuni", "navi"].map((name) => (
                  <Paper key={name} variant="outlined" sx={{ p: 1, lineHeight: 0 }}>
                    <img
                      src={getBaseUrl("chuni", `emotedata/${name}.webp`)}
                      alt={name}
                      title={name}
                      style={{ maxWidth: 320, maxHeight: 320, objectFit: "contain" }}
                    />
                  </Paper>
                ))}
              </Box>
            </Box>
          </Stack>
        );
      }}
    />
  );
};

export default EmoteScriptPage;
