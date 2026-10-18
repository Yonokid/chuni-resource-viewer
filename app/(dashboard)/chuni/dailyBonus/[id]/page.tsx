"use client";
import { DailyBonus } from "../page";
import DataDetail from "@/app/Components/DataDetail";
import InfoTable from "@/app/Components/InfoTable";
import { getBaseUrl } from "@/app/utils/global";
import { Fragment } from "react";
import { Typography } from "@mui/material";

const DailyBonusPage = () => {
  return (
    <DataDetail
      endpoint={`${getBaseUrl("chuni", "dailyBonus/dailyBonus.json")}`}
      render={(item: DailyBonus) => (
        <Fragment>
          <Typography variant="h4" sx={{ marginBottom: 2 }}>
            {item.name}
          </Typography>
          <InfoTable
            rows={[
              ["ID", item.id],
              ["Text", item.text],
              ...Object.entries(item.effects).map(
                ([block, values]): [string, string] => [
                  block.replace(/Data$/, ""),
                  Object.entries(values).map(([k, v]) => `${k}: ${v}`).join(", ") || "enabled",
                ],
              ),
            ]}
          />
        </Fragment>
      )}
    />
  );
};

export default DailyBonusPage;
