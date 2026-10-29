"use client";
import { IconButton, MenuItem, Select, Tooltip } from "@mui/material";
import { UploadFile as UploadFileIcon } from "@mui/icons-material";
import { usePathname } from "next/navigation";
import { gameVersions, getVersion, missingVersions, setVersion } from "@/app/utils/global";
import { importUnlocks } from "@/app/utils/unlocks";

function ImportUnlocks() {
  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      importUnlocks(JSON.parse(await file.text()));
      window.location.reload();
    } catch (err) {
      alert(`Import failed: ${err instanceof Error ? err.message : err}`);
    }
  };
  return (
    <Tooltip title="Import unlocked items (JSON)">
      <IconButton component="label">
        <UploadFileIcon />
        <input type="file" accept="application/json,.json" hidden onChange={onFile} />
      </IconButton>
    </Tooltip>
  );
}

export default function VersionSelect() {
  const pathname = usePathname();
  const game = pathname.startsWith("/maimai") ? "maimai" : "chuni";
  return (
    <>
      {game === "chuni" && <ImportUnlocks />}
      <Select
        size="small"
        value={getVersion(game)}
        onChange={(e) => {
          setVersion(game, e.target.value);
          window.location.reload();
        }}
      >
        {Object.entries(gameVersions[game]).map(([v, name]) => (
          <MenuItem key={v} value={v} disabled={missingVersions[game]?.includes(v)}>
            {name}
          </MenuItem>
        ))}
      </Select>
    </>
  );
}
