import express from "express";
import { PaymentController } from "./payment.controller";

const router = express.Router();

router.post("/create-payment-intent", PaymentController.createPaymentIntent);
router.post("/save", PaymentController.savePaymentInfo);
router.get("/history", PaymentController.getPaymentHistory);

export const PaymentRouter = router;
