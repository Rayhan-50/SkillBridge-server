import { prisma } from "../../lib/prisma";
import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";

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
    const { role, status, bio, headline, hourlyRate, subjects, image, languages, location, experienceYears } = payload;
    
    // Separate user fields from profile fields
    const userData: any = {};
    if (role) userData.role = role;
    if (status) userData.status = status;
    if (image) userData.image = image; // Only update if truthy (not empty string)

    const updatedUser = await prisma.user.update({
        where: { id },
        data: userData
    });

    // If role is TUTOR, or it was already TUTOR and we are updating profile info
    if (userData.role === "TUTOR" || (updatedUser.role === "TUTOR" && (bio || headline || hourlyRate || image || languages || location || experienceYears))) {
        const profileUpdate: any = {};
        if (bio) profileUpdate.bio = bio;
        if (headline) profileUpdate.headline = headline;
        if (hourlyRate !== undefined) profileUpdate.hourlyRate = Number(hourlyRate);
        if (subjects && subjects.length > 0) profileUpdate.subjects = subjects;
        if (image) profileUpdate.profileImage = image;
        if (languages && languages.length > 0) profileUpdate.languages = languages;
        if (location) profileUpdate.location = location;
        if (experienceYears !== undefined) profileUpdate.experienceYears = Number(experienceYears);

        await prisma.tutorProfile.upsert({
            where: { userId: id },
            update: profileUpdate,
            create: {
                userId: id,
                bio: bio || "New Tutor",
                headline: headline || "Tutor at SkillBridge",
                hourlyRate: hourlyRate ? Number(hourlyRate) : 15,
                subjects: subjects || [],
                profileImage: image || null,
                languages: languages || [],
                location: location || null,
                experienceYears: experienceYears ? Number(experienceYears) : 0,
            }
        });
    }

    return updatedUser;
};

const deleteUser = async (id: string) => {
    return await prisma.user.delete({
        where: { id }
    });
};

const createTutor = async (payload: any) => {
    const { email, password, name, bio, headline, hourlyRate, subjects, image, languages, location, experienceYears } = payload;
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new Error("User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = "tutor_" + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    const accountId = "acc_" + Math.random().toString(36).substr(2, 9);

    const newUser = await prisma.user.create({
        data: {
            id: userId,
            name,
            email,
            image: image || null,
            emailVerified: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            role: "TUTOR",
            status: "ACTIVE",
            accounts: {
                create: {
                    id: accountId,
                    accountId: userId,
                    providerId: "credential",
                    password: hashedPassword,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }
            },
            tutorProfile: {
                create: {
                    bio: bio || "New Tutor",
                    headline: headline || "Tutor at SkillBridge",
                    hourlyRate: Number(hourlyRate) || 15,
                    subjects: subjects || [],
                    profileImage: image || null,
                    languages: languages || [],
                    location: location || null,
                    experienceYears: Number(experienceYears) || 0,
                    isAvailable: true,
                }
            }
        }
    });

    return newUser;
};

const updateTutor = async (id: string, payload: any) => {
    const { name, email, bio, headline, hourlyRate, subjects, status, password, image, languages, location, experienceYears } = payload;

    // Update User
    const userData: any = {};
    if (name) userData.name = name;
    if (email) userData.email = email;
    if (status) userData.status = status;
    if (image !== undefined) userData.image = image;
    
    const updatedUser = await prisma.user.update({
        where: { id },
        data: userData
    });

    // Update Password if provided
    if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.account.updateMany({
            where: { userId: id, providerId: "credential" },
            data: { password: hashedPassword }
        });
    }

    // Update Profile
    const profileData: any = {};
    if (bio !== undefined) profileData.bio = bio;
    if (headline !== undefined) profileData.headline = headline;
    if (hourlyRate !== undefined) profileData.hourlyRate = Number(hourlyRate);
    if (subjects !== undefined) profileData.subjects = subjects;
    if (image !== undefined) profileData.profileImage = image;
    if (languages !== undefined) profileData.languages = languages;
    if (location !== undefined) profileData.location = location;
    if (experienceYears !== undefined) profileData.experienceYears = Number(experienceYears);

    await prisma.tutorProfile.upsert({
        where: { userId: id },
        update: profileData,
        create: {
            userId: id,
            ...profileData
        }
    });

    return updatedUser;
};

export const AdminService = { getStats, getAllUsers, updateUserStatus, deleteUser, createTutor, updateTutor };
