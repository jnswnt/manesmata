"use client";

import { useRef } from "react";
import { createProject } from "../actions";

export default function ProjectForm() {
    const formRef = useRef<HTMLFormElement>(null);

    async function actionCreate(formData: FormData) {
        const res = await createProject(formData);
        if (res?.error) {
            alert(res.error);
        } else {
            formRef.current?.reset();
        }
    }

    return (
        <form ref={formRef} action={actionCreate} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
                <label htmlFor="title" className="font-bold uppercase tracking-tight">
                    Nama Aplikasi <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    className="neo-input"
                    placeholder="e.g WashOps"
                    required
                />
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="description" className="font-bold uppercase tracking-tight">
                    Deskripsi Singkat <span className="text-red-500">*</span>
                </label>
                <textarea
                    id="description"
                    name="description"
                    className="neo-input min-h-[100px]"
                    placeholder="Aplikasi pencatatan cuci motor..."
                    required
                />
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="color" className="font-bold uppercase tracking-tight">
                    Warna Utama (Hex) <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2 items-center">
                    <input
                        type="color"
                        id="color"
                        name="color"
                        defaultValue="#5CE1E6"
                        className="w-12 h-12 p-1 bg-white border-2 border-black cursor-pointer shadow-[2px_2px_0px_#1e1e1e]"
                        required
                    />
                    <span className="text-sm font-medium italic opacity-70">Pilih warna branding aplikasi</span>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="features" className="font-bold uppercase tracking-tight">
                    Fitur Utama (JSON Array Format)
                </label>
                <input
                    type="text"
                    id="features"
                    name="features"
                    className="neo-input"
                    placeholder='["Kasir", "Notifikasi WA"]'
                />
                <span className="text-xs font-medium">Opsional. Pisahkan dengan format ["Hitung Gaji", "Absensi"]</span>
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="demoUrl" className="font-bold uppercase tracking-tight">
                    Link Demo / Web
                </label>
                <input
                    type="url"
                    id="demoUrl"
                    name="demoUrl"
                    className="neo-input"
                    placeholder="https://washops.com"
                />
            </div>

            <button type="submit" className="neo-button w-full mt-2 py-4 text-xl">
                + Simpan Project
            </button>
        </form>
    );
}
