"use client";
import { Title } from "../page";
import DataDetail from "@/app/Components/DataDetail";
import { getBaseUrl } from "@/app/utils/global";
import MaimaiTitle from "../../../../Components/MaimaiTitle";
import { Table, TableBody, TableRow, TableCell, Box } from "@mui/material";

const getUnlockTypeLabel = (
  unlockType: string,
  param: number,
  reference_id: number,
): string => {
  switch (unlockType) {
    case "RATING":
      return `Get a rating of ${param}`;
    case "CHARA_KAKUSEI":
      return `Get character ${reference_id} to rank ${param}`;
    case "MUSIC":
      return `Play ${reference_id} with these requirements`; //bad
    case "MAP_KYORI":
      return `Travel a distance of ${param}m`;
    case "DANNI":
      return `Clear ${reference_id}`;
    case "MAP_CHARA_KAKUSEI":
      return `Get characters from chiho to level ${param}`;
    case "TODOHUKEN":
      return `Play in the above prefecture`;
    case "LOGIN_RUIKEI":
      return `Login for ${param} days total`;
    case "LOGIN_RENZOKU":
      return `Login for ${param} days consecutively`;
    case "MUSIC_GROUP":
      return `Play these songs in a single credit`; //bad
    case "CHARA_KAISU":
      return `Awaken ${reference_id} ${param} times`;
    case "NPC_OTOMODACHI_N_REN_WIN":
      return `Get ${param} consecutive Otomodachi wins`;
    case "MAI2DX_N_PLAY":
      return `Play maimai DX`;
    case "ZENKOKU_OTOMODACHI_N_WIN":
      return `Win ${param} Otomodachi battles`;
    case "OTOMODACHI_WIN":
      return `Win against ${param} in Otomodachi`;
    case "NPC_OTOMODACHI_N_WIN":
      return `Win ${param} Otomodachi battles`;
    case "ZENKOKU_OTOMODACHI_N_REN_WIN":
      return `Get ${param} consecutive Otomodachi wins`;
    case "MAP_COMPLETE":
      return `Complete the ${reference_id} chiho`;
    case "TRACK_SKIP":
      return `Track skip the song ${reference_id}`;
    case "PARTNER":
      return `Equip ${reference_id} as a partner`;
    case "TOTAL_CHARA_KAKUSEI":
      return `Get all tour members to level ${param}`;
    case "MUSIC_GENRE_SELECTED":
      return `Select this song in the ${reference_id} genre`; //bad
    case "TITLESET_DP":
      return `Have both players equip these titles`; //bad
    case "MATCHING_FOR_TITLESETPLAYER":
      return `Equip these two titles in matching`; //bad
    case "FULLCOMBO_COUNT":
      return `Get ${param} Full Combos`;
    default:
      return `Transferred from maimai FiNALE or below`;
  }
};

const TitlePage = () => {
  return (
    <DataDetail
      endpoint={`${getBaseUrl("maimai", "title/title.json")}`}
      render={(title: Title) => (
        <>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <MaimaiTitle key={title.id} item={title} />
          </div>
          <div
            style={{ display: "flex", justifyContent: "center", padding: 10 }}
          >
            <Table sx={{ maxWidth: 800 }}>
              <TableBody>
                <TableRow>
                  <TableCell style={{ fontWeight: 600 }}>ID</TableCell>
                  <TableCell align="right">{title.id}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ fontWeight: 600 }}>Title</TableCell>
                  <TableCell align="right">{title.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ fontWeight: 600 }}>Description</TableCell>
                  <TableCell align="right">{title.normText}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ fontWeight: 600 }}>
                    Unlock Method
                  </TableCell>
                  <TableCell align="right">
                    {getUnlockTypeLabel(
                      title.unlock_type,
                      title.param,
                      title.reference_id,
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </>
      )}
    />
  );
};

export default TitlePage;
