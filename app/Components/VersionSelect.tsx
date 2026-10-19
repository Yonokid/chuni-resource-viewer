"use client";
import { MenuItem, Select } from "@mui/material";
import { usePathname } from "next/navigation";
import { gameVersions, getVersion, setVersion } from "@/app/utils/global";

export default function VersionSelect() {
  const pathname = usePathname();
  const game = pathname.startsWith("/maimai") ? "maimai" : "chuni";
  return (
    <Select
      size="small"
      value={getVersion(game)}
      onChange={(e) => {
        setVersion(game, e.target.value);
        window.location.reload();
      }}
    >
      {Object.entries(gameVersions[game]).map(([v, name]) => (
        <MenuItem key={v} value={v}>
          {name}
        </MenuItem>
      ))}
    </Select>
  );
}
