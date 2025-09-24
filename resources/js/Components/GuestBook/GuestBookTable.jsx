// resources/js/Components/GuestBook/GuestBookTable.jsx

import React, { useState } from "react"; // Import useState
import { Link, usePage } from "@inertiajs/react"; // Import usePage untuk CSRF token
import { format } from "date-fns";
import { Button } from "@/Components/ui/button";
// Impor komponen dialog edit
import GuestBookEditDialog from "@/Components/GuestBook/GuestBookEditDialog";

const GuestBookTable = ({
    guestBooks,
    showActions = true,
    refreshData,
    users = [],
}) => {
    // Tambahkan users ke props
    // Ambil csrf_token dari shared props Inertia
    const { csrf_token } = usePage().props;

    // State untuk dialog edit
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [currentEntry, setCurrentEntry] = useState(null);

    const formatTime = (timeStr) => {
        if (!timeStr) return "-";
        return timeStr.substring(0, 5);
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
            // Gunakan token CSRF dari Inertia props
            fetch(route("guestbook.update.checkout", entryId), {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                    "X-CSRF-TOKEN": csrf_token, // Gunakan token dari Inertia props
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
                        response.text().then((text) => {
                            console.error("Error response body:", text);
                        });
                        alert(
                            "Error updating check-out time. Please check the console for details."
                        );
                    }
                })
                .catch((error) => {
                    console.error("Network error or fetch failed:", error);
                    alert(
                        "Network error or request failed. Please check the console for details."
                    );
                });
        }
    };

    // Fungsi untuk membuka dialog edit
    const openEditDialog = (entry) => {
        setCurrentEntry(entry); // Simpan data entry yang akan diedit
        setIsEditDialogOpen(true); // Buka dialog
    };

    // Fungsi untuk menutup dialog edit
    const closeEditDialog = () => {
        setIsEditDialogOpen(false); // Tutup dialog
        setCurrentEntry(null); // Kosongkan data entry
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
                            {/* Kolom data lainnya */}
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
                                    {/* Tombol Edit: Gunakan onClick untuk membuka dialog */}
                                    <Button
                                        size="sm"
                                        className="bg-blue-500 text-white hover:bg-blue-700 mr-2"
                                        onClick={() => openEditDialog(entry)} // Panggil fungsi openEditDialog
                                    >
                                        Edit
                                    </Button>

                                    {/* Tombol Delete */}
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

            {/* Render komponen dialog edit */}
            {/* Kirimkan data entry, users, state open/close, dan fungsi refresh */}
            <GuestBookEditDialog
                entry={currentEntry} // Kirim data entry yang dipilih
                users={users} // Kirim data users untuk dropdown
                open={isEditDialogOpen} // Kirim state open/close
                onClose={closeEditDialog} // Kirim fungsi untuk menutup dialog
                refreshData={refreshData} // Kirim fungsi refresh data
            />
        </div>
    );
};

export default GuestBookTable;
