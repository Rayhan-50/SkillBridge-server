import { Request, Response, NextFunction } from "express";
import { getAuth } from "../lib/auth";
import { Role } from "@prisma/client";

export const requireAuth = (...roles: Role[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // better-auth provides a way to get the session from headers
            const auth = await getAuth();
            const session = await auth.api.getSession({
                headers: req.headers,
            });

            if (!session || !session.user) {
                return res.status(401).json({
                    success: false,
                    statusCode: 401,
                    message: "You are not authorized",
                });
            }

            const user = session.user as any;

            if (user.status === "BANNED") {
                return res.status(403).json({
                    success: false,
                    statusCode: 403,
                    message: "Your account is banned",
                });
            }

            if (roles.length && !roles.includes(user.role as Role)) {
                return res.status(403).json({
                    success: false,
                    statusCode: 403,
                    message: "You do not have permission to access this resource",
                });
            }

            req.user = {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                status: user.status,
            };

            next();
        } catch (error) {
            next(error);
        }
    };
};
