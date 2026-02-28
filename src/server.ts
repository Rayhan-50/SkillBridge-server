import app from "./app";
import { prisma } from "./lib/prisma";

const PORT = process.env.PORT || 3000;

async function bootstrap() {
    try {
        // Basic test of connection
        await prisma.$connect();
        console.log("🛢  Database connection established successfully!");

        app.listen(PORT, () => {
            console.log(`🚀 Server is listening on port ${PORT}`);
        });
    } catch (err) {
        console.error("❌ Failed to connect to database:", err);
        process.exit(1);
    }
}

bootstrap();
