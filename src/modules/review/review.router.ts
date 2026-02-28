import express from "express";
import { ReviewController } from "./review.controller";
import { requireAuth } from "../../middlewares/auth";
import validate from "../../middlewares/validate";
import { createReviewSchema } from "../../types/dto";

const router = express.Router();

router.post(
    "/",
    requireAuth("STUDENT"),
    validate(createReviewSchema),
    ReviewController.createReview
);

router.get("/:tutorId", ReviewController.getReviewsByTutor);

export const ReviewRouter = router;
