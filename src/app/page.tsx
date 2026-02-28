import Image from "next/image";

import Link from "next/link";
import { getProjects } from "./actions";

export default async function Home() {
  const projects = await getProjects();

  return (
    <main className="min-h-screen pb-20">
      {/* Navbar Minimal */}
      <nav className="flex items-center justify-between p-6 md:px-12 neo-box border-t-0 border-l-0 border-r-0 rounded-none bg-white">
        <div className="text-2xl font-black tracking-tighter uppercase">
          ManesMata<span className="text-[var(--color-primary)]">.</span>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-20 md:px-12 md:py-32 flex flex-col items-center text-center">
        <div className="inline-block neo-box px-4 py-1 bg-[var(--color-secondary)] text-sm font-bold mb-6 rotate-[-2deg]">
          Halo, Selamat Datang! 👋
        </div>
        <h1 className="text-5xl md:text-7xl font-black uppercase leading-[1.1] mb-6 max-w-4xl tracking-tight">
          Koleksi <span className="bg-[var(--color-purple)] text-white px-2 neo-box">Aplikasi</span> Terbaik Karya Anak Bangsa
        </h1>
        <p className="text-xl md:text-2xl font-medium max-w-2xl mb-12">
          Eksplorasi berbagai solusi digital mulai dari manajemen pencucian, sistem kasir (POS) cerdas, hingga pengelolaan usaha mandiri.
        </p>
        <Link href="#projects" className="neo-button text-lg px-8 py-4">
          Lihat Semua Project
        </Link>
      </section>

      {/* Projects Grid */}
      <section id="projects" className="px-6 md:px-12 max-w-7xl mx-auto">
        <h2 className="text-4xl font-black uppercase mb-12 border-b-4 border-black pb-4 inline-block">
          Daftar Project
        </h2>

        {projects.length === 0 ? (
          <div className="neo-box p-12 text-center bg-white">
            <h3 className="text-2xl font-bold mb-4">Belum Ada Project</h3>
            <p className="mb-6">Tambahkan project pertama Anda melalui Admin Dashboard.</p>
            <Link href="/admin" className="neo-button">
              Ke Dashboard
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project: any) => (
              <div key={project.id} className="neo-box flex flex-col h-full overflow-hidden bg-white">
                {/* Visual Header */}
                <div
                  className="h-48 w-full border-b-[4px] border-black flex items-center justify-center relative p-6"
                  style={{ backgroundColor: project.color || 'var(--color-secondary)' }}
                >
                  <h3 className="text-3xl font-black uppercase text-center text-white" style={{ textShadow: "3px 3px 0 #000" }}>
                    {project.title}
                  </h3>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <p className="font-medium text-lg mb-6 flex-grow">{project.description}</p>

                  {project.features && (
                    <div className="mb-6 flex flex-wrap gap-2">
                      {JSON.parse(project.features).slice(0, 3).map((feature: string, i: number) => (
                        <span key={i} className="text-xs font-bold border-2 border-black px-2 py-1 bg-gray-100 rounded-sm">
                          {feature}
                        </span>
                      ))}
                      {JSON.parse(project.features).length > 3 && (
                        <span className="text-xs font-bold border-2 border-black px-2 py-1 bg-gray-100 rounded-sm">
                          +{JSON.parse(project.features).length - 3} lagi
                        </span>
                      )}
                    </div>
                  )}

                  {(project.demoUrl && project.demoUrl !== '#') ? (
                    <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="neo-button w-full">
                      Kunjungi Web
                    </a>
                  ) : (
                    <button className="neo-button w-full opacity-50 cursor-not-allowed" disabled>
                      Demo Tidak Tersedia
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
