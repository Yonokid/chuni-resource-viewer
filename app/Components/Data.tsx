"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";

export interface BaseData {
  id: number;
  name: string;
  version: number;
}

interface Endpoint<T> {
  endpoint: string;
  render: (data: T[]) => React.ReactNode;
  skeleton?: (count: number) => React.ReactNode;
  /** Extra sort options on top of the built-in Version, ID and Name. */
  sorts?: Record<string, (a: T, b: T) => number>;
}

const DataList = <T extends BaseData>({
  endpoint,
  render,
  skeleton,
  sorts,
}: Endpoint<T>) => {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState("Version");
  const [desc, setDesc] = useState(false);

  const options = useMemo<Record<string, (a: T, b: T) => number>>(
    () => ({
      Version: (a, b) => a.version - b.version || a.id - b.id,
      ID: (a, b) => a.id - b.id,
      Name: (a, b) => a.name.localeCompare(b.name),
      ...sorts,
    }),
    [sorts],
  );

  const sorted = useMemo(() => {
    if (!data) return data;
    const cmp = options[sortKey] ?? options.Version;
    return [...data].sort((a, b) => (desc ? cmp(b, a) : cmp(a, b)));
  }, [data, options, sortKey, desc]);

  useEffect(() => {
    fetch(endpoint)
      .then((response) => response.json())
      .then((json: T[]) => {
        setData(json);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading JSON:", error);
        setLoading(false);
      });
  }, [endpoint]);

  if (loading) {
    if (skeleton) {
      return skeleton(5);
    }
    return <p>Loading...</p>;
  }

  if (!data) {
    return <p>Error loading data.</p>;
  }
  return (
    <>
      <Box sx={{ display: "flex", gap: 1, p: 1, width: "100%" }}>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Sort by</InputLabel>
          <Select
            value={sortKey}
            label="Sort by"
            onChange={(e) => setSortKey(e.target.value)}
          >
            {Object.keys(options).map((k) => (
              <MenuItem key={k} value={k}>
                {k}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 130 }}>
          <Select
            value={desc ? "desc" : "asc"}
            onChange={(e) => setDesc(e.target.value === "desc")}
          >
            <MenuItem value="asc">Ascending</MenuItem>
            <MenuItem value="desc">Descending</MenuItem>
          </Select>
        </FormControl>
      </Box>
      {render(sorted!)}
    </>
  );
};

export default DataList;
