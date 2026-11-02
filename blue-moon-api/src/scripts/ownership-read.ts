import { prisma } from '../db/prisma.js';

async function main(): Promise<void> {
    try {
        const owner = await prisma.userAccount.findUnique({
            where: {
                username: 'homeowner_a',
            },
            select: {
                id: true,
            },
        });

        if (owner === null) {
            throw new Error('Demo homeowner not found');
        }

        const now = new Date();

        const apartments = await prisma.apartment.findMany({
            where: {
                ownershipAssignments: {
                    some: {
                        ownerId: owner.id,
                        effectiveFrom: {
                            lte: now,
                        },
                        effectiveUntil: null,
                    },
                },
            },
            select: {
                id: true,
                apartmentNumber: true,
                floorNumber: true,
            },
            orderBy: {
                apartmentNumber: 'asc',
            },
        });

        console.table(apartments);
    } finally {
        await prisma.$disconnect();
    }
}

main().catch((error: unknown) => {
    console.error('Ownership read failure', error);
    process.exitCode = 1;
});
