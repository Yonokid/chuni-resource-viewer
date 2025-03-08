"use client";
import { Event } from "../page";
import DataDetail from "@/app/Components/DataDetail";
import Image from "next/image";
import { getVersion, getAbsolutePath } from "@/app/utils/global";

const directory = getAbsolutePath(`../${getVersion()}/event`);
const EventPage = () => {
  return (
    <DataDetail
      endpoint={`${directory}/event.json`}
      render={(event: Event) => (
        <div>
          <h2>{event.name}</h2>
          <p>{event.id}</p>
          <Image
            src={`${directory}/${event.eventBannerName}.webp`}
            alt=" "
            width={1240}
            height={640}
          ></Image>
        </div>
      )}
    />
  );
};

export default EventPage;
