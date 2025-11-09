import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ title = "Dashboard", items = [] }) {
    const loc = useLocation();

    return (
        <aside className="flex flex-col h-full">
            <div className="p-6 border-b text-xl font-semibold text-blue-600">
                {title}
            </div>
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                {items.map(({ label, to, icon }) => (
                    <Link
                        key={to}
                        to={to}
                        className={`flex items-center gap-3 px-4 py-2 rounded-lg transition font-medium ${
                            loc.pathname === to
                                ? "bg-blue-100 text-blue-700"
                                : "text-gray-700 hover:bg-gray-100"
                        }`}
                    >
                        <span>{icon}</span> {label}
                    </Link>
                ))}
            </nav>
        </aside>
    );
}
