import { prisma } from "../lib/prisma";

async function seedData() {
    const categories = [
        { name: "Web Development", slug: "web-development", description: "Learn React, Node, Next.js" },
        { name: "Data Science", slug: "data-science", description: "Python, Machine Learning, AI" },
        { name: "UI/UX Design", slug: "ui-ux-design", description: "Figma, Adobe XD, Design Systems" },
        { name: "Digital Marketing", slug: "digital-marketing", description: "SEO, SEM, Social Media" }
    ];

    for (const c of categories) {
        await prisma.category.upsert({
            where: { slug: c.slug },
            update: {},
            create: c
        });
    }

    console.log("Categories seeded successfully!");
}

seedData().catch(console.error).finally(() => prisma.$disconnect());
