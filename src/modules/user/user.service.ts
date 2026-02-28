import { prisma } from "../../lib/prisma";

const getMyProfile = async (userId: string) => {
    return await prisma.user.findUnique({
        where: { id: userId },
        include: {
            tutorProfile: true
        }
    });
};

export const UserService = { getMyProfile };
