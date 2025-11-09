import React, { useState } from "react";
import { Button } from "./ui/button";

function fmtDate(dt) {
    try {
        const d = new Date(dt);
        if (isNaN(d)) return "TBA";
        return d.toLocaleString(undefined, {
            weekday: "short",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    } catch {
        return "TBA";
    }
}

function getStatus(startTime, endTime) {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (isNaN(start) || isNaN(end))
        return { key: "unknown", label: "Schedule TBD", color: "bg-gray-300 text-gray-800" };
    if (now < start) {
        const ms = start - now;
        const d = Math.floor(ms / 86400000);
        const h = Math.floor((ms % 86400000) / 3600000);
        return {
            key: "upcoming",
            label: d > 0 ? `Starts in ${d}d ${h}h` : "Starting soon",
            color: "bg-blue-100 text-blue-700",
        };
    }
    if (now > end)
        return { key: "ended", label: "Ended", color: "bg-gray-200 text-gray-600" };
    return { key: "active", label: "Active Now", color: "bg-green-100 text-green-700" };
}

export default function EventCard({ event = {}, onClaim, claimed = false }) {
    const [showPay, setShowPay] = useState(false);
    const {
        title = "Untitled Event",
        description = "",
        location = "TBA",
        startTime = null,
        endTime = null,
        maxSignups = 0,
        claimedCount = 0,
        priceType = "free",
        amount = 0,
        category = "",
    } = event || {};

    const status = getStatus(startTime, endTime);
    const safeMax = Math.max(1, Number(maxSignups) || 1);
    const safeClaimed = Math.max(0, Number(claimedCount) || 0);
    const remaining = Math.max(0, safeMax - safeClaimed);
    const pct = Math.min(100, Math.round((safeClaimed / safeMax) * 100));
    const priceLabel = priceType === "paid" ? `$${Number(amount).toFixed(2)}` : "Free";

    // Handle click depending on price type
    function handleClaimClick() {
        if (priceType === "paid") setShowPay(true);
        else onClaim && onClaim(event);
    }

    function confirmPayment() {
        setShowPay(false);
        // simulate payment success
        setTimeout(() => {
            onClaim && onClaim(event);
        }, 300);
    }

    return (
        <>
            {/* Event Card */}
            <div
                className={`relative flex flex-col rounded-2xl border p-6 shadow-sm transition-all duration-200 overflow-hidden ${
                    claimed
                        ? "bg-gradient-to-br from-green-50 to-green-100 border-green-300"
                        : "bg-white hover:shadow-lg hover:-translate-y-1"
                }`}
            >
                {/* claimed badge */}
                {claimed && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full shadow">
                        ✅ Registered
                    </div>
                )}

                {/* status badge */}
                {!claimed && (
                    <span
                        className={`absolute right-3 top-3 text-[11px] px-2 py-0.5 rounded-full font-medium ${status.color}`}
                    >
                        {status.label}
                    </span>
                )}

                <div className="flex-1 flex flex-col">
                    {/* category & price */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                        {category && (
                            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                                {category}
                            </span>
                        )}
                        <span
                            className={`text-xs px-2 py-1 rounded-full ${
                                priceType === "paid"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-gray-100 text-gray-700"
                            }`}
                        >
                            {priceLabel}
                        </span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 leading-snug mb-2 line-clamp-2">
                        {title}
                    </h3>

                    <div className="text-sm text-gray-600 space-y-1 mb-3">
                        <div>📅 {fmtDate(startTime)} – {fmtDate(endTime)}</div>
                        <div>📍 {location}</div>
                    </div>

                    {description && (
                        <p className="text-sm text-gray-700 leading-relaxed line-clamp-3 mb-4">
                            {description}
                        </p>
                    )}

                    {/* progress bar */}
                    <div className="mt-auto">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Spots</span>
                            <span>{safeClaimed}/{safeMax} ({remaining} left)</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all"
                                style={{ width: `${pct}%` }}
                            />
                        </div>

                        {/* button */}
                        <div className="mt-5 flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">
                                Ticket: <span className="text-gray-900">{priceLabel}</span>
                            </span>
                            <Button
                                disabled={claimed || status.key === "ended" || remaining === 0}
                                onClick={() => !claimed && handleClaimClick()}
                                className={`text-sm ${
                                    claimed
                                        ? "bg-green-500 hover:bg-green-600 text-white"
                                        : ""
                                }`}
                            >
                                {claimed
                                    ? "Already Registered"
                                    : remaining === 0
                                        ? "Sold Out"
                                        : status.key === "active"
                                            ? "Join Now"
                                            : priceType === "paid"
                                                ? "Pay & Register"
                                                : "Claim Ticket"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 💳 Payment Popup */}
            {showPay && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-sm text-center shadow-xl animate-fade-in">
                        <h3 className="text-lg font-semibold mb-3">Payment Required</h3>
                        <p className="text-gray-600 mb-4">
                            This event costs <b>${Number(amount).toFixed(2)}</b>.
                            Click below to confirm your payment.
                        </p>
                        <div className="flex justify-center gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setShowPay(false)}
                            >
                                Cancel
                            </Button>
                            <Button onClick={confirmPayment}>💳 Pay Now</Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
