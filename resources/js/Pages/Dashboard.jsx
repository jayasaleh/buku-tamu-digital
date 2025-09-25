// resources/js/Pages/Dashboard.jsx

import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import GuestBookTable from "@/Components/GuestBook/GuestBookTable";
import GuestBookCreateDialog from "@/Components/GuestBook/GuestBookCreateDialog";

export default function Dashboard({ allGuestBooks, users, filters = {} }) {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

    const [searchGuestName, setSearchGuestName] = useState(
        filters.search_guest_name || ""
    );
    const [searchDate, setSearchDate] = useState(filters.search_date || "");
    const [searchCompany, setSearchCompany] = useState(
        filters.search_company || ""
    );

    const handleSearchGuestNameChange = (e) => {
        setSearchGuestName(e.target.value);
    };

    const handleSearchDateChange = (e) => {
        setSearchDate(e.target.value);
    };

    const handleSearchCompanyChange = (e) => {
        setSearchCompany(e.target.value);
    };

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        router.get(
            route("dashboard"),
            {
                search_guest_name: searchGuestName,
                search_date: searchDate,
                search_company: searchCompany,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const handleResetFilters = () => {
        setSearchGuestName("");
        setSearchDate("");
        setSearchCompany("");
        router.get(
            route("dashboard"),
            {},
            {
                preserveState: true,
                replace: true,
            }
        );
    };
    const handleExportPdf = () => {
        window.location.href = route("guestbook.export.pdf");
    };
    const openCreateDialog = () => setIsCreateDialogOpen(true);
    const closeCreateDialog = () => setIsCreateDialogOpen(false);

    const refreshData = () => {
        router.get(
            route("dashboard"),
            {
                search_guest_name: searchGuestName,
                search_date: searchDate,
                search_company: searchCompany,
            },
            {
                preserveState: true,
                replace: true,
                only: ["allGuestBooks", "users", "filters"],
            }
        );
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
                            <div className="mb-6  bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <form
                                    onSubmit={handleFilterSubmit}
                                    className="grid grid-cols-4 gap-6 items-end"
                                >
                                    <div>
                                        <label
                                            htmlFor="search_guest_name"
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                        >
                                            Nama Tamu
                                        </label>
                                        <Input
                                            id="search_guest_name"
                                            type="text"
                                            placeholder="Cari Nama Tamu..."
                                            value={searchGuestName}
                                            onChange={
                                                handleSearchGuestNameChange
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="search_date"
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                        >
                                            Tanggal
                                        </label>
                                        <Input
                                            id="search_date"
                                            type="date"
                                            value={searchDate}
                                            onChange={handleSearchDateChange}
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="search_company"
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                        >
                                            Perusahaan
                                        </label>
                                        <Input
                                            id="search_company"
                                            type="text"
                                            placeholder="Cari Perusahaan..."
                                            value={searchCompany}
                                            onChange={handleSearchCompanyChange}
                                        />
                                    </div>
                                    <div className="flex space-x-2">
                                        <Button type="submit">Filter</Button>
                                        {(searchGuestName ||
                                            searchDate ||
                                            searchCompany) && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={handleResetFilters}
                                            >
                                                Reset
                                            </Button>
                                        )}
                                        <Button
                                            onClick={handleExportPdf}
                                            variant="outline"
                                        >
                                            Export ke PDF
                                        </Button>
                                    </div>
                                </form>
                            </div>

                            <div className="overflow-x-auto">
                                <GuestBookTable
                                    guestBooks={allGuestBooks}
                                    showActions={true}
                                    refreshData={refreshData}
                                    users={users}
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
                refreshData={refreshData}
            />
        </AuthenticatedLayout>
    );
}
