import { randomBytes } from 'node:crypto';

import type { LoginInput, LoginResult } from '../types/auth.types.js';
import { verifyPassword } from '../policies/password-policy.js';
import { accounts, sessions, demoPasswordRecord } from '../stores/auth.store.js';

export async function login(input: LoginInput): Promise<LoginResult> {
    const account = accounts.get(input.username);

    const storedPassword = account?.passwordRecord ?? demoPasswordRecord;

    const passwordMatches = await verifyPassword(input.password, storedPassword);

    if (account === undefined || account.status !== 'active' || !passwordMatches) {
        return {
            ok: false,
            code: 'INVALID_CREDENTIALS',
        };
    }

    const token = randomBytes(32).toString('hex');
    const expiresAt = Date.now() + 15 * 60_000;

    const updatedSession = {
        accountId: account.id,
        expiresAt,
        revokedAt: null,
    };
    sessions.set(token, updatedSession);
    return {
        ok: true,
        data: {
            token,
            expiresAt,
        },
    };
}

export function logout(token: string): boolean {
    const session = sessions.get(token);

    if (session === undefined) {
        return false;
    }

    sessions.set(token, {
        ...session,
        revokedAt: Date.now(),
    });

    return true;
}
