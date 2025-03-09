"use client";
import { Stage } from "../page";
import DataDetail from "@/app/Components/DataDetail";
import { getVersion, getAbsolutePath } from "@/app/utils/global";
import { SERVER_URL } from "@/app/utils/global";

const directory = getAbsolutePath(`../${getVersion()}/stage`);
const StagePage = () => {
  return (
    <DataDetail
      endpoint={`${SERVER_URL}/${directory}/stage.json`}
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
