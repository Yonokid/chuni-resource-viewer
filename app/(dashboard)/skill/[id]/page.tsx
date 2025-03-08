"use client";
import { Skill } from "../page";
import DataDetail from "@/app/Components/DataDetail";
import { getVersion, getAbsolutePath } from "@/app/utils/global";

const directory = getAbsolutePath(`../${getVersion()}/skill`);
const SkillPage = () => {
  return (
    <DataDetail
      endpoint={`${directory}/skill.json`}
      render={(skill: Skill) => (
        <div>
          <h2>{skill.name}</h2>
          <p>{skill.id}</p>
        </div>
      )}
    />
  );
};

export default SkillPage;
