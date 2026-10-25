import { hashPassword } from '../policies/password-policy.js';
import type { SessionRecord } from '../policies/session-policy.js';
import type { AccountRecord } from '../types/auth.types.js';

const now = Date.now();

export const demoPasswordRecord = await hashPassword('Practice-password-2026!');
const adminPasswordRecord = await hashPassword('Admin-practice-2026!');

export const accounts = new Map<string, AccountRecord>([
    [
        'homeowner_a',
        {
            id: 'account_a',
            username: 'homeowner_a',
            passwordRecord: demoPasswordRecord,
            status: 'active',
            role: 'HOMEOWNER',
        },
    ],
    [
        'homeowner_b',
        {
            id: 'account_b',
            username: 'homeowner_b',
            passwordRecord: demoPasswordRecord,
            status: 'active',
            role: 'HOMEOWNER',
        },
    ],
    [
        'homeowner_locked',
        {
            id: 'account_locked',
            username: 'homeowner_locked',
            passwordRecord: demoPasswordRecord,
            status: 'locked',
            role: 'HOMEOWNER',
        },
    ],
    [
        'admin_a',
        {
            id: 'account_admin',
            username: 'admin_a',
            passwordRecord: adminPasswordRecord,
            status: 'active',
            role: 'ADMIN',
        },
    ],
]);

const baseSession: SessionRecord = {
    accountId: 'account_a',
    expiresAt: now + 15 * 60_000,
    revokedAt: null,
};

export const sessions = new Map<string, SessionRecord>([
    ['demo-valid-token', baseSession],
    [
        'demo-expired-token',
        {
            ...baseSession,
            expiresAt: now - 1,
        },
    ],
    [
        'demo-revoked-token',
        {
            ...baseSession,
            revokedAt: now,
        },
    ],
    [
        'demo-other-device-token',
        {
            ...baseSession,
        },
    ],
    [
        'demo-locked-account-token',
        {
            accountId: 'account_locked',
            expiresAt: Date.now() + 15 * 60_000,
            revokedAt: null,
        },
    ],
]);

export function findAccountById(id: string): AccountRecord | undefined {
    for (const account of accounts.values()) {
        if (account.id === id) {
            return account;
        }
    }
    return undefined;
}
