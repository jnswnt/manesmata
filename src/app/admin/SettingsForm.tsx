"use client";

import { useState } from "react";
import { updateSettings } from "../actions";

interface SettingsFormProps {
    settings: Record<string, string>;
}

export default function SettingsForm({ settings }: SettingsFormProps) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setMessage(null);

        const result = await updateSettings(formData);

        if (result.success) {
            setMessage({ type: "success", text: "Pengaturan berhasil diperbarui!" });
        } else {
            setMessage({ type: "error", text: result.error || "Gagal memperbarui pengaturan." });
        }

        setLoading(false);
    }

    return (
        <form action={handleSubmit} className="flex flex-col gap-6">
            <h2 className="text-2xl font-black uppercase mb-2 border-b-4 border-black pb-2">
                Pengaturan Umum
            </h2>

            {message && (
                <div className={`p-4 font-bold border-2 border-black ${message.type === "success" ? "bg-green-300" : "bg-red-300"}`}>
                    {message.text}
                </div>
            )}

            <div className="flex flex-col gap-2">
                <label className="font-bold uppercase text-sm tracking-tight">Nomor WhatsApp</label>
                <input
                    name="whatsapp_number"
                    type="text"
                    defaultValue={settings.whatsapp_number || "6282223445225"}
                    placeholder="Contoh: 6282223445225"
                    className="neo-box p-3 font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-white"
                />
                <p className="text-xs font-medium opacity-70 italic">* Gunakan kode negara tanpa tanda + (contoh: 62 untuk Indonesia)</p>
            </div>

            <div className="flex flex-col gap-2">
                <label className="font-bold uppercase text-sm tracking-tight">Template Pesan WA</label>
                <textarea
                    name="whatsapp_message"
                    defaultValue={settings.whatsapp_message || "Halo ManesMata, saya ingin berdiskusi..."}
                    rows={2}
                    className="neo-box p-3 font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-white"
                />
            </div>

            <div className="flex flex-col gap-2">
                <label className="font-bold uppercase text-sm tracking-tight">Email Kontak</label>
                <input
                    name="contact_email"
                    type="email"
                    defaultValue={settings.contact_email || "halo@manesmata.id"}
                    className="neo-box p-3 font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-white"
                />
            </div>

            <div className="flex flex-col gap-2">
                <label className="font-bold uppercase text-sm tracking-tight">Teks About (Beranda)</label>
                <textarea
                    name="about_text"
                    defaultValue={settings.about_text || "ManesMata hadir sebagai wadah inovasi digital yang mengedepankan solusi praktis dan efisien untuk berbagai lini bisnis. Kami berfokus pada pengembangan perangkat lunak yang tidak hanya fungsional, tetapi juga memberikan pengalaman pengguna yang intuitif."}
                    rows={4}
                    className="neo-box p-3 font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-white"
                />
            </div>

            <div className="flex flex-col gap-2">
                <label className="font-bold uppercase text-sm tracking-tight">Teks Copyright</label>
                <input
                    name="footer_copyright"
                    type="text"
                    defaultValue={settings.footer_copyright || "© 2026 ManesMata. Hak Cipta Dilindungi."}
                    className="neo-box p-3 font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-white"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="neo-button bg-[var(--color-primary)] py-4 font-black uppercase tracking-widest disabled:opacity-50"
            >
                {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
        </form>
    );
}
