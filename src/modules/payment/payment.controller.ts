import { Request, Response } from "express";
import httpStatus from "http-status";
import { PaymentService } from "./payment.service";

const createPaymentIntent = async (req: Request, res: Response) => {
  try {
    const { amount } = req.body;
    const result = await PaymentService.createPaymentIntent(amount);

    res.status(httpStatus.OK).json({
      success: true,
      message: "Payment intent created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(error.statusCode || httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

const savePaymentInfo = async (req: Request, res: Response) => {
  try {
    const { amount, transactionId, status, bookingId } = req.body;
    // Get user id from better-auth session. If not available in req.user, 
    // it should be provided from the client or parsed via auth middleware.
    // Assuming you have auth middleware that injects user id:
    const userId = (req as any).user?.id || req.body.userId; 

    if (!userId) {
       return res.status(httpStatus.UNAUTHORIZED).json({
         success: false,
         message: "User not authenticated",
       });
    }

    const result = await PaymentService.savePaymentInfo({
      amount,
      transactionId,
      status,
      userId,
      bookingId,
    });

    res.status(httpStatus.OK).json({
      success: true,
      message: "Payment info saved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(error.statusCode || httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

const getPaymentHistory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || req.query.userId;
    
    if (!userId) {
       return res.status(httpStatus.UNAUTHORIZED).json({
         success: false,
         message: "User not authenticated",
       });
    }

    const result = await PaymentService.getPaymentHistory(userId as string);

    res.status(httpStatus.OK).json({
      success: true,
      message: "Payment history retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(error.statusCode || httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

export const PaymentController = {
  createPaymentIntent,
  savePaymentInfo,
  getPaymentHistory,
};
