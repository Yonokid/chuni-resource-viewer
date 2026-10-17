"use client";
import { Course } from "../page";
import DataDetail from "@/app/Components/DataDetail";
import AssetLink from "@/app/Components/AssetLink";
import { getBaseUrl } from "@/app/utils/global";
import { Fragment } from "react";
import { Typography, Table, TableBody, TableRow, TableCell } from "@mui/material";

const CoursePage = () => {
  return (
    <DataDetail
      endpoint={`${getBaseUrl("chuni", "course/course.json")}`}
      render={(course: Course) => (
        <Fragment>
          <Typography variant="h4">{course.name}</Typography>
          <Typography variant="subtitle1" sx={{ marginBottom: 2 }}>
            {course.difficulty.name}
          </Typography>
          <Table sx={{ maxWidth: 800 }}>
            <TableBody>
              <TableRow>
                <TableCell style={{ fontWeight: 600 }}>ID</TableCell>
                <TableCell align="right">{course.id}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ fontWeight: 600 }}>Rule</TableCell>
                <TableCell align="right">{course.rule?.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ fontWeight: 600 }}>Reward</TableCell>
                <TableCell align="right">
                  <AssetLink type="reward" asset={course.reward} />
                </TableCell>
              </TableRow>
              {course.reward2nd && (
                <TableRow>
                  <TableCell style={{ fontWeight: 600 }}>Second Reward</TableCell>
                  <TableCell align="right">
                    <AssetLink type="reward" asset={course.reward2nd} />
                  </TableCell>
                </TableRow>
              )}
              {course.infos.map((info, i) => (
                <TableRow key={i}>
                  <TableCell style={{ fontWeight: 600 }}>Song {i + 1}</TableCell>
                  <TableCell align="right">
                    {info.kind === "selectMusic" ? (
                      <Fragment>
                        <AssetLink type="music" asset={info.music} />
                        {info.difficulty && ` (${info.difficulty.name})`}
                      </Fragment>
                    ) : (
                      `Random ${info.fromLevel?.name}`
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Fragment>
      )}
    />
  );
};

export default CoursePage;
