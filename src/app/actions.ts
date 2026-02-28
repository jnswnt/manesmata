"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { writeFile, mkdir, appendFile } from "fs/promises";
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
        // Use raw query to ensure we get the 'slug' column even if the Client is out of sync
        const projects = await prisma.$queryRawUnsafe('SELECT * FROM "Project" ORDER BY "createdAt" DESC') as any[];
        return projects;
    } catch (error) {
        console.error("Failed to fetch projects:", error);
        return [];
    }
}

export async function getProjectBySlug(slug: string) {
    try {
        const logMsg = `[${new Date().toISOString()}] Fetching project for slug: "${slug}"\n`;
        await appendFile(path.join(process.cwd(), "debug.log"), logMsg);

        // @ts-ignore - slug field might not be in generated types yet
        const project = await prisma.project.findFirst({
            where: { slug }
        });

        await appendFile(path.join(process.cwd(), "debug.log"), `Found project: ${project ? project.title : 'null'}\n`);
        return project;
    } catch (error: any) {
        await appendFile(path.join(process.cwd(), "debug.log"), `Error fetching project ${slug}: ${error.message}\n`);
        console.error(`Failed to fetch project ${slug}:`, error);
        return null;
    }
}

export async function getProjectById(id: number) {
    try {
        const logMsg = `[${new Date().toISOString()}] Fetching project for ID: ${id}\n`;
        await appendFile(path.join(process.cwd(), "debug.log"), logMsg);

        const project = await prisma.project.findUnique({
            where: { id },
        });

        await appendFile(path.join(process.cwd(), "debug.log"), `Found project ID ${id}: ${project ? project.title : 'null'}\n`);
        return project;
    } catch (error: any) {
        await appendFile(path.join(process.cwd(), "debug.log"), `Error fetching project ID ${id}: ${error.message}\n`);
        console.error(`Failed to fetch project ${id}:`, error);
        return null;
    }
}

function generateSlug(text: string) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "") // Remove non-word characters (except space and dash)
        .replace(/[\s_]+/g, "-") // Replace spaces and underscores with dash
        .replace(/^-+|-+$/g, ""); // Remove leading/trailing dashes
}

async function handleMultipleFileUpload(files: File[]): Promise<string[]> {
    const urls: string[] = [];
    for (const file of files) {
        if (!file || file.size === 0 || typeof file === "string") continue;
        try {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const uploadDir = path.join(process.cwd(), "public", "uploads");
            await mkdir(uploadDir, { recursive: true });
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}-${file.name.replace(/\s+/g, "-")}`;
            const filePath = path.join(uploadDir, fileName);
            await writeFile(filePath, buffer);
            urls.push(`/uploads/${fileName}`);
        } catch (error) {
            console.error("File upload error:", error);
        }
    }
    return urls;
}

export async function createProject(formData: FormData) {
    try {
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const color = formData.get("color") as string;
        const featuresStr = formData.get("features") as string;
        const imagesUrlText = formData.get("imagesUrl") as string | null;
        const imageFiles = formData.getAll("imageFiles") as File[];

        if (!title || !description || !color) {
            return { error: "Membutuhkan Title, Description, dan Color" };
        }

        // Tangani upload file atau URL
        let allImages: string[] = [];

        // 1. Tambah dari upload files
        const uploadedUrls = await handleMultipleFileUpload(imageFiles);
        allImages = [...allImages, ...uploadedUrls];

        // 2. Tambah dari input teks (split by comma or newline)
        if (imagesUrlText) {
            const textUrls = imagesUrlText.split(/[\n,]+/).map(u => u.trim()).filter(u => u !== "");
            allImages = [...allImages, ...textUrls];
        }

        const demoUrl = formData.get("demoUrl") as string | null; // Moved demoUrl declaration here
        const slug = generateSlug(title);

        await prisma.project.create({
            data: {
                title,
                // @ts-ignore
                slug,
                description,
                color,
                features: featuresStr || null,
                imageUrl: allImages[0] || null, // Legacy support for first image
                // @ts-ignore
                images: allImages.length > 0 ? JSON.stringify(allImages) : null,
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
        const imagesUrlText = formData.get("imagesUrl") as string | null;
        const imageFiles = formData.getAll("imageFiles") as File[];

        const demoUrl = formData.get("demoUrl") as string | null;

        if (!title || !description || !color) {
            return { error: "Membutuhkan Title, Description, dan Color" };
        }

        let allImages: string[] = [];

        // 1. Ambil dari textarea (ini sumber kebenaran untuk urutan dan pemilihan gambar yang sudah ada)
        if (imagesUrlText) {
            allImages = imagesUrlText.split(/[\n,]+/).map(u => u.trim()).filter(u => u !== "");
        } else {
            // Ambil data lama jika textarea benar-benar kosong (fallback)
            const existing = await prisma.project.findUnique({ where: { id } });
            // @ts-ignore
            if (existing?.images) {
                try {
                    // @ts-ignore
                    allImages = JSON.parse(existing.images);
                } catch (e) {
                    if (existing.imageUrl) allImages = [existing.imageUrl];
                }
            } else if (existing?.imageUrl) {
                allImages = [existing.imageUrl];
            }
        }

        // 2. Tangani upload file baru (tambahkan ke daftar)
        const uploadedUrls = await handleMultipleFileUpload(imageFiles);
        if (uploadedUrls.length > 0) {
            allImages = [...allImages, ...uploadedUrls];
        }

        const slug = generateSlug(title);

        await prisma.project.update({
            where: { id },
            data: {
                title,
                // @ts-ignore
                slug,
                description,
                color,
                features: featuresStr || null,
                imageUrl: allImages[0] || null,
                // @ts-ignore
                images: allImages.length > 0 ? JSON.stringify(allImages) : null,
                demoUrl: demoUrl || null,
            },
        });

        revalidatePath("/admin");
        revalidatePath(`/project/${slug}`);
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

export async function getSettings() {
    try {
        // @ts-ignore - Prisma client needs to be re-imported or re-generated in some IDEs
        const settings = await prisma.setting.findMany();
        // Convert array to object { [key]: value }
        return settings.reduce((acc: Record<string, string>, curr: any) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {});
    } catch (error) {
        console.error("Failed to fetch settings:", error);
        return {};
    }
}

export async function updateSettings(formData: FormData) {
    try {
        const keys = Array.from(formData.keys()).filter(k => !k.startsWith("$ACTION"));

        await Promise.all(
            keys.map(key => {
                const value = formData.get(key) as string;
                // @ts-ignore - Prisma client needs to be re-imported or re-generated in some IDEs
                return prisma.setting.upsert({
                    where: { key },
                    update: { value },
                    create: { key, value },
                });
            })
        );

        revalidatePath("/admin");
        revalidatePath("/");

        return { success: true };
    } catch (error: any) {
        console.error("Failed to update settings:", error);
        return { error: error.message || "Gagal mengupdate pengaturan." };
    }
}

export async function migrateProjectSlugs() {
    try {
        // Use raw query to bypass Client-side model check during migration
        const projects = await prisma.$queryRawUnsafe('SELECT id, title FROM "Project" WHERE slug IS NULL') as any[];

        for (const project of projects) {
            const slug = generateSlug(project.title);
            await prisma.$executeRawUnsafe('UPDATE "Project" SET slug = $1 WHERE id = $2', slug, project.id);
        }

        revalidatePath("/");
        revalidatePath("/admin");

        return { success: true, count: projects.length };
    } catch (error: any) {
        console.error("Migration failed:", error);
        return { error: error.message || "Migration failed" };
    }
}
