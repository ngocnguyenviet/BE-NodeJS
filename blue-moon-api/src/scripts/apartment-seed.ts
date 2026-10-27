import { prisma } from '../db/prisma.js';

async function main(): Promise<void> {
    try {
        const apartmentSeeds = [
            { apartmentNumber: 'A101', floorNumber: 1 },
            { apartmentNumber: 'A102', floorNumber: 1 },
            { apartmentNumber: 'B201', floorNumber: 2 },
        ];

        for (const data of apartmentSeeds) {
            const apartment = await prisma.apartment.upsert({
                where: {
                    apartmentNumber: data.apartmentNumber,
                },
                update: {},
                create: data,
            });
            console.log('Apartment ready: ', data.apartmentNumber);
        }
    } finally {
        await prisma.$disconnect();
    }
}

main().catch((error: unknown) => {
    console.error('Apartment seed failed', error);
    process.exitCode = 1;
});
