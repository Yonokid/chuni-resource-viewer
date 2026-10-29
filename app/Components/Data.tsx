"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { Box, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { matches, needles, searchKey } from "@/app/utils/search";
import { gameVersions } from "@/app/utils/global";

/** "v1 1.25.00" → 12500, the gameVersions key; NaN if the tag has no x.yy. */
const releaseCode = (tag: string) => {
  const m = tag.match(/(\d+)\.(\d+)/);
  return m ? +m[1] * 10000 + +m[2] * 100 : NaN;
};

export interface BaseData {
  id: number;
  name: string;
  version: number;
  sortName?: string;
  releaseTagName?: string;
}

interface Endpoint<T> {
  endpoint: string;
  render: (data: T[]) => React.ReactNode;
  skeleton?: (count: number) => React.ReactNode;
  /** Extra sort options on top of the built-in Version, ID and Name. */
  /** Set false for detail views to hide the sort controls. */
  sortable?: boolean;
  sorts?: Record<string, (a: T, b: T) => number>;
  /** Extra dropdown filters: label -> the values an item matches (options are collected from the data). */
  filters?: Record<string, (d: T) => string[]>;
}

const PAGE_SIZE = 50;

const DataList = <T extends BaseData>({
  endpoint,
  render,
  skeleton,
  sorts,
  filters,
  sortable = true,
}: Endpoint<T>) => {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState("ID");
  const [desc, setDesc] = useState(false);
  const [search, setSearch] = useState("");
  const [release, setRelease] = useState("");
  const [picked, setPicked] = useState<Record<string, string>>({});
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

  const versionNames = gameVersions[endpoint.includes("/maimai/") ? "maimai" : "chuni"];
  const releaseName = (tag?: string) => tag && (versionNames[releaseCode(tag)] ?? tag);
  const releases = useMemo(() => {
    const tags = [...new Set(data?.map((d) => d.releaseTagName).filter(Boolean) as string[])];
    tags.sort((a, b) => releaseCode(a) - releaseCode(b) || a.localeCompare(b));
    return [...new Set(tags.map(releaseName))] as string[];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const filterOptions = useMemo(
    () =>
      Object.entries(filters ?? {}).map(([label, fn]) => {
        const values = [...new Set(data?.flatMap(fn))];
        return [label, values.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))] as const;
      }),
    [data, filters],
  );

  const keys = useMemo(() => new Map(data?.map((d) => [d, searchKey(d.name, d.sortName)])), [data]);

  const sorted = useMemo(() => {
    if (!data) return data;
    const cmp = options[sortKey] ?? options.ID;
    const ns = needles(search);
    return data
      .filter(
        (d) =>
          (!release || releaseName(d.releaseTagName) === release) &&
          Object.entries(picked).every(([label, v]) => !v || filters![label](d).includes(v)) &&
          matches(keys.get(d)!, ns),
      )
      .sort((a, b) => (desc ? cmp(b, a) : cmp(a, b)));
  }, [data, keys, options, sortKey, desc, search, release, picked, filters]);

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

  useEffect(() => setLimit(PAGE_SIZE), [search, sortKey, desc, release, picked]);

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
          {releases.length > 0 && (
            <FormControl size="small" sx={{ minWidth: 160, flex: { xs: 1, sm: "0 1 auto" } }}>
              <InputLabel shrink>Release</InputLabel>
              <Select
                value={release}
                label="Release"
                displayEmpty
                notched
                onChange={(e) => setRelease(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {releases.map((r) => (
                  <MenuItem key={r} value={r}>
                    {r}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          {filterOptions.map(([label, values]) => (
            <FormControl key={label} size="small" sx={{ minWidth: 160, flex: { xs: 1, sm: "0 1 auto" } }}>
              <InputLabel shrink>{label}</InputLabel>
              <Select
                value={picked[label] ?? ""}
                label={label}
                displayEmpty
                notched
                onChange={(e) => setPicked((p) => ({ ...p, [label]: e.target.value }))}
              >
                <MenuItem value="">All</MenuItem>
                {values.map((v) => (
                  <MenuItem key={v} value={v}>
                    {v}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ))}
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
