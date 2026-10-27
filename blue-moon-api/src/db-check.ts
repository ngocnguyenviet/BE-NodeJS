import { prisma } from './db/prisma.js';

async function main(): Promise<void> {
    try {
        const rows = await prisma.$queryRaw`
            SELECT current_database() AS database
        `;

        console.table(rows);
    } finally {
        await prisma.$disconnect();
    }
}

main().catch((error: unknown) => {
    console.error('Database check failed', error);
    process.exitCode = 1;
});
