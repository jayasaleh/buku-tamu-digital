import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useState } from "react";

import GuestBookCreateDialog from "@/Components/GuestBook/GuestBookCreateDialog";
import GuestBookTable from "@/Components/GuestBook/GuestBookTable";
import { Button } from "@/Components/ui/button";

export default function Dashboard({ allGuestBooks, users }) {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const openCreateDialog = () => setIsCreateDialogOpen(true);
    const closeCreateDialog = () => setIsCreateDialogOpen(false);
    return (
        <AuthenticatedLayout
            header={
                <div className="px-6 flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Buku Tamu
                    </h2>
                    <Button onClick={openCreateDialog}>Tambah Data Tamu</Button>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-4">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6">
                            <div className="overflow-x-auto">
                                <GuestBookTable
                                    guestBooks={allGuestBooks}
                                    showActions={true}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <GuestBookCreateDialog
                users={users}
                open={isCreateDialogOpen}
                onOpenChange={closeCreateDialog}
            />
        </AuthenticatedLayout>
    );
}
