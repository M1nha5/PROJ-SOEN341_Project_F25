import React from "react";
import Sidebar from "./Sidebar";

export default function DashboardLayout({ sidebarTitle, sidebarItems, children }) {
    return (
        <div className="flex">
            {/* Fixed Sidebar */}
            <div className="fixed left-0 top-0 h-screen w-64 border-r bg-white shadow-sm z-20">
                <Sidebar title={sidebarTitle} items={sidebarItems} />
            </div>

            {/* Scrollable Main Content */}
            <main className="ml-64 flex-1 min-h-screen bg-gray-50 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
