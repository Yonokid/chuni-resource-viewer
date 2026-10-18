"use client";
import { GaugeRef, Map, MapAreaInfo } from "../page";
import DataDetail from "@/app/Components/DataDetail";
import AssetLink from "@/app/Components/AssetLink";
import InfoTable from "@/app/Components/InfoTable";
import MapBoard from "@/app/Components/MapBoard";
import MapBonusList from "@/app/Components/MapBonusList";
import { getBaseUrl } from "@/app/utils/global";
import { intLabel, useEnums } from "@/app/utils/enums";
import { useState } from "react";
import {
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

// Gauge values per BASIC..MASTER; 100 gauge is assumed to be one tile (unconfirmed)
const gaugeTiles = (
  gauge: GaugeRef | null | undefined,
  key: "normGauge" | "maxGauge",
) =>
  gauge?.fumens
    ?.filter((fumen) => fumen.difficulty < 4)
    .map((fumen) => fumen[key] / 100)
    .join(" / ") ?? "—";

const AreaRow = ({ area, index }: { area: MapAreaInfo; index: number }) => {
  const grids = area.grids ?? [];
  // grids lists only the start, goal and reward tiles, so the goal's index is the tile count
  const gridRewards = grids.filter((grid) => grid.reward || grid.ticket);
  return (
    <TableRow>
      <TableCell>{index + 1}</TableCell>
      <TableCell>{area.mapArea?.name}</TableCell>
      <TableCell>
        {grids.length ? Math.max(...grids.map((grid) => grid.index)) : "—"}
      </TableCell>
      <TableCell>{gaugeTiles(area.normalGauge ?? area.gauge, "maxGauge")}</TableCell>
      <TableCell>
        <AssetLink type="music" asset={area.music} />
        {area.music && area.challengeGauge && (
          <div>Norma {gaugeTiles(area.challengeGauge, "normGauge")}</div>
        )}
      </TableCell>
      <TableCell>
        <Stack spacing={0.5}>
          {gridRewards.map((grid) => (
            <div key={grid.index}>
              Tile {grid.index}: <AssetLink type="reward" asset={grid.reward} />
              <AssetLink type="ticket" asset={grid.ticket} />
            </div>
          ))}
          {area.reward && (
            <Stack direction="row" spacing={1} alignItems="center">
              {area.reward.chara ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={getBaseUrl(
                    "chuni",
                    `chara/CHU_UI_Character_${(area.reward.chara.id / 10).toString().padStart(4, "0")}_00_02.webp`,
                  )}
                  alt={area.reward.name}
                  style={{
                    height: 56,
                    background: "linear-gradient(#2b3a67, #121a33)",
                    borderRadius: 4,
                  }}
                />
              ) : (
                area.reward.icon && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={getBaseUrl("chuni", area.reward.icon)}
                    alt={area.reward.name}
                    style={{ height: 40 }}
                  />
                )
              )}
              <AssetLink type="reward" asset={area.reward} />
            </Stack>
          )}
          <Stack direction="row" spacing={1}>
            <AssetLink type="chara" asset={area.chara} />
            <AssetLink type="skill" asset={area.skill} />
            <AssetLink type="trophy" asset={area.trophy} />
          </Stack>
        </Stack>
      </TableCell>
      <TableCell>
        {area.bonus?.substances.length ? (
          <MapBonusList substances={area.bonus.substances} />
        ) : (
          "—"
        )}
      </TableCell>
    </TableRow>
  );
};

const tileCount = (area?: MapAreaInfo) =>
  Math.max(0, ...(area?.grids ?? []).map((grid) => grid.index));

const MapViewer = ({ map }: { map: Map }) => {
  const [areaIndex, setAreaIndex] = useState(0);
  const areas = map.areas ?? [];
  return (
    <div>
      {areas.length > 1 && (
        <Select
          size="small"
          value={areaIndex}
          onChange={(e) => setAreaIndex(Number(e.target.value))}
          sx={{ marginBottom: 1 }}
        >
          {areas.map((area, index) => (
            <MenuItem key={index} value={index}>
              {index + 1}. {area.mapArea?.name}
            </MenuItem>
          ))}
        </Select>
      )}
      <MapBoard
        key={areaIndex}
        background={getBaseUrl("chuni", `map/${map.ddsMapName}`)}
        total={tileCount(areas[areaIndex]) || 9}
        tileRewards={Object.fromEntries(
          (areas[areaIndex]?.grids ?? [])
            .filter((grid) => grid.reward)
            .map((grid) => [grid.index, grid.reward]),
        )}
        goalReward={areas[areaIndex]?.reward}
        challengeSong={areas[areaIndex]?.music}
        bonus={areas[areaIndex]?.bonus}
      />
    </div>
  );
};

const MapPage = () => {
  const enums = useEnums();
  return (
    <DataDetail
      endpoint={`${getBaseUrl("chuni", "map/map.json")}`}
      render={(map: Map) => (
        <div>
          <h2>{map.name}</h2>
          <p>{map.id}</p>
          <MapViewer map={map} />
          <InfoTable
            rows={[
              [
                "Type",
                map.mapType !== undefined &&
                  intLabel(enums, "map.mapType", map.mapType),
              ],
              ["Progress Stops At", map.stopMapArea?.name],
              [
                "Continues After Event",
                map.stopUnlockEvent && (
                  <AssetLink type="event" asset={map.stopUnlockEvent} />
                ),
              ],
            ]}
          />
          {map.areas && map.areas.length > 0 && (
            <>
              <Typography variant="h5" sx={{ marginTop: 3 }}>
                Areas
              </Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ fontWeight: 600 }}>#</TableCell>
                    <TableCell style={{ fontWeight: 600 }}>Area</TableCell>
                    <TableCell style={{ fontWeight: 600 }}>Tiles</TableCell>
                    <TableCell style={{ fontWeight: 600 }}>
                      Max tiles per song (B / A / E / M)
                    </TableCell>
                    <TableCell style={{ fontWeight: 600 }}>
                      Challenge song
                    </TableCell>
                    <TableCell style={{ fontWeight: 600 }}>Rewards</TableCell>
                    <TableCell style={{ fontWeight: 600 }}>
                      Tile bonus
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {map.areas.map((area, index) => (
                    <AreaRow key={index} area={area} index={index} />
                  ))}
                </TableBody>
              </Table>
            </>
          )}
        </div>
      )}
    />
  );
};

export default MapPage;
