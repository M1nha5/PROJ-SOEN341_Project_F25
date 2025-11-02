import { Parser } from "json2csv";

export const generateCSV = (tickets) => {
  const fields = ["attendeeName", "attendeeEmail", "eventId", "validated"];
  const parser = new Parser({ fields });
  return parser.parse(tickets);
};
