import Link from "next/link";
import { Stack } from "@mui/material";
import type { MapBonusSubstance } from "@/app/(dashboard)/chuni/map/page";

// bonus kind -> [label, page to link the target to (none for series/genre/level filters)]
const BONUS_KINDS: { [kind: string]: [string, string | null] } = {
  chara: ["Character", "chara"],
  charaWorks: ["Character series", null],
  skill: ["Skill", "skill"],
  skillCategory: ["Skill category", null],
  music: ["Song", "music"],
  musicGenre: ["Genre", null],
  musicWorks: ["Song series", null],
  musicDif: ["Difficulty", null],
  musicLv: ["Level", null],
};

const MapBonusList = ({ substances }: { substances: MapBonusSubstance[] }) => (
  <Stack spacing={0.5}>
    {substances.map((sub, index) => {
      const [label, page] = BONUS_KINDS[sub.kind] ?? [sub.kind, null];
      return (
        <div key={index}>
          {label}:{" "}
          {page
            ? sub.target && (
                <Link
                  href={`/chuni/${page}/${sub.target.id}`}
                  style={{ color: "inherit", textDecoration: "underline" }}
                >
                  {sub.target.name}
                </Link>
              )
            : (sub.target?.name ?? "—")}{" "}
          (+{sub.point})
        </div>
      );
    })}
  </Stack>
);

export default MapBonusList;
