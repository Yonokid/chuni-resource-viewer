"use client";
import { Map } from "../page";
import DataDetail from "@/app/Components/DataDetail";
import AssetLink from "@/app/Components/AssetLink";
import InfoTable from "@/app/Components/InfoTable";
import Image from "next/image";
import { getBaseUrl } from "@/app/utils/global";
import { intLabel, useEnums } from "@/app/utils/enums";
import {
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

const MapPage = () => {
  const enums = useEnums();
  return (
    <DataDetail
      endpoint={`${getBaseUrl("chuni", "map/map.json")}`}
      render={(map: Map) => (
        <div>
          <h2>{map.name}</h2>
          <p>{map.id}</p>
          <Image
            src={getBaseUrl("chuni", `map/${map.ddsMapName}`)}
            alt=" "
            width={1220}
            height={680}
          ></Image>
          <InfoTable
            rows={[
              ["Type", map.mapType !== undefined && intLabel(enums, "map.mapType", map.mapType)],
              ["Progress Stops At", map.stopMapArea && <AssetLink type="mapArea" asset={map.stopMapArea} />],
              ["Continues After Event", map.stopUnlockEvent && <AssetLink type="event" asset={map.stopUnlockEvent} />],
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
                    <TableCell style={{ fontWeight: 600 }}>Reward</TableCell>
                    <TableCell style={{ fontWeight: 600 }}>Gauge (normal / challenge)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {map.areas.map((area, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <AssetLink type="mapArea" asset={area.mapArea} />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <AssetLink type="music" asset={area.music} />
                          <AssetLink type="reward" asset={area.reward} />
                          <AssetLink type="chara" asset={area.chara} />
                          <AssetLink type="skill" asset={area.skill} />
                          <AssetLink type="trophy" asset={area.trophy} />
                        </Stack>
                      </TableCell>
                      <TableCell>
                        {area.normalGauge?.name ?? "—"} / {area.challengeGauge?.name ?? "—"}
                      </TableCell>
                    </TableRow>
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
