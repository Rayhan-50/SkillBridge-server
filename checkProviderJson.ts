import "dotenv/config";
import { prisma } from "./src/lib/prisma";

async function main() {
    const accounts = await prisma.account.findMany({
        take: 10,
        include: { user: { select: { email: true } } },
        orderBy: { createdAt: "desc" }
    });
    const result = accounts.map((a: any) => ({
        email: a.user?.email,
        providerId: a.providerId,
        hasPassword: !!a.password
    }));
    require("fs").writeFileSync("d:/assignment-4/accountResult.json", JSON.stringify(result, null, 2));
    console.log("Done - written to accountResult.json");
}

main().catch(console.error).finally(() => prisma.$disconnect());
