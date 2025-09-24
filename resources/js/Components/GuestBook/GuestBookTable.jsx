// resources/js/Components/GuestBook/GuestBookTable.jsx

import React from "react";
import { Link } from "@inertiajs/react";
import { format } from "date-fns";
import { Button } from "@/Components/ui/button";

const GuestBookTable = ({ guestBooks, showActions = true, refreshData }) => {
    const formatTime = (timeStr) => {
        if (!timeStr) return "-";
        return timeStr;
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "-";
        return format(new Date(dateStr), "dd/MM/yyyy");
    };

    const handleUpdateCheckOut = (entryId) => {
        if (
            confirm(
                "Apakah kamu yakin akan melakukan check-out untuk tamu ini?"
            )
        ) {
            fetch(route("guestbook.update.checkout", entryId), {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                },
            })
                .then((response) => {
                    if (response.ok) {
                        if (refreshData) {
                            refreshData();
                        }
                    } else {
                        console.error(
                            "Failed to update check-out time:",
                            response.statusText
                        );
                        alert(
                            "Error updating check-out time. Please try again."
                        );
                    }
                })
                .catch((error) => {
                    console.error("Network error:", error);
                    alert("Network error. Please try again.");
                });
        }
    };

    if (!guestBooks || guestBooks.length === 0) {
        return (
            <p className="text-center text-gray-500">
                No guest book entries found.
            </p>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            No.
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nama Tamu
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tanggal
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Jam Masuk
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Jam Keluar
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Perusahaan
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Keperluan
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            User Tujuan
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Divisi User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            No. Identitas
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nama Penerima Tamu
                        </th>
                        {showActions && (
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Aksi
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {guestBooks.map((entry, index) => (
                        <tr key={entry.id}>
                            {/* ... (kolom data lainnya) ... */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {index + 1}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {entry.guest_name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(entry.visit_date)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatTime(entry.check_in_time)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {entry.check_out_time === null ? (
                                    <Button
                                        size="sm"
                                        className="bg-red-500 hover:bg-red-700 text-white"
                                        onClick={() =>
                                            handleUpdateCheckOut(entry.id)
                                        }
                                    >
                                        Check-out
                                    </Button>
                                ) : (
                                    formatTime(entry.check_out_time)
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {entry.company}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {entry.purpose}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {entry.user?.name || "N/A"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {entry.user?.division?.name || "N/A"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {entry.identity_number}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {entry.receptionist_name}
                            </td>
                            {showActions && (
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <Link
                                        href={route("guestbook.edit", entry.id)}
                                        className="mr-2"
                                    >
                                        <Button
                                            size="sm"
                                            className="bg-blue-500 text-white hover:bg-blue-700"
                                        >
                                            Edit
                                        </Button>
                                    </Link>

                                    <Button
                                        size="sm"
                                        className="bg-red-500 hover:bg-red-700 text-white"
                                    >
                                        Delete
                                    </Button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default GuestBookTable;
