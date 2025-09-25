// resources/js/Components/GuestBook/GuestBookCreateDialog.jsx

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

const GuestBookCreateDialog = ({ users = [], open, onOpenChange }) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        guest_name: "",
        check_out_time: "",
        company: "",
        purpose: "",
        user_id: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("guestbook.store"), {
            onSuccess: () => {
                reset();
                onOpenChange(false);
                if (refreshData) {
                    refreshData();
                }
                toast.success("Data tamu berhasil disimpan!");
            },
            onError: (errors) => {
                console.error("Validation errors on create:", errors);
                toast.error("Gagal menyimpan data. Silakan periksa kembali.");
            },
        });
    };

    const handleChange = (e) => setData(e.target.name, e.target.value);

    const handleSelectChange = (value) => {
        setData("user_id", value);
    };

    const usersArray = Array.isArray(users) ? users : [];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Guest Entry</DialogTitle>
                    <DialogDescription>
                        Fill in the details for the new guest.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="guest_name">Nama Tamu</Label>
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
                        <Label htmlFor="check_out_time">
                            Jam Keluar (Optional)
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
                        <Label htmlFor="company">Perusahaan</Label>
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
                        <Label htmlFor="purpose">Tujuan</Label>
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
                        <Label htmlFor="user_id">User Tujuan</Label>
                        <Select
                            name="user_id"
                            value={data.user_id}
                            onValueChange={handleSelectChange}
                            required
                        >
                            <SelectTrigger
                                className={
                                    errors.user_id ? "border-red-500" : ""
                                }
                            >
                                <SelectValue placeholder="Select a user" />
                            </SelectTrigger>
                            <SelectContent>
                                {usersArray.length === 0 ? (
                                    <div className="p-2 text-center text-sm text-gray-500">
                                        No users available
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
                                onOpenChange(false);
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

export default GuestBookCreateDialog;
