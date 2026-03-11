import "dotenv/config";
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { globalErrorHandler } from './middlewares/globalErrorHandler';

const app: Application = express();

// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(cors({
    origin: [process.env.APP_URL || "http://localhost:4000", "http://localhost:3000", "https://skillbridge-client.vercel.app"],
    credentials: true, // required for better-auth cookies
}));

import { getAuth } from "./lib/auth";

// Route for Better-Auth endpoints (Express 5 wildcard syntax)
app.all("/api/auth/*path", async (req: Request, res: Response, next: express.NextFunction) => {
    try {
        const auth = await getAuth();
        const dynamicImport = new Function('modulePath', 'return import(modulePath)');
        const { toNodeHandler } = await dynamicImport("better-auth/node");
        const handler = toNodeHandler(auth);
        return handler(req, res);
    } catch (err) {
        next(err);
    }
});

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
