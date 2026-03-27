import { prisma } from "../../lib/prisma";
import { Prisma } from "@prisma/client";

const createCategory = async (payload: Prisma.CategoryCreateInput) => {
    return await prisma.category.create({ data: payload });
};

const getAllCategories = async () => {
    return await prisma.category.findMany({
        orderBy: { name: "asc" },
        include: {
            _count: {
                select: { bookings: true }
            }
        }
    });
};

const updateCategory = async (id: string, payload: Prisma.CategoryUpdateInput) => {
    return await prisma.category.update({
        where: { id },
        data: payload
    });
};

const deleteCategory = async (id: string) => {
    return await prisma.category.delete({ where: { id } });
};

export const CategoryService = {
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory
};
