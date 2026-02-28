import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // Hanya proteksi route yang berawalan /admin
    if (request.nextUrl.pathname.startsWith('/admin')) {
        // Abaikan jika sedang menuju halaman login admin itu sendiri
        if (request.nextUrl.pathname === '/admin/login') {
            return NextResponse.next();
        }

        // Cek apakah ada cookie sesi admin yang valid
        const sessionCookie = request.cookies.get('admin-session');

        // Jika tidak ada cookie, tendang kembali ke halaman login
        if (!sessionCookie || sessionCookie.value !== 'authenticated') {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    // Menentukan path mana saja yang akan memicu middleware ini berjalan
    matcher: ['/admin/:path*'],
}
