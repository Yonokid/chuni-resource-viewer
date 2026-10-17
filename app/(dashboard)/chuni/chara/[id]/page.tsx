"use client";
import { Chara } from "../page";
import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  Typography,
  Chip,
  Stack,
  Table,
  TableBody,
  TableRow,
  TableCell,
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
  const [expanded, setExpanded] = React.useState<string | false>("panel1");
  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };
  return (
    <DataDetail
      endpoint={getBaseUrl("chuni", "chara/chara.json")}
      render={(chara: Chara) => (
        <>
          <Image
            src={getBaseUrl(
              "chuni",
              `chara/CHU_UI_Character_${(chara.id / 10).toString().padStart(4, "0")}_00_00.webp`,
            )}
            alt="Jacket"
            width="1080"
            height="1080"
          ></Image>
          <Stack direction="row" spacing={1} sx={{ marginTop: 1 }}>
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
          <InfoTable
            rows={[
              ["Works", chara.works],
              ["How to Obtain", chara.explainText && renderLines(chara.explainText)],
              ["Owned by Default", chara.defaultHave ? "Yes" : null],
              ["Release", chara.releaseTagName],
            ]}
          />
          <List>
            <ListItem>{chara.name}</ListItem>
            <Divider component="li" />
            <ListItem>{chara.id}</ListItem>
            <Divider component="li" />
            <ListItem>{chara.illustratorName}</ListItem>
            <ListItemButton component="a" href={`/chuni/skill/${chara.skillId}`}>
              {chara.firstSkill}
            </ListItemButton>
            {chara.ranks.some((r) => r.skill) && (
              <>
                <Divider component="li" />
                <ListItem>
                  <Typography variant="subtitle2">Rank-up Skills</Typography>
                </ListItem>
                <Table>
                  <TableBody>
                    {chara.ranks
                      .filter((r) => r.skill)
                      .map((r) => (
                        <TableRow key={r.index}>
                          <TableCell>Rank {r.index}</TableCell>
                          <TableCell align="right">
                            <AssetLink type="skill" asset={r.skill!} />
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </>
            )}
            {chara.flavorText.map((text: string, index: number) => (
              <Accordion onChange={handleChange(`panel-${index}`)} key={index}>
                <AccordionSummary
                  aria-controls={`panel-${index}-content`}
                  id={`panel-${index}-header`}
                >
                  <Typography component="span">
                    Flavor Text {index + 1}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography component="span">
                    {text.split(/\n|\$n/).map((line, i, arr) => (
                      <Fragment key={i}>
                        {line}
                        {i < arr.length - 1 && <br />}
                      </Fragment>
                    ))}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </List>
        </>
      )}
    />
  );
};

export default CharaPage;
