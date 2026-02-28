import { getSettings } from "@/app/actions";
import SettingsForm from "@/app/admin/SettingsForm";

export default async function AdminSettingsPage() {
    const settings = await getSettings();

    return (
        <div className="max-w-2xl">
            <header className="mb-8">
                <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">
                    Pengaturan <span className="text-[var(--color-primary)]">Kontak</span>
                </h1>
                <p className="font-bold">Sesuaikan informasi kontak dan teks global website Anda di sini.</p>
            </header>

            <div className="neo-box p-8 bg-white">
                <SettingsForm settings={settings} />
            </div>
        </div>
    );
}
