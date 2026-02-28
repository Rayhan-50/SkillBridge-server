import express from "express";
import { TutorController } from "./tutor.controller";
import { requireAuth } from "../../middlewares/auth";
import validate from "../../middlewares/validate";
import { updateTutorProfileSchema } from "../../types/dto";

const router = express.Router();

// Public routes
router.get("/", TutorController.getAllTutors);
router.get("/:id", TutorController.getTutorById);

// Protected tutor routes
router.patch(
    "/profile",
    requireAuth("TUTOR", "ADMIN"),
    validate(updateTutorProfileSchema),
    TutorController.updateTutorProfile
);

router.get(
    "/availability",
    requireAuth("TUTOR"),
    TutorController.getTutorAvailability
);

router.put(
    "/availability",
    requireAuth("TUTOR"),
    TutorController.updateTutorAvailability
);

export const TutorRouter = router;
