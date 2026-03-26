import "dotenv/config";
import { prisma } from "../lib/prisma";

/**
 * This seed script uses better-auth's internal API to create users
 * so passwords are hashed correctly and the account record format
 * matches exactly what better-auth expects during sign-in.
 */
async function seedUsers() {
    // Dynamically import better-auth (ESM-only)
    const { betterAuth } = await import("better-auth");
    const { prismaAdapter } = await import("better-auth/adapters/prisma");

    const auth = betterAuth({
        database: prismaAdapter(prisma, { provider: "postgresql" }),
        secret: process.env.BETTER_AUTH_SECRET || "fallback_secret_key_12345",
        baseURL: process.env.BETTER_AUTH_URL || "http://localhost:4000/api/auth",
        trustedOrigins: ["http://localhost:3000", "http://localhost:4000"],
        emailAndPassword: { enabled: true, autoSignIn: false },
        user: {
            additionalFields: {
                role: { type: "string", required: false, defaultValue: "STUDENT" },
                status: { type: "string", required: false, defaultValue: "ACTIVE" },
                phone: { type: "string", required: false },
            }
        }
    });

    const users = [
        { name: "Super Admin",   email: "admin@skillbridge.com",   password: "password123", role: "ADMIN"   },
        { name: "Jane Student",  email: "student@example.com",     password: "password123", role: "STUDENT" },
        { name: "John Tutor",    email: "tutor@example.com",       password: "password123", role: "TUTOR"   },
    ];

    for (const u of users) {
        const existing = await prisma.user.findUnique({ where: { email: u.email } });
        if (existing) {
            // Ensure the role is set correctly (in case it was created without the role)
            if ((existing as any).role !== u.role) {
                await prisma.user.update({
                    where: { email: u.email },
                    data: { role: u.role as any },
                });
                console.log(`Updated role for ${u.email} → ${u.role}`);
            } else {
                console.log(`User already exists: ${u.email}`);
            }
            continue;
        }

        // Create user through better-auth's API so bcrypt hash is stored correctly
        const result = await auth.api.signUpEmail({
            body: {
                name: u.name,
                email: u.email,
                password: u.password,
            }
        });

        if (result?.user) {
            // Update the role (better-auth defaults to STUDENT)
            await prisma.user.update({
                where: { email: u.email },
                data: { role: u.role as any, emailVerified: true },
            });
            console.log(`✅  Seeded: ${u.email}  role=${u.role}`);
        } else {
            console.error(`❌  Failed to create: ${u.email}`);
        }
    }

    // Ensure tutor profile exists for the tutor user
    const tutor = await prisma.user.findUnique({ where: { email: "tutor@example.com" } });
    if (tutor) {
        const existingProfile = await prisma.tutorProfile.findUnique({ where: { userId: tutor.id } });
        if (!existingProfile) {
            await prisma.tutorProfile.create({
                data: {
                    userId: tutor.id,
                    bio: "Expert JavaScript developer.",
                    headline: "Senior Full-stack Engineer",
                    hourlyRate: 60,
                    subjects: ["JavaScript", "React", "Node.js"],
                    location: "Online",
                    experienceYears: 5,
                    isAvailable: true,
                }
            });
            console.log("✅  Created tutor profile");
        } else {
            console.log("Tutor profile already exists");
        }
    }

    console.log("\nSeed complete!");
}

seedUsers().catch(console.error).finally(() => prisma.$disconnect());
