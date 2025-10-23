import React, { useState, useEffect } from "react";
import { fetchEvents } from "./services/api";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import MyCalendar from "./pages/MyCalendar.jsx";
import { claimTicket, getUserTickets } from "./services/tickets";

export default function App() {
    // ---------- AUTH ----------
    const [page, setPage] = useState("login");
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem("user");
        return saved ? JSON.parse(saved) : null;
    });

    // ---------- EVENTS ----------
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({
        date: "",
        category: "",
        organization: "",
    });
    const [selectedEvent, setSelectedEvent] = useState(null);

    // ---------- VIEW ----------
    const [view, setView] = useState("events");
    const [calendarTickets, setCalendarTickets] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: "",
        description: "",
        date: "",
        duration: "",
        category: "",
        organization: "",
        capacity: "",
        ticketType: "",
    });

    const inputStyle = {
        padding: "10px",
        borderRadius: "6px",
        border: "1px solid #3b82f6",
        background: "#0f1729",
        color: "white",
    };

    // ---------- FETCH EVENTS ----------
    useEffect(() => {
        const loadEvents = async () => {
            try {
                const data = await fetchEvents(filters);
                setEvents(data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching events:", err);
                setError("Failed to load events. Please try again later.");
                setLoading(false);
            }
        };
        loadEvents();
    }, [filters]);

    // ---------- FILTER ----------
    const handleClearFilters = () => {
        setSearchTerm("");
        setFilters({ date: "", category: "", organization: "" });
    };

    const filteredEvents = events.filter((event) => {
        const s = searchTerm.toLowerCase();
        const matchesSearch =
            !s ||
            event.title.toLowerCase().includes(s) ||
            event.description.toLowerCase().includes(s);
        const matchesCat =
            !filters.category || event.category === filters.category;
        const matchesOrg =
            !filters.organization || event.organization === filters.organization;
        return matchesSearch && matchesCat && matchesOrg;
    });

    // ---------- CREATE EVENT ----------
    const handleCreateEvent = async (e) => {
        e.preventDefault();

        const payload = {
            ...newEvent,
            duration: newEvent.duration ? Number(newEvent.duration) : undefined,
            capacity: newEvent.capacity ? Number(newEvent.capacity) : undefined,
            date: new Date(newEvent.date),
        };

        try {
            const res = await fetch("/api/events", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || "Failed to create event");
            }

            const data = await res.json();
            setEvents((prev) => [...prev, data.event]);
            alert("✅ Event created successfully!");
            setShowCreateForm(false);

            setNewEvent({
                title: "",
                description: "",
                date: "",
                duration: "",
                category: "",
                organization: "",
                capacity: "",
                ticketType: "",
            });
        } catch (err) {
            console.error(err);
            alert("❌ Error: " + err.message);
        }
    };

    // ---------- AUTH ----------
    if (!user) {
        if (page === "register")
            return <Register goToLogin={() => setPage("login")} />;
        return (
            <Login
                onLoginSuccess={(u) => {
                    setUser(u);
                    localStorage.setItem("user", JSON.stringify(u));
                }}
                goToRegister={() => setPage("register")}
            />
        );
    }

    // ---------- LOADING ----------
    if (loading)
        return <div style={styles.loading}>Loading events...</div>;

    if (error)
        return (
            <div style={{ color: "red", textAlign: "center", padding: "50px" }}>
                {error}
            </div>
        );

    // ---------- CALENDAR VIEW ----------
    if (view === "calendar") {
        return (
            <MyCalendar
                userEmail={user.email}
                tickets={calendarTickets}
                goBack={() => setView("events")}
            />
        );
    }

    // ---------- EVENT DETAILS ----------
    if (selectedEvent) {
        return (
            <div style={{ minHeight: "100vh", background: "#0f1729", padding: "60px 40px" }}>
                <div style={{ maxWidth: "900px", margin: "0 auto" }}>
                    <button onClick={() => setSelectedEvent(null)} style={styles.backBtn}>
                        ← Back to Events
                    </button>

                    <div style={styles.eventCard}>
                        <h1 style={styles.eventTitle}>{selectedEvent.title}</h1>
                        <p style={{ color: "#e2e8f0", marginBottom: "20px" }}>
                            {selectedEvent.description}
                        </p>
                        <p style={styles.info}>
                            <strong>Date:</strong>{" "}
                            {new Date(selectedEvent.date).toLocaleString()}
                        </p>
                        {selectedEvent.duration && (
                            <p style={styles.info}>
                                <strong>Duration:</strong> {selectedEvent.duration} minutes
                            </p>
                        )}
                        {selectedEvent.category && (
                            <p style={styles.info}>
                                <strong>Category:</strong> {selectedEvent.category}
                            </p>
                        )}
                        {selectedEvent.organization && (
                            <p style={styles.info}>
                                <strong>Organization:</strong> {selectedEvent.organization}
                            </p>
                        )}

                        <div style={{ display: "flex", gap: "20px", marginTop: "40px" }}>
                            <button
                                style={styles.greenBtn}
                                onClick={async () => {
                                    try {
                                        await claimTicket(selectedEvent._id, user.email);
                                        alert("✅ Ticket claimed! Added to your calendar.");
                                    } catch (err) {
                                        alert("❌ " + err.message);
                                    }
                                }}
                            >
                                Claim Ticket
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ---------- MAIN EVENTS PAGE ----------
    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#0f1729",
                color: "white",
                padding: "60px",
                fontFamily: "'Space Grotesk', sans-serif",
            }}
        >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h1 style={styles.heading}>Campus Events</h1>

                <div style={{ display: "flex", gap: "10px" }}>
                    <button
                        onClick={() => setShowCreateForm(true)}
                        style={{
                            background: "#22c55e",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            padding: "8px 12px",
                            cursor: "pointer",
                        }}
                    >
                        + Create Event
                    </button>

                    <button
                        onClick={async () => {
                            if (view === "calendar") return setView("events");
                            try {
                                const data = await getUserTickets(user.email);
                                setCalendarTickets(data);
                                setView("calendar");
                            } catch (err) {
                                alert("Error loading your calendar: " + err.message);
                            }
                        }}
                        style={{
                            background: "#3b82f6",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            padding: "8px 12px",
                            cursor: "pointer",
                        }}
                    >
                        My Calendar
                    </button>

                    <button
                        onClick={() => {
                            localStorage.removeItem("user");
                            setUser(null);
                        }}
                        style={styles.logoutBtn}
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* CREATE EVENT FORM (popup) */}
            {showCreateForm && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        background: "rgba(0,0,0,0.7)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 9999,
                    }}
                >
                    <form
                        onSubmit={handleCreateEvent}
                        style={{
                            background: "#1e293b",
                            padding: "30px",
                            borderRadius: "12px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                            width: "400px",
                        }}
                    >
                        <h2 style={{ color: "white", textAlign: "center" }}>Create New Event</h2>

                        <label style={{ color: "white" }}>Title</label>
                        <input
                            type="text"
                            required
                            placeholder="Event title"
                            value={newEvent.title}
                            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                            style={inputStyle}
                        />

                        <label style={{ color: "white" }}>Description</label>
                        <textarea
                            required
                            placeholder="Describe your event"
                            value={newEvent.description}
                            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                            style={{ ...inputStyle, height: "70px" }}
                        />

                        <label style={{ color: "white" }}>Date & Time</label>
                        <input
                            type="datetime-local"
                            required
                            value={newEvent.date}
                            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                            style={inputStyle}
                        />

                        <label style={{ color: "white" }}>Duration (minutes)</label>
                        <input
                            type="number"
                            required
                            min="1"
                            placeholder="60"
                            value={newEvent.duration}
                            onChange={(e) => setNewEvent({ ...newEvent, duration: e.target.value })}
                            style={inputStyle}
                        />

                        <label style={{ color: "white" }}>Category</label>
                        <select
                            value={newEvent.category}
                            onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                            style={inputStyle}
                        >
                            <option value="">Select category</option>
                            <option value="Music">Music</option>
                            <option value="Career">Career</option>
                            <option value="Sports">Sports</option>
                            <option value="Education">Education</option>
                            <option value="General">General</option>
                        </select>

                        <label style={{ color: "white" }}>Organization</label>
                        <input
                            type="text"
                            placeholder="Ex: Student Union"
                            value={newEvent.organization}
                            onChange={(e) => setNewEvent({ ...newEvent, organization: e.target.value })}
                            style={inputStyle}
                        />

                        <label style={{ color: "white" }}>Capacity</label>
                        <input
                            type="number"
                            min="1"
                            placeholder="100"
                            value={newEvent.capacity}
                            onChange={(e) => setNewEvent({ ...newEvent, capacity: e.target.value })}
                            style={inputStyle}
                        />

                        <label style={{ color: "white" }}>Ticket Type</label>
                        <select
                            required
                            value={newEvent.ticketType}
                            onChange={(e) => setNewEvent({ ...newEvent, ticketType: e.target.value })}
                            style={inputStyle}
                        >
                            <option value="">Select type</option>
                            <option value="free">Free</option>
                            <option value="paid">Paid</option>
                        </select>

                        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                            <button
                                type="submit"
                                style={{
                                    flex: 1,
                                    background: "#22c55e",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "8px",
                                    padding: "10px",
                                    cursor: "pointer",
                                }}
                            >
                                Create
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowCreateForm(false)}
                                style={{
                                    flex: 1,
                                    background: "#ef4444",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "8px",
                                    padding: "10px",
                                    cursor: "pointer",
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.search}
            />

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                    gap: "25px",
                }}
            >
                {filteredEvents.map((event) => (
                    <div
                        key={event._id}
                        onClick={() => setSelectedEvent(event)}
                        style={styles.card}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.transform = "scale(1.03)")
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.transform = "scale(1)")
                        }
                    >
                        <h3 style={styles.cardTitle}>{event.title}</h3>
                        <p style={{ color: "#cbd5e1", fontWeight: "500" }}>
                            {event.description}
                        </p>
                        <p style={styles.cardFooter}>
                            {new Date(event.date).toLocaleDateString()} •{" "}
                            {event.category || "General"}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}


// ---------- STYLES ----------
const styles = {
    loading: {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#3b82f6",
        fontSize: "1.5rem",
        fontWeight: "700",
        fontFamily: "Space Grotesk, sans-serif",
    },
    heading: {
        fontSize: "3rem",
        background:
            "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #06b6d4 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
    },
    logoutBtn: {
        height: "40px",
        padding: "0 16px",
        background: "#ef4444",
        border: "none",
        color: "#fff",
        borderRadius: "8px",
        cursor: "pointer",
    },
    backBtn: {
        padding: "15px 30px",
        background: "linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)",
        color: "white",
        border: "none",
        borderRadius: "12px",
        fontSize: "1.1rem",
        fontWeight: "700",
        cursor: "pointer",
        marginBottom: "40px",
    },
    eventCard: {
        background:
            "linear-gradient(135deg, rgba(30,41,59,0.95) 0%, rgba(20,27,45,0.95) 100%)",
        borderRadius: "25px",
        padding: "50px",
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
    },
    eventTitle: {
        background: "linear-gradient(135deg, #3b82f6 0%, #84cc16 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        fontSize: "3rem",
        marginBottom: "30px",
        fontFamily: "'Archivo Black', sans-serif",
    },
    info: { color: "#60a5fa", marginBottom: "10px" },
    greenBtn: {
        flex: 1,
        padding: "15px 25px",
        background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        color: "white",
        border: "none",
        borderRadius: "12px",
        fontSize: "1rem",
        fontWeight: "700",
        cursor: "pointer",
    },
    search: {
        width: "100%",
        padding: "15px 20px",
        borderRadius: "10px",
        border: "2px solid #3b82f6",
        background: "rgba(15, 23, 41, 0.9)",
        color: "white",
        fontSize: "1rem",
        marginBottom: "30px",
    },
    card: {
        background:
            "linear-gradient(135deg, rgba(30,41,59,0.95) 0%, rgba(20,27,45,0.95) 100%)",
        borderRadius: "20px",
        padding: "25px",
        cursor: "pointer",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        boxShadow:
            "0 4px 10px rgba(0,0,0,0.2), 0 6px 20px rgba(0,0,0,0.3)",
    },
    cardTitle: {
        fontFamily: "'Archivo Black', sans-serif",
        background: "linear-gradient(135deg, #3b82f6 0%, #84cc16 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        fontSize: "1.5rem",
        marginBottom: "10px",
    },
    cardFooter: { marginTop: "10px", color: "#06b6d4", fontSize: "0.9rem" },
};
