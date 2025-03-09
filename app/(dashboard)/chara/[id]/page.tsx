"use client";
import { Chara } from "../page";
import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  Typography,
} from "@mui/material";
import Image from "next/image";
import DataDetail from "@/app/Components/DataDetail";
import React, { Fragment } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "./AccordionTheming";
import { getVersion, getAbsolutePath } from "@/app/utils/global";
import { SERVER_URL } from "@/app/utils/global";

const directory = getAbsolutePath(`../${getVersion()}/chara`);
const CharaPage = () => {
  const [expanded, setExpanded] = React.useState<string | false>("panel1");
  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };
  return (
    <DataDetail
      endpoint={`${SERVER_URL}/${directory}/chara.json`}
      render={(chara: Chara) => (
        <>
          <Image
            src={`${SERVER_URL}/${getAbsolutePath(`../chara`)}/CHU_UI_Character_${(parseInt(chara.id, 10) / 10).toString().padStart(4, "0")}_00_00.webp`}
            alt="Jacket"
            width="1080"
            height="1080"
          ></Image>
          <List>
            <ListItem>{chara.name}</ListItem>
            <Divider component="li" />
            <ListItem>{chara.id}</ListItem>
            <Divider component="li" />
            <ListItem>{chara.illustratorName}</ListItem>
            <ListItemButton component="a" href={`/skill/${chara.skillId}`}>
              {chara.firstSkill}
            </ListItemButton>
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
