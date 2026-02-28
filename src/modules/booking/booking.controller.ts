import { Request, Response } from "express";
import { BookingService } from "./booking.service";
import httpStatus from "http-status";

const createBooking = async (req: Request, res: Response) => {
    try {
        const studentId = req.user!.id;
        const result = await BookingService.createBooking(studentId, req.body);
        res.status(httpStatus.CREATED).json({
            success: true,
            statusCode: httpStatus.CREATED,
            message: "Booking created successfully",
            data: result,
        });
    } catch (error: any) {
        res.status(httpStatus.BAD_REQUEST).json({
            success: false,
            statusCode: httpStatus.BAD_REQUEST,
            message: error.message || "Failed to create booking",
        });
    }
};

const getMyBookings = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;
        const role = req.user!.role; // STUDENT or TUTOR
        const result = await BookingService.getMyBookings(userId, role);
        res.status(httpStatus.OK).json({
            success: true,
            statusCode: httpStatus.OK,
            message: "Bookings retrieved successfully",
            data: result,
        });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            statusCode: httpStatus.INTERNAL_SERVER_ERROR,
            message: "Failed to retrieve bookings",
        });
    }
};

const updateBookingStatus = async (req: Request, res: Response) => {
    try {
        const bookingId = req.params.id as string;
        const userId = req.user!.id;
        const role = req.user!.role;
        const { status, meetingLink } = req.body;

        const result = await BookingService.updateBookingStatus(bookingId, userId, role, status, meetingLink);

        res.status(httpStatus.OK).json({
            success: true,
            statusCode: httpStatus.OK,
            message: "Booking status updated successfully",
            data: result,
        });
    } catch (error: any) {
        res.status(httpStatus.BAD_REQUEST).json({
            success: false,
            statusCode: httpStatus.BAD_REQUEST,
            message: error.message || "Failed to update booking",
        });
    }
};

export const BookingController = {
    createBooking,
    getMyBookings,
    updateBookingStatus
};
