import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";

async function seedData() {
    const password = "password123";
    const hashedPassword = await bcrypt.hash(password, 10);

    // 1. Admin
    const adminEmail = "admin@skillbridge.com";
    let admin = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (!admin) {
        admin = await prisma.user.create({
            data: {
                id: "admin-id-1",
                email: adminEmail,
                name: "Super Admin",
                emailVerified: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                role: "ADMIN",
                accounts: {
                    create: {
                        id: "admin-account-1",
                        accountId: adminEmail,
                        providerId: "credential",
                        password: hashedPassword,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    }
                }
            }
        });
        console.log("Admin seeded:", adminEmail);
    } else {
        console.log("Admin already exists!");
    }

    // 2. Student
    const studentEmail = "student@example.com";
    let student = await prisma.user.findUnique({ where: { email: studentEmail } });
    if (!student) {
        student = await prisma.user.create({
            data: {
                id: "user-student-id-1",
                email: studentEmail,
                name: "Jane Student",
                emailVerified: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                role: "STUDENT",
                accounts: {
                    create: {
                        id: "account-student-id-1",
                        accountId: studentEmail,
                        providerId: "credential",
                        password: hashedPassword,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    }
                }
            }
        });
        console.log("Student seeded:", studentEmail);
    } else {
        console.log("Student already exists!");
    }

    // 3. Tutor
    const tutorEmail = "tutor@example.com";
    let tutor = await prisma.user.findUnique({ where: { email: tutorEmail } });
    if (!tutor) {
        tutor = await prisma.user.create({
            data: {
                id: "user-tutor-id-1",
                email: tutorEmail,
                name: "John Tutor",
                emailVerified: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                role: "TUTOR",
                accounts: {
                    create: {
                        id: "account-tutor-id-1",
                        accountId: tutorEmail,
                        providerId: "credential",
                        password: hashedPassword,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    }
                },
                tutorProfile: {
                    create: {
                        bio: "Expert JavaScript developer.",
                        headline: "Senior Full-stack Engineer",
                        hourlyRate: 60,
                        subjects: ["JavaScript", "React", "Node.js"],
                        location: "Online",
                        experienceYears: 5,
                        isAvailable: true
                    }
                }
            }
        });
        console.log("Tutor seeded:", tutorEmail);
    } else {
        console.log("Tutor already exists!");
    }

    // 4. Create Category
    const categorySlug = "data-science";
    let category = await prisma.category.findUnique({ where: { slug: categorySlug } });
    if (!category) {
        category = await prisma.category.create({
            data: {
                name: "Data Science",
                slug: "data-science",
                description: "Learn Data Science & ML",
                iconUrl: "https://example.com/icon.png"
            }
        });
        console.log("Category seeded:", category.name);
    } else {
        console.log("Category already exists!");
    }

}

seedData().catch(console.error).finally(() => prisma.$disconnect());
