import { getProjectById } from "@/app/actions";
import ProjectForm from "@/app/admin/ProjectForm";
import { notFound } from "next/navigation";

export default async function EditProjectPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const project = await getProjectById(parseInt(id));

    if (!project) {
        notFound();
    }

    return (
        <div className="max-w-2xl">
            <header className="mb-8">
                <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">
                    Edit <span className="text-[var(--color-primary)]">Proyek</span>
                </h1>
                <p className="font-bold uppercase text-sm bg-black text-white inline-block px-2 py-1 mb-2">
                    ID: {id}
                </p>
                <p className="font-bold italic">Sedang menyunting: {project.title}</p>
            </header>

            <div className="neo-box p-8 bg-white">
                <ProjectForm project={project} />
            </div>
        </div>
    );
}
