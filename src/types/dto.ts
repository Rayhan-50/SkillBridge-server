import { z } from "zod";

// Base Types
export const idParamSchema = z.object({
    params: z.object({
        id: z.string().cuid({ message: "Invalid ID format" }),
    }),
});

// Tutor Profile DTOs
export const createTutorProfileSchema = z.object({
    body: z.object({
        bio: z.string().optional(),
        headline: z.string().optional(),
        hourlyRate: z.number().positive().optional(),
        subjects: z.array(z.string()).optional(),
        languages: z.array(z.string()).optional(),
        location: z.string().optional(),
        experienceYears: z.number().int().min(0).optional(),
        isAvailable: z.boolean().optional(),
        availability: z.any().optional(), // Can refine based on exact JSON structure expected
    }),
});

export const updateTutorProfileSchema = createTutorProfileSchema;

// Booking DTOs
export const createBookingSchema = z.object({
    body: z.object({
        tutorId: z.string().min(1, { message: "Invalid Tutor ID" }),
        categoryId: z.string().cuid().optional(),
        date: z.string().datetime({ message: "Date must be ISO string" }),
        startTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Start time must be HH:MM"),
        endTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "End time must be HH:MM"),
        notes: z.string().optional(),
    }),
});

export const updateBookingStatusSchema = z.object({
    params: z.object({ id: z.string().cuid() }),
    body: z.object({
        status: z.enum(["CONFIRMED", "COMPLETED", "CANCELLED", "REJECTED"]),
        meetingLink: z.string().url().optional().or(z.literal('')),
    }),
});

// Review DTOs
export const createReviewSchema = z.object({
    body: z.object({
        bookingId: z.string().min(1),
        tutorId: z.string().min(1),
        rating: z.number().int().min(1).max(5),
        comment: z.string().optional(),
    }),
});

// Category DTOs
export const createCategorySchema = z.object({
    body: z.object({
        name: z.string().min(1),
        slug: z.string().min(1),
        description: z.string().optional(),
        iconUrl: z.string().url().optional(),
    }),
});

export const updateCategorySchema = z.object({
    params: z.object({ id: z.string().cuid() }),
    body: createCategorySchema.shape.body.partial(),
});
