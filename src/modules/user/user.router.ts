import express from "express";
import { UserController } from "./user.controller";
import { requireAuth } from "../../middlewares/auth";

const router = express.Router();

router.get("/", requireAuth("STUDENT", "TUTOR", "ADMIN"), UserController.getMyProfile);

export const UserRouter = router;
