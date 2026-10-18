"use client";
import { CMissionInfo } from "../page";
import DataDetail from "@/app/Components/DataDetail";
import { getBaseUrl } from "@/app/utils/global";
import { spriteUrl } from "@/app/utils/enums";
import { Fragment } from "react";
import { Box, Table, TableBody, TableCell, TableRow, Typography } from "@mui/material";

const label = (value: unknown): string => {
  if (value && typeof value === "object") {
    const ref = value as { name?: string };
    return Array.isArray(value) ? value.map(label).join(", ") : (ref.name ?? JSON.stringify(value));
  }
  return String(value);
};

const MissionTaskPage = () => {
  return (
    <DataDetail
      endpoint={`${getBaseUrl("chuni", "cmissionInfo/cmissionInfo.json")}`}
      render={(item: CMissionInfo) => (
        <Fragment>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center", marginBottom: 2 }}>
            <img src={spriteUrl("missionIcon", item.iconType)} alt="" width={77} height={78} />
            <Box>
              <Typography variant="h4">{item.name}</Typography>
              <Typography color="text.secondary">#{item.id}</Typography>
            </Box>
            <img src={spriteUrl("missionUnit", item.unitType)} alt="" style={{ marginLeft: "auto" }} onError={(e) => (e.currentTarget.hidden = true)} />
          </Box>
          {item.explainText && <Typography sx={{ marginBottom: 2 }}>{item.explainText}</Typography>}
          <Typography variant="h6">Conditions</Typography>
          <Table size="small" sx={{ maxWidth: 800 }}>
            <TableBody>
              {item.conditions.map((condition, i) =>
                Object.entries(condition)
                  .filter(([key]) => key !== "type")
                  .map(([key, value]) => (
                    <TableRow key={`${i}-${key}`}>
                      <TableCell style={{ fontWeight: 600 }}>{key}</TableCell>
                      <TableCell align="right">{label(value)}</TableCell>
                    </TableRow>
                  )),
              )}
            </TableBody>
          </Table>
        </Fragment>
      )}
    />
  );
};

export default MissionTaskPage;
