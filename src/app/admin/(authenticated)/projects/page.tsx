import { getProjects } from "@/app/actions";
import Link from "next/link";
import DeleteProjectButton from "@/app/admin/DeleteProjectButton";

export default async function AdminProjectsPage() {
    const projects = await getProjects();

    return (
        <div className="flex flex-col gap-8">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">
                        Manajemen <span className="text-[var(--color-primary)]">Proyek</span>
                    </h1>
                    <p className="font-bold italic">Total {projects.length} proyek terdaftar.</p>
                </div>
                <Link
                    href="/admin/projects/new"
                    className="neo-button px-6 py-3 text-sm font-black uppercase"
                >
                    + Tambah Proyek
                </Link>
            </header>

            <div className="grid grid-cols-1 gap-6">
                {projects.length === 0 ? (
                    <div className="neo-box p-12 bg-white text-center">
                        <p className="text-xl font-black uppercase opacity-30">Belum ada proyek.</p>
                        <Link href="/admin/projects/new" className="mt-4 inline-block font-bold underline">Mulai buat proyek pertama Anda</Link>
                    </div>
                ) : (
                    projects.map((project: any) => (
                        <div key={project.id} className="neo-box bg-white flex flex-col md:flex-row overflow-hidden hover:translate-x-1 hover:-translate-y-1 transition-transform">
                            <div className="w-full md:w-12 h-12 md:h-auto border-b-4 md:border-b-0 md:border-r-4 border-black" style={{ backgroundColor: project.color || 'var(--color-secondary)' }}></div>

                            <div className="p-6 flex-grow flex flex-col md:flex-row justify-between items-center gap-6">
                                <div className="flex-grow text-center md:text-left">
                                    <h3 className="text-xl font-black uppercase tracking-tight">{project.title}</h3>
                                    <p className="text-sm font-bold line-clamp-1 opacity-70">{project.description}</p>
                                </div>

                                <div className="flex flex-wrap justify-center gap-3">
                                    <Link
                                        href={`/project/${project.slug || project.id}`}
                                        target="_blank"
                                        className="text-xs font-black uppercase border-2 border-black px-3 py-2 bg-cyan-200 hover:bg-cyan-300"
                                    >
                                        Pratinjau
                                    </Link>
                                    <Link
                                        href={`/admin/projects/edit/${project.id}`}
                                        className="text-xs font-black uppercase border-2 border-black px-3 py-2 bg-yellow-300 hover:bg-yellow-400"
                                    >
                                        Edit
                                    </Link>
                                    <DeleteProjectButton id={project.id} />
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
