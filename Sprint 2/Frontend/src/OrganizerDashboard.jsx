import React from "react";

const OrganizerDashboard = () => {
  const mockData = [
    { id: 1, event: "Hackathon", ticketsIssued: 80, remaining: 20 },
    { id: 2, event: "Music Night", ticketsIssued: 45, remaining: 55 },
    { id: 3, event: "Tech Talk", ticketsIssued: 60, remaining: 40 },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2>Organizer Dashboard</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        {mockData.map((event) => (
          <div
            key={event.id}
            style={{
              backgroundColor: "#f3f4f6",
              borderRadius: "12px",
              padding: "20px",
              textAlign: "center",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            <h3>{event.event}</h3>
            <p>Tickets Issued: {event.ticketsIssued}</p>
            <p>Remaining Capacity: {event.remaining}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrganizerDashboard;

