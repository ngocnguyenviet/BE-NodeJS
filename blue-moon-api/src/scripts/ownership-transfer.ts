import { prisma } from '../db/prisma.js';
import { transferOwnership } from '../services/ownership.service.js';

async function main(): Promise<void> {
    try {
        // Resolve the demo names to database IDs before calling the service.
        const [apartment, newOwner, admin] = await Promise.all([
            prisma.apartment.findUnique({
                where: {
                    apartmentNumber: 'A101',
                },
                select: {
                    id: true,
                },
            }),
            prisma.userAccount.findUnique({
                where: {
                    username: 'homeowner_b',
                },
                select: {
                    id: true,
                },
            }),
            prisma.userAccount.findUnique({
                where: {
                    username: 'admin_a',
                },
                select: {
                    id: true,
                },
            }),
        ]);

        if (apartment === null || newOwner === null || admin === null) {
            throw new Error('Required demo apartment or accounts were not found');
        }

        const current = await prisma.ownershipAssignment.findFirst({
            where: {
                apartmentId: apartment.id,
                effectiveUntil: null,
            },
            select: { id: true },
        });

        if (current === null) {
            throw new Error('The apartment has no open ownership assignment');
        }

        // This call commits a real ownership transfer when the script is executed.
        const result = await transferOwnership({
            apartmentId: apartment.id,
            expectedAssignmentId: current.id,
            newOwnerId: newOwner.id,
            actorId: admin.id,
            reason: 'Demo ownership transfer',
        });

        console.log('Ownership transferred:', result);
    } finally {
        await prisma.$disconnect();
    }
}

main().catch((error: unknown) => {
    console.error('Ownership transfer failed', error);
    process.exitCode = 1;
});
