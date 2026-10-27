import { prisma } from '../db/prisma.js';

async function main(): Promise<void> {
    try {
        const accounts = await prisma.userAccount.findMany({
            select: {
                username: true,
                displayName: true,
                role: {
                    select: {
                        code: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                username: 'asc',
            },
            where: {
                role: {
                    code: 'HOMEOWNER',
                },
            },
        });

        console.dir(accounts, { depth: null });
    } finally {
        await prisma.$disconnect();
    }
}

main().catch((error: unknown) => {
    console.error('Account read failure ', error);
    process.exitCode = 1;
});
