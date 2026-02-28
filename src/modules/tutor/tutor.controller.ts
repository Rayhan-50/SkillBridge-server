import { Request, Response } from "express";
import { TutorService } from "./tutor.service";
import httpStatus from "http-status";

const getAllTutors = async (req: Request, res: Response) => {
    try {
        const result = await TutorService.getAllTutors(req.query);
        res.status(httpStatus.OK).json({
            success: true,
            statusCode: httpStatus.OK,
            message: "Tutors retrieved successfully",
            meta: result.meta,
            data: result.data,
        });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            statusCode: httpStatus.INTERNAL_SERVER_ERROR,
            message: "Failed to retrieve tutors"
        });
    }
};

const getTutorById = async (req: Request, res: Response) => {
    try {
        const result = await TutorService.getTutorById(req.params.id as string);
        if (!result) {
            return res.status(httpStatus.NOT_FOUND).json({
                success: false,
                statusCode: httpStatus.NOT_FOUND,
                message: "Tutor profile not found",
            });
        }
        res.status(httpStatus.OK).json({
            success: true,
            statusCode: httpStatus.OK,
            message: "Tutor retrieved successfully",
            data: result,
        });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            statusCode: httpStatus.INTERNAL_SERVER_ERROR,
            message: "Failed to retrieve tutor",
            error
        });
    }
};

const updateTutorProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;
        const result = await TutorService.updateTutorProfile(userId, req.body);
        res.status(httpStatus.OK).json({
            success: true,
            statusCode: httpStatus.OK,
            message: "Tutor profile updated successfully",
            data: result,
        });
    } catch (error) {
        res.status(httpStatus.BAD_REQUEST).json({
            success: false,
            statusCode: httpStatus.BAD_REQUEST,
            message: "Failed to update profile",
            error
        });
    }
};

const getTutorAvailability = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;
        const result = await TutorService.getTutorAvailability(userId);
        res.status(httpStatus.OK).json({
            success: true,
            statusCode: httpStatus.OK,
            message: "Availability retrieved successfully",
            data: result,
        });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            statusCode: httpStatus.INTERNAL_SERVER_ERROR,
            message: "Failed to retrieve availability"
        });
    }
};

const updateTutorAvailability = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;
        const result = await TutorService.updateTutorAvailability(userId, req.body.availability);
        res.status(httpStatus.OK).json({
            success: true,
            statusCode: httpStatus.OK,
            message: "Availability updated successfully",
            data: result,
        });
    } catch (error) {
        res.status(httpStatus.BAD_REQUEST).json({
            success: false,
            statusCode: httpStatus.BAD_REQUEST,
            message: "Failed to update availability"
        });
    }
};

export const TutorController = {
    getAllTutors,
    getTutorById,
    updateTutorProfile,
    getTutorAvailability,
    updateTutorAvailability
};
