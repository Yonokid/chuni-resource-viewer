"use client";
import { Trophy } from "../page";
import DataDetail from "@/app/Components/DataDetail";
import { getVersion, getAbsolutePath } from "@/app/utils/global";

const directory = getAbsolutePath(`../${getVersion()}/trophy`);
const TrophyPage = () => {
  return (
    <DataDetail
      endpoint={`${directory}/trophy.json`}
      render={(trophy: Trophy) => (
        <div>
          <h2>{trophy.name}</h2>
          <p>{trophy.id}</p>
          <p>{trophy.explainText}</p>
        </div>
      )}
    />
  );
};

export default TrophyPage;
