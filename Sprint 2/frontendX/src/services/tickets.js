// services/tickets.js
const API_URL = "/api/tickets";

// POST /api/tickets/claim
export const claimTicket = async (eventId, userEmail) => {
    const res = await fetch(`${API_URL}/claim`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, userEmail }),
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to claim ticket");
    }

    return res.json();
};

// GET /api/tickets/:email
export const getUserTickets = async (userEmail) => {
    const res = await fetch(`${API_URL}/${userEmail}`);
    if (!res.ok) throw new Error("Failed to load user tickets");
    return res.json();
};
