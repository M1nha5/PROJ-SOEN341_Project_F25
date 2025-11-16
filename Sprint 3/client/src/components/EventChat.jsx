// client/src/components/EventChat.jsx
import React, { useEffect, useState } from "react";

export default function EventChat({ eventId, isOrganizer = false }) {
    const STORAGE_KEY = `chat_${eventId}`;

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        setMessages(JSON.parse(saved));
    }
}, [STORAGE_KEY]);

    function saveMessages(updated) {
        setMessages(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }

    function sendMessage(isOrgMsg = false) {
        if (!input.trim()) return;

        const newMsg = {
            id: Date.now(),
            text: input,
            user: isOrgMsg ? "Organizer" : "You",
            timestamp: new Date().toLocaleString(),
            isOrganizer: isOrgMsg,
        };

        const updated = [...messages, newMsg];
        saveMessages(updated);
        setInput("");
    }

    function reportMessage(id) {
        alert("Message reported ✔ (mock action)");
    }

    function clearChat() {
        localStorage.removeItem(STORAGE_KEY);
        setMessages([]);
    }

    return (
        <div className="mt-4">
            {/* Title */}
            <h3 className="text-lg font-semibold mb-3">💬 Event Chat / Q&A</h3>

            {/* Chat box */}
            <div className="h-56 overflow-y-auto border rounded-xl p-3 bg-gray-50 shadow-inner">
                {messages.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center mt-4">
                        No messages yet.
                    </p>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`mb-3 p-3 rounded-xl shadow-sm ${
                                msg.isOrganizer
                                    ? "bg-blue-100 border-l-4 border-blue-500"
                                    : "bg-white"
                            }`}
                        >
                            <div className="font-semibold text-gray-800">
                                {msg.user}
                                <span className="text-xs text-gray-500 ml-1">
                                    {msg.timestamp}
                                </span>
                            </div>
                            <div className="text-gray-700">{msg.text}</div>

                            {/* Report Button */}
                            <button
                                onClick={() => reportMessage(msg.id)}
                                className="text-xs text-red-500 underline mt-1"
                            >
                                Report
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Input */}
            <div className="mt-3 flex gap-2">
                <input
                    className="flex-1 border rounded-xl p-2 text-sm shadow-sm"
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />

                <button
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-xl shadow hover:opacity-90"
                    onClick={() => sendMessage(false)}
                >
                    Send
                </button>
            </div>

            {/* Organizer-only button */}
            {isOrganizer && (
                <button
                    className="text-sm text-blue-700 mt-2 underline"
                    onClick={() => sendMessage(true)}
                >
                    + Send as Organizer
                </button>
            )}

            <button
                className="text-red-500 text-sm mt-3 underline block"
                onClick={clearChat}
            >
                Clear Chat History
            </button>
        </div>
    );
}
