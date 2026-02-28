import { prisma } from "../../lib/prisma";

const createReview = async (studentId: string, payload: any) => {
    const { bookingId, tutorId, rating, comment } = payload;

    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });

    if (!booking) {
        throw new Error("Booking not found");
    }

    if (booking.studentId !== studentId) {
        throw new Error("You are not authorized to review this booking");
    }

    if (booking.status !== "COMPLETED") {
        throw new Error("You can only review a completed booking");
    }

    if (booking.tutorId !== tutorId) {
        throw new Error("Tutor does not match the booking");
    }

    // A review is 1:1 with booking
    const existingReview = await prisma.review.findUnique({ where: { bookingId } });
    if (existingReview) {
        throw new Error("You have already reviewed this booking");
    }

    return await prisma.review.create({
        data: {
            studentId,
            tutorId,
            bookingId,
            rating,
            comment
        },
        include: {
            student: { select: { name: true, image: true } }
        }
    });
};

const getReviewsByTutor = async (tutorId: string) => {
    return await prisma.review.findMany({
        where: { tutorId },
        include: {
            student: { select: { id: true, name: true, image: true } }
        },
        orderBy: { createdAt: "desc" }
    });
};

export const ReviewService = { createReview, getReviewsByTutor };
