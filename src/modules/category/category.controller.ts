import { Request, Response } from "express";
import { CategoryService } from "./category.service";
import httpStatus from "http-status";

const createCategory = async (req: Request, res: Response) => {
    try {
        const result = await CategoryService.createCategory(req.body);
        res.status(httpStatus.CREATED).json({
            success: true,
            statusCode: httpStatus.CREATED,
            message: "Category created successfully",
            data: result,
        });
    } catch (error: any) {
        res.status(httpStatus.BAD_REQUEST).json({
            success: false,
            statusCode: httpStatus.BAD_REQUEST,
            message: error.message || "Failed to create category",
            errorDetails: error
        });
    }
};

const getAllCategories = async (req: Request, res: Response) => {
    try {
        const result = await CategoryService.getAllCategories();
        res.status(httpStatus.OK).json({
            success: true,
            statusCode: httpStatus.OK,
            message: "Categories retrieved successfully",
            data: result,
        });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            statusCode: httpStatus.INTERNAL_SERVER_ERROR,
            message: "Failed to retrieve categories",
        });
    }
};

const updateCategory = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const result = await CategoryService.updateCategory(id, req.body);
        res.status(httpStatus.OK).json({
            success: true,
            statusCode: httpStatus.OK,
            message: "Category updated successfully",
            data: result,
        });
    } catch (error: any) {
        res.status(httpStatus.BAD_REQUEST).json({
            success: false,
            statusCode: httpStatus.BAD_REQUEST,
            message: error.message || "Failed to update category",
        });
    }
};

const deleteCategory = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        await CategoryService.deleteCategory(id);
        res.status(httpStatus.OK).json({
            success: true,
            statusCode: httpStatus.OK,
            message: "Category deleted successfully",
            data: null,
        });
    } catch (error: any) {
        res.status(httpStatus.BAD_REQUEST).json({
            success: false,
            statusCode: httpStatus.BAD_REQUEST,
            message: error.message || "Failed to delete category",
        });
    }
};

export const CategoryController = {
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory
};
