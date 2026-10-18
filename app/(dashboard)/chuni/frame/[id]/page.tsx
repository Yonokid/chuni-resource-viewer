"use client";
import { Frame } from "../page";
import DataDetail from "@/app/Components/DataDetail";
import InfoTable from "@/app/Components/InfoTable";
import { getBaseUrl } from "@/app/utils/global";
import { Fragment } from "react";
import { Box, Typography } from "@mui/material";

const FramePage = () => {
  return (
    <DataDetail
      endpoint={`${getBaseUrl("chuni", "frame/frame.json")}`}
      render={(item: Frame) => (
        <Fragment>
          <Box sx={{ mb: 2 }}>
            <img src={getBaseUrl("chuni", `frame/${item.image}`)} alt="" style={{ maxWidth: "100%" }} />
          </Box>
          <Typography variant="h4">{item.name}</Typography>
          <Typography variant="subtitle1" sx={{ marginBottom: 2, whiteSpace: "pre-line" }}>
            {item.explainText}
          </Typography>
          <InfoTable rows={[["ID", item.id], ["Owned by default", item.defaultHave ? "Yes" : null]]} />
        </Fragment>
      )}
    />
  );
};

export default FramePage;
