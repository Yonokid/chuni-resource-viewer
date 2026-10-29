"use client";
// Shared maimai DX pieces. Tables come from chuni-parsing-library maimai/ (one generic XmlSerializer dump per type):
// references are StringID {id, str}, images are file names relative to the table's folder.
import React, { Fragment } from "react";
import Link from "next/link";
import { Box, Divider, List, ListItemAvatar, ListItemButton, ListItemText, Typography } from "@mui/material";
import DataList, { BaseData } from "@/app/Components/Data";
import DataDetail from "@/app/Components/DataDetail";
import InfoTable from "@/app/Components/InfoTable";
import { getBaseUrl } from "@/app/utils/global";

export interface StringID {
  id: number;
  str: string;
}

export interface MaiItem extends BaseData {
  image?: string | null;
  [field: string]: unknown;
}

/** ids 10000-19999 are the DX (でらっくす) charts of a song. */
export const isDX = (s: { id: number }) => s.id >= 10000 && s.id < 20000;

export const table = (type: string) => getBaseUrl("maimai", `${type}/${type}.json`);
export const asset = (type: string, file: string) => getBaseUrl("maimai", `${type}/${file}`);

const isStringID = (v: unknown): v is StringID =>
  typeof v === "object" && v !== null && "id" in v && "str" in v && Object.keys(v).length === 2;

/** StringID field -> the table its id points into (for links). */
const REF_TYPES: Record<string, string> = {
  charaId: "chara", CharacterId: "chara", chara: "cardCharaPack", musicId: "music", MusicId: "music", mapId: "map",
  titleId: "title", plateId: "plate", iconId: "icon", otomodachiId: "mapOtomodachi", Otomodachi: "mapOtomodachi",
  TreasureId: "mapTreasure", type: "cardType", eventName: "event", eventName2: "event", OpenEventId: "event",
  PartnerId: "partner", TitleId: "title", PlateId: "plate", IconId: "icon", music: "music", silhouette: "mapSilhouette",
  Silhouette: "mapSilhouette",
  FrameId: "frame", frameId: "frame", partnerId: "partner", matchingUserTitle: "title", allEquipTitles: "title",
  partnerName: "partner", NamePlate: "plate", Frame: "frame", Icon: "icon", shopItemCategoryName: "shopItemCategory", TicketId: "ticket", seasonId: "udemaeSeasonEvent", classBoss: "udemaeBoss",
};

export const Ref = ({ field, value }: { field?: string; value: StringID }) => {
  const type = field && REF_TYPES[field];
  const text = value.str || `#${value.id}`;
  return type ? <Link href={`/maimai/${type}/${value.id}`}>{text}</Link> : <>{text}</>;
};

/** Plain value for an info table cell; nested objects/lists collapse to text. */
export const show = (field: string, v: unknown): React.ReactNode => {
  if (isStringID(v)) return <Ref field={field} value={v} />;
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (Array.isArray(v)) return v.length ? v.map((x, i) => <div key={i}>{show(field, x)}</div>) : null;
  if (typeof v === "object" && v !== null)
    return Object.entries(v).map(([k, x], i) => (
      <span key={k}>
        {i > 0 && " · "}
        {k}: {show(k, x)}
      </span>
    ));
  return v as React.ReactNode;
};

const HIDDEN = new Set(["dataName", "image", "name", "relConds", "bases", "priority"]);

/** Every field of an item, minus bookkeeping. */
export const allRows = (item: MaiItem): [string, React.ReactNode][] =>
  Object.entries(item)
    .filter(([k, v]) => !HIDDEN.has(k) && v !== "" && !(isStringID(v) && v.id === 0 && !v.str))
    .map(([k, v]) => [k, show(k, v)]);

/** Release*Kind prefix -> the ReleaseItemConditions field it reads (Manager.MaiStudio.Serialize). First match wins. */
const KIND_FIELDS: [string, string][] = [
  ["MUSIC_GROUP", "musicGroupId"], ["MUSIC_GENRE_SELECTED", "musicGenreId"], ["MUSIC", "musicId"], ["TRACK_SKIP", "musicId"], ["CHARA", "charaId"], ["MAP", "mapId"],
  ["NPC_OTOMODACHI", ""], ["ZENKOKU_OTOMODACHI", ""], ["OTOMODACHI", "otomodachiId"], ["TITLESET_DP", "allEquipTitles"], ["TITLE", "titleId"],
  ["PLATE", "plateId"], ["ICON", "iconId"], ["DIFFICULTY", "difficultyId"], ["RANK", "rankId"], ["TODOHUKEN", "todohukenId"],
  ["SATELLITE", "satelliteId"], ["DANNI", "gradeId"], ["FULLCOMBO", "fcId"], ["SYNC", "syncId"],
  ["FRAME", "frameId"], ["MIRROR_MODE", "mirrorModeId"], // 1.30+
  ["DELUXE_SCORE", "deluxeScoreId"], // 1.35+
  ["PARTNER", "partnerId"], ["MOVIE_BRIGHTNESS", "moviebrightnessID"], ["MATCHING_FOR_TITLESETPLAYER", "matchingUserTitle"], // 1.40+
];

/** One ReleaseConditions slot (titles, icons, plates): "Total · LOGIN_RENZOKU 30". */
export const conditionText = (c: Record<string, unknown>): React.ReactNode => {
  const kind = String(c.kind);
  const field = KIND_FIELDS.find(([prefix]) => kind.startsWith(prefix))?.[1];
  const ref = field ? c[field] : undefined;
  return (
    <>
      {`${c.Category} · ${kind}${c.param ? ` ${c.param}` : ""} `}
      {ref !== undefined && field && show(field, ref)}
    </>
  );
};

/** Text shown under an item's name in lists. */
const blurb = (item: MaiItem) =>
  (item.normText ?? item.infoText ?? item.effectText ?? item.title ?? item.TreasureType ?? "") as string;

export const ItemList = ({ type, imageWidth = 64 }: { type: string; imageWidth?: number }) => (
  <DataList<MaiItem>
    endpoint={table(type)}
    render={(data) => (
      <List>
        {data.map((item) => (
          <Fragment key={item.id}>
            <ListItemButton component="a" href={`/maimai/${type}/${item.id}`}>
              {item.image && (
                <ListItemAvatar sx={{ minWidth: 0, mr: 2 }}>
                  <img src={asset(type, item.image)} alt="" width={imageWidth} loading="lazy" style={{ display: "block" }} />
                </ListItemAvatar>
              )}
              <ListItemText primary={item.name || `#${item.id}`} secondary={blurb(item)} sx={{ whiteSpace: "pre-line" }} />
            </ListItemButton>
            <Divider />
          </Fragment>
        ))}
      </List>
    )}
  />
);

export const ItemDetail = <T extends MaiItem>({
  type,
  children,
}: {
  type: string;
  children?: (item: T) => React.ReactNode;
}) => (
  <DataDetail<T>
    endpoint={table(type)}
    render={(item) => (
      <>
        {item.image && (
          <Box sx={{ mb: 2 }}>
            <img src={asset(type, item.image)} alt="" style={{ maxWidth: "100%" }} />
          </Box>
        )}
        <Typography variant="h4" sx={{ mb: 2 }}>
          {item.name}
        </Typography>
        {children?.(item)}
        {Array.isArray(item.relConds) && item.relConds.length > 0 && (
          <InfoTable rows={(item.relConds as Record<string, unknown>[]).map((c, i) => [`Unlock ${i + 1}`, conditionText(c)])} />
        )}
        <InfoTable rows={allRows(item)} />
      </>
    )}
  />
);
