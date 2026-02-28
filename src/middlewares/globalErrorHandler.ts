import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

export const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";
    let errorDetails: any = err;

    // better auth API error class checking
    if (err?.name === "APIError") {
        statusCode = err.status || 500;
    } else if (err instanceof ZodError) {
        statusCode = 400;
        message = "Validation Error";
        errorDetails = err.issues.map(issue => ({
            field: issue.path.join("."),
            message: issue.message
        }));
    } else if (err.name === 'PrismaClientValidationError') {
        statusCode = 400;
        message = "Database Validation Error";
    } else if (err.name === 'PrismaClientKnownRequestError') {
        statusCode = 400;
        message = "Database Request Error";
        if (err.code === 'P2002') {
            message = "Duplicate entry found for unique field";
        }
    }

    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        errorDetails: statusCode === 500 ? err.stack : errorDetails,
    });
};
