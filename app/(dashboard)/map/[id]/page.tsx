"use client";
import { Map } from "../page";
import DataDetail from "@/app/Components/DataDetail";
import Image from "next/image";
import { getVersion, getAbsolutePath } from "@/app/utils/global";

const directory = getAbsolutePath(`../${getVersion()}/map`);
const MapPage = () => {
  return (
    <DataDetail
      endpoint={`${directory}/map.json`}
      render={(map: Map) => (
        <div>
          <h2>{map.name}</h2>
          <p>{map.id}</p>
          <Image
            src={`${directory}/${map.ddsMapName}`}
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
