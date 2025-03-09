"use client";
import { Trophy } from "../page";
import DataDetail from "@/app/Components/DataDetail";
import { getVersion, getAbsolutePath } from "@/app/utils/global";
import { SERVER_URL } from "@/app/layout";

const directory = getAbsolutePath(`../${getVersion()}/trophy`);
const TrophyPage = () => {
  return (
    <DataDetail
      endpoint={`${SERVER_URL}/${directory}/trophy.json`}
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
