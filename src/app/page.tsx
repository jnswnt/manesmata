import Image from "next/image";

import Link from "next/link";
import { getProjects, getSettings } from "./actions";

export default async function Home() {
  const projects = await getProjects();
  const settings = await getSettings();

  // Konfigurasi default jika data belum ada di database
  const whatsappNumber = settings.whatsapp_number || "6282223445225";
  const whatsappMessage = encodeURIComponent(settings.whatsapp_message || "Halo ManesMata, saya ingin berdiskusi...");
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
  const aboutText = settings.about_text || "ManesMata hadir sebagai wadah inovasi digital yang mengedepankan solusi praktis dan efisien untuk berbagai lini bisnis. Kami berfokus pada pengembangan perangkat lunak yang tidak hanya fungsional, tetapi juga memberikan pengalaman pengguna yang intuitif.";
  const contactEmail = settings.contact_email || "halo@manesmata.id";
  const footerCopyright = settings.footer_copyright || "© 2026 ManesMata. Hak Cipta Dilindungi.";

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
              <Link
                href={`/project/${project.slug || project.id}`}
                key={project.id}
                className="neo-box flex flex-col h-full overflow-hidden bg-white group hover:translate-x-2 hover:-translate-y-2 transition-transform duration-200"
              >
                {/* Visual Header / Image */}
                <div
                  className="h-56 w-full border-b-[4px] border-black flex items-center justify-center relative bg-gray-100 overflow-hidden"
                  style={{ backgroundColor: !project.imageUrl ? (project.color || 'var(--color-secondary)') : 'transparent' }}
                >
                  {project.imageUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <h3 className="text-4xl font-black uppercase text-center text-white px-4" style={{ textShadow: "3px 3px 0 #000" }}>
                      {project.title}
                    </h3>
                  )}
                  {/* Category Badge overlay */}
                  <div className="absolute top-4 left-4 neo-box bg-white px-3 py-1 text-xs font-black uppercase shadow-[2px_2px_0_#000]">
                    Project
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-2xl font-black uppercase mb-2 group-hover:text-[var(--color-primary)] transition-colors">
                    {project.title}
                  </h3>
                  <p className="font-medium text-base mb-6 flex-grow line-clamp-3 opacity-80">{project.description}</p>

                  {project.features && (
                    <div className="mb-0 flex flex-wrap gap-2">
                      {JSON.parse(project.features).slice(0, 3).map((feature: string, i: number) => (
                        <span key={i} className="text-[10px] font-bold border-2 border-black px-2 py-0.5 bg-yellow-100 uppercase">
                          {feature}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Action Hint */}
                <div className="px-6 py-4 bg-gray-50 border-t-2 border-black flex justify-between items-center group-hover:bg-[var(--color-accent)] transition-colors">
                  <span className="font-bold text-xs uppercase">Lihat Detail</span>
                  <span className="text-xl">➜</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* About Section */}
      <section className="px-6 py-20 bg-[var(--color-bg)] mt-20 border-t-4 border-black">
        <div className="max-w-4xl mx-auto neo-box p-8 md:p-12 bg-[#FF90E8]">
          <h2 className="text-4xl font-black uppercase mb-6 text-black border-b-4 border-black pb-2 inline-block">
            Mengenal Lebih Dekat
          </h2>
          <p className="text-xl font-medium leading-relaxed mb-6 bg-white p-6 neo-box shadow-[4px_4px_0px_#000]">
            {aboutText}
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            <span className="neo-box px-4 py-2 bg-white font-bold text-sm rotate-1">Desain Neobrutalism</span>
            <span className="neo-box px-4 py-2 bg-white font-bold text-sm -rotate-2">Performa Tinggi</span>
            <span className="neo-box px-4 py-2 bg-white font-bold text-sm rotate-2">Mudah Digunakan</span>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="px-6 py-20 max-w-7xl mx-auto">
        <h2 className="text-4xl font-black uppercase mb-12 border-b-4 border-black pb-4 inline-block">
          Hubungi Kami
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="flex flex-col gap-6">
            <p className="text-xl font-medium mb-4">
              Punya pertanyaan, ide kolaborasi, atau butuh bantuan teknis? Jangan ragu untuk menghubungi kami kapan saja melalui platform berikut:
            </p>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="neo-box p-6 transition-colors flex flex-col items-start gap-2 block">
              <span className="font-bold text-sm uppercase tracking-wider text-[var(--color-primary)]">WhatsApp</span>
              <span className="text-2xl font-black">{whatsappNumber.replace(/(\d{2})(\d{3})(\d{4})(\d{4})/, '$1 $2-$3-$4')}</span>
            </a>
            <div className="neo-box p-6 bg-white flex flex-col items-start gap-2">
              <span className="font-bold text-sm uppercase tracking-wider text-[var(--color-primary)]">Email</span>
              <span className="text-2xl font-black">{contactEmail}</span>
            </div>
          </div>

          {/* Action box */}
          <div className="neo-box p-8 bg-white flex flex-col justify-center items-center text-center">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-3xl font-black uppercase mb-4">Mari Berdiskusi!</h3>
            <p className="font-medium text-lg mb-8">Kirimkan pesan Anda 24/7. Kami akan merespons secepat mungkin untuk solusi bisnis Anda.</p>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="neo-button text-lg w-full py-4 text-center">
              Kirim Pesan Sekarang
            </a>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="border-t-4 border-black bg-white p-6 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="font-black text-xl uppercase tracking-tighter">ManesMata<span className="text-[var(--color-primary)]">.</span></div>
          <p className="font-medium text-sm">{footerCopyright}</p>
        </div>
      </footer>
    </main>
  );
}
