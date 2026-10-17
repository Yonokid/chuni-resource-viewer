"use client";
import { Stage } from "../page";
import DataDetail from "@/app/Components/DataDetail";
import StageViewer from "@/app/Components/StageViewer";
import { getBaseUrl } from "@/app/utils/global";
import { Fragment } from "react";
import { Typography, Table, TableBody, TableRow, TableCell, Box } from "@mui/material";

const stageModel = (models: string[], prefix: string) => {
  const name = models.find((m) => m.startsWith(prefix));
  return name && getBaseUrl("chuni", `stage/${name}`);
};

const StagePage = () => {
  return (
    <DataDetail
      endpoint={`${getBaseUrl("chuni", "stage/stage.json")}`}
      render={(stage: Stage) => (
        <Fragment>
          <Typography variant="h4">{stage.name}</Typography>
          <Table sx={{ maxWidth: 800 }}>
            <TableBody>
              <TableRow>
                <TableCell style={{ fontWeight: 600 }}>ID</TableCell>
                <TableCell align="right">{stage.id}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ fontWeight: 600 }}>Release</TableCell>
                <TableCell align="right">{stage.releaseTagName}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ fontWeight: 600 }}>Notes Field Color</TableCell>
                <TableCell align="right">{stage.notesFieldLine}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ fontWeight: 600 }}>Base Asset</TableCell>
                <TableCell align="right">{stage.baseFile || "—"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ fontWeight: 600 }}>Notes Field Asset</TableCell>
                <TableCell align="right">{stage.notesFieldFile || "—"}</TableCell>
              </TableRow>
              {stage.objectFile && (
                <TableRow>
                  <TableCell style={{ fontWeight: 600 }}>Object Asset</TableCell>
                  <TableCell align="right">{stage.objectFile}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {stage.models && stage.models.length > 0 && (
            <>
              <Typography variant="h5" sx={{ marginTop: 3 }}>
                3D Preview
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 1 }}>
                Start-of-song layout; animation isn&apos;t decoded yet.
              </Typography>
              <StageViewer
                background={stageModel(stage.models, "st_")}
                lane={stageModel(stage.models, "nf_")}
              />
            </>
          )}

          {stage.textures.length > 0 && (
            <>
              <Typography variant="h5" sx={{ marginTop: 3 }}>
                Textures ({stage.textures.length})
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, marginTop: 1 }}>
                {[...new Set(stage.textures)].map((filename) => (
                  <img
                    key={filename}
                    src={getBaseUrl("chuni", `stage/${filename}`)}
                    alt={filename}
                    title={filename}
                    style={{ maxWidth: 160, maxHeight: 160, objectFit: "contain" }}
                  />
                ))}
              </Box>
            </>
          )}
        </Fragment>
      )}
    />
  );
};

export default StagePage;
