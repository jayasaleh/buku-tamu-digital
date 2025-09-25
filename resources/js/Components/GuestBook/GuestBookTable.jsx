// resources/js/Components/GuestBook/GuestBookTable.jsx

import { Button } from "@/Components/ui/button";
import { router } from "@inertiajs/react"; // Import usePage untuk CSRF token
import { format } from "date-fns";
import { useState } from "react"; // Import useState
// Impor komponen dialog edit
import GuestBookEditDialog from "@/Components/GuestBook/GuestBookEditDialog";
import GuestBookDeleteDialog from "./GuestBookDeleteDialog";

const GuestBookTable = ({
    guestBooks,
    showActions = true,
    refreshData,
    users = [],
}) => {
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [currentEntry, setCurrentEntry] = useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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
            // Gunakan router.put dari Inertia
            router.put(
                route("guestbook.update.checkout", entryId),
                {},
                {
                    // Opsi konfigurasi
                    preserveScroll: true, // Pertahankan posisi scroll
                    preserveState: true, // Pertahankan state komponen lain (opsional, bisa dihapus jika tidak diperlukan)
                    onSuccess: () => {
                        // --- PERUBAHAN UTAMA ---
                        // Panggil refreshData() hanya setelah permintaan berhasil
                        // dan Inertia selesai memproses respons
                        console.log(
                            "Check-out updated successfully, refreshing data..."
                        );
                        if (refreshData) {
                            refreshData(); // Ini akan memicu router.reload di Dashboard.jsx
                        }
                        // --- AKHIR PERUBAHAN UTAMA ---
                    },
                    onError: (errors) => {
                        // Tangani error validasi atau error lain dari backend
                        console.error(
                            "Error updating check-out time (from Inertia):",
                            errors
                        );
                        alert(
                            "Error updating check-out time. Please try again."
                        ); // Tampilkan alert untuk user
                    },
                }
            );
        }
    };

    const openEditDialog = (entry) => {
        setCurrentEntry(entry);
        setIsEditDialogOpen(true);
    };

    // Fungsi untuk menutup dialog edit
    const closeEditDialog = () => {
        setIsEditDialogOpen(false); // Tutup dialog
        setCurrentEntry(null); // Kosongkan data entry
    };

    const openDeleteDialog = (entry) => {
        setCurrentEntry(entry); // Simpan data entry yang akan dihapus
        setIsDeleteDialogOpen(true); // Buka dialog delete
    };

    // 4. Fungsi untuk menutup dialog delete
    const closeDeleteDialog = () => {
        setIsDeleteDialogOpen(false);
        // setCurrentEntry(null); // Opsional: Kosongkan setelah dialog ditutup
    };

    if (!guestBooks || guestBooks.length === 0) {
        return (
            <p className="text-center text-gray-500">
                <i> ~ Tidak ada buku tamu yang tersedia ~</i>
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
                                    <Button
                                        size="sm"
                                        className="bg-blue-500 text-white hover:bg-blue-700 mr-2"
                                        onClick={() => openEditDialog(entry)}
                                    >
                                        Edit
                                    </Button>

                                    <Button
                                        size="sm"
                                        className="bg-red-500 hover:bg-red-700 text-white"
                                        onClick={() => openDeleteDialog(entry)}
                                    >
                                        Delete
                                    </Button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>

            <GuestBookEditDialog
                entry={currentEntry}
                users={users}
                open={isEditDialogOpen}
                onClose={closeEditDialog}
                refreshData={refreshData}
            />
            <GuestBookDeleteDialog
                entry={currentEntry}
                open={isDeleteDialogOpen}
                onClose={closeDeleteDialog}
                refreshData={refreshData}
            />
        </div>
    );
};

export default GuestBookTable;
