"use client";
import { Ticket } from "../page";
import DataDetail from "@/app/Components/DataDetail";
import { getVersion, getAbsolutePath } from "@/app/utils/global";
import { SERVER_URL } from "@/app/utils/global";

const directory = getAbsolutePath(`../${getVersion()}/ticket`);
const TicketPage = () => {
  return (
    <DataDetail
      endpoint={`${SERVER_URL}/${directory}/ticket.json`}
      render={(ticket: Ticket) => (
        <div>
          <h2>{ticket.name}</h2>
          <p>{ticket.id}</p>
          <p>{ticket.explainText}</p>
        </div>
      )}
    />
  );
};

export default TicketPage;
