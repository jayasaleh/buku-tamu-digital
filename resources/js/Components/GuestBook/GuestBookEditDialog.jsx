// resources/js/Components/GuestBook/GuestBookEditDialog.jsx

import React from "react";
import { useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";

const GuestBookEditDialog = ({
    entry,
    users = [],
    open,
    onClose, // Gunakan 'onClose' sesuai dengan prop yang dikirim dari GuestBookTable
    refreshData,
}) => {
    const { data, setData, put, processing, errors, reset, clearErrors } =
        useForm({
            guest_name: entry?.guest_name || "",
            visit_date: entry?.visit_date || "",
            check_in_time: entry?.check_in_time
                ? entry.check_in_time.substring(0, 5)
                : "",
            check_out_time: entry?.check_out_time
                ? entry.check_out_time.substring(0, 5)
                : "",
            company: entry?.company || "",
            purpose: entry?.purpose || "",
            identity_number: entry?.identity_number || "",
            user_id: entry?.user_id ? entry.user_id.toString() : "",
        });

    React.useEffect(() => {
        if (open && entry) {
            reset();
            clearErrors();
            setData({
                guest_name: entry.guest_name,
                visit_date: entry.visit_date,
                check_in_time: entry.check_in_time
                    ? entry.check_in_time.substring(0, 5)
                    : "",
                check_out_time: entry.check_out_time
                    ? entry.check_out_time.substring(0, 5)
                    : "",
                company: entry.company,
                purpose: entry.purpose,
                identity_number: entry.identity_number,
                user_id: entry.user_id.toString(),
            });
        }
    }, [open, entry, reset, clearErrors, setData]);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Siapkan data untuk dikirim, pastikan format waktu HH:MM
        const submitData = {
            ...data,
            check_in_time: data.check_in_time
                ? data.check_in_time.substring(0, 5)
                : null,
            check_out_time: data.check_out_time
                ? data.check_out_time.substring(0, 5)
                : null,
        };

        // --- PERBAIKAN SIGNATURE useFom.put ---
        // Gunakan: put(url, { data: ..., onSuccess: ..., ... })
        put(route("guestbook.update", entry.id), {
            submitData, // <-- Data dikirim dalam properti 'data' dari objek options
            onSuccess: () => {
                console.log("Edit successful!");
                reset();
                onClose(); // Gunakan 'onClose' sesuai dengan prop yang diterima
                if (refreshData) {
                    console.log("Refreshing data...");
                    refreshData();
                }
                toast.success("Data tamu berhasil diperbarui!");
            },
            onError: (errors) => {
                console.error("Validation errors on edit:", errors);
                toast.error("Gagal memperbarui data. Silakan periksa kembali.");
            },
        });
        // --- AKHIR PERBAIKAN ---
    };

    const handleChange = (e) => setData(e.target.name, e.target.value);
    const handleSelectChange = (name, value) => setData(name, value);

    const usersArray = Array.isArray(users) ? users : [];

    return (
        <Dialog open={open} onOpenChange={onClose}>
            {" "}
            {/* Gunakan 'onClose' untuk menutup dialog */}
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Buku Tamu</DialogTitle>
                    <DialogDescription>
                        Update detail tamu: {entry?.guest_name}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="guest_name">Nama Tamu *</Label>
                        <Input
                            id="guest_name"
                            name="guest_name"
                            type="text"
                            value={data.guest_name}
                            onChange={handleChange}
                            className={
                                errors.guest_name ? "border-red-500" : ""
                            }
                        />
                        {errors.guest_name && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.guest_name}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="visit_date">Tanggal *</Label>
                        <Input
                            id="visit_date"
                            name="visit_date"
                            type="date"
                            value={data.visit_date}
                            onChange={handleChange}
                            className={
                                errors.visit_date ? "border-red-500" : ""
                            }
                        />
                        {errors.visit_date && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.visit_date}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="check_in_time">
                            Jam Masuk (HH:MM) *
                        </Label>
                        <Input
                            id="check_in_time"
                            name="check_in_time"
                            type="time"
                            value={data.check_in_time}
                            onChange={handleChange}
                            className={
                                errors.check_in_time ? "border-red-500" : ""
                            }
                        />
                        {errors.check_in_time && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.check_in_time}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="check_out_time">
                            Jam Keluar (HH:MM) (Opsional)
                        </Label>
                        <Input
                            id="check_out_time"
                            name="check_out_time"
                            type="time"
                            value={data.check_out_time}
                            onChange={handleChange}
                            className={
                                errors.check_out_time ? "border-red-500" : ""
                            }
                        />
                        {errors.check_out_time && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.check_out_time}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="company">Perusahaan *</Label>
                        <Input
                            id="company"
                            name="company"
                            type="text"
                            value={data.company}
                            onChange={handleChange}
                            className={errors.company ? "border-red-500" : ""}
                        />
                        {errors.company && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.company}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="purpose">Keperluan *</Label>
                        <Textarea
                            id="purpose"
                            name="purpose"
                            value={data.purpose}
                            onChange={handleChange}
                            className={errors.purpose ? "border-red-500" : ""}
                        />
                        {errors.purpose && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.purpose}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="identity_number">No. Identitas *</Label>
                        <Input
                            id="identity_number"
                            name="identity_number"
                            type="text"
                            value={data.identity_number}
                            onChange={handleChange}
                            className={
                                errors.identity_number ? "border-red-500" : ""
                            }
                        />
                        {errors.identity_number && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.identity_number}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="user_id">User Tujuan *</Label>
                        <Select
                            name="user_id"
                            value={data.user_id}
                            onValueChange={(value) =>
                                handleSelectChange("user_id", value)
                            }
                        >
                            <SelectTrigger
                                className={
                                    errors.user_id ? "border-red-500" : ""
                                }
                            >
                                <SelectValue placeholder="Pilih user" />
                            </SelectTrigger>
                            <SelectContent>
                                {usersArray.length === 0 ? (
                                    <div className="p-2 text-center text-sm text-gray-500">
                                        Tidak ada user tersedia
                                    </div>
                                ) : (
                                    usersArray.map((user) => (
                                        <SelectItem
                                            key={user.id}
                                            value={user.id.toString()}
                                        >
                                            {user.name} (
                                            {user.division?.name ||
                                                "No Division"}
                                            )
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                        {errors.user_id && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.user_id}
                            </p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                reset();
                                onClose(); // Gunakan 'onClose'
                            }}
                        >
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? "Menyimpan..." : "Simpan"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default GuestBookEditDialog;
