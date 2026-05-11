import express from "express";
import { PaymentController } from "./payment.controller";
import { requireAuth } from "../../middlewares/auth";

const router = express.Router();

router.post("/create-payment-intent", requireAuth("STUDENT", "TUTOR", "ADMIN"), PaymentController.createPaymentIntent);
router.post("/save", requireAuth("STUDENT", "TUTOR", "ADMIN"), PaymentController.savePaymentInfo);
router.get("/history", requireAuth("STUDENT", "TUTOR", "ADMIN"), PaymentController.getPaymentHistory);

export const PaymentRouter = router;
