"use client";
import { Stage } from "../page";
import DataDetail from "@/app/Components/DataDetail";
import { getBaseUrl } from "@/app/utils/global";

const StagePage = () => {
  return (
    <DataDetail
      endpoint={`${getBaseUrl("chuni", "stage/stage.json")}`}
      render={(stage: Stage) => (
        <div>
          <h2>{stage.name}</h2>
          <p>{stage.id}</p>
          <p>Please contact me if you believe you can add more to this page.</p>
        </div>
      )}
    />
  );
};

export default StagePage;
