// src/services/api.js
const API_URL = "/api"; // Proxy sends this to http://localhost:5000

export const fetchEvents = async (filters = {}) => {
    const params = new URLSearchParams();

    if (filters.category) params.append("category", filters.category);
    if (filters.organization) params.append("organization", filters.organization);
    if (filters.date) params.append("date", filters.date);

    const response = await fetch(`${API_URL}/events?${params.toString()}`);
    if (!response.ok) throw new Error("Failed to fetch events");

    return await response.json();
};
