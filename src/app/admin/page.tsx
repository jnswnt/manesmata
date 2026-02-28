import { getProjects, deleteProject } from "../actions";
import Link from "next/link";
import ProjectForm from "./ProjectForm";

export default async function AdminPage() {
    const projects = await getProjects();

    return (
        <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] font-sans pb-20">
            <nav className="flex items-center justify-between p-6 md:px-12 neo-box border-t-0 border-l-0 border-r-0 rounded-none bg-white mb-8">
                <div className="text-2xl font-black tracking-tighter uppercase">
                    Admin <span className="text-[var(--color-primary)]">Dashboard</span>
                </div>
                <Link href="/" className="font-bold text-sm tracking-wide hover:underline decoration-2 underline-offset-4">
                    Kembali ke Web
                </Link>
            </nav>

            <main className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8 relative items-start">
                {/* Sidebar / Form Area */}
                <section className="lg:col-span-1 lg:sticky lg:top-8 neo-box p-6 bg-white">
                    <h2 className="text-2xl font-black uppercase mb-6 border-b-4 border-black inline-block pb-2">
                        Tambah Project
                    </h2>
                    <ProjectForm />
                </section>

                {/* List Project Area */}
                <section className="lg:col-span-2">
                    <h2 className="text-3xl font-black uppercase mb-6 bg-white neo-box inline-block px-4 py-2 rotate-[1deg]">
                        Daftar Project ({projects.length})
                    </h2>

                    <div className="flex flex-col gap-6">
                        {projects.length === 0 ? (
                            <div className="neo-box p-8 bg-white text-center font-bold">
                                Belum ada project yang ditambahkan.
                            </div>
                        ) : (
                            projects.map((project) => (
                                <div key={project.id} className="neo-box bg-white flex flex-col sm:flex-row shadow-[4px_4px_0px_#1e1e1e] hover:shadow-[6px_6px_0px_#1e1e1e] transition-shadow overflow-hidden">
                                    {/* Left color bar */}
                                    <div className="w-full sm:w-8 h-8 sm:h-auto border-b-4 sm:border-b-0 sm:border-r-4 border-black" style={{ backgroundColor: project.color || 'var(--color-secondary)' }}></div>

                                    <div className="p-6 flex-grow flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-2xl font-black uppercase mb-2">{project.title}</h3>
                                            <p className="font-medium mb-4">{project.description}</p>

                                            <div className="text-sm font-bold bg-gray-100 p-2 inline-block border-2 border-black mb-4">
                                                Warna Tema: <span className="inline-block w-4 h-4 ml-2 border border-black align-middle translate-y-[-2px]" style={{ backgroundColor: project.color }}></span> {project.color}
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-4 mt-4">
                                            {project.demoUrl && (
                                                <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-bold border-2 border-black px-4 py-2 hover:bg-gray-100 transition-colors">
                                                    Lihat Demo
                                                </a>
                                            )}

                                            <form action={async () => {
                                                "use server";
                                                await deleteProject(project.id);
                                            }}>
                                                <button type="submit" className="text-sm font-bold border-2 border-[var(--color-primary)] text-[var(--color-primary)] px-4 py-2 hover:bg-[var(--color-primary)] hover:text-white transition-colors">
                                                    🗑️ Hapus
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}
