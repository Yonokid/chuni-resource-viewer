"use client";
import { Trophy } from "../page";
import DataDetail from "@/app/Components/DataDetail";
import { getVersion, getAbsolutePath } from "@/app/utils/global";
import { SERVER_URL } from "@/app/utils/global";
import AnimatedTitle from "../../../Components/AnimatedTitle";
import { Table, TableBody, TableRow, TableCell, Box } from "@mui/material";

const directory = getAbsolutePath(`../${getVersion()}/trophy`);
const TrophyPage = () => {
  return (
    <DataDetail
      endpoint={`${SERVER_URL}/${directory}/trophy.json`}
      render={(trophy: Trophy) => (
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
              </TableBody>
            </Table>
          </div>
        </>
      )}
    />
  );
};

export default TrophyPage;
