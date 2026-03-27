import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { calculatePagination } from "../../helpers/paginationSortingHelper";

const getAllTutors = async (query: any) => {
    const { page, limit, skip, sortBy, sortOrder } = calculatePagination(query);

    const andConditions: Prisma.TutorProfileWhereInput[] = [];

    // filter by search term
    if (query.search) {
        andConditions.push({
            OR: [
                { bio: { contains: query.search, mode: "insensitive" } },
                { headline: { contains: query.search, mode: "insensitive" } },
                {
                    user: {
                        is: {
                            name: { contains: query.search, mode: "insensitive" }
                        }
                    }
                }
            ]
        });
    }

    // filter by category (or subject depending on query format)
    const category = query.category || query.subject;
    if (category) {
        andConditions.push({
            subjects: { has: category }
        });
    }

    // filter by location
    if (query.location) {
        andConditions.push({
            location: { contains: query.location, mode: "insensitive" }
        });
    }

    // filter by price range
    if (query.minPrice) {
        andConditions.push({
            hourlyRate: { gte: Number(query.minPrice) }
        });
    }
    if (query.maxPrice) {
        andConditions.push({
            hourlyRate: { lte: Number(query.maxPrice) }
        });
    }

    // filter by availability
    if (query.isAvailable !== undefined) {
        andConditions.push({
            isAvailable: query.isAvailable === "true"
        });
    }

    const whereConditions: Prisma.TutorProfileWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.tutorProfile.findMany({
        where: whereConditions,
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                }
            }
        },
        skip,
        take: limit,
        // order by handling. If sortBy is e.g. 'hourlyRate', we use direct property
        // If not found in tutorProfile, fallback to id for stable sort
        orderBy: {
            [sortBy === "createdAt" ? "id" : sortBy]: sortOrder
        }
    });

    const total = await prisma.tutorProfile.count({ where: whereConditions });

    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
};

const getTutorById = async (userId: string) => {
    const profile = await prisma.tutorProfile.findUnique({
        where: { userId },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                }
            }
        }
    });

    if (!profile) return null;

    // Add reviews calculation logic for public detail page
    const reviews = await prisma.review.findMany({
        where: { tutorId: userId },
        include: {
            student: { select: { name: true, image: true } }
        }
    });

    const avgRating = reviews.length > 0
        ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length
        : 0;

    return {
        ...profile,
        reviews,
        avgRating: Number(avgRating.toFixed(1)),
        totalReviews: reviews.length
    };
};

const updateTutorProfile = async (userId: string, payload: Prisma.TutorProfileUpdateInput) => {
    return await prisma.tutorProfile.upsert({
        where: { userId },
        update: payload,
        create: {
            userId,
            ...payload as any
        }
    });
};

const getTutorAvailability = async (userId: string) => {
    const profile = await prisma.tutorProfile.findUnique({
        where: { userId },
        select: { availability: true }
    });
    return profile?.availability || null;
};

const updateTutorAvailability = async (userId: string, availability: any) => {
    return await prisma.tutorProfile.upsert({
        where: { userId },
        update: { availability },
        create: {
            userId,
            availability
        }
    });
};

export const TutorService = {
    getAllTutors,
    getTutorById,
    updateTutorProfile,
    getTutorAvailability,
    updateTutorAvailability
};
