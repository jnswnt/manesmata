import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const projects = [
        {
            title: 'WashOps',
            description: 'Aplikasi pencatatan transaksi usaha cuci motor & mobil, dengan fitur penghitungan gaji karyawan otomatis (persentase/bagi hasil per layanan).',
            features: JSON.stringify(['Pencatatan Transaksi', 'Penggajian Otomatis', 'Bagi Hasil', 'Laporan Harian']),
            color: '#FF90E8',
            demoUrl: '#',
        },
        {
            title: 'POS Laundry',
            description: 'Sistem Kasir (POS) khusus untuk usaha Laundry, dilengkapi dengan fitur cerdas integrasi penyimpanan keranjang & rak.',
            features: JSON.stringify(['Manajemen Keranjang', 'Posisi Rak', 'Kasir Pintar', 'Notifikasi Pelanggan']),
            color: '#FFC900',
            demoUrl: '#',
        },
        {
            title: 'Juragan Galon',
            description: 'Aplikasi manajemen untuk kebutuhan usaha galon isi ulang & produk lain, memudahkan pelacakan stok dan pemesanan.',
            features: JSON.stringify(['Manajemen Stok Galon', 'Pemesanan/Delivery', 'Laporan Penjualan', 'Data Pelanggan']),
            color: '#22BC01',
            demoUrl: '#',
        },
        {
            title: 'POS Bangunan',
            description: 'Aplikasi Kasir (POS) yang dirancang khusus untuk toko bangunan dengan manajemen inventaris barang material yang kompleks.',
            features: JSON.stringify(['Inventaris Material', 'Kasir Toko', 'Grosir & Eceran', 'Hutang Piutang']),
            color: '#00E5FF',
            demoUrl: '#',
        }
    ]

    for (const project of projects) {
        await prisma.project.create({
            data: project
        })
    }
    console.log('Database seeded successfully!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
