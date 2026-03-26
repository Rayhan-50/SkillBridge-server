import { prisma } from "../lib/prisma";

async function clean() {
    console.log("Cleaning test users from DB...");
    await prisma.user.deleteMany({
        where: {
            email: {
                in: [
                    "admin@skillbridge.com",
                    "student@example.com",
                    "tutor@example.com"
                ]
            }
        }
    });

    console.log("Cleanup complete!");
}

clean().catch(console.error).finally(() => prisma.$disconnect());
