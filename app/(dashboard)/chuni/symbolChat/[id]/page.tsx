"use client";
import { SymbolChat } from "../page";
import DataDetail from "@/app/Components/DataDetail";
import InfoTable from "@/app/Components/InfoTable";
import { getBaseUrl } from "@/app/utils/global";
import { Fragment } from "react";
import { Typography } from "@mui/material";

const SymbolChatPage = () => {
  return (
    <DataDetail
      endpoint={`${getBaseUrl("chuni", "symbolChat/symbolChat.json")}`}
      render={(item: SymbolChat) => (
        <Fragment>
          <Typography variant="h4" sx={{ marginBottom: 2 }}>
            {item.name}
          </Typography>
          <InfoTable
            rows={[
              ["ID", item.id],
              ["Text", item.text],
              ["Balloon", item.balloonId],
              ["Scenes", item.scenes.join(", ")],
              ["Owned by default", item.defaultHave ? "Yes" : null],
              ["Description", item.explainText !== "-" ? item.explainText : null],
            ]}
          />
        </Fragment>
      )}
    />
  );
};

export default SymbolChatPage;
