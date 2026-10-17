import { Box } from "@mui/material";
import { spriteUrl } from "@/app/utils/enums";
import type { Ticket } from "@/app/(dashboard)/chuni/ticket/page";

/** Banner for the ticket type, with the PRESENT ribbon on present tickets. Types without a banner render nothing. */
const TicketBanner = ({ ticket, width }: { ticket: Ticket; width: number }) => (
  <Box sx={{ position: "relative", width, flexShrink: 0, lineHeight: 0, "&:has(img[hidden])": { display: "none" } }}>
    <img src={spriteUrl("ticketType", ticket.type)} alt="" style={{ width: "100%" }} onError={(e) => (e.currentTarget.hidden = true)} />
    {ticket.name.includes("プレゼント") && (
      <img src={spriteUrl("ticketPresent", 0)} alt="Present" style={{ position: "absolute", top: 0, right: 0, width: "23%" }} />
    )}
  </Box>
);

export default TicketBanner;
