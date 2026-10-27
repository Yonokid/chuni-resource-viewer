// Unlocked items imported from a player's exported JSON, keyed by the site's data type (trophy, namePlate, ...).
const STORAGE_KEY = "chuni_unlocks";

type Ids = { [type: string]: number[] };
const ids = (items?: { id: number }[]) => (items ?? []).map((i) => i.id);

/** Accepts the tRPC batch export (playlog, listUnlockedItems, profile) or a bare listUnlockedItems object. */
export function importUnlocks(raw: unknown): number {
  const parts = (Array.isArray(raw) ? raw : [raw]).map((r) => r?.result?.data?.json ?? r);
  const u = parts.find((p) => p?.trophies);
  if (!u) throw new Error("No unlocked items found in this file.");
  const data: Ids = {
    trophy: ids(u.trophies),
    namePlate: ids(u.namePlates),
    mapIcon: ids(u.mapIcons),
    systemVoice: ids(u.systemVoices),
    avatarAccessory: Object.values<{ id: number }[]>(u.avatar ?? {}).flatMap(ids),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return Object.values(data).reduce((n, a) => n + a.length, 0);
}

export function getUnlocked(type: string): Set<number> {
  try {
    return new Set((JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}") as Ids)[type]);
  } catch {
    return new Set();
  }
}
