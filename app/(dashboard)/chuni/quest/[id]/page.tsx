"use client";
import { Quest } from "../page";
import DataDetail from "@/app/Components/DataDetail";
import AssetLink from "@/app/Components/AssetLink";
import InfoTable from "@/app/Components/InfoTable";
import { getBaseUrl } from "@/app/utils/global";

const QuestPage = () => {
  return (
    <DataDetail
      endpoint={`${getBaseUrl("chuni", "quest/quest.json")}`}
      render={(quest: Quest) => (
        <div>
          <h2>{quest.name}</h2>
          <p>{quest.id}</p>
          <InfoTable
            rows={[
              ["Works", quest.charaWorks.map((w) => w.name).join(", ") || null],
              ["Characters", quest.charas.map((c) => c.name).join(", ") || null],
              ...quest.rewards.map((r): [string, React.ReactNode] => [
                `Rank ${r.sumRank}`,
                <span key={r.sumRank}>
                  <AssetLink type="trophy" asset={r.trophy} />
                  <AssetLink type="namePlate" asset={r.namePlate} />
                </span>,
              ]),
            ]}
          />
        </div>
      )}
    />
  );
};

export default QuestPage;
