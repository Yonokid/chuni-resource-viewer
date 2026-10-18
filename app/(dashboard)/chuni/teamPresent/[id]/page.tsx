"use client";
import { TeamPresent } from "../page";
import DataDetail from "@/app/Components/DataDetail";
import AssetLink from "@/app/Components/AssetLink";
import InfoTable from "@/app/Components/InfoTable";
import { getBaseUrl } from "@/app/utils/global";
import { intLabel, useEnums } from "@/app/utils/enums";
import { Fragment } from "react";
import { Typography } from "@mui/material";

const TeamPresentPage = () => {
  const enums = useEnums();
  return (
    <DataDetail
      endpoint={`${getBaseUrl("chuni", "teamPresent/teamPresent.json")}`}
      render={(item: TeamPresent) => (
        <Fragment>
          <Typography variant="h4" sx={{ marginBottom: 2 }}>
            {item.name}
          </Typography>
          <InfoTable
            rows={[
              ["ID", item.id],
              ["Category", intLabel(enums, "teamPresent.category", item.category)],
              ["Present", <AssetLink key="present" type="present" asset={item.present} />],
              ["Quantity", item.itemNum],
              ["Team points needed", item.needTeamPoint],
            ]}
          />
        </Fragment>
      )}
    />
  );
};

export default TeamPresentPage;
