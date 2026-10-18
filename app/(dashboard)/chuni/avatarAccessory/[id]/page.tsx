"use client";
import { AvatarAccessory } from "../page";
import DataDetail from "@/app/Components/DataDetail";
import InfoTable from "@/app/Components/InfoTable";
import { getBaseUrl } from "@/app/utils/global";
import { intLabel, useEnums } from "@/app/utils/enums";
import { Fragment } from "react";
import { Box, Typography } from "@mui/material";

const AvatarAccessoryPage = () => {
  const enums = useEnums();
  return (
    <DataDetail
      endpoint={`${getBaseUrl("chuni", "avatarAccessory/avatarAccessory.json")}`}
      render={(item: AvatarAccessory) => (
        <Fragment>
          <Box sx={{ mb: 2 }}>
            <img src={getBaseUrl("chuni", `avatarAccessory/${item.image}`)} alt="" width={160} />
          </Box>
          <Typography variant="h4">{item.name}</Typography>
          <Typography variant="subtitle1" sx={{ marginBottom: 2, whiteSpace: "pre-line" }}>
            {item.explainText}
          </Typography>
          <InfoTable
            rows={[
              ["ID", item.id],
              ["Category", intLabel(enums, "avatarAccessory.category", item.category)],
              ["Layer", item.layerIndex],
              ["Owned by default", item.defaultHave ? "Yes" : null],
            ]}
          />
        </Fragment>
      )}
    />
  );
};

export default AvatarAccessoryPage;
