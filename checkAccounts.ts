import "dotenv/config";
import { prisma } from "./src/lib/prisma";

async function checkAccounts() {
    const accounts = await prisma.account.findMany({
        include: { user: { select: { email: true, role: true } } }
    });
    accounts.forEach((a: any) => {
        console.log(`email=${a.user?.email} | providerId=${a.providerId} | password=${a.password?.substring(0, 15)}...`);
    });
}

checkAccounts().catch(console.error).finally(() => prisma.$disconnect());
