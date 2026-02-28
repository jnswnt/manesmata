import Link from "next/link";
import { logoutAdmin } from "@/app/actions";
import { redirect } from "next/navigation";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[var(--color-bg)] flex flex-col md:flex-row">
            {/* Sidebar Navigation */}
            <aside className="w-full md:w-64 bg-white border-r-4 border-black p-6 flex flex-col gap-8 md:sticky md:top-0 md:h-screen">
                <div className="text-2x font-black tracking-tighter uppercase mb-4">
                    Admin <span className="text-[var(--color-primary)] font-black">Panel</span>
                </div>

                <nav className="flex flex-col gap-4 flex-grow">
                    <Link
                        href="/admin"
                        className="neo-box p-3 font-bold hover:bg-[var(--color-primary)] transition-colors inline-block text-center"
                    >
                        Dashboard
                    </Link>
                    <Link
                        href="/admin/projects"
                        className="neo-box p-3 font-bold hover:bg-[var(--color-primary)] transition-colors inline-block text-center"
                    >
                        Manajemen Proyek
                    </Link>
                    <Link
                        href="/admin/settings"
                        className="neo-box p-3 font-bold hover:bg-[var(--color-primary)] transition-colors inline-block text-center"
                    >
                        Pengaturan Umum
                    </Link>
                </nav>

                <div className="flex flex-col gap-4 mt-auto">
                    <Link
                        href="/"
                        className="font-bold text-sm text-center border-2 border-black p-2 hover:bg-gray-100 transition-colors"
                    >
                        Lihat Website
                    </Link>
                    <form action={async () => {
                        "use server";
                        await logoutAdmin();
                        redirect("/admin/login");
                    }}>
                        <button
                            type="submit"
                            className="w-full font-bold text-sm border-2 border-black bg-black text-white p-2 hover:bg-red-500 transition-colors"
                        >
                            Logout
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-grow p-6 md:p-12 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
