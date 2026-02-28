import express from "express";
import { CategoryController } from "./category.controller";
import { requireAuth } from "../../middlewares/auth";
import validate from "../../middlewares/validate";
import { createCategorySchema, updateCategorySchema } from "../../types/dto";

const router = express.Router();

router.get("/", CategoryController.getAllCategories);

router.post(
    "/",
    requireAuth("ADMIN"),
    validate(createCategorySchema),
    CategoryController.createCategory
);

router.patch(
    "/:id",
    requireAuth("ADMIN"),
    validate(updateCategorySchema),
    CategoryController.updateCategory
);

router.delete(
    "/:id",
    requireAuth("ADMIN"),
    CategoryController.deleteCategory
);

export const CategoryRouter = router;
