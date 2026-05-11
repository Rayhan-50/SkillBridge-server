import express from "express";
import { AdminController } from "./admin.controller";
import { requireAuth } from "../../middlewares/auth";

const router = express.Router();

router.get("/stats", requireAuth("ADMIN"), AdminController.getStats);
router.get("/users", requireAuth("ADMIN"), AdminController.getAllUsers);
router.patch("/users/:id", requireAuth("ADMIN"), AdminController.updateUserStatus);
router.delete("/users/:id", requireAuth("ADMIN"), AdminController.deleteUser);
router.post("/tutors", requireAuth("ADMIN"), AdminController.createTutor);
router.put("/tutors/:id", requireAuth("ADMIN"), AdminController.updateTutor);

export const AdminRouter = router;
