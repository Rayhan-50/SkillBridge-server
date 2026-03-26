import express from "express";
import { BookingController } from "./booking.controller";
import { requireAuth } from "../../middlewares/auth";
import validate from "../../middlewares/validate";
import { createBookingSchema, updateBookingStatusSchema } from "../../types/dto";

const router = express.Router();

router.post(
    "/",
    requireAuth("STUDENT"),
    validate(createBookingSchema),
    BookingController.createBooking
);

router.get(
    "/my-bookings",
    requireAuth("STUDENT", "TUTOR"),
    BookingController.getMyBookings
);

router.patch(
    "/:id",
    requireAuth("STUDENT", "TUTOR", "ADMIN"),
    validate(updateBookingStatusSchema),
    BookingController.updateBookingStatus
);

router.get(
    "/",
    requireAuth("ADMIN"),
    BookingController.getAllBookings
);

export const BookingRouter = router;
