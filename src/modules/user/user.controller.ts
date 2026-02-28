import { Request, Response } from "express";
import { UserService } from "./user.service";
import httpStatus from "http-status";

const getMyProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;
        const result = await UserService.getMyProfile(userId);
        res.status(httpStatus.OK).json({
            success: true,
            statusCode: httpStatus.OK,
            message: "Profile retrieved successfully",
            data: result,
        });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            statusCode: httpStatus.INTERNAL_SERVER_ERROR,
            message: "Failed to retrieve profile",
        });
    }
};

export const UserController = { getMyProfile };
