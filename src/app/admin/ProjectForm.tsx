"use client";

import { useRef, useState, useEffect } from "react";
import {
    Plus,
    Trash2,
    Save,
    Image as ImageIcon,
    Link as LinkIcon,
    ExternalLink,
    Info
} from "lucide-react";
import { createProject, updateProject } from "../actions";
import { useRouter } from "next/navigation";

export default function ProjectForm({ project }: { project?: any }) {
    const formRef = useRef<HTMLFormElement>(null);
    const router = useRouter();
    const [preview, setPreview] = useState<string | null>(project?.imageUrl || null);

    // Reset preview jika project berubah (misal ganti dari edit ke tambah)
    useEffect(() => {
        setPreview(project?.imageUrl || null);
        if (!project) formRef.current?.reset();
    }, [project]);

    async function handleSubmit(formData: FormData) {
        let res;
        if (project) {
            res = await updateProject(project.id, formData);
        } else {
            res = await createProject(formData);
        }

        if (res?.error) {
            alert(res.error);
        } else {
            if (!project) {
                formRef.current?.reset();
                setPreview(null);
            } else {
                // Setelah selesai, arahkan kembali ke daftar proyek
                router.push("/admin/projects");
            }
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreview(url);
        }
    };

    return (
        <div className="neo-box p-6 bg-white shadow-[4px_4px_0px_#1e1e1e]">
            <h2 className="text-2xl font-black uppercase mb-6 border-b-2 border-black pb-2">
                {project ? `⚡ Edit Project: ${project.title}` : "🚀 Tambah Project Baru"}
            </h2>

            <form ref={formRef} action={handleSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                    <label htmlFor="title" className="font-bold uppercase tracking-tight">
                        Nama Aplikasi <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        defaultValue={project?.title || ""}
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
                        defaultValue={project?.description || ""}
                        className="neo-input min-h-[100px]"
                        placeholder="Aplikasi pencatatan cuci motor..."
                        required
                    />
                </div>

                {/* Multi Images */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-black uppercase flex items-center gap-2">
                            <ImageIcon size={16} /> Upload Gambar (Bisa banyak)
                        </label>
                        <input
                            name="imageFiles"
                            type="file"
                            accept="image/*"
                            multiple
                            className="w-full neo-box p-3 bg-white font-bold text-sm file:mr-4 file:py-1 file:px-4 file:neo-button file:bg-white file:text-xs file:font-black"
                        />
                        <p className="text-[10px] text-gray-400 font-bold uppercase italic">* Pilih beberapa file untuk carousel</p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-black uppercase flex items-center gap-2">
                            <LinkIcon size={16} /> URL Gambar Tambahan
                        </label>
                        <textarea
                            name="imagesUrl"
                            defaultValue={
                                project?.images
                                    ? (() => {
                                        try {
                                            const parsed = JSON.parse(project.images);
                                            return Array.isArray(parsed) ? parsed.join(",\n") : project.images;
                                        } catch (e) {
                                            return project.images;
                                        }
                                    })()
                                    : project?.imageUrl || ""
                            }
                            placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                            rows={3}
                            className="w-full neo-box p-4 focus:bg-[var(--color-primary)] transition-colors font-bold outline-none text-sm"
                        />
                        <p className="text-[10px] text-gray-400 font-bold uppercase italic">* Pisahkan dengan koma atau baris baru</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="color" className="font-bold uppercase tracking-tight">
                            Warna Tema (Hex) <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-2 items-center">
                            <input
                                type="color"
                                id="color"
                                name="color"
                                defaultValue={project?.color || "#5CE1E6"}
                                className="w-12 h-12 p-1 bg-white border-2 border-black cursor-pointer shadow-[2px_2px_0px_#1e1e1e]"
                                required
                            />
                            <span className="text-sm font-medium italic opacity-70">Warna branding</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="demoUrl" className="font-bold uppercase tracking-tight">
                            Link Demo / Web
                        </label>
                        <input
                            type="url"
                            id="demoUrl"
                            name="demoUrl"
                            defaultValue={project?.demoUrl || ""}
                            className="neo-input"
                            placeholder="https://washops.com"
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="font-bold uppercase tracking-tight">
                        Screenshot / Foto Project
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <input
                                type="file"
                                name="imageFile"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="text-sm file:mr-4 file:py-2 file:px-4 file:border-2 file:border-black file:text-sm file:font-bold file:bg-[var(--color-bg)] hover:file:bg-white cursor-pointer"
                            />
                            <span className="text-xs opacity-60">Upload file langsung (Max 5MB)</span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <input
                                type="text"
                                name="imageUrl"
                                defaultValue={project?.imageUrl || ""}
                                className="neo-input text-sm"
                                placeholder="Atau tempel URL gambar di sini..."
                            />
                        </div>
                    </div>
                    {preview && (
                        <div className="mt-2 border-2 border-black p-2 inline-block bg-gray-50">
                            <p className="text-xs font-bold uppercase mb-1">Preview:</p>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={preview} alt="Preview" className="max-h-[150px] object-contain" />
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="features" className="font-bold uppercase tracking-tight">
                        Fitur Utama (JSON Format)
                    </label>
                    <input
                        type="text"
                        id="features"
                        name="features"
                        defaultValue={project?.features || ""}
                        className="neo-input"
                        placeholder='["Kasir", "Notifikasi WA"]'
                    />
                    <span className="text-xs font-medium">Contoh: ["Hitung Gaji", "Absensi"]</span>
                </div>

                <div className="flex gap-4 mt-2">
                    <button type="submit" className="neo-button flex-grow py-4 text-xl">
                        {project ? "⚡ Update Project" : "🚀 Simpan Project"}
                    </button>
                    {project && (
                        <button
                            type="button"
                            onClick={() => router.push("/admin/projects")}
                            className="neo-button bg-gray-200 text-black border-gray-400 font-bold"
                        >
                            Batal
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}
