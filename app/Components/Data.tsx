"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { Box, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { matches, needles, searchKey } from "@/app/utils/search";
import { gameVersions } from "@/app/utils/global";

export interface BaseData {
  id: number;
  name: string;
  version: number;
  sortName?: string;
}

interface Endpoint<T> {
  endpoint: string;
  render: (data: T[]) => React.ReactNode;
  skeleton?: (count: number) => React.ReactNode;
  /** Extra sort options on top of the built-in Version, ID and Name. */
  /** Set false for detail views to hide the sort controls. */
  sortable?: boolean;
  sorts?: Record<string, (a: T, b: T) => number>;
}

const PAGE_SIZE = 50;

const DataList = <T extends BaseData>({
  endpoint,
  render,
  skeleton,
  sorts,
  sortable = true,
}: Endpoint<T>) => {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState("ID");
  const [desc, setDesc] = useState(false);
  const [search, setSearch] = useState("");
  const [version, setVersion] = useState("");
  const [limit, setLimit] = useState(PAGE_SIZE);
  const sentinel = useRef<HTMLDivElement>(null);

  const options = useMemo<Record<string, (a: T, b: T) => number>>(
    () => ({
      Version: (a, b) => a.version - b.version || a.id - b.id,
      ID: (a, b) => a.id - b.id,
      Name: (a, b) => a.name.localeCompare(b.name),
      ...sorts,
    }),
    [sorts],
  );

  const versions = useMemo(() => [...new Set(data?.map((d) => d.version))].sort((a, b) => a - b), [data]);
  const versionNames = gameVersions[endpoint.includes("/maimai/") ? "maimai" : "chuni"];

  const keys = useMemo(() => new Map(data?.map((d) => [d, searchKey(d.name, d.sortName)])), [data]);

  const sorted = useMemo(() => {
    if (!data) return data;
    const cmp = options[sortKey] ?? options.ID;
    const ns = needles(search);
    return data
      .filter((d) => (!version || d.version === +version) && matches(keys.get(d)!, ns))
      .sort((a, b) => (desc ? cmp(b, a) : cmp(a, b)));
  }, [data, keys, options, sortKey, desc, search, version]);

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

  useEffect(() => setLimit(PAGE_SIZE), [search, sortKey, desc, version]);

  const more = sortable && !!sorted && limit < sorted.length;
  useEffect(() => {
    const el = sentinel.current;
    if (!more || !el) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setLimit((l) => l + PAGE_SIZE),
      { rootMargin: "400px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [more, limit]);

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
      {sortable && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, p: 1, width: "100%" }}>
        <TextField
          label="Search"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 200, flex: { xs: "1 1 100%", sm: "0 1 auto" } }}
        />
          <FormControl size="small" sx={{ minWidth: 160, flex: { xs: 1, sm: "0 1 auto" } }}>
            <InputLabel shrink>Version</InputLabel>
            <Select
              value={version}
              label="Version"
              displayEmpty
              notched
              onChange={(e) => setVersion(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {versions.map((v) => (
                <MenuItem key={v} value={String(v)}>
                  {versionNames[v] ?? v}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 160, flex: { xs: 1, sm: "0 1 auto" } }}>
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
          <FormControl size="small" sx={{ minWidth: 130, flex: { xs: 1, sm: "0 1 auto" } }}>
            <Select
              value={desc ? "desc" : "asc"}
              onChange={(e) => setDesc(e.target.value === "desc")}
            >
              <MenuItem value="asc">Ascending</MenuItem>
              <MenuItem value="desc">Descending</MenuItem>
            </Select>
          </FormControl>
        </Box>
      )}
      {render(sortable ? sorted!.slice(0, limit) : sorted!)}
      {more && <div ref={sentinel} style={{ height: 1, width: "100%" }} />}
    </>
  );
};

export default DataList;
