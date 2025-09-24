// resources/js/Pages/Dashboard.jsx

import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import { router } from "@inertiajs/react"; // Import router
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/Components/ui/button";
import GuestBookTable from "@/Components/GuestBook/GuestBookTable";
import GuestBookCreateDialog from "@/Components/GuestBook/GuestBookCreateDialog";

export default function Dashboard({ allGuestBooks, users }) {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

    const openCreateDialog = () => setIsCreateDialogOpen(true);
    const closeCreateDialog = () => setIsCreateDialogOpen(false);

    // Fungsi untuk me-refresh data
    const refreshData = () => {
        router.reload({ only: ["allGuestBooks", "users"] });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="px-6 flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Buku Tamu
                    </h2>
                    <Button onClick={openCreateDialog}>Buat Buku Tamu</Button>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-4">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6">
                            <div className="overflow-x-auto">
                                {/* Kirim fungsi refreshData ke GuestBookTable */}
                                <GuestBookTable
                                    guestBooks={allGuestBooks}
                                    showActions={true}
                                    refreshData={refreshData} // <-- Tambahkan ini
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <GuestBookCreateDialog
                users={users}
                open={isCreateDialogOpen}
                closeDialog={closeCreateDialog}
                refreshData={refreshData} // <-- Jangan lupa kirim juga ke dialog
            />
        </AuthenticatedLayout>
    );
}
