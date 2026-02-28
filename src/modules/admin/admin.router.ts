import express from "express";
import { AdminController } from "./admin.controller";
import { requireAuth } from "../../middlewares/auth";

const router = express.Router();

router.get("/stats", requireAuth("ADMIN"), AdminController.getStats);
router.get("/users", requireAuth("ADMIN"), AdminController.getAllUsers);
router.patch("/users/:id", requireAuth("ADMIN"), AdminController.updateUserStatus);

export const AdminRouter = router;
