import "dotenv/config";
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { globalErrorHandler } from './middlewares/globalErrorHandler';

const app: Application = express();

// Parsers - skip for Auth routes since Better Auth handles them
app.use((req, res, next) => {
    if (req.path.startsWith('/api/auth')) {
        return next();
    }
    express.json()(req, res, next);
});
app.use((req, res, next) => {
    if (req.path.startsWith('/api/auth')) {
        return next();
    }
    express.urlencoded({ extended: true })(req, res, next);
});

// CORS — dynamic origin check
const allowedOrigins = [
    process.env.APP_URL || "https://skillbridge-server-nu.vercel.app",
    "http://localhost:3000",
    "http://localhost:4000",
    "https://skillbridge-client.vercel.app",
    "https://skillbridge-client-coral.vercel.app",
];

// Also allow any Vercel preview deployment for this project
const allowedOriginPatterns = [
    /^https:\/\/skillbridge-client-.*\.vercel\.app$/,
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        if (allowedOriginPatterns.some((pattern) => pattern.test(origin))) {
            return callback(null, true);
        }
        callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
}));

import { getAuth } from "./lib/auth";

// esbuild converts `await import()` to `require()` in CJS bundles.
// better-auth/node is ESM-only so require() crashes.
// new Function() prevents esbuild from statically analyzing the import.
const esmImport = new Function("specifier", "return import(specifier)");

// Trick Vercel's Node File Trace (NFT) into bundling these ESM-only packages.
// We export a dummy function so esbuild does not dead-code eliminate it.
export const _vercelTraceTrickApp = () => {
    require("better-auth/node");
};

// Route for Better-Auth endpoints
app.all("/api/auth/*", async (req: Request, res: Response, next: express.NextFunction) => {
    try {
        const auth = await getAuth();
        const { toNodeHandler } = await esmImport("better-auth/node");
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

// App Routers
app.use("/api/tutors", TutorRouter);
app.use("/api/tutor", TutorRouter);
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
