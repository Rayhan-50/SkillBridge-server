import { Request, Response } from "express";
import { AdminService } from "./admin.service";
import httpStatus from "http-status";

const getStats = async (req: Request, res: Response) => {
    try {
        const result = await AdminService.getStats();
        res.status(httpStatus.OK).json({
            success: true,
            statusCode: httpStatus.OK,
            message: "Admin stats retrieved successfully",
            data: result,
        });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            statusCode: httpStatus.INTERNAL_SERVER_ERROR,
            message: "Failed to retrieve stats",
        });
    }
};

const getAllUsers = async (req: Request, res: Response) => {
    try {
        const result = await AdminService.getAllUsers();
        res.status(httpStatus.OK).json({
            success: true,
            statusCode: httpStatus.OK,
            message: "Users retrieved successfully",
            data: result,
        });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            statusCode: httpStatus.INTERNAL_SERVER_ERROR,
            message: "Failed to retrieve users",
        });
    }
};

const updateUserStatus = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const result = await AdminService.updateUserStatus(id, req.body);
        res.status(httpStatus.OK).json({
            success: true,
            statusCode: httpStatus.OK,
            message: "User status updated successfully",
            data: result,
        });
    } catch (error: any) {
        res.status(httpStatus.BAD_REQUEST).json({
            success: false,
            statusCode: httpStatus.BAD_REQUEST,
            message: error.message || "Failed to update user",
        });
    }
};

const deleteUser = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        await AdminService.deleteUser(id);
        res.status(httpStatus.OK).json({
            success: true,
            statusCode: httpStatus.OK,
            message: "User deleted successfully",
        });
    } catch (error: any) {
        res.status(httpStatus.BAD_REQUEST).json({
            success: false,
            statusCode: httpStatus.BAD_REQUEST,
            message: error.message || "Failed to delete user",
        });
    }
};

export const AdminController = {
    getStats,
    getAllUsers,
    updateUserStatus,
    deleteUser
};
