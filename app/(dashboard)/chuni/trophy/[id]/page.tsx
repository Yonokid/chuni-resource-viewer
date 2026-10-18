"use client";
import { Trophy, Condition } from "../page";
import DataDetail from "@/app/Components/DataDetail";
import AssetLink from "@/app/Components/AssetLink";
import { getBaseUrl } from "@/app/utils/global";
import { intLabel, useEnums } from "@/app/utils/enums";
import AnimatedTitle from "../../../../Components/AnimatedTitle";
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  Box,
  Paper,
  Stack,
  Chip,
  Typography,
} from "@mui/material";
import { Fragment } from "react";

const flagLabels: [keyof Condition, string][] = [
  ["fullCombo", "Full Combo"],
  ["fullChain", "Full Chain"],
  ["allJustice", "All Justice"],
  ["masterUnderAll", "MASTER or below"],
  ["gameOver", "Game Over"],
  ["anyCharaRankMax", "Any Character Rank MAX"],
  ["anySkillLvMax", "Any Skill Lv MAX"],
];

const ConditionRow = ({ cond, index }: { cond: Condition; index: number }) => {
  const hasContent = Object.keys(cond).length > 1;
  if (!hasContent) return null;

  return (
    <Paper key={index} sx={{ padding: 2, marginBottom: 1 }}>
      <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1, alignItems: "center" }}>
        {cond.music && <AssetLink type="music" asset={cond.music} />}
        {cond.musics?.map((m) => <AssetLink key={m.id} type="music" asset={m} />)}
        {cond.musicDifficulty && <Chip size="small" label={cond.musicDifficulty} />}
        {cond.genres?.map((g) => <Chip key={g} size="small" label={g} />)}
        {cond.scoreRank && <Chip size="small" label={`Rank ${cond.scoreRank}`} />}
        {flagLabels.map(
          ([key, label]) => cond[key] === true && <Chip key={key} size="small" color="warning" label={label} />,
        )}
        {cond.memberNum && <Chip size="small" label={`${cond.memberNum} players`} />}
        {cond.missNum && <Chip size="small" label={`${cond.missNum} miss${cond.missNum > 1 ? "es" : ""}`} />}
        {cond.charaTargetRank && <Chip size="small" label={`Character Rank ${cond.charaTargetRank}`} />}
        {cond.playNum && <Chip size="small" label={`${cond.playNum} plays`} />}
        {cond.japanRegion && (
          <Chip
            size="small"
            label={`${cond.japanRegion}${cond.japanRegionPlayNum ? ` ×${cond.japanRegionPlayNum}` : ""}`}
          />
        )}
        {cond.playerLv && <Chip size="small" label={`Player Lv ${cond.playerLv}`} />}
        {cond.playerRating && <Chip size="small" label={`Rating ${cond.playerRating}`} />}
        {cond.playerRebirthCount && <Chip size="small" label={`Rebirth ${cond.playerRebirthCount}`} />}
        {cond.totalGamePoint && <Chip size="small" label={`${cond.totalGamePoint} pts`} />}
        {cond.memberOtherTrophy && (
          <Fragment>
            <Typography variant="body2">Other player has:</Typography>
            <AssetLink type="trophy" asset={cond.memberOtherTrophy} />
          </Fragment>
        )}
        {cond.haveTrophies?.map((t) => <AssetLink key={t.id} type="trophy" asset={t} />)}
        {cond.events?.map((e) => (
          <Chip key={e.id} size="small" variant="outlined" label={e.name} />
        ))}
      </Stack>
    </Paper>
  );
};

const TrophyPage = () => {
  const enums = useEnums();
  return (
    <DataDetail
      endpoint={`${getBaseUrl("chuni", "trophy/trophy.json")}`}
      render={(trophy: Trophy) => {
        const meaningfulConditions = (trophy.conditions ?? []).filter(
          (c: Condition) => Object.keys(c).length > 1,
        );
        return (
          <>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <AnimatedTitle key={trophy.id} item={trophy} />
            </div>
            <div
              style={{ display: "flex", justifyContent: "center", padding: 10 }}
            >
              <Table sx={{ maxWidth: 800 }}>
                <TableBody>
                  <TableRow>
                    <TableCell style={{ fontWeight: 600 }}>ID</TableCell>
                    <TableCell align="right">{trophy.id}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ fontWeight: 600 }}>Title</TableCell>
                    <TableCell align="right">{trophy.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ fontWeight: 600 }}>
                      Unlock Condition
                    </TableCell>
                    <TableCell align="right">{trophy.explainText}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ fontWeight: 600 }}>Rarity</TableCell>
                    <TableCell align="right">
                      {intLabel(enums, "trophy.rareType", trophy.rareType)}
                    </TableCell>
                  </TableRow>
                  {trophy.defaultHave && (
                    <TableRow>
                      <TableCell style={{ fontWeight: 600 }}>Owned by Default</TableCell>
                      <TableCell align="right">Yes</TableCell>
                    </TableRow>
                  )}
                  {trophy.openCondition?.useCondition && (
                    <TableRow>
                      <TableCell style={{ fontWeight: 600 }}>
                        Only During Event{trophy.openCondition.forceHide ? " (hidden until earned)" : ""}
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end" }}>
                          {trophy.openCondition.events.map((e) => (
                            <AssetLink key={e.id} type="event" asset={e} />
                          ))}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            {meaningfulConditions.length > 0 && (
              <Box sx={{ maxWidth: 800, margin: "0 auto", padding: "0 10px" }}>
                <Typography variant="h6" sx={{ marginBottom: 1 }}>
                  Related
                </Typography>
                {meaningfulConditions.map((cond: Condition, index: number) => (
                  <ConditionRow key={index} cond={cond} index={index} />
                ))}
              </Box>
            )}
          </>
        );
      }}
    />
  );
};

export default TrophyPage;
