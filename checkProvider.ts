import { getAuth } from "./src/lib/auth";

async function checkProviderId() {
    // Sign up a test user and check what providerId gets stored
    const auth = await getAuth();
    const testEmail = "check_provider_test@test.com";
    
    // Try to sign up (will fail if already exists, that's ok)
    try {
        await auth.api.signUpEmail({
            body: {
                name: "Test",
                email: testEmail,
                password: "testpassword123",
            }
        });
        console.log("Created test user");
    } catch (e) {
        console.log("User may already exist:", (e as any).message);
    }
    
    const { PrismaClient } = await import("@prisma/client");
    const { PrismaPg } = await import("@prisma/adapter-pg");
    const { Pool } = await import("pg");
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    const p = new PrismaClient({ adapter } as any);
    
    const accounts = await p.account.findMany({
        where: { user: { email: testEmail } },
        include: { user: { select: { email: true } } }
    });
    
    accounts.forEach((a: any) => {
        console.log(`providerId="${a.providerId}" | accountId="${a.accountId}"`);
    });
    
    await p.$disconnect();
    await pool.end();
}

checkProviderId().catch(console.error);
