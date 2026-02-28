"use client";

import { deleteProject } from "../actions";

export default function DeleteProjectButton({ id }: { id: number }) {
    const handleDelete = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Munculkan dialog konfirmasi bawaan browser
        const isConfirmed = window.confirm("Yakin ingin menghapus project ini? Tindakan ini tidak dapat dibatalkan.");

        if (isConfirmed) {
            const formData = new FormData(e.currentTarget);
            await deleteProject(Number(formData.get("id")));
        }
    };

    return (
        <form onSubmit={handleDelete} className="w-full sm:w-auto">
            <input type="hidden" name="id" value={id} />
            <button type="submit" className="w-full sm:w-auto text-center text-sm font-bold border-2 border-[var(--color-primary)] text-[var(--color-primary)] px-4 py-2 hover:bg-[var(--color-primary)] hover:text-white transition-colors cursor-pointer">
                🗑️ Hapus
            </button>
        </form>
    );
}
