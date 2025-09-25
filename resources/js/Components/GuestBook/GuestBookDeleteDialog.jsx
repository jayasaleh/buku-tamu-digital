// resources/js/Components/GuestBook/GuestBookDeleteDialog.jsx

import React from "react";
import { router } from "@inertiajs/react"; // Import router untuk delete
import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";

const GuestBookDeleteDialog = ({ entry, open, onClose, refreshData }) => {
    const handleDelete = () => {
        router.delete(route("guestbook.destroy", entry.id), {
            onSuccess: () => {
                onClose();
                if (refreshData) {
                    refreshData();
                }
                toast.success("Data tamu berhasil dihapus!");
            },
            onError: (errors) => {
                console.error("Delete error:", errors);
                toast.error("Gagal menghapus data.");
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Konfirmasi Hapus</DialogTitle>
                    <DialogDescription>
                        Apakah Anda yakin ingin menghapus data tamu
                        <strong>{entry?.guest_name}</strong>? Tindakan ini tidak
                        dapat dibatalkan.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={onClose}>
                        Batal
                    </Button>
                    <Button
                        type="button"
                        variant="destructive" // Gunakan variant untuk tombol berbahaya
                        onClick={handleDelete}
                    >
                        Hapus
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default GuestBookDeleteDialog;
