import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { globalErrorHandler } from './middlewares/globalErrorHandler';

const app: Application = express();

// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(cors({
    origin: process.env.APP_URL || "http://localhost:4000",
    credentials: true, // required for better-auth cookies
}));

// Route for Better-Auth endpoints (like sign-in, sign-up, etc.)
app.all("/api/auth/*", toNodeHandler(auth));

// Welcome Route
app.get('/', (req: Request, res: Response) => {
    res.json({ message: "Welcome to SkillBridge API!" });
});

import { TutorRouter } from "./modules/tutor/tutor.router";
import { BookingRouter } from "./modules/booking/booking.router";
import { ReviewRouter } from "./modules/review/review.router";
import { CategoryRouter } from "./modules/category/category.router";
import { AdminRouter } from "./modules/admin/admin.router";
import { UserRouter } from "./modules/user/user.router";

// App Routers will go here
app.use("/api/tutors", TutorRouter);
app.use("/api/tutor", TutorRouter); // Alias for assignment specific paths
app.use("/api/bookings", BookingRouter);
app.use("/api/reviews", ReviewRouter);
app.use("/api/categories", CategoryRouter);
app.use("/api/admin", AdminRouter);
app.use("/api/me", UserRouter);

// Global Error Handler
app.use(globalErrorHandler);

// Not Found Route
app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: "API Route Not Found!",
        errorDetails: { path: req.originalUrl }
    });
});

export default app;
