import React from "react";

export default function StatsCard({ label, value, helper }) {
    return (
        <div className="rounded-lg border bg-white p-4 shadow-sm">
            <div className="text-sm text-gray-500">{label}</div>
            <div className="mt-1 text-2xl font-semibold">{value}</div>
            {helper ? <div className="mt-1 text-xs text-gray-500">{helper}</div> : null}
        </div>
    );
}
