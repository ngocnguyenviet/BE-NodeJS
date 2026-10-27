import { prisma } from '../db/prisma.js';

export type TransferOwnershipInput = {
    apartmentId: string;
    expectedAssignmentId: string;
    newOwnerId: string;
    actorId: string;
    reason: string;
};

export type TransferOwnershipResult = {
    id: string;
    apartmentId: string;
    ownerId: string;
    effectiveFrom: Date;
};

export async function transferOwnership(
    input: TransferOwnershipInput,
): Promise<TransferOwnershipResult> {
    const reason = input.reason.trim();

    if (reason.length === 0 || reason.length > 500) {
        throw new Error('Transfer reason must contain between 1 and 500 characters');
    }

    return prisma.$transaction(
        async (tx) => {
            const apartment = await tx.apartment.findUnique({
                where: {
                    id: input.apartmentId,
                },
                select: {
                    id: true,
                },
            });

            if (apartment === null) {
                throw new Error('Apartment not found');
            }

            const actor = await tx.userAccount.findUnique({
                where: {
                    id: input.actorId,
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

            if (actor === null || actor.role.code !== 'ADMIN') {
                throw new Error('An Administrator is required to transfer ownership');
            }

            const newOwner = await tx.userAccount.findUnique({
                where: {
                    id: input.newOwnerId,
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

            if (newOwner === null || newOwner.role.code !== 'HOMEOWNER') {
                throw new Error('An homeowner is required to transfer ownership');
            }

            const current = await tx.ownershipAssignment.findFirst({
                where: {
                    id: input.expectedAssignmentId,
                    apartmentId: apartment.id,
                    effectiveUntil: null,
                },
                select: {
                    id: true,
                    ownerId: true,
                    effectiveFrom: true,
                },
            });

            if (current === null) {
                throw new Error('Ownership has changed; reload the apartment');
            }

            if (current.ownerId === newOwner.id) {
                throw new Error('The new owner must differ from the current owner');
            }

            const changedAt = new Date();
            if (changedAt.getTime() <= current.effectiveFrom.getTime()) {
                throw new Error('Transfer time must be after the current assignment start');
            }

            const closed = await tx.ownershipAssignment.updateMany({
                where: {
                    id: current.id,
                    apartmentId: apartment.id,
                    ownerId: current.ownerId,
                    effectiveUntil: null,
                },
                data: {
                    effectiveUntil: changedAt,
                    endingReason: reason,
                },
            });

            if (closed.count !== 1) {
                throw new Error('Ownership has changed; reload the apartment');
            }

            return await tx.ownershipAssignment.create({
                data: {
                    apartmentId: apartment.id,
                    ownerId: newOwner.id,
                    createdById: actor.id,
                    effectiveFrom: changedAt,
                    assignmentReason: reason,
                },
                select: {
                    id: true,
                    apartmentId: true,
                    ownerId: true,
                    effectiveFrom: true,
                },
            });
        },
        {
            isolationLevel: 'Serializable',
        },
    );
}
