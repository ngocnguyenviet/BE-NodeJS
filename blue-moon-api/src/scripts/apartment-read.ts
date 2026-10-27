import { prisma } from '../db/prisma.js';

async function main(): Promise<void> {
    try {
        const apartments = await prisma.apartment.findMany({
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
    console.error('Apartment read failure', error);
    process.exitCode = 1;
});
