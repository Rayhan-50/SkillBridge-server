import "dotenv/config";
import { prisma } from "./prisma";

let authInstance: any = null;

export const getAuth = async () => {
    if (authInstance) return authInstance;

    const { betterAuth } = await import("better-auth");
    const { prismaAdapter } = await import("better-auth/adapters/prisma");

    authInstance = betterAuth({
        database: prismaAdapter(prisma, {
            provider: "postgresql",
        }),
        // Provide explicit string fallbacks in case process.env loading is delayed by tsx watch
        secret: process.env.BETTER_AUTH_SECRET || "fallback_secret_key_12345",
        baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
        emailAndPassword: {
            enabled: true,
            autoSignIn: true, // Auto sign-in after registration
        },
        user: {
            additionalFields: {
                role: {
                    type: "string",
                    required: false,
                    defaultValue: "STUDENT"
                },
                status: {
                    type: "string",
                    required: false,
                    defaultValue: "ACTIVE"
                },
                phone: {
                    type: "string",
                    required: false,
                }
            }
        }
    });

    return authInstance;
};
