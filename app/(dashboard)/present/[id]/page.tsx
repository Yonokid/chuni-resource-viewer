"use client";
import { Present } from "../page";
import DataDetail from "@/app/Components/DataDetail";
import { getVersion, getAbsolutePath } from "@/app/utils/global";

const directory = getAbsolutePath(`../${getVersion()}/present`);
const PresentPage = () => {
  return (
    <DataDetail
      endpoint={`${directory}/present.json`}
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
