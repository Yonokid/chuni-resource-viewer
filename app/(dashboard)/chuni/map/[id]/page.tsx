"use client";
import { Map } from "../page";
import DataDetail from "@/app/Components/DataDetail";
import Image from "next/image";
import { getBaseUrl } from "@/app/utils/global";

const MapPage = () => {
  return (
    <DataDetail
      endpoint={`${getBaseUrl("chuni", "map/map.json")}`}
      render={(map: Map) => (
        <div>
          <h2>{map.name}</h2>
          <p>{map.id}</p>
          <Image
            src={getBaseUrl("chuni", `map/${map.ddsMapName}`)}
            alt=" "
            width={1220}
            height={680}
          ></Image>
        </div>
      )}
    />
  );
};

export default MapPage;
