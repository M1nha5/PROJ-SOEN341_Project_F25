import React from "react";
import { Button } from "./ui/button";

export default function AdminPendingList({ users = [], onApprove, onReject }) {
    if (!users.length) {
        return (
            <div className="bg-white border rounded-xl p-5 shadow-sm text-gray-600">
                No pending organizers.
            </div>
        );
    }

    return (
        <div className="bg-white border rounded-xl p-3 shadow-sm">
            <table className="w-full text-sm">
                <thead>
                <tr className="text-left text-gray-600">
                    <th className="p-2">Name</th>
                    <th className="p-2">Email</th>
                    <th className="p-2">Status</th>
                    <th className="p-2 w-40">Actions</th>
                </tr>
                </thead>
                <tbody>
                {users.map(u => (
                    <tr key={u._id} className="border-t">
                        <td className="p-2 font-medium">{u.name}</td>
                        <td className="p-2">{u.email}</td>
                        <td className="p-2">{u.status}</td>
                        <td className="p-2 flex gap-2">
                            <Button onClick={() => onApprove?.(u)} className="px-3 py-1">Approve</Button>
                            <Button variant="outline" onClick={() => onReject?.(u)} className="px-3 py-1">Reject</Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
