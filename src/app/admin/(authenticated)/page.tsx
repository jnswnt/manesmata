import { getProjects } from "@/app/actions";
import Link from "next/link";

export default async function AdminDashboardPage() {
    const projects = await getProjects();

    return (
        <div className="flex flex-col gap-8">
            <header>
                <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">
                    Selamat Datang, <span className="text-[var(--color-primary)]">Admin</span>
                </h1>
                <p className="font-bold text-lg">Kelola konten website Anda melalui panel kontrol terstruktur ini.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="neo-box p-6 bg-white flex flex-col gap-2">
                    <span className="text-sm font-black uppercase text-gray-500">Total Proyek</span>
                    <span className="text-5xl font-black">{projects.length}</span>
                    <Link href="/admin/projects" className="mt-4 text-sm font-bold underline decoration-2 underline-offset-4 hover:text-[var(--color-primary)]">
                        Kelola Proyek &rarr;
                    </Link>
                </div>

                <div className="neo-box p-6 bg-white flex flex-col gap-2">
                    <span className="text-sm font-black uppercase text-gray-500">Konfigurasi</span>
                    <span className="text-lg font-bold">Info Kontak & Sosial</span>
                    <Link href="/admin/settings" className="mt-4 text-sm font-bold underline decoration-2 underline-offset-4 hover:text-[var(--color-primary)]">
                        Buka Pengaturan &rarr;
                    </Link>
                </div>

                <div className="neo-box p-6 bg-[var(--color-secondary)] flex flex-col justify-center items-center text-center gap-2">
                    <span className="text-lg font-black uppercase tracking-tight">Butuh Bantuan?</span>
                    <p className="text-sm font-bold">Dashboard ini dirancang untuk kemudahan navigasi.</p>
                </div>
            </div>

            <section className="neo-box p-8 bg-white mt-4">
                <h2 className="text-2xl font-black uppercase mb-4">Aktivitas Terakhir</h2>
                <div className="flex flex-col gap-4">
                    {projects.slice(0, 3).map((p: any) => (
                        <div key={p.id} className="flex justify-between items-center border-b-2 border-dashed border-gray-200 pb-2">
                            <span className="font-bold uppercase tracking-tight">{p.title}</span>
                            <span className="text-xs font-black bg-gray-100 px-2 py-1 border-2 border-black">PROJECT</span>
                        </div>
                    ))}
                    {projects.length === 0 && <p className="font-bold text-gray-400 italic">Belum ada aktivitas proyek.</p>}
                </div>
            </section>
        </div>
    );
}
