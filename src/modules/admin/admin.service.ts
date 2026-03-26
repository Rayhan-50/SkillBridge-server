import { prisma } from "../../lib/prisma";
import { Prisma } from "@prisma/client";

const getStats = async () => {
    const [totalUsers, tutors, students, bookings, totalRevenue] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { role: "TUTOR" } }),
        prisma.user.count({ where: { role: "STUDENT" } }),
        prisma.booking.count(),
        prisma.booking.aggregate({
            where: { status: "COMPLETED" },
            _sum: { price: true }
        })
    ]);

    return {
        totalUsers,
        totalTutors: tutors,
        totalStudents: students,
        totalBookings: bookings,
        revenue: totalRevenue._sum.price || 0
    };
};

const getAllUsers = async () => {
    return await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            createdAt: true
        },
        orderBy: { createdAt: "desc" }
    });
};

const updateUserStatus = async (id: string, payload: any) => {
    return await prisma.user.update({
        where: { id },
        data: payload
    });
};

const deleteUser = async (id: string) => {
    return await prisma.user.delete({
        where: { id }
    });
};

export const AdminService = { getStats, getAllUsers, updateUserStatus, deleteUser };
