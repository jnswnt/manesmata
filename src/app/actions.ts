"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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

export async function createProject(formData: FormData) {
    try {
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const color = formData.get("color") as string;
        const featuresStr = formData.get("features") as string;
        const imageUrl = formData.get("imageUrl") as string | null;
        const demoUrl = formData.get("demoUrl") as string | null;

        if (!title || !description || !color) {
            return { error: "Membutuhkan Title, Description, dan Color" };
        }

        await prisma.project.create({
            data: {
                title,
                description,
                color,
                features: featuresStr || null,
                imageUrl: imageUrl || null,
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
        const imageUrl = formData.get("imageUrl") as string | null;
        const demoUrl = formData.get("demoUrl") as string | null;

        if (!title || !description || !color) {
            return { error: "Membutuhkan Title, Description, dan Color" };
        }

        await prisma.project.update({
            where: { id },
            data: {
                title,
                description,
                color,
                features: featuresStr || null,
                imageUrl: imageUrl || null,
                demoUrl: demoUrl || null,
            },
        });

        revalidatePath("/admin");
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
