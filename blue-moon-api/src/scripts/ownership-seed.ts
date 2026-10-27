import { Certificate } from 'crypto';
import { prisma } from '../db/prisma.js';

async function ensureOwnership(
    apartmentNumber: string,
    ownerUsername: string,
    creatorUsername: string,
): Promise<void> {
    const owner = await prisma.userAccount.findUnique({
        where: {
            username: ownerUsername,
        },
        select: {
            id: true,
            role: {
                select: {
                    code: true,
                },
            },
        },
    });

    const creator = await prisma.userAccount.findUnique({
        where: {
            username: creatorUsername,
        },
        select: {
            id: true,
            role: {
                select: {
                    code: true,
                },
            },
        },
    });

    const existing = await prisma.ownershipAssignment.findFirst({
        where: {
            apartment: {
                apartmentNumber,
            },
            effectiveUntil: null,
        },
        select: {
            ownerId: true,
        },
    });

    if (owner === null || owner.role.code !== 'HOMEOWNER') {
        throw new Error('A valid homeowner is required');
    }

    if (creator === null || creator.role.code !== 'ADMIN') {
        throw new Error('A valid creator is required');
    }

    if (existing !== null) {
        if (existing.ownerId !== owner.id) {
            throw new Error('Apartment already belongs to another homeowner');
        }
        return;
    }

    await prisma.ownershipAssignment.create({
        data: {
            apartment: {
                connect: {
                    apartmentNumber,
                },
            },
            owner: {
                connect: {
                    id: owner.id,
                },
            },
            createdBy: {
                connect: {
                    id: creator.id,
                },
            },
            assignmentReason: 'Initial demo assignment',
        },
    });
}

async function main(): Promise<void> {
    try {
        await ensureOwnership('A101', 'homeowner_a', 'admin_a');
        await ensureOwnership('A102', 'homeowner_a', 'admin_a');
        await ensureOwnership('B201', 'homeowner_b', 'admin_a');
    } finally {
        await prisma.$disconnect();
    }
}

main().catch((error: unknown) => {
    console.error('Ownership seed failure', error);
    process.exitCode = 1;
});
