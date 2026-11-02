import 'dotenv/config';
import { prisma } from '../db/prisma.js';
import { hashPassword } from '../security/password.js';

class DemoPasswordSetupError extends Error {}

function getRequiredPassword(variableName: string): string {
    const value = process.env[variableName];

    if (value === undefined || value.length === 0) {
        throw new DemoPasswordSetupError(`${variableName} is required`);
    }

    return value;
}

async function ensureDemoPassword(username: string, password: string): Promise<void> {
    const account = await prisma.userAccount.findUnique({
        where: { username },
        select: {
            id: true,
            passwordHash: true,
        },
    });

    if (account === null) {
        throw new DemoPasswordSetupError(`Demo account not found: ${username}`);
    }
}
