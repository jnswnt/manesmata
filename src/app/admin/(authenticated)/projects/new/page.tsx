import ProjectForm from "@/app/admin/ProjectForm";

export default function NewProjectPage() {
    return (
        <div className="max-w-2xl">
            <header className="mb-8">
                <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">
                    Tambah <span className="text-[var(--color-primary)]">Proyek Baru</span>
                </h1>
                <p className="font-bold">Isi formulir di bawah untuk mempublikasikan proyek baru Anda.</p>
            </header>

            <div className="neo-box p-8 bg-white">
                <ProjectForm />
            </div>
        </div>
    );
}
