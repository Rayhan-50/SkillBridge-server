import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error("[PRISMA] DATABASE_URL is missing in environment variables!");
}

console.log("[PRISMA] Initializing with connection string:", connectionString ? connectionString.split('@')[1] : "MISSING");

const pool = new Pool({ 
    connectionString,
    ssl: {
        rejectUnauthorized: false
    }
});

pool.on('error', (err) => {
    console.error('[PRISMA] Unexpected error on idle client', err);
});

const adapter = new PrismaPg(pool);

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({ 
    adapter,
    log: process.env.NODE_ENV === "production" ? ["error", "warn"] : ["query", "error", "warn"],
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
