"use client";
import { useEffect, useState } from "react";
import { getBaseUrl } from "./global";

// enums.json is written by chuni-parsing-library (chuni/enums.py):
//   tables: JSON field -> projDB records ({id, enumName, name}), e.g. musicLabel "ID_000" -> "ゲーム"
//   ints:   "<type>.<field>" -> {value: label}, e.g. "trophy.rareType" {"0": "Normal", ...}
export interface EnumRecord {
  id: number;
  enumName: string;
  name: string;
}
export interface Enums {
  tables: Record<string, EnumRecord[]>;
  ints: Record<string, Record<string, string>>;
}

const cache: Record<string, Promise<Enums | null>> = {};

export function useEnums(): Enums | null {
  const [enums, setEnums] = useState<Enums | null>(null);
  useEffect(() => {
    const url = getBaseUrl("chuni", "enums.json"); // reads localStorage, so client-only
    cache[url] ??= fetch(url)
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null);
    cache[url].then(setEnums);
  }, []);
  return enums;
}

/** Label for a plain-int enum; falls back to the raw number (also while enums.json loads or is missing). */
export function intLabel(enums: Enums | null, key: string, value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  return enums?.ints[key]?.[String(value)] ?? String(value);
}

/** Display name for a table enum stored by its enumName (e.g. musicLabel "ID_000" -> "ゲーム"). */
export function tableName(enums: Enums | null, field: string, enumName: string | null | undefined): string {
  if (!enumName) return "—";
  return enums?.tables[field]?.find((r) => r.enumName === enumName)?.name ?? enumName;
}

/** Sprites cut by chuni-parsing-library (chuni/sprites.py), e.g. spriteUrl("skillCategory", 2). */
export function spriteUrl(kind: string, value: number): string {
  return getBaseUrl("chuni", `sprites/${kind}_${value}.webp`);
}
