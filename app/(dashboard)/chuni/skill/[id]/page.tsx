"use client";
import { Skill } from "../page";
import SkillEffects from "./SkillEffects";
import InfoTable from "@/app/Components/InfoTable";
import { intLabel, spriteUrl, useEnums } from "@/app/utils/enums";
import DataDetail from "@/app/Components/DataDetail";
import { getBaseUrl } from "@/app/utils/global";
import { Fragment } from "react";
import {
  Typography,
  Chip,
  Stack,
  Paper,
  Tab,
  Tabs,
} from "@mui/material";
import { TabContext, TabPanel } from "@mui/lab";
import { useState, SyntheticEvent } from "react";
import Link from "next/link";

// Skill descriptions use $n for line breaks and $c[RRGGBBAA]...$c for colored spans.
const renderDescription = (text: string) => {
  const lines = text.split("$n");
  return lines.map((line, lineIdx) => {
    const parts = line.split(/(\$c\[[0-9A-Fa-f]{8}\]|\$c)/);
    let color: string | undefined;
    const spans: React.ReactNode[] = [];
    parts.forEach((part, i) => {
      const colorMatch = part.match(/^\$c\[([0-9A-Fa-f]{6})[0-9A-Fa-f]{2}\]$/);
      if (colorMatch) {
        color = `#${colorMatch[1]}`;
      } else if (part === "$c") {
        color = undefined;
      } else if (part) {
        spans.push(
          <span key={i} style={{ color }}>
            {part}
          </span>,
        );
      }
    });
    return (
      <Fragment key={lineIdx}>
        {spans}
        {lineIdx < lines.length - 1 && <br />}
      </Fragment>
    );
  });
};

const SkillPage = () => {
  const [tab, setTab] = useState("0");
  const enums = useEnums();
  const handleChange = (event: SyntheticEvent, newTab: string) => setTab(newTab);

  return (
    <DataDetail
      endpoint={`${getBaseUrl("chuni", "skill/skill.json")}`}
      render={(skill: Skill) => (
        <Fragment>
          <Typography variant="h4">{skill.name}</Typography>
          <Stack direction="row" spacing={1} sx={{ marginY: 1 }}>
            {skill.rareType === 1 && (
              <Chip color="warning" label="Rare" />
            )}
            {skill.targetCharas.map((chara) => (
              <Chip
                key={chara.id}
                label={chara.name}
                component={Link}
                href={`/chuni/chara/${chara.id}`}
                clickable
              />
            ))}
          </Stack>
          <InfoTable
            rows={[
              ["ID", skill.id],
              [
                "Category",
                <Stack key="category" direction="row" spacing={1} sx={{ justifyContent: "flex-end", alignItems: "center" }}>
                  <img src={spriteUrl("skillCategory", skill.category)} alt="" width={32} height={32} />
                  <span>{intLabel(enums, "skill.category", skill.category)}</span>
                </Stack>,
              ],
              ["Max Level", skill.maxLv],
              ["Price", skill.price],
              ["Use Limit", skill.useLimit ? skill.useNum : "Unlimited"],
              ["Extra Uses per Level", skill.growthUseNum || null],
              ["Owned by Default", skill.defaultHave ? "Yes" : null],
            ]}
          />

          {skill.substances && skill.substances.length > 0 && (
            <>
              <Typography variant="h5" sx={{ marginTop: 3, marginBottom: 1 }}>
                Effects
              </Typography>
              <SkillEffects substances={skill.substances} enums={enums} />
            </>
          )}

          {skill.explainText.length > 0 && (
            <>
              <Typography variant="h5" sx={{ marginTop: 3 }}>
                Description
              </Typography>
              <TabContext value={tab}>
                <Paper sx={{ maxWidth: 800 }}>
                  <Tabs value={tab} onChange={handleChange} variant="scrollable" scrollButtons>
                    {skill.explainText.map((_, idx) => (
                      <Tab key={idx} label={`Lv.${idx + 1}`} value={String(idx)} />
                    ))}
                  </Tabs>
                </Paper>
                {skill.explainText.map((text, idx) => (
                  <TabPanel key={idx} value={String(idx)} sx={{ maxWidth: 800 }}>
                    <Typography>{renderDescription(text)}</Typography>
                  </TabPanel>
                ))}
              </TabContext>
            </>
          )}
        </Fragment>
      )}
    />
  );
};

export default SkillPage;
