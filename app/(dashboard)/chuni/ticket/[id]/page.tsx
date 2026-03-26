"use client";
import { Ticket } from "../page";
import DataDetail from "@/app/Components/DataDetail";
import { getBaseUrl } from "@/app/utils/global";

const TicketPage = () => {
  return (
    <DataDetail
      endpoint={`${getBaseUrl("chuni", "ticket/ticket.json")}`}
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
