import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";

async function seedAdmin() {
    const email = "admin@skillbridge.com";
    const password = "password123";
    const name = "Super Admin";

    const existingAdmin = await prisma.user.findUnique({ where: { email } });
    if (existingAdmin) {
        console.log("Admin already exists!");
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            id: "admin-id-1",
            email,
            name,
            emailVerified: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            role: "ADMIN",
            accounts: {
                create: {
                    id: "admin-account-1",
                    accountId: email,
                    providerId: "credential",
                    password: hashedPassword,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }
            }
        }
    });

    console.log("Admin seeded successfully! Email:", email, "Password:", password);
}

seedAdmin().catch(console.error).finally(() => prisma.$disconnect());
