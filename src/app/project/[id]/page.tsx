import { getProjectById } from "@/app/actions";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function ProjectDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const project = await getProjectById(parseInt(id));

    if (!project) {
        notFound();
    }

    const features = project.features ? JSON.parse(project.features) : [];
    const waNumber = "6282223445225";
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(
        `Halo ManesMata, saya tertarik dengan project ${project.title}. Bisa bantu jelaskan lebih lanjut?`
    )}`;

    return (
        <main className="min-h-screen bg-[var(--color-bg)] pb-20">
            {/* Simple Nav */}
            <nav className="p-6 md:px-12 bg-white border-b-4 border-black mb-10 flex justify-between items-center">
                <Link href="/" className="text-2xl font-black uppercase tracking-tighter">
                    ManesMata<span className="text-[var(--color-primary)]">.</span>
                </Link>
                <Link href="/" className="neo-button py-2 px-4 text-sm font-bold bg-white">
                    ← Kembali
                </Link>
            </nav>

            <div className="max-w-5xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Left: Image / Visual */}
                    <div className="w-full">
                        <div
                            className="neo-box aspect-video overflow-hidden bg-white relative flex items-center justify-center"
                            style={{ backgroundColor: !project.imageUrl ? project.color : 'white' }}
                        >
                            {project.imageUrl ? (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img
                                    src={project.imageUrl}
                                    alt={project.title}
                                    className="w-full h-full object-contain"
                                />
                            ) : (
                                <h1 className="text-6xl font-black uppercase text-center text-white p-4" style={{ textShadow: "4px 4px 0 #000" }}>
                                    {project.title}
                                </h1>
                            )}
                        </div>

                        {/* Status Tags */}
                        <div className="flex gap-3 mt-6">
                            <span className="neo-box bg-green-300 px-4 py-1 font-black uppercase text-xs">Aktif</span>
                            <span className="neo-box bg-purple-300 px-4 py-1 font-black uppercase text-xs">Terverifikasi</span>
                        </div>
                    </div>

                    {/* Right: Info */}
                    <div className="flex flex-col gap-8">
                        <div>
                            <div className="inline-block neo-box px-3 py-1 bg-[var(--color-accent)] text-xs font-black uppercase mb-4 shadow-[2px_2px_0_#000]">
                                Project Detail
                            </div>
                            <h1 className="text-5xl font-black uppercase tracking-tight mb-4">
                                {project.title}
                            </h1>
                            <div className="w-20 h-4 mb-6" style={{ backgroundColor: project.color }}></div>
                            <p className="text-xl font-medium leading-relaxed opacity-90">
                                {project.description}
                            </p>
                        </div>

                        {features.length > 0 && (
                            <div>
                                <h2 className="text-lg font-black uppercase mb-4 border-b-2 border-black inline-block">Fitur Utama:</h2>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {features.map((feature: string, i: number) => (
                                        <li key={i} className="flex items-center gap-3 font-bold text-sm bg-white neo-box p-3">
                                            <span className="text-xl">✅</span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="flex flex-col gap-4 pt-6 border-t-2 border-dashed border-gray-400">
                            {project.demoUrl && project.demoUrl !== '#' && (
                                <a
                                    href={project.demoUrl}
                                    target="_blank"
                                    className="neo-button text-center py-4 bg-cyan-400 text-xl"
                                >
                                    🚀 Kunjungi Website
                                </a>
                            )}

                            <a
                                href={waUrl}
                                target="_blank"
                                className="neo-button text-center py-4 bg-[#25D366] text-white text-xl flex items-center justify-center gap-3"
                            >
                                <span>💬</span> Tanya Via WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
