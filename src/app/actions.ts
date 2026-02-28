"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function loginAdmin(password: string) {
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword || password !== adminPassword) {
        return { error: "Password salah atau belum disetur!" };
    }

    // Set cookie yang aman untuk sesi login (berlaku 1 hari)
    const cookieStore = await cookies();
    cookieStore.set("admin-session", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24,
        path: "/",
    });

    return { success: true };
}

export async function logoutAdmin() {
    const cookieStore = await cookies();
    cookieStore.delete("admin-session");
    return { success: true };
}

export async function getProjects() {
    try {
        const projects = await prisma.project.findMany({
            orderBy: { createdAt: "desc" },
        });
        return projects;
    } catch (error) {
        console.error("Failed to fetch projects:", error);
        return [];
    }
}

export async function getProjectById(id: number) {
    try {
        const project = await prisma.project.findUnique({
            where: { id },
        });
        return project;
    } catch (error) {
        console.error(`Failed to fetch project ${id}:`, error);
        return null;
    }
}

async function handleFileUpload(file: File | null): Promise<string | null> {
    if (!file || file.size === 0 || typeof file === "string") return null;

    try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Pastikan folder tersedia
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        await mkdir(uploadDir, { recursive: true });

        // Buat nama file unik
        const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
        const filePath = path.join(uploadDir, fileName);

        await writeFile(filePath, buffer);
        return `/uploads/${fileName}`;
    } catch (error) {
        console.error("File upload error:", error);
        return null;
    }
}

export async function createProject(formData: FormData) {
    try {
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const color = formData.get("color") as string;
        const featuresStr = formData.get("features") as string;
        const imageUrlText = formData.get("imageUrl") as string | null;
        const imageFile = formData.get("imageFile") as File | null;
        const demoUrl = formData.get("demoUrl") as string | null;

        if (!title || !description || !color) {
            return { error: "Membutuhkan Title, Description, dan Color" };
        }

        // Tangani upload file atau URL
        let finalImageUrl = await handleFileUpload(imageFile);
        if (!finalImageUrl && imageUrlText) {
            finalImageUrl = imageUrlText;
        }

        await prisma.project.create({
            data: {
                title,
                description,
                color,
                features: featuresStr || null,
                imageUrl: finalImageUrl,
                demoUrl: demoUrl || null,
            },
        });

        revalidatePath("/admin");
        revalidatePath("/");

        return { success: true };
    } catch (error: any) {
        console.error("Failed to create project:", error);
        return { error: error.message || "Gagal membuat project baru." };
    }
}

export async function updateProject(id: number, formData: FormData) {
    try {
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const color = formData.get("color") as string;
        const featuresStr = formData.get("features") as string;
        const imageUrlText = formData.get("imageUrl") as string | null;
        const imageFile = formData.get("imageFile") as File | null;
        const demoUrl = formData.get("demoUrl") as string | null;

        if (!title || !description || !color) {
            return { error: "Membutuhkan Title, Description, dan Color" };
        }

        // Ambil data lama untuk tetap menggunakan image lama jika tidak ada yang baru
        const existing = await prisma.project.findUnique({ where: { id } });
        let finalImageUrl = existing?.imageUrl;

        // Cek jika ada upload baru
        const uploadedPath = await handleFileUpload(imageFile);
        if (uploadedPath) {
            finalImageUrl = uploadedPath;
        } else if (imageUrlText) {
            // Jika tidak ada upload baru, tapi ada URL baru di input teks
            finalImageUrl = imageUrlText;
        }

        await prisma.project.update({
            where: { id },
            data: {
                title,
                description,
                color,
                features: featuresStr || null,
                imageUrl: finalImageUrl,
                demoUrl: demoUrl || null,
            },
        });

        revalidatePath("/admin");
        revalidatePath(`/project/${id}`);
        revalidatePath("/");

        return { success: true };
    } catch (error: any) {
        console.error(`Failed to update project ${id}:`, error);
        return { error: error.message || "Gagal mengupdate project." };
    }
}

export async function deleteProject(id: number) {
    try {
        await prisma.project.delete({
            where: { id },
        });

        revalidatePath("/admin");
        revalidatePath("/");

        return { success: true };
    } catch (error: any) {
        console.error(`Failed to delete project ${id}:`, error);
        return { error: error.message || "Gagal menghapus project." };
    }
}
