import React, { useEffect, useState } from "react";
import { getUserTickets } from "../services/tickets";

export default function MyCalendar({ userEmail, goBack }) {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getUserTickets(userEmail);
                setTickets(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [userEmail]);

    if (loading)
        return (
            <div style={styles.center}>
                <p>Loading your calendar...</p>
            </div>
        );

    if (error)
        return (
            <div style={styles.center}>
                <p style={{ color: "red" }}>{error}</p>
            </div>
        );

    return (
        <div style={styles.page}>
            <div style={styles.header}>
                <h1 style={styles.heading}>My Calendar</h1>
                <button onClick={goBack} style={styles.backBtn}>
                    ← Back
                </button>
            </div>

            {tickets.length === 0 ? (
                <p style={{ textAlign: "center", marginTop: "40px" }}>
                    You haven’t claimed any tickets yet.
                </p>
            ) : (
                <div style={styles.grid}>
                    {tickets.map((ticket) => (
                        <div key={ticket._id} style={styles.card}>
                            <h3 style={styles.cardTitle}>
                                {ticket.eventId?.title || "Event"}
                            </h3>
                            <p style={{ color: "#cbd5e1" }}>
                                {ticket.eventId?.date
                                    ? new Date(ticket.eventId.date).toLocaleString()
                                    : "No date"}
                            </p>
                            <p style={{ marginTop: "5px", color: "#60a5fa" }}>
                                Claimed:{" "}
                                {new Date(ticket.claimedAt).toLocaleString()}
                            </p>

                            {ticket.qrCode && (
                                <div style={styles.qrContainer}>
                                    <img
                                        src={ticket.qrCode}
                                        alt="QR Code"
                                        style={styles.qrImg}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        background: "#0f1729",
        color: "white",
        padding: "60px",
        fontFamily: "'Space Grotesk', sans-serif",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px",
    },
    heading: {
        fontSize: "2.5rem",
        background:
            "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #06b6d4 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
    },
    backBtn: {
        padding: "10px 20px",
        background: "#3b82f6",
        color: "white",
        border: "none",
        borderRadius: "10px",
        cursor: "pointer",
        fontWeight: "600",
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "25px",
        marginTop: "20px",
    },
    card: {
        background:
            "linear-gradient(135deg, rgba(30,41,59,0.95) 0%, rgba(20,27,45,0.95) 100%)",
        borderRadius: "20px",
        padding: "25px",
        textAlign: "center",
        boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
        transition: "transform 0.3s ease",
    },
    cardTitle: {
        fontFamily: "'Archivo Black', sans-serif",
        background: "linear-gradient(135deg, #3b82f6 0%, #84cc16 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        fontSize: "1.5rem",
        marginBottom: "10px",
    },
    qrContainer: {
        marginTop: "15px",
        display: "flex",
        justifyContent: "center",
    },
    qrImg: {
        width: "120px",
        height: "120px",
        borderRadius: "10px",
        border: "2px solid #3b82f6",
    },
    center: {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        fontFamily: "'Space Grotesk', sans-serif",
    },
};
