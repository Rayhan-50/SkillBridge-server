import { Request, Response } from "express";
import { ReviewService } from "./review.service";
import httpStatus from "http-status";

const createReview = async (req: Request, res: Response) => {
    try {
        const studentId = req.user!.id;
        const result = await ReviewService.createReview(studentId, req.body);
        res.status(httpStatus.CREATED).json({
            success: true,
            statusCode: httpStatus.CREATED,
            message: "Review submitted successfully",
            data: result,
        });
    } catch (error: any) {
        res.status(httpStatus.BAD_REQUEST).json({
            success: false,
            statusCode: httpStatus.BAD_REQUEST,
            message: error.message || "Failed to submit review",
        });
    }
};

const getReviewsByTutor = async (req: Request, res: Response) => {
    try {
        const tutorId = req.params.tutorId as string;
        const result = await ReviewService.getReviewsByTutor(tutorId);
        res.status(httpStatus.OK).json({
            success: true,
            statusCode: httpStatus.OK,
            message: "Reviews retrieved successfully",
            data: result,
        });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            statusCode: httpStatus.INTERNAL_SERVER_ERROR,
            message: "Failed to retrieve reviews",
        });
    }
};

export const ReviewController = {
    createReview,
    getReviewsByTutor
};
