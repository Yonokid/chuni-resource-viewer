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
  TextField,
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

interface TitleListProps {
  data: Title[];
}

const TitleList: React.FC<TitleListProps> = ({ data }) => {
  const [search, setSearch] = useState("");
  const [selectedRareTypes, setSelectedRareTypes] = useState<number[]>([]);
  const [selectedUnlockType, setSelectedUnlockType] = useState<string>("all");
  const [selectedVersion, setSelectedVersion] = useState<string>("all");

  const unlockTypes = useMemo(() => {
    const types = Array.from(new Set(data.map((t) => t.unlock_type))).sort();
    return types;
  }, [data]);

  const versions = useMemo(() => {
    const versionMap = gameVersions["maimai"];
    return Array.from(new Set(data.map((t) => t.version)))
      .sort((a, b) => a - b)
      .map((v) => ({ value: v, label: versionMap[String(v)] ?? String(v) }));
  }, [data]);

  const filtered = useMemo(() => {
    return [...data]
      .sort((a, b) => a.id - b.id)
      .filter((item) => {
        if (search && !item.name.toLowerCase().includes(search.toLowerCase())) {
          return false;
        }
        if (selectedRareTypes.length > 0 && !selectedRareTypes.includes(item.rareType)) {
          return false;
        }
        if (selectedUnlockType !== "all" && item.unlock_type !== selectedUnlockType) {
          return false;
        }
        if (selectedVersion !== "all" && item.version !== Number(selectedVersion)) {
          return false;
        }
        return true;
      });
  }, [data, search, selectedRareTypes, selectedUnlockType, selectedVersion]);

  const handleRareTypeToggle = (
    _event: React.MouseEvent<HTMLElement>,
    newTypes: number[]
  ) => {
    setSelectedRareTypes(newTypes);
  };

  return (
    <>
      <Box sx={{ p: 2, display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
        <TextField
          label="Search"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 200 }}
        />
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
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Unlock Type</InputLabel>
          <Select
            value={selectedUnlockType}
            label="Unlock Type"
            onChange={(e) => setSelectedUnlockType(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            {unlockTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 180 }}>
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
            <ListItemButton component="a" href={`title/${item.id}`}>
              <ListItemText>
                <MaimaiTitle key={item.id} item={item} />
              </ListItemText>
              <ListItemText
                sx={{ textAlign: "right", flex: "0 0 45%" }}
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
      render={(data) => <TitleList data={data} />}
    />
  );
};

export default Trophies;
