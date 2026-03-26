"use client";
import { Skill } from "../page";
import DataDetail from "@/app/Components/DataDetail";
import { getBaseUrl } from "@/app/utils/global";

const SkillPage = () => {
  return (
    <DataDetail
      endpoint={`${getBaseUrl("chuni", "skill/skill.json")}`}
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
