import { checkSession } from '../src/policies/session-policy.js';
import type { SessionRecord } from '../src/policies/session-policy.js';

const now = Date.now();

const validSession: SessionRecord = {
    accountId: 'account_a',
    expiresAt: now + 60_000,
    revokedAt: null,
};

console.log(checkSession(validSession, now));
console.log(checkSession(undefined, now));

console.log(
    checkSession(
        {
            ...validSession,
            revokedAt: now,
        },
        now,
    ),
);

console.log(
    checkSession(
        {
            ...validSession,
            expiresAt: now,
        },
        now,
    ),
);
