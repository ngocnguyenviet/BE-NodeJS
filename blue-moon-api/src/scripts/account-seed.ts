import { prisma } from '../db/prisma.js';

async function main(): Promise<void> {
    try {
        const roleSeeds = [
            { code: 'HOMEOWNER', name: 'Homeowner' },
            { code: 'ADMIN', name: 'Adminstrator' },
            { code: 'HR_MANAGER', name: 'HR Manager' },
            { code: 'BUSINESS_OPERATOR', name: 'Business Operator' },
            { code: 'TECHNICIAN', name: 'Technician' },
            { code: 'SECURITY', name: 'Security' },
        ];

        for (const data of roleSeeds) {
            await prisma.role.upsert({
                where: {
                    code: data.code,
                },
                update: {},
                create: data,
            });
        }

        const accountSeeds = [
            { username: 'homeowner_a', displayName: 'Homeowner A', code: 'HOMEOWNER' },
            { username: 'homeowner_b', displayName: 'Homeowner B', code: 'HOMEOWNER' },
            { username: 'admin_a', displayName: 'Adminstrator A', code: 'ADMIN' },
        ];

        for (const data of accountSeeds) {
            await prisma.userAccount.upsert({
                where: {
                    username: data.username,
                },
                update: {},
                create: {
                    username: data.username,
                    displayName: data.displayName,
                    role: {
                        connect: {
                            code: data.code,
                        },
                    },
                },
            });
        }
    } finally {
        await prisma.$disconnect();
    }
}

main().catch((error: unknown) => {
    console.error('Account seed failure', error);
    process.exitCode = 1;
});
