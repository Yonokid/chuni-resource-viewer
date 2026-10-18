"use client";
import { Chara } from "../page";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import Image from "next/image";
import DataDetail from "@/app/Components/DataDetail";
import AssetLink from "@/app/Components/AssetLink";
import InfoTable from "@/app/Components/InfoTable";
import React, { Fragment } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "./AccordionTheming";
import { getBaseUrl } from "@/app/utils/global";
import Link from "next/link";

const renderLines = (text: string) =>
  text.split(/\n|\$n/).map((line, i, arr) => (
    <Fragment key={i}>
      {line}
      {i < arr.length - 1 && <br />}
    </Fragment>
  ));

const CharaPage = () => {
  return (
    <DataDetail
      endpoint={getBaseUrl("chuni", "chara/chara.json")}
      render={(chara: Chara) => (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4, alignItems: "flex-start" }}>
          <Paper
            variant="outlined"
            sx={{ flex: "1 1 320px", maxWidth: 480, overflow: "hidden", lineHeight: 0 }}
          >
            <Image
              src={getBaseUrl(
                "chuni",
                `chara/CHU_UI_Character_${(chara.id / 10).toString().padStart(4, "0")}_00_00.webp`,
              )}
              alt={chara.name}
              width="1080"
              height="1080"
              style={{ width: "100%", height: "auto" }}
            />
          </Paper>
          <Stack spacing={3} sx={{ flex: "1 1 360px", minWidth: 0 }}>
            <Box>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
                {chara.name}
              </Typography>
              <Typography color="text.secondary">
                #{chara.id} · Illustrated by {chara.illustratorName}
              </Typography>
              <Stack direction="row" spacing={1} useFlexGap sx={{ mt: 1, flexWrap: "wrap" }}>
                {chara.rareType === 1 && <Chip color="warning" label="Rare" />}
                {chara.addImages.map((c) => (
                  <Chip
                    key={c.id}
                    label={`Costume via ${c.name}`}
                    component={Link}
                    href={`/chuni/chara/${c.id}`}
                    clickable
                  />
                ))}
              </Stack>
            </Box>
            <Card variant="outlined">
              <CardActionArea component={Link} href={`/chuni/skill/${chara.skillId}`}>
                <CardContent>
                  <Typography variant="overline" color="text.secondary">
                    Skill
                  </Typography>
                  <Typography variant="h6">{chara.firstSkill}</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
            <InfoTable
              maxWidth={600}
              rows={[
                ["Works", chara.works],
                ["How to Obtain", chara.explainText && renderLines(chara.explainText)],
                ["Owned by Default", chara.defaultHave ? "Yes" : null],
                ["Release", chara.releaseTagName],
                ...chara.ranks
                  .filter((r) => r.skill)
                  .map((r): [string, React.ReactNode] => [
                    `Rank ${r.index} Skill`,
                    <AssetLink key={r.index} type="skill" asset={r.skill!} />,
                  ]),
              ]}
            />
            {chara.flavorText.length > 0 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Flavor Text
                </Typography>
                {chara.flavorText.map((text: string, index: number) => (
                  <Accordion key={index} defaultExpanded={index === 0}>
                    <AccordionSummary
                      aria-controls={`panel-${index}-content`}
                      id={`panel-${index}-header`}
                    >
                      <Typography component="span">Entry {index + 1}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography component="span">{renderLines(text)}</Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            )}
          </Stack>
        </Box>
      )}
    />
  );
};

export default CharaPage;
