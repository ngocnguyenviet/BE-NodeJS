import { prisma } from '../db/prisma.js';

async function main(): Promise<void> {
    try {
        const accounts = await prisma.userAccount.findMany({
            select: {
                username: true,
                status: true,
                passwordHash: true,
            },
            orderBy: {
                username: 'asc',
            },
        });

        const rows = accounts.map((account) => ({
            username: account.username,
            status: account.status,
            hasPassword: account.passwordHash !== null,
        }));

        console.table(rows);
    } finally {
        await prisma.$disconnect();
    }
}

main().catch((error: unknown) => {
    console.error('Account auth check failed:', error);
    process.exitCode = 1;
});
