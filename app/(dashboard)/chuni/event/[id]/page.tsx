"use client";
import { Event } from "../page";
import DataDetail from "@/app/Components/DataDetail";
import AssetLink from "@/app/Components/AssetLink";
import InfoTable from "@/app/Components/InfoTable";
import Image from "next/image";
import { getBaseUrl } from "@/app/utils/global";
import { intLabel, useEnums } from "@/app/utils/enums";
import { Stack } from "@mui/material";

const KIND_LABELS: Record<string, string> = {
  flag: "Flag",
  information: "Announcement",
  map: "Map unlock",
  music: "Song unlock",
  advertiseMovie: "Attract movie",
  recommendMusic: "Recommended songs",
  release: "Release",
  course: "Courses",
  quest: "Quests",
  duel: "Duel",
};

const EventPage = () => {
  const enums = useEnums();
  return (
    <DataDetail
      endpoint={getBaseUrl("chuni", "event/event.json")}
      render={(event: Event) => {
        const sub = event.substance;
        return (
          <div>
            <h2>{event.name}</h2>
            <p>{event.id}</p>
            {event.eventBannerName && (
              <Image
                src={getBaseUrl("chuni", `event/${event.eventBannerName}.webp`)}
                alt=" "
                width={1240}
                height={640}
              ></Image>
            )}
            <InfoTable
              rows={[
                ["Kind", sub && (KIND_LABELS[sub.kind] ?? intLabel(enums, "event.substance.type", sub.type))],
                ["Always Active", event.alwaysOpen ? "Yes" : null],
                ["Text", event.text || sub?.text],
                ["Map", sub?.map && <AssetLink type="map" asset={sub.map} />],
                ["Map Tag", sub?.tagText],
                [
                  "Songs",
                  sub?.musics && sub.musics.length > 0 && (
                    <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1, justifyContent: "flex-end" }}>
                      {sub.musics.map((m) => (
                        <AssetLink key={m.id} type="music" asset={m} />
                      ))}
                    </Stack>
                  ),
                ],
                ["Map Filter", sub?.mapFilter?.name],
                [
                  "Quests",
                  sub?.quests && sub.quests.length > 0 && (
                    <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1, justifyContent: "flex-end" }}>
                      {sub.quests.map((q) => (
                        <AssetLink key={q.id} type="quest" asset={q} />
                      ))}
                    </Stack>
                  ),
                ],
                ["Duel", sub?.duel && <AssetLink type="duel" asset={sub.duel} />],
                ["Movie", sub?.movie && <AssetLink type="movie" asset={sub.movie} />],
                ["First Movie", sub?.firstMovie && <AssetLink type="movie" asset={sub.firstMovie} />],
                ["Second Movie", sub?.secondMovie && <AssetLink type="movie" asset={sub.secondMovie} />],
              ]}
            />
          </div>
        );
      }}
    />
  );
};

export default EventPage;
