import "dotenv/config";
import { prisma } from "./prisma";

let authInstance: any = null;

// Trick Vercel's Node File Trace (NFT) into bundling these ESM-only packages.
// We export a dummy function so esbuild does not dead-code eliminate it.
export const _vercelTraceTrick = () => {
    // These requires are statically analyzed by Vercel to include the packages
    // in the deployment, but this function is never called at runtime, avoiding
    // the "require() of ES Module" error.
    require("better-auth");
    require("better-auth/adapters/prisma");
};

/**
 * Use new Function() to create a dynamic import that esbuild CANNOT
 * transform into require(). This is required because better-auth is
 * ESM-only — esbuild compiles `await import("better-auth")` into
 * `require("better-auth")` inside a CommonJS bundle, which crashes
 * at runtime. By wrapping inside new Function(), esbuild cannot
 * statically analyze the import and leaves it as a genuine import().
 */
const esmImport = new Function("specifier", "return import(specifier)");

export const getAuth = async () => {
    if (authInstance) return authInstance;

    const { betterAuth } = await esmImport("better-auth");
    const { prismaAdapter } = await esmImport("better-auth/adapters/prisma");

    authInstance = betterAuth({
        database: prismaAdapter(prisma, {
            provider: "postgresql",
        }),
        secret: process.env.BETTER_AUTH_SECRET,
        baseURL: process.env.BETTER_AUTH_URL || "https://skillbridge-server-nu.vercel.app/api/auth",
        trustedOrigins: [
            process.env.APP_URL || "https://skillbridge-server-nu.vercel.app",
            process.env.CLIENT_URL || "https://skillbridge-client-coral.vercel.app",
            "http://localhost:3000",
            "http://localhost:4000",
            "https://skillbridge-client.vercel.app",
            "https://skillbridge-client-coral.vercel.app",
            // Include all Vercel preview deployment URLs
            "https://skillbridge-server-brls1avkk-rayhan557s-projects.vercel.app",
            "https://skillbridge-server-j5fvuwr4m-rayhan557s-projects.vercel.app",
        ],
        emailAndPassword: {
            enabled: true,
            autoSignIn: true,
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
