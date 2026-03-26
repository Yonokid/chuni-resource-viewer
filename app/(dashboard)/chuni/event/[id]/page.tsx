"use client";
import { Event } from "../page";
import DataDetail from "@/app/Components/DataDetail";
import Image from "next/image";
import { getBaseUrl } from "@/app/utils/global";

const EventPage = () => {
  return (
    <DataDetail
      endpoint={getBaseUrl("chuni", "event/event.json")}
      render={(event: Event) => (
        <div>
          <h2>{event.name}</h2>
          <p>{event.id}</p>
          <Image
            src={getBaseUrl("chuni", `event/${event.eventBannerName}.webp`)}
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
