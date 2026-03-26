import { BookingStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma";

/**
 * Creates a new booking for a student with a specific tutor, checking for schedule conflicts first.
 * @param studentId - The ID of the student making the booking
 * @param payload - The booking details including tutorId, date, startTime, and endTime
 */
const createBooking = async (studentId: string, payload: any) => {
    // Check if slot is already booked (conflict check)
    const existingBooking = await prisma.booking.findFirst({
        where: {
            tutorId: payload.tutorId,
            date: new Date(payload.date),
            startTime: payload.startTime,
            endTime: payload.endTime,
            status: {
                notIn: ["CANCELLED", "REJECTED"]
            }
        }
    });

    if (existingBooking) {
        throw new Error("This time slot is already booked for the selected tutor");
    }

    return await prisma.booking.create({
        data: {
            ...payload,
            date: new Date(payload.date),
            studentId,
            status: "PENDING"
        },
        include: {
            tutor: { select: { name: true, email: true, image: true } },
            category: { select: { name: true } },
        }
    });
};

const getMyBookings = async (userId: string, role: string) => {
    const whereCondition = role === "TUTOR" ? { tutorId: userId } : { studentId: userId };
    return await prisma.booking.findMany({
        where: whereCondition,
        include: {
            tutor: { select: { name: true, email: true, image: true, phone: true } },
            student: { select: { name: true, email: true, image: true, phone: true } },
            category: { select: { name: true, iconUrl: true } },
            review: { select: { id: true, rating: true, comment: true } },
        },
        orderBy: { createdAt: "desc" }
    });
};

const updateBookingStatus = async (
    bookingId: string,
    userId: string,
    role: string,
    status: BookingStatus,
    meetingLink?: string
) => {
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) throw new Error("Booking not found");

    if (role === "STUDENT") {
        if (status !== "CANCELLED") {
            throw new Error("Students can only cancel bookings");
        }
        if (booking.studentId !== userId) {
            throw new Error("You are not authorized to update this booking");
        }
    }

    if (role === "TUTOR") {
        if (booking.tutorId !== userId) {
            throw new Error("You are not authorized to update this booking");
        }
    }

    return await prisma.booking.update({
        where: { id: bookingId },
        data: {
            status,
            ...(meetingLink ? { meetingLink } : {})
        },
        include: {
            student: { select: { name: true, email: true } },
            tutor: { select: { name: true, email: true } }
        }
    });
};

const getAllBookings = async () => {
    return await prisma.booking.findMany({
        include: {
            tutor: { select: { name: true, email: true } },
            student: { select: { name: true, email: true } },
            category: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" }
    });
};

export const BookingService = {
    createBooking,
    getMyBookings,
    getAllBookings,
    updateBookingStatus
};
