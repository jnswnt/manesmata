"use client";

import { useState, useTransition } from "react";
import { loginAdmin } from "@/app/actions";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        startTransition(async () => {
            const result = await loginAdmin(password);
            if (result.error) {
                setError(result.error);
            } else {
                router.push("/admin");
                router.refresh(); // Segarkan status autentikasi middleware di client
            }
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--color-secondary)]">
            <div className="neo-box bg-white max-w-sm w-full p-8 flex flex-col items-center">
                <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">Auth.</h1>
                <p className="font-bold text-sm mb-6 text-center">Masukkan sandi khusus untuk mengakses ruang kontrol.</p>

                {error && (
                    <div className="w-full bg-[var(--color-primary)] text-white font-bold p-3 border-4 border-black mb-4 text-sm">
                        ❌ {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
                    <div>
                        <label className="block font-bold mb-2 uppercase text-sm">Sandi Admin</label>
                        <input
                            type="password"
                            className="neo-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
                        className={`neo-button w-full py-4 mt-2 ${isPending ? 'opacity-50 cursor-wait' : ''}`}
                    >
                        {isPending ? "MEMERIKSA..." : "MASUK"}
                    </button>
                </form>
            </div>
        </div>
    );
}
