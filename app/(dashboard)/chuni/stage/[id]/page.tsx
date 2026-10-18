"use client";
import { Stage } from "../page";
import DataDetail from "@/app/Components/DataDetail";
import InfoTable from "@/app/Components/InfoTable";
import StageViewer from "@/app/Components/StageViewer";
import { getBaseUrl } from "@/app/utils/global";
import { Box, Chip, Paper, Stack, Typography } from "@mui/material";

const stageModel = (models: string[], prefix: string) => {
  const name = models.find((m) => m.startsWith(prefix));
  return name && getBaseUrl("chuni", `stage/${name}`);
};

const StagePage = () => {
  return (
    <DataDetail
      endpoint={`${getBaseUrl("chuni", "stage/stage.json")}`}
      render={(stage: Stage) => {
        const textures = [...new Set(stage.textures)];
        return (
          <Stack spacing={3}>
            <Box>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
                {stage.name}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center", mt: 0.5 }}>
                <Typography color="text.secondary">#{stage.id}</Typography>
                {stage.releaseTagName && <Chip size="small" label={stage.releaseTagName} />}
              </Stack>
            </Box>

            {stage.models && stage.models.length > 0 && (
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  3D Preview
                </Typography>
                <StageViewer
                  background={stageModel(stage.models, "st_")}
                  lane={stageModel(stage.models, "nf_")}
                />
              </Paper>
            )}

            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="h6">Details</Typography>
              <InfoTable
                rows={[
                  ["Notes Field Color", stage.notesFieldLine],
                  ["Base Asset", stage.baseFile],
                  ["Notes Field Asset", stage.notesFieldFile],
                  ["Object Asset", stage.objectFile],
                ]}
              />
            </Paper>

            {textures.length > 0 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Textures ({textures.length})
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {textures.map((filename) => (
                    <Paper key={filename} variant="outlined" sx={{ p: 1, lineHeight: 0 }}>
                      <img
                        src={getBaseUrl("chuni", `stage/${filename}`)}
                        alt={filename}
                        title={filename}
                        style={{ maxWidth: 160, maxHeight: 160, objectFit: "contain" }}
                      />
                    </Paper>
                  ))}
                </Box>
              </Box>
            )}
          </Stack>
        );
      }}
    />
  );
};

export default StagePage;
