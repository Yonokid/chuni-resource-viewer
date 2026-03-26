"use client";
import { Present } from "../page";
import DataDetail from "@/app/Components/DataDetail";
import { getBaseUrl } from "@/app/utils/global";

const PresentPage = () => {
  return (
    <DataDetail
      endpoint={`${getBaseUrl("chuni", "present/present.json")}`}
      render={(present: Present) => (
        <div>
          <h2>{present.name}</h2>
          <p>{present.id}</p>
          <p>{present.messageText}</p>
        </div>
      )}
    />
  );
};

export default PresentPage;
