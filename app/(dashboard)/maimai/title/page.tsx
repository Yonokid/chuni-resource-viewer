"use client";
import React, { Fragment, useState, useMemo } from "react";
import {
  Box,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  List,
  ListItemButton,
  ListItemText,
  MenuItem,
  Select,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import DataList, { BaseData } from "@/app/Components/Data";
import { getBaseUrl, gameVersions } from "@/app/utils/global";
import MaimaiTitle from "../../../Components/MaimaiTitle";
import Image from "next/image";

export interface Title extends BaseData {
  normText: string;
  rareType: number;
  param: number;
  reference_id: number;
  unlock_category: string;
  unlock_type: string;
}

const RARE_TYPE_LABELS: Record<number, string> = {
  0: "Normal",
  1: "Bronze",
  2: "Silver",
  3: "Gold",
  4: "Rainbow",
};

/** unlock_type (chuni-parsing-library maimai/title.py unlock_types) -> filter label. */
const UNLOCK_TYPE_LABELS: Record<string, string> = {
  None: "Transferred",
  RATING: "Rating",
  CHARA_KAKUSEI: "Character Awakening",
  CHARA_KAISU: "Character Awakening Count",
  MAP_CHARA_KAKUSEI: "Chiho Character Awakening",
  TOTAL_CHARA_KAKUSEI: "Tour Member Awakening",
  PARTNER: "Partner",
  MUSIC: "Play Song",
  MUSIC_GROUP: "Song Set",
  MUSIC_GENRE_SELECTED: "Genre Select",
  TRACK_SKIP: "Track Skip",
  FULLCOMBO_COUNT: "Full Combo Count",
  DANNI: "Dan Rank",
  MAP_KYORI: "Travel Distance",
  MAP_COMPLETE: "Chiho Complete",
  TODOHUKEN: "Prefecture",
  TODOHUKEN_SEIHA: "All Prefectures",
  LOGIN_RUIKEI: "Total Logins",
  LOGIN_RENZOKU: "Consecutive Logins",
  MAI2DX_N_PLAY: "maimai DX Plays",
  OTOMODACHI_WIN: "Otomodachi Win",
  NPC_OTOMODACHI_N_WIN: "NPC Otomodachi Wins",
  NPC_OTOMODACHI_N_REN_WIN: "NPC Otomodachi Win Streak",
  ZENKOKU_OTOMODACHI_N_WIN: "National Otomodachi Wins",
  ZENKOKU_OTOMODACHI_N_REN_WIN: "National Otomodachi Win Streak",
  TITLESET_DP: "Title Set (2P)",
  MATCHING_FOR_TITLESETPLAYER: "Title Set (Matching)",
  SATELLITE: "Satellite",
};

// Stable reference so DataList's memo doesn't rerun every render.
const filters = {
  Requirement: (t: Title) => [UNLOCK_TYPE_LABELS[t.unlock_type] ?? t.unlock_type],
};

interface TitleListProps {
  data: Title[];
}

const TitleList: React.FC<TitleListProps> = ({ data }) => {
  const [selectedRareTypes, setSelectedRareTypes] = useState<number[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<string>("all");

  const versions = useMemo(() => {
    const versionMap = gameVersions["maimai"];
    return Array.from(new Set(data.map((t) => t.version)))
      .sort((a, b) => a - b)
      .map((v) => ({ value: v, label: versionMap[String(v)] ?? String(v) }));
  }, [data]);

  const filtered = useMemo(() => {
    return data
      .filter((item) => {
        if (selectedRareTypes.length > 0 && !selectedRareTypes.includes(item.rareType)) {
          return false;
        }
        if (selectedVersion !== "all" && item.version !== Number(selectedVersion)) {
          return false;
        }
        return true;
      });
  }, [data, selectedRareTypes, selectedVersion]);

  const handleRareTypeToggle = (
    _event: React.MouseEvent<HTMLElement>,
    newTypes: number[]
  ) => {
    setSelectedRareTypes(newTypes);
  };

  return (
    <>
      <Box sx={{ p: 2, display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
        <ToggleButtonGroup
          value={selectedRareTypes}
          onChange={handleRareTypeToggle}
          size="small"
          sx={{ flexWrap: "wrap", gap: 0.5 }}
        >
          {Object.entries(RARE_TYPE_LABELS).map(([type, label]) => (
            <ToggleButton key={type} value={Number(type)} sx={{ gap: 0.5 }}>
              <Image
                src={`/maimai/title_${type}.webp`}
                alt={label}
                width={54}
                height={5}
                style={{ display: "block" }}
              />
              {label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        <FormControl size="small" sx={{ minWidth: 180, flex: { xs: "1 1 100%", sm: "0 1 auto" } }}>
          <InputLabel>Version</InputLabel>
          <Select
            value={selectedVersion}
            label="Version"
            onChange={(e) => setSelectedVersion(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            {versions.map(({ value, label }) => (
              <MenuItem key={value} value={String(value)}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Chip label={`${filtered.length} titles`} size="small" />
      </Box>
      <List>
        {filtered.map((item: Title, index: number) => (
          <Fragment key={index}>
            <ListItemButton component="a" href={`title/${item.id}`} sx={{ flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "stretch", sm: "center" } }}>
              <ListItemText>
                <MaimaiTitle key={item.id} item={item} />
              </ListItemText>
              <ListItemText
                sx={{ textAlign: { xs: "left", sm: "right" }, flex: { xs: "1 1 auto", sm: "0 0 45%" } }}
                primary={item.normText}
              />
            </ListItemButton>
            <Divider />
          </Fragment>
        ))}
      </List>
    </>
  );
};

const Trophies: React.FC = () => {
  return (
    <DataList<Title>
      endpoint={`${getBaseUrl("maimai", "title/title.json")}`}
      filters={filters}
      render={(data) => <TitleList data={data} />}
    />
  );
};

export default Trophies;
